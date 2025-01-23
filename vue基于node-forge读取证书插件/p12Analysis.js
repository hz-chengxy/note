import * as forge from 'node-forge' //node-forge版本1.3.1/1.3.10
// import './sm2.js'
import * as sm2 from './sm2.js'
window.sm2 = sm2
class P12Process {
    Instance = null
    vueDiyAttr = null
    loading = null // 等待
    executeQueue = {} // 执行队列
    loadingFile = null // 文件导入时等待
    config = {
      fileUnicode: 'utf8', // sql编码格式, utf8、gbk
      workSqlUrl: '/static/worker.js',
      globalVue: window.app,
      processDiy: (vue) => {
        return vue
      }
    }
    constructor (conf = {}) {
      if (this.workInstance) {
        return this.workInstance
      }
      this.config = Object.assign({}, this.config, conf)
      const config = this.config
      this.vueDiyAttr = config.processDiy(config.globalVue) // 处理vue2与vue3的差异
      this.workInstance = this
      return this.workInstance
    }
  // 执行sql
    executeP12File (file, password, signStr, processSignFun, showLoading) {
      if (showLoading) {
        this.loadingFile = this.vueDiyAttr.$loading()
      }
      return new Promise((resolve, reject) => {
        const fileData = new FileReader()
        fileData.onload = async (e) => {
          try {
            // let text = new TextDecoder('utf8').decode(e.target.result)
            // console.log(text)
            // let arraybuffer = new Uint8Array(e.target.result)
            // let text = ''
            // for (let i = 0; i < arraybuffer.length; i++) {
            //   text += String.fromCharCode(arraybuffer[i])
            // }
            // console.log(e.target.result, fileData.result)
            const data = this.executeAnalysis(fileData.result, password, signStr, processSignFun)
            console.log(data)
            this.loadingFile && this.loadingFile.close()
            resolve(data)
          } catch (error) {
            this.loadingFile && this.loadingFile.close()
            reject(error)
          }
        }
        fileData.onerror = (e) => {
          this.loadingFile && this.loadingFile.close()
          reject(e)
        }
        fileData.readAsBinaryString(file)
      })
    }
    parseAn1 (data) {
      let result = {}
      let index = 0
      while (index < data.length) {
        let tag = data[index++]
        let isC = tag & 0x20
        let type = tag & 0x1f
        if (type === 0x1f) {
          let temp = 0
          do {
            temp = (temp << 7) | (data[index++] & 0x7f)
          } while ((data[index - 1] & 0x80) !== 0)
          type = temp
        }
        let len = data[index++]
        let valueStr = index
        if (len === 0x80) {
          let lenLen = data[index++]
          len = 0
          for (let i = 0; i < lenLen; i++) {
            len = (len << 0) | data[index++]
          }
        }
        let valueEnd = index + len
        let value = data.slice(valueStr, valueEnd)
        if (isC) {
          result[type] = this.parseAn1(value)
        } else {
          result[type] = value
        }
        index = valueEnd
      }
      return result
    }
    // utf8ToHex (str) {
    //   str = unescape(encodeURIComponent(str))
    //   const length = str.length
    //   const words = []
    //   for (let i = 0; i < length; i++) {
    //     words[i >> 2] |= (str.charCodeAt(i) & 0xff << (24 - (i % 4)) * 8)
    //   }
    //   const hexChars = []
    //   for(let i = 0; i < length; i++){
    //     const bite = (words[i >> 2] >>> (24 - (i % 4)))
    //   }
    // }
    executeAnalysis (buffer, password, signStr = '中文', processSignFun) {
      let res = false
      try {
        // console.log(forge.asn1.fromDer(buffer))
        const sm2 = window.sm2
        const pkcs12 = forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(buffer), password)
        const key = pkcs12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0]
        const cert = pkcs12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0]
        const pk = key.asn1.value.filter(item => item.type === forge.asn1.Type.OCTETSTRING && item.tagClass === forge.asn1.Class.UNIVERSAL)[0] || {}
        // const pkPP = key.asn1.value.filter(item => item.type === forge.asn1.Type.SEQUENCE)[0] || {}
        let privateKey = forge.util.createBuffer(pk.value).toHex()
        // let privateKeyPfx = key.asn1.value.filter(item => item.type === forge.asn1.Type.INTEGER && item.tagClass === forge.asn1.Class.UNIVERSAL)[0] || {}
        // privateKeyPfx = forge.util.createBuffer(privateKeyPfx.value).toHex()
        // console.log(key, pkcs12, 'pkcs12')
        privateKey = forge.util.hexToBytes(privateKey) // forge.util.decode64(forge.util.encode64())
        privateKey = forge.asn1.fromDer(privateKey)
        privateKey = privateKey.value.filter(item => item.type === forge.asn1.Type.OCTETSTRING && item.tagClass === forge.asn1.Class.UNIVERSAL)[0] || {}
        privateKey = forge.util.createBuffer(privateKey.value).toHex() // privateKeyPfx可不要
        // 获取证书序列号
        const sn = forge.util.createBuffer(cert.asn1.value[0].value[1].value).toHex()
        if (processSignFun && typeof processSignFun === 'function') { // 处理函数
          signStr = processSignFun(signStr, sn)
        }
        const publicCert = forge.util.createBuffer(cert.asn1.value[0].value[6].value[1].value).toHex().slice(2) // 可不要，提取公钥
        let signValue = sm2.doSignature(signStr, privateKey, {der: true, hash: true})
        console.log(privateKey, 'privateKey', publicCert, 'publicCert', sm2.doVerifySignature(signStr, signValue, publicCert, {der: true, hash: true}), 'signValue')
        res = {signValue, sn}
      } catch (error) {
        if (error.toString().includes('Invalid password')) {
          this.vueDiyAttr.$alert(this.vueDiyAttr.$t('msg.password_error'))
        } else {
          this.vueDiyAttr.$alert(this.vueDiyAttr.$t('msg.cert_pars_failed'))
        }
        res = false
      }
      return res
    }
    // 生成主键
    uuid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
}
export default P12Process
