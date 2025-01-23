# vue的css问题

## vue动态添加class名
`:class="{'divborder':showIndex == index}"`
表示 showIndex如果等于index，则有个class名为divborder

`:class="[k === tabList.length - 1 ? 'pointer_footer' : '', k === 0 ? 'pointer_header' : '', k !== 0 && k !== tabList.length - 1 ? 'pointer' : '', k === Number(activetab) ? 'activeTab' : '']"`
动态添加多个class名的写法

## vue中css是个变量的写法
`:style="{width: mediaCount.toString().length == 4 ? '' : ''}"`

:style="{fontSize: totalNums.readCount > 999999999 ? '23px' : '26px',width: mediaCount.toString().length == 4 ? '' : ''}"

## class名拼接(一个标签有多个class名时)
可以直接写一个固定class名的同时写一个变化的class名
class="className" :class="'el-icon-'+item.icon"


# vue的API

## vue事件阻止冒泡
即子标签和父标签都添加了不同的事件，而触发了子标签的事件后冒泡到了父标签的事件，导致两个事件都触发，@click.stop = "clickHandler"，即在click添加修饰符即可，官方文档有提及。
@click.stop : 阻止事件冒泡
@click.prevent : 阻止事件默认行为
@click.self : 事件只作用在元素本身，而不是其子元素(阻止事件捕获)

## vue中nextTick使用
在使用富文本字符串v-html渲染页面时，在mount中无法获取到需要渲染的DOM，也就无法做操作，解决方法就是在nextTick的回调中操作。
`this.$nextTick(() => {})`

### nextTick踩坑
如果有如下需求：使用v-html渲染页面后，需要在渲染出的DOM中的某个元素添加事件，在事件的回调函数中对渲染dom的字符串做更改，则当前的dom发生变化，那么之前添加的事件就会消失，原因是此时从新渲染了dom。同时，无法再进入nextTick函数中。
总体来说，如果是由于异步渲染出的DOM，而需要在nextTick(第一次页面渲染完成后的回调)中更改DOM，最终渲染完成后，不会重复进入nextTick函数中，那么在第一次触发也是唯一一次触发的nextTick中添加的事件也就会消失。

## vue中添加原生事件
vue中可以给原生的标签添加原生的事件，如scroll，mouseover等，如果报错可以在this.$nextTick()的callback中通过addEventListener添加事件。 
但是组件要通过.native才能生效事件

## v-for直接写数字表示循环
v-for里使用的值范围：v-for 也可以接受整数。在这种情况下，它会把模板重复对应次数。也就是v-for="n in 4",就会重复四次，n就是1-4。
T：这个是直接写在vue文档里的，我竟然一直不知道 >_<

## 父组件引用子组件方法
给子组件一个ref，this.$ref.childname.method

## vue2底层无法观测对象和数组变化实时更新视图的问题
在vue中通过watch监听数据的变化，从而，该改变视图的时候，如果监听的数据是数组或对象，而且此时视图未更新，
数组：vm.items[1] = 'x' // 不是响应性的，可以改为 vm.items.splice(indexOfItem, 1, newValue)，即利用splice改变数组
对象：this.obj.message = 'hello' // 不是响应式的，可以改为 this.obj = Object.assign({}, this.obj, { a: 1, b: 2 })
当然，也可以暴力刷新：this.clearTagData[0]=this.checkedColumn[0];  this.$forceUpdate()
参考博客：https://segmentfault.com/a/1190000022772025

## vue获取当前组件中的方法 $options.methods
this.$options.methods是查询该组件下的所有method，这样就可以将方法名作为字符串+变量的方式执行，更灵活，但注意，方法执行时需要用call或apply。
let methods = this.$options.methods;
调用：
this.$options.methods.getPicData.call(this)
this.$options.methods.getPicData.call(this,data)

## vue 不常用事件
@load.once : 加载完成回调

## vue的key属性
不要以为key属性只是在v-for中才会使用，key是vue为了区分各个dom节点区别的一个重要因素。
例如两个tab页，拥有相似的dom结构。在切换的时候，如果不加key，vue会以为是一个页面，则可能mounted都不会触发。
又例如一个表单中，有新增或删除的表单项，若不加key，删除或者新增的表单项，可能会导致表单项的表单验证、或者样式也出现混乱

## 如何准确的调整watch执行时机（也可以体现两种watch写法的区别）
* 业务情景：在编辑某个现有数据的表单时，如果有某几个下拉选项有联动关系（比如 密钥类别 => 密钥算法 => 密钥长度 ， 选择密钥类别后再展示特定的密钥算法，选择了密钥算法后再展示特定的密钥长度），通常这种联动逻辑会通过watch实现。在打开弹框的时候，会首先填充表单数据。但是填充有联动关系的数据时，会触发watch导致填充的数据出错。如果写在watch中监测，则就有可能出现上述场景的问题，则可以通过this.$watch的写法来规避这个问题。
* 替换逻辑：在打开弹框的时候，首先填充表单数据，再根据这些数据获取下拉选项的可选值。做完这一步相当于打开弹框的显示过程不再会出现问题。之后再通过$watch监测密钥类别、密钥算法、密钥长度等字段来实现联动关系。$watch最好写在nextTick中，确保是在页面完全渲染后再添加上监测逻辑。
```js $watch写法示例
this.$watch('formModel.field', (data) => {}, {deep: true})
```
* 补充点：在实际实现的过程中又遇到了一个问题，由于封装的框架逻辑问题，在进入该模块的时候，弹框就会被渲染(会触发mounted生命周期)，而关闭弹框时只是隐藏了页面。所以第二次打开这个弹框的时候，即使是$watch,一开始监测的逻辑也还在。所以在关闭弹框的时候需要把watch的逻辑给关掉。
```js 如何把$watch的监测逻辑给关掉
showDialog () { // 打开弹框逻辑
    this.watch = this.$watch('field', (data) => {}) // 通过一个变量承接住
}
closeDialog () { // 关闭弹框
    this.watch() // 执行后即可关闭监测
}
```

## Vue.observable
* 该api主要是将不是响应式的数据添加上响应式。
* 如你在全局注册了一个全局变量，该全局变量是个配置项。配置项呢，是由一个js文件直接默认模块化导出的。那么这个全局变量便不是一个响应式变量，watch、computed是监测不到变化的。
* 即使`Vue.prototype.$config = config;` 挂在this上也不行。
这时就需要拿observable注册一下。也只多了一步
```js
const configOb = Vue.observable(config)
Vue.prototype.$config = configOb
```

# vue路由
- router-view 路由插座
- router-link 路由跳转 其中有几个属性 
1. tag:router-link标签实际显示为什么标签，例如li、div等
2. active-class: 高亮时该标签的class名，该class名对应的css样式可以提前写好。

## 组件路由守卫：
### beforeRouteEnter(to,from,next)  
将要进入时
去哪？来自哪？放行，只有调用next（）才会成功前往to
```js
beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      if (from.name == "mediaDetail") {
        vm.formData = JSON.parse(sessionStorage.getItem("formData"));
      }
    });
  },
//在这个路由守卫中是拿不到this的，因为他的触发情景是进入该路由前，所以通过vm来调用组件里的变量或者函数。
```

### beforeRouteLeave(to,from,next)	
将要离开时
同理
动态路由的变化，以上两个守卫不能拦截

### beforeRouteUpdate(to,from,next) 
专门检测动态路由的钩子，2.6版本之后才存在的钩子，之前可以通过watch $route来检测路由变化，而感知动态路由

## $router.push
```js
this.$router.push("/CustomView/systemManage/CustomView");  //跳转
// 默认是替换了当前的窗口

// Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象
//deferred.resolve() 函数用于解决Deferred（延迟）对象，并根据给定的args参数调用任何 doneCallbacks 回调函数。
let text= this.$router.resolve({
      path: '/Started',
      query:{
        id:1
      }
    });
    
// 打开一个新的页面     
window.open(text.href, '_blank')
```

## 页面重载(全局注册方法)
```js 定义reload插件
<router-view v-if="isRouterAlive"></router-view>
//provide和data同级
provide() {
  return {
    reload: this.reload,
  };
},
data() {
  return {
    isRouterAlive: true,
  };
},
methods: {
  reload() {
    this.isRouterAlive = false;
    this.$nextTick(function () {
      this.isRouterAlive = true;
    });
  },
},
```

``` 使用插件
inject: ["reload"],
this.reload();
```


# vue业务相关问题

## 通过v-html富文本而生成的dom，设置图片的样式
无法直接写css样式，不会直接生效
在mount中写nextTick获取img设置css
```js
this.$nextTick(() => {
      // 页面渲染完成后的回调
      $(this.$refs.content_html).find("img").css("max-width", "100%");
    });
```

如果有tab标签页，也就是说不会多次触发mount，页面变化了但是没有多次触发mount，后续的页面便无法通过next设置css，则可在updata中加css

```js
updated(){
    $(this.$refs.content_html).find("img").css("max-width", "100%");
  },
```
## vue无法触发hashchange事件
由于vue底层调用的是history.pushState和history.replaceState,当url中#后的地址发生变化时并不会触发hashchange事件。所以必须要调用路由守卫。
但是如果vue需要引入外部js，外部的js中无法调用vue的API。
例如一个实际的业务：要根据路由的变化，来决定实际调用哪个函数。比如resizes.js函数：针对不同的url执行不同的缩放比例函数，将所有的自执行函数都导出到外部。

在App.vue写路由守卫
```js
import {resizeHome,resizeSmall,resizeTest} from '@/assets/js/resizes.js'
this.$router.beforeEach((to, from, next) => {
  // resizeHome()
  // resizeSmall()
  if(to.name == "Main"){
    resizeHome()
  }else{
    resizeSmall()
  }
  next();
});
```


## 微信防盗链
破解微信防盗链：直接在头部加（目前好像已经失效）
`<meta name="referrer" content="never">`
但是这个在vue中好像不会生效。但是通过这次掌握了如何在vue中加头部
+ 1、`npm install vue-meta --save`
+ 2、main.js中引入
`import Meta from 'vue-meta'`
`Vue.use(Meta)`
+ 3、在单个vue组件中写metaInfo方法，和methods写法一样
```js
 metaInfo: {
      title: 'This is the test',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' }
      ]
    },
```

## vue防抖
事件回调以下函数，然后在函数中的setTimeout中执行实际的回调函数。
```js
debounce(fn,late) {
  if(this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(() => {
    fn()
  },late)
}
```

## vue引入翻译
百度翻译请求url:`"http://api.fanyi.baidu.com/api/trans/vip/translate"`;
有道翻译请求url:`"https://openapi.youdao.com/api"`
无论那种api，都需要用到加密。这里采用CryptoJS包中的加密方法`yarn add crypto-js`
百度用到的是MD5，有道是SHA256，直接加密后的是数组，需要用toString去转成字符串
`MD5().toString()`   
`SHA256().toString(CryptoJS.enc.Hex)`

且如果用的axios做请求，get方式统一axios.get("url",{params:{}}),
而post方式参数要采用application/x-www-form-urlencoded即表单数据类型
```js
let datas = new FormData();
datas.append("q", this.query);
```

目前已遇到的问题：
1、post提交时，参数若不是表单类型会提示参数错误。
2、若翻译的内容是一段富文本字符串(即包含转义字符，空格、左右尖括号等，可能会引起报错。)

### 百度翻译
签名生成方式：将请求参数中的 APPID(appid)， 翻译 query(q，注意为UTF-8编码)，随机数(salt)，以及平台分配的密钥
拓尔思APPID:20200831000555888   秘钥:9r3LhR_69v5DT1Em82ua
拓尔思APPID:20190603000304568   秘钥:OvqjwMmLtheEzGF9L988
salt随机数：`new Date().getTime()`
所以签名生成为：
```js
var str = appid + query + salt + key;
var sign = CryptoJS.MD5(this.str).toString()
```
其余参考文档操作即可
`http://api.fanyi.baidu.com/doc/21`

### 有道翻译
salt随机数：`new Date().getTime()`
curtime:`Math.round(new Date().getTime() / 1000)`
signType(签名类型):`v3` 大部分固定为v3
签名生成方式:应用ID+input+salt+curtime+应用密钥,其中,input有个讲究:
input的计算方式为：`input=q前10个字符 + q长度 + q后10个字符（当q长度大于20）或 input=q字符串（当q长度小于等于20）`;
所以签名生成为：
```js
var str = appKey + truncate(q) + salt + curtime + secret_key
var sign = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex)
function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}
```
其余参考文档操作即可
`https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html`

## 切换路由后，页面接口异常刷新。（集中在mounted, created的接口）
 * 问题描述： 在首页和其他页面之间切换，接口会重新请求（后来发现只请求了mounted，created里的接口，怀疑被动刷新了）。首页 => 其他页面，首页的接口会重新请求；其他页面 => 首页，其他页面的接口会重新请求。 其他页面 => 其他页面，一切正常。

 * 定位过程： 刚开始也没往mounted、created等钩子上想，偶然发现只触发了这两个钩子里的接口。先去看了看首页的逻辑，一切正常。首页路由为/index，又去找了找和这个路由/index的相关逻辑，看看有没有单独处理了一些逻辑，没发现什么特殊处理。后来又去全局的路由守卫里看了看，也是一些全局的路由跳转处理，没有什么异常。后来又网上搜了一下，一位老哥的情景跟我比较类似（文章链接：https://juejin.cn/post/7024068717134741534），不过他是动态路由导致的父组件重复渲染，router-view的key的唯一性会导致“根据参数动态渲染路由”时无法复用组件。想要复用某组件，就保证router-view里按需赋予它该有的key。key不变就不会重新渲染组件。虽然跟我情景不太一致，但也让我注意到了这个路由插座。我去搜了搜项目中的路由插座，看到也是有两个插座，用v-if/v-else来控制显示的，再加上前面怀疑的被动刷新导致的，所以怀疑大概率就是这里导致的。然后细看了这里的逻辑，首页的布局是没有顶部的tab来切换路由的布局，其他的页面，均带了顶部的tab，来切换小路由。所以逻辑判断为有没有tabs，即tabs.length大于0来决定两种显示哪种页面布局，切换就会带来router-view的切换，从而带来mounted等钩子的触发。然后又去看了看点击左侧菜单切换路由时的逻辑，点击菜单时，会先处理tabs数据，也就是在实际的切换路由前，tabs的数据就变了，那么问题来了，tabs数据先变，那就势必会触发v-if/v-else，那么router-view就会重新渲染一次，而且是在切换路由前，所以重复触发了一次切换前页面的钩子。那么至此，终于成功定位到了问题。

 * 改正： v-if/v-else不再牵扯router-view，即合并了两种layout，原来两种router-view在两个布局文件里，现在直接合并，在布局里，给tabs一个v-if，然后适当合并修改样式，完事。