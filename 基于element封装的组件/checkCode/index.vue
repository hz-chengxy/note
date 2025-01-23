<template>
  <canvas :id="id" v-bind="$attrs" v-on="$listeners" @click="refresh" class="canvas_code"></canvas>
</template>

<script>
const uuid = () => {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export default {
  name: 'CheckCode',
  props: {
    // 验证码长度
    codeLength: {
      type: Number,
      default: 4
    },
    // 线条数
    lineLength: {
      type: Number,
      default: 4
    },
    // 点个数
    cirNum: {
      type: Number,
      default: 20
    },
    id: {
      type: String,
      default: `canvas_${uuid()}`
    }
  },
  data () {
    return {}
  },
  created () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.$nextTick(() => {
        this.draw()
      })
    },
    // 获取随机验证码
    getRandomCode () {
      const sCode = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9,0,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'
      const codeList = sCode.split(',')
      const codeTextList = new Array(this.codeLength).fill(0).map(() => codeList[Math.floor(Math.random() * codeList.length)]) // 取随机编码
      const codeText = codeTextList.join('').toLowerCase() // 转换为字符串
      this.$emit('getCode', codeText)
      return codeTextList
    },
    draw () {
      const C_W = this.$el.clientWidth
      const C_H = this.$el.clientHeight
      const cxt = this.$el.getContext('2d')
      this.$el.width = C_W
      this.$el.height = C_H
      // 画验证码
      this.drawCode(cxt)
      // 画线
      this.drawLine(cxt, C_W, C_H)
      // 画点
      this.drawCir(cxt, C_W, C_H)
    },
    drawCode (cxt) {
      // 画验证码
      const textList = this.getRandomCode()
      for (let i = 0; i < textList.length; i++) {
        const text = textList[i]
        const deg = (Math.random() * 30 * Math.PI) / 180
        const x = 10 + i * 20
        const y = 20 + Math.random() * 8
        cxt.font = 'bold 23px 微软雅黑'
        cxt.translate(x, y)
        cxt.rotate(deg)
        cxt.fillStyle = this.randomColor()
        cxt.fillText(text, 0, 0)
        cxt.rotate(-deg)
        cxt.translate(-x, -y)
      }
    },
    // 画线
    drawLine (cxt, C_W, C_H) {
      for (let i = 0; i < this.lineLength; i++) {
        cxt.strokeStyle = this.randomColor()
        cxt.beginPath()
        cxt.moveTo(Math.random() * C_W, Math.random() * C_H)
        cxt.lineTo(Math.random() * C_W, Math.random() * C_H)
        cxt.stroke()
      }
    },
    // 画点
    drawCir (cxt, C_W, C_H) {
      for (let i = 0; i < this.cirNum; i++) {
        cxt.strokeStyle = this.randomColor()
        cxt.beginPath()
        const x = Math.random() * C_W
        const y = Math.random() * C_H
        cxt.moveTo(x, y)
        cxt.lineTo(x + 1, y + 1)
        cxt.stroke()
      }
    },
    // 随机颜色
    randomColor () {
      const r = Math.floor(Math.random() * 256)
      const g = Math.floor(Math.random() * 256)
      const b = Math.floor(Math.random() * 256)
      return (r > 240 && g > 240 && b > 240) ? `rgb(0,0,0)` : `rgb(${r},${g},${b})`
    }
  }
}
</script>

<style lang="scss" scoped>
    .canvas_code{
        width: 100px;
        height: 30px;
        background-color: #fff;
        cursor: pointer;
    }
</style>
