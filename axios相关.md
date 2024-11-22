# axios
## 引入vue后，vue.config.js的基础配置
```js
'use strict'
const path = require('path')
module.exports = {
    //axios域代理，解决axios跨域问题
    devServer: {
        proxy: {
            
            '/cas': {
                target: 'http://124.127.249.216/cas/',
                changeOrigin: true,
                pathRewrite: {
                    '^/cas': ''
                }
            },
            '/wcm': {
                target: 'http://124.127.249.216/wcm/',
                changeOrigin: true,
                pathRewrite: {
                    '^/wcm': ''
                }
            },

        }
    },
    //publicPath: process.env.NODE_ENV === 'production' ? '/statistics/' : './', 
    
}
```

## axios get和post携带参数的写法不同
axios.get(url,{
    params:{}
})

axios.post(url,data)

## axios 在请求头中加token
```js
this.axios.post(url,params,{
    headers:{
    token: `${this.token}`
    }
}).then(res => {
    console.log(res)
})

this.axios.get(url,{
    params:{},
    headers:{
        token:""
    }
})
```

## 利用axios终止多次请求
实际的业务需求：当接口访问速度非常慢时，而参数的变化非常快，且每次参数变化时都会请求接口，导致如果有一次较早发起的请求，其返回数据的速度比，较晚发起的请求，返回数据的速度慢，则会导致当前页实际要展示的数据被老数据覆盖。
解决方案：axios终止多次请求，解决的思路就在于，当你在不断发起异步请求的时候，如果说后面的请求有了响应前面的还在pending我就终止之前的请求，这样就很好的解决了这个问题。
示例，在vue中：
```js
mounted(){
    this.$watch("params",() => {
        this.cancelReq();  //取消请求 
        this.axios.get("url",{
            params:params,
            cancelToken: new this.axios.CancelToken((c) => {
                this.source = c;
            })
        })
    })
},
methods:{
    cancelReq() {
        if (typeof this.source === 'function') {
            this.source("取消请求");
        }
    },
}
```