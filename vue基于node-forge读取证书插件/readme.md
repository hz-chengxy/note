## 调用过程
```js
// 引入插件
import P12Process from '@/plugins/p12Analysis.js'

// 实例化一下这个对象
let analy = new P12Process()

// 调用读取签名方法(证书文件； 证书访问密码； 组合签名所用参数； 处理签名方法，传进插件里使用的； 是否显示loading)。
analy.executeP12File(certFile, password, params, this.handleSign, true)

// 告诉插件如何利用params拼接签名字符串
handleSign (params, sn) {
    return `${sn}${params.userName}${params.uuid}`
}

// 异步执行后，会拿到一个对象，对象包含签名后的值，以及证书序列号sn
analy.executeP12File(certFile, password, params, this.handleSign, true).then(Res => {
    if (Res) {
        params.signValue = Res.signValue
        params.ukeySerialNum = Res.sn
    }
})
```