# 运算符
## <<  >>
3<<1 => 3转二进制11并向后加一位零 => 110 => 6 
5>>1 => 5转二进制101并删除掉最后一位 => 10 => 2

```js
let a = 3
a<<1 // 6，但此时a还为3
a<<=1 // 6，且此时a也被赋值为了6
```

## ++
```js
let a = 3
a++*3 //9
++a*3 //12
```

## 位运算符
* & 与运算：  1&1 =1，其余均为0。
```js
25 & 34
011001
100010
与运算后
000000 = 0
```

* ｜或运算：  0｜0 =0，其余均为1

* ^ 异或运算： 相同为0，不同位1。常用语加密解密

* ~ 位非运算： 加1取负。 2 => -3
```js
let str = 'abcdef'
if (~str.indexOf('a')) {} 
// 除了找不到的为-1后，加1取负后为0(false)，其余能找到的加1取负后均为负数(true)，但都是真。
// 所以这个表达式代表“是否可以查找到该字母”
```

## ~~Number 会将数值转为字符串
~~9 === '9'

# switch
```js
let score = 85;
let grade;

switch(true) {
  case score >= 90:
    grade = 'A';
    break;
  case score >= 80:
    grade = 'B';
    break;
  case score >= 70:
    grade = 'C';
    break;
  case score >= 60:
    grade = 'D';
    break;
  default:
    grade = 'F';
}

console.log(grade); // 输出: B

// ---------------------------------------

let fruit = '苹果';
let message;

switch(fruit) {
  case '苹果':
  case '梨':
  case '香蕉':
    message = '这是常见水果';
    break;
  case '火龙果':
  case '山竹':
    message = '这是热带水果';
    break;
  default:
    message = '未知水果';
}

console.log(message); // 输出: 这是常见水果
```

# while循环
* break： 跳出当前循环，若有id，可以跳出指定id的外层循环（for循环中也是）
```js // 查找0～100的质数
var num=1, i=2, bool=true
abc:while (num++ < 100) {
  i = 2
  bool = true
  while (i < num){
    if (num % i === 0) {
      bool = false;
      break
    }
    if (num > 50) break abc;  // 大于50时，跳出外层while循环
    i++
  }
  if (bool) console.log(num)
}
```

* continue：遇到满足条件的，跳到下一次循环，继续向后。当前continue后面的语句不执行。（for循环也是）

## do-while // 先执行，再判断条件是否循环
```js
let i =0
do{
  console.log(i)
}while(++i < 10)

// while后也可以加逻辑，在循环结束后会执行一次
do{
  console.log(i)
}while(++i < 10){
  console.log('done')
}
```

# 函数
## 函数的参数
* arguments
arguments 函数的参数会被存储在这个数组中，常用语参数数量不固定
arguments.callee 当前函数
arguments.callee.name 当前函数名字
arguments.callee.caller 调用当前函数的外部函数

```js
function fn (a,b){
  arguments.length // 5 实参的长度
  arguments.callee.length // 2 形参的长度
}
fn (1,2,3,4,5)
fn.length // 2 形参的长度
```

* rest
```js
function fn1 (a, ...rest) {
    console.log(a) // 1
    console.log(rest) // [2,3] 
   }
   fn1 (1,2,3)
```

# 数组
* push 往尾部推若干元素，返回数组长度 `push(2,3,4,5)`
* pop 删除尾部元素，返回被删除的元素 `let arr = [1,2,3,4,5,6]; while(arr.pop() !== 3)` 这么写可以删除元素到3为止 `arr => [1,2]`
* unshift 前面添加若干元素，返回新长度。效率低下
* shift 前面删除元素，返回被删除的元素。效率低下
* concat `arr.concat([5,6,7],[8,9])`  `arr.concat[5,6,7,8,9]` 
```js
//数组去重
function short_arr (arr) {
  return arr.reduce((value, item) => {
    return value.indexOf(item) > -1 ? value : value.concat([item])
  }, [])
}
```
* splice()
  * arr.splice(1)  第1开始（包含第1位），删除到尾部，返回被删除元素的新数组
  * arr.splice(1,2)  从第1位开始（包含第1位）删除2个元素，返回被删除元素的新数组
  * arr.splice(-1) 从后向前数，开始删除，从最后一位开始
  * arr.splice(-3, 2) 从倒数第三个开始删，向后删俩
  * arr.splice(0) 将一个数组的所有元素转到另一个数组

  * arr.splice(1,2,3,4) 将数组从第一位开始删，删俩，并且替换成3，4
  * arr.splice(1,0,2) 在第一位插入一个元素2，插在了第一位，原第一位被挤在第二位
* slice 
  * arr.slice() 复制原数组到新数组
  * arr.slice(2) 从第2项开始（包含第二项），复制元素到新数组 
  * arr.slice(-2) 从后向前数第二个开始，向后复制到新数组
  * arr.slice(1,2) 从第一项复制到第二项，”不包括“结束这一项
* reverse 将数组颠倒，会改变原数组，以下为两种重构方法
```js
// 递归
const reverse = ([first, ...rest]) => {
  return first === undefined ? [] : [...reverse(rest), first];
}
reverse([1,2,3])

// reduce
const reverse = arr => arr.reduce((acc, item) => [item, ...acc], []);
console.log(reverse([1, 2, 3])); // [3, 2, 1]
```

* sort 将数组正序排序，会改变原数组
```js
arr.sort(function (a, b) {
  // a 泛指后一项 
  // b 泛指前一项
  return a-b
})
```

* indexOf 查找下标，若无返回-1
  * arr.indexOf(3,4) 查找3，从第4个下标开始搜索
* lastIndexOf 从后向前查找元素
  * arr.lastIndexOf(3,4) 查找3，从第4个下标开始搜索，从后向前
* fill 填充，fill只能填充有长度的数组 fill(要填充的内容, 从第几位开始填充, 到第几位之前(不包含))
```js
let array = new Array(10).fill(3);  // [3,3,3,3,3,3,3,3,3,3]
let arr = new Array(5).fill(3, 1, 3) // [empty, 3, 3, empty, empty]
```

* reduce(value, item, index, arr) 归并。 若没有初始值，value就是数组的第0位元素，item从第1位开始。下次循环运行的value是上次return的结果

* flatMap 扁平化数组，参数必传，是一个函数。` arr.flatMap(item => item) ` item代表二元数组的每一项

# 字符串
* replace ` 'abcdef'.replace('a','c') `将a替换为c，不改变原字符串
```js
let str = 'abcdef'
str = str.replace('cd', function(item){
  return item+'1'
})
```
* slice 与数组完全相等，包括前，不包括后
* substring 与slice差不多，包括小的，不包括大的。为什么用“小”和“大”呢。因为substring可以前后倒着写
```js
let str = 'abcdefdg'
str.substring(3,6) //从第3位截到第6位之前，“def” 包括3，不包括6
str.substring(6,3) //从第3位截到第6位之前，“def” 包括3，不包括6
```
* substr `str.substr(index, length)` 从第index位开始截取，截取length长度

* str.toUpperCase() 大写
* str.toLowerCase() 小写
* str.repeat(num) 字符串重复num次，返回一个新字符串

* str.includes('string') 判断字符在字符串中是否存在，返回true或false

* str.startsWith('a') 判断是否以'a'开始 `str.startsWith('a', 1)` 判断第一位开始是否是a
* str.endsWith('a') 判断是否以'a'结束，也可传第二个参数

* str.padStart(num, string) 当字符串长度不足num时，前面补string
* str.padEnd(num, string) 当字符串长度不足num时，后面补string
* 随机色 ` "#" + Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6, 0) `

* split 切割。 
```js
str.split("").reverse().join("") // 字符串反转

// 获取Url查询参数部分(即?后的)
let str = 'https://fanyi.baidu.com/mtpe-individual/multimodal?query=shift&lang=en2zh&fr=pcPinzhuan'
let params = str.split("?")[1]

// 若参数部分有?号
let params = str.split("?").shift().join("")

// 当然，现有更高效的写法
const urlObj = new URL(url);
const params = new URLSearchParams(urlObj.search); // 获取URL中的查询参数部分，并且是已经存储为URLSearchParams对象了，并且可以直接用forEach等数组方法遍历
```

# Set与Map
## Set 
无重复列表类型，无下标，不按照下标存储，但有序。插入速度和删除速度非常快，遍历也快，但略低于键值对类型
* 创建 `let set = new Set([])`
* 插入元素 `set.add(1)`
* 删除元素 `set.delete(2)`
* 是否存在 `set.has(2)`
* 清除元素 `set.clear()`
* 长度平替 `set.size()`
* 去重 `Array.from(new Set(arr))`
* 遍历 forEach  forOf  `for(let value of new Set([1,2,3])) {console.log(value) 1、2、3}`
```js
let set = new Set([1,2,3])
for (let value of set) {
  console.log(value) // 1 2 3
}
set.forEach((v1, v2, set) => {
  console.log(v1, v2, set) 
  // 打印出来v1=v2 等于遍历元素内容，set就是set本身
  // 这意味着set本身就是键值对，不过是key和value相等的键值对，key是绝不可能重复的，所以set就不可能重复
})
```

## Map
有长度的键值对数据结构，具备数组的长度紧密型，有具备对象的键值对方法。获取、查询、删除、遍历速度极快。并且任何类型的数据都可作为键使用
* 创建 `let map = new Map()`
* 赋值 `map.set('name', 'cxy')`
* 获取 `map.get('name')`
* 判断某个键是否存在 `map.has('name')`
* 长度 `map.size()`
* 删除 `map.delete('name')`
* 清除 `map.clear()`
* 获取所有值的列表 `map.values()` 获取的这个列表可以转为Set类型，进而转为数组 `Array.from(new Set(map.values()))`
* 获取所有键的列表 `map.keys()`
* 遍历
  * forEach `map.forEach((值， 键值， map本身)=> {})`
  * forOf
  ```js
    for(let key of map.keys()){} // 键值的遍历
    for(let value of map.values()){} // 值的遍历
    for(let arr of map.entries()) { // 键值的遍历
      console.log(arr[0]) // 键
      console.log(arr[1]) // 值
    }
  ```
## Symbol 
唯一性，创建后，不可能存在和它一样的数据（双等和三等都不同） （什么才是真正的常量啊，哈哈哈）
对象的键必须是字符串，或是symbol
五种基本类型：Number String Boolean null undefined 一种复杂类型：Object。
新增了一个symbol类型
* 创建 `let a = Symbol('a')` `let a = Symbol()`
* 即使创建了n个Symbol()，这n个Symbol()也完全不一样。这样可以用作判断条件使用，可使条件强判断就是这个symbol时，才可进入条件的回调，更加规范。以防万一
* 对象中使用symbol
```js
let KEY = Symbol()
let obj = { [KEY]: 100 }
console.log(obj[KEY]) 
// 其他任何常量都无法访问到这个键值对。这个键名就这辈子都不会被覆盖
```

## 生成器函数
* 定义生成器函数`function* abc() {}`或`function *abc() {}`或`function * abc() {}`
* yield 类似断点。生成器函数执行后会返回一个生成器对象
```js
function *abc(a,b) {
  yield a;
  yield b;
  a++;
  yield a;
  b+=10;
  yield b;
  return a+b
}

let a = abc(3,5) //生成器对象
let obj = a.next() // {value:3, done: false}，value就是yield返回的结果，done就是生成器函数是否执行完成
// 当4次next之后，将返回{value: 19, done: true}
```
* 遍历生成器函数
```js do-while
let a = abc(3,5);
let obj;
do{
  obj = a.next();
  console.log(obj)
} while(!obj.done)
```

```js for-of
for(let value of a){
  console.log(value) // 只会执行到最后一次yield，最后一次return不会执行
}
```

# 类
* 类型判断 typeof function === 'function'; typeof obj === 'object' ; function.constructor === Function; obj.constructor === Object;
```js
class Ball extends Box{
  a='a'
  constructor(a){
    super(a) // 父类的构造函数，继承后需要执行
    // 构造函数中不能return返回某个对象，因为构造函数会默认返回this，如果返回了对象就会覆盖this。this就是实例话完成的对象
  },
  clickHandler (e) {
    // 若父类有这个方法，则会覆盖原方法，若不想覆盖，只想在原来的基础上新加逻辑
    super.clickHandler(e) // 先执行父类方法，在执行后来新加的方法
    console.log(...)
  },
  static isBox(){} // 静态方法。静态方法理论不能使用this，但实际上也不报错，this就是类名
  static A = 12 // 静态属性。这俩静态的，都只能通过类名Box来调用，不能通过实例话对象来调用
  showDemo () {
    // 取静态属性也要加上类名
    console.log(Box.A)
    console.log(Box.isBox())
    console.log(this.a)
  }
}

Box.c = '1' // 直接在类上定义的属性为静态属性，只能通过类获取到，方法同理
Box.prototype.d = '2' // 在原型上定义的属性为实例属性，可以通过实例话对象获取到
let box = new Box()
box.d // 2
box.c // undefined
Box.d // undefined
Box.c // 1
```

* 模块化开发的时候，想要使用import 需要给script加`type='modules'` `<script type="module">`

# BOM window
就是整个浏览器，包含开、关、放大等等

# DOM document
浏览器实际可视区域

# 事件
* 可利用事件抛发传参，必须先侦听，抛发时才能接收到。先抛发再侦听则不行
```js
document.addEventListener('cxy', (e) => console.log(e.params)) // 侦听，获得params参数：test
e.target // 实际触发了事件的元素
e.currentTarget // 被侦听的元素

let cusEvent = new Event('cxy')
cusEvent.params = 'test'
document.dispatchEvent(cusEvent) // 再抛发，抛发时执行回调
```

# async await
* async 函数必然返回一个promise对象，其实async本来也就是个promise
* await 必须写在async中
* await 只能处理promise对象的等待，也就是不会等setTimout或setInterval
* await 会等promise中的setTimout或setInterval
* async 函数返回的内容，可以在.then中接收到
```js
async function test() {
  return 'b'
}
let result = test()
console.log(result) // promise
result.then(res => console.log(res)) // 'b'
```

# 宏任务与微任务
## 宏任务 setTimout setInterval
宏任务将当前任务挪至下一个任务列的最顶端执行

## 微任务 promise
微任务将当前任务挪至当前任务列的最底端执行

具体的执行顺序判断，如果将来还不懂的话，建议看视频，js -> 0804 -> 宏任务与微任务

# node
* package.json解读:  dependencies项目打包会打进的包合集；devDependencies: 开发时用的包，不打入最终包
使用 --save (-S) 安装的包是项目发布之后还需要依赖的包 ， 如axiox , express等包，等项目上线以后还需使用。 会打入dependencies
使用 --save-dev （-D） 安装的包则是开发时依赖的包，等项目上线则不会使。如项目中使用的 gulp , 压缩css、js 的模块等在项目上线后则不会使用。会打入devDependencies

- npm view vue versions
- ^: 锁定主版本号
- ~: 锁定次版本号
- *: 固定版本
- 无：安装最高版本

# AJAX
* AJAX如果你连续快速发了多次请求，它只会将最后一次请求返回
* 跨域也分为“消息头”跨域和“消息体“跨域
* 一般form表单的默认提交要屏蔽掉，通过AJAX提交，而且默认的可能会刷一下页面，很难看。在submit事件中通过`e.preventDefault()`阻止默认事件
```js get
var xhr = new XMLHttpRequest()
let url = 'https://localhost:8080?user=cxy'
xhr.addEventListener('load', loadHandler)
xhr.addEventListener("timeout",timeoutHandler); // 超时回调
xhr.open('GET', url)
xhr.setRequestHeader("content-type", '') // 设置请求头，open后，send前
// GET允许发送自定义消息头，POST不允许
// 发送自定义消息头时，必须在服务端设置响应头跨域同意Access-Control-Allow-Headers："*"
// "Access-Control-Allow-Origin":"*", 请求体跨域
xhr.setRequestHeader("name", 'cxy')
xhr.send()
function loadHandler(e) {
  xhr.getAllResponseHeaders() // 获取所有响应头，不包括自定义的响应头
  xhr.getResponseHeader('content-type') //获取指定的响应头
}
function timeoutHandler () {}
```

```js post
var xhr = new XMLHttpRequest()
let url = 'https://localhost:8080'
let params = {
  name: 'cxy'
  age: 26
}
xhr.addEventListener('load', loadHandler)
xhr.open('POST', url)
xhr.send(JSON.string(params))
function loadHandler(e) {}
```

* 然后实际上不使用load事件，多用`readystatechange`
```js
var xhr=new XMLHttpRequest();
xhr.addEventListener("readystatechange",readyHandler);
xhr.open("GET","http://localhost:4006?user=xietian&age=30");
xhr.send();
function readyHandler(e){
    // xhr.status 响应消息的状态
    if(xhr.readyState===4 && xhr.status===200){
        console.log(xhr.response);
    }
}
```

* jsonp解决跨域，极其不安全，不怎么用
```js
var script=document.createElement("script");
script.src="http://localhost:4008?a=3&b=4";
document.body.appendChild(script);
// 如果script的src指向服务端，服务端中write内容将是这个script执行的脚本
// script返回的内容，会直接在这个创建的script脚本中执行
```

# setter getter
* 如果仅有set，没有get，这个属性就是只写属性
* 如果仅有get，没有set，这个属性就是一个只读属性
```js es6可以通过只设置get来定义常量
class Box{
// static  const EVENT_ID="Event_Id"; 对象中不能使用const
  constructor(){
    this.check = !this.check // 内部改也会触发set
  }
  _check= false
  static get EVENT_ID(){
      return "EVENT_ID";
  }
  set check(val) {
    return this._check = val
  }
  get check() {
    return this._check
  }
}
```
* 对象中定义set和get
```js
var obj = {
  a: 1,
  _c: 0,
  // set有且仅有一个参数
  set c(value) {
    this._c = value;
  },
  // 不允许有任何参数
  get c() {
    return this._c;
  },
};
obj.c = 10 // 修改c时，便会调用set，
console.log(c) // 获取c时，便会调用get
```

* 可以通过`Object.defineProperty`或`Object.defineProperties`给DOM中的元素增加setter和getter获取响应式
`var div = document.querySelector("div");`获取要加setter和getter的dom
```js 设置单一属性
div._width=0;
Object.defineProperty(div,"width",{ // 通过defineProperty设置的以下三个高级属性，默认值是false。普通赋值div.a的方式，a属性的三个高级属性，默认值是true
  value: 30 // 属性值
  enumerable:true, // 可枚举 默认false
  writable：true, // 可修改 默认false
  configurable: true, // 是否允许修改属性描述符或删除属性，默认false
  set:function(_value){
      this.style.width=_value.toString().indexOf("px")>-1 ? _value : _value+"px";
      this._width=_value;
  },
  get:function(){
      return this._width;
  }
});
div.width++;
// 触发set
```
```js 设置多个属性
Object.defineProperties(div, {
  _width: {
    writable: true,
    value: 0,
  },
  _height: {
    writable: true,
    value: 0,
  },
  _bgColor: {
    writable: true,
    value: 0,
  },
  width: {
    enumerable: true,
    set: function (_value) {
      this.style.width =
        _value.toString().indexOf("px") > -1 ? _value : _value + "px";
      this._width = _value;
    },
    get: function () {
      return this._width;
    },
  },
  height: {
    enumerable: true,
    set: function (_value) {
      this.style.height =
        _value.toString().indexOf("px") > -1 ? _value : _value + "px";
      this._height = _value;
    },
    get: function () {
      return this._height;
    },
  },
  bgColor: {
    enumerable: true,
    set: function (_value) {
      this.style.backgroundColor =
        typeof _value === "string"
          ? _value
          : "#" + _value.toString(16).padStart(6, "0");
      this._bgColor = _value;
    },
    get: function () {
      return this._bgColor;
    },
  },
});
div.width++;
div.height++;
div.bgColor++;
// 触发div中的set
```

# 闭包
* 是指有权访问另一个函数作用域中的局部变量
* 为了解决变量污染
* 为了得到私有变量
* 缺点:  会造成内存泄漏
```js
function fn1(){
    var a=1;
    // 因为返回的函数被存储在全局变量中，
    // 并且这个返回的函数使用这个a的局部变量，因此a被保存在堆中
    return function(){
        a++;
        console.log(a);
    }
}
var f=fn1();
f() // 2
f(); // 3
```

## 柯里化 （算是另一种手段的业务分离？也许吧）
```js
function curry(fn){
    var arr=[]; // 闭包的局部变量
    return function(){
      if(arguments.length>0){
          // 专门处理参数
          arr=arr.concat(Array.from(arguments));
          return arguments.callee;
      }else{
        // 实际的业务逻辑
          return  fn.apply(null,arr);
      }
    }
}

function fns(){
    return Array.from(arguments).reduce((value,item)=>value+=item); // 求和
}

var sum=curry(fns);
var s=sum(1)(2,3)(4,5,6)()
console.log(s);
```

# 设计模式
* 工厂模式：假设有一份很复杂的代码需要用户去调用，但是用户并不关心这些复杂的代码，只需要你提供给我一个接口去调用，用户只负责传递需要的参数，至于这些参数怎么使用，内部有什么逻辑是不关心的，只需要你最后返回我一个实例。这个构造过程就是工厂。工厂起到的作用就是隐藏了创建实例的复杂度，只需要提供一个接口，简单清晰。（给零件，调函数，出工程化的对象，每个对象都不一样，无引用关系）
* 单例模式：单例模式很常用，比如全局缓存、全局状态管理(Vuex )等等这些只需要一个对象，就可以使用单例模式。（最终形成的对象或者其他的，就那么一个，存在就直接return已存在出去，不再创建新的）
* 装饰模式：不需要改变已有的接口，作用是给对象添加功能。在 React 中，装饰模式其实随处可见。
* 代理模式：代理是为了控制对对象的访问，不让外部直接访问到对象。比如事件代理就用到了代理模式。因为存在太多的 li，不可能每个都去绑定事件。这时候可以通过给父节点绑定一个事件，让父节点作为代理去拿到真实点击的节点。
* 发布-订阅模式：也叫做观察者模式。通过一对一或者一对多的依赖关系，当对象发生改变时，订阅方都会收到通知。比如我们点击一个按钮触发了点击事件就是使用了该模式。在 Vue 中，如何实现响应式也是使用了该模式。对于需要实现响应式的对象来说，在 get 的时候会进行依赖收集，当改变了对象的属性时，就会触发派发更新。
  * 学习完redux之后，发现redux也是观察者模式，将所有被观察的对象放在一个列表里，当需要被执行时，或被dispatch时。通知观察列表里的所有对象执行。

# promise
## promise
### 基础promise写法
```js
let p = new Promise((resolve,reject) => {
  axios.get(url).then(res => {
    resolve(res)
  })
})

p.then(res => {
  //这里的res，就是上面resolve(res)传过来的res
  console.log(res)
})
```

### 连缀写法
```js
new Promise(resolve => {
  axios.get(url,{params}).then(res => {
    resolve(res)
  })
})
.then(res => {
  return new Promise(resolve => {
    axios.get(url,{
      //params中的res就是上个异步函数中取到的res
      params:{
        res
      }
    }).then(res => {
      resolve(res)
    })
  }).then(res => {
    console.log(res) //这个res是经过两层异步后得到的结果
  })
})
```

### 在vuex中的action中写promise
vuex的action如何定义：
```js
port({commit}){
  return new Promise(resolve => {
    axios.get("/cas/statistics/original/main.do",{
      params:{
        method: "getArticleStyleClassify",
      }
    }).then(res => {
      commit("setTypeList",res.data.Records)
      resolve(res)
    })
  })
},
```

在外部接到这个promise并且控制顺序
```js
this.port().then(res => {
  return new Promise(resolve => {
    this.axios.get(url,{
      params:{
        res  //port执行后取得的res
      }
    }).then(res => {
      resolve(res) //通过resolve将res传给then
    })
  }).then(res => {
    console.log(res) //第二个异步函数最终获取的res
  })
})
```

### 结合一下
```js
function newPromise(){
  return new Promise(resolve => {
    this.axios.get(url).then(res => {
      resolve(res)
    })
  })
}

newPromise().then(res1 => {
  return new Promise(resolve => {
    axios.get(url,{params:{
      res1 //第一次异步获取的res
    }}).then(res2 => {
      resolve(res2)
    })
  }).then(res2 => {
    //这个port是上面里面定义的函数
    return port().then(res3 => {
      return new Promise(resolve => {
        axios.get(url,{
          params:{
            res3
          }
        }).then(res4 => {
          resolve(res4)
        })
      }).then(res4 => {
        return new Promise(resolve => {
          axios.get(url,{
            params:{
              res4
            }
          }).then(res5 => {
            resolve(res5)
          })
        }).then(res5 => {
          console.log(res5) //经过4-5个异步函数的参数调整后，最终获取到res5这个最终结果
        })
      })
    })
  })
})
```

### promise.all
```js
getZmAnalyCount() {
  return new Promise((resolse) => {
    this.axios
      .get("/cas/statistics/original/main.do")
      .then((res) => {
        resolse(res);
      });
  });
},

getZmAnalyShare() {
  return new Promise((resolse) => {
    this.axios
      .get("/cas/statistics/original/main.do")
      .then((res) => {
        resolse(res);
      });
  });
},

Promise.all([this.getZmAnalyCount(),this.getZmAnalyShare()]).then(
  (res) => {
    console.log(res);  //res是一个数组，顺序和上面写的调用顺序一致
  }
);
```

## webStorage 与cookie
### cookie与storage
cookie浏览器关闭时会消失，可以设置过期时间，但存储空间小4K
storage:sessionStorage关闭浏览器自动丢失，localStorage不手动清除永远会在,但存储空间5M
```js
sessionStorage.setItem('user', JSON.stringify(userEntity)); //存
var userJsonStr = sessionStorage.getItem('user'); //取
userEntity = JSON.parse(userJsonStr);
```

### localstorage与sessionStorage
1、不同浏览器无法共享localStorage和sessionStorage的值。

2、相同浏览器下，并且是同源窗口（协议、域名、端口一致），不同页面可以共享localStorage，Cookies值，通过跳转的页面可以共享sessionStorage值

3、原窗口跳转的页面传递sessionStorage，改变存储值会相互影响，新开窗口跳转方式传递sessionStorage，改变存储值互不影响
(这种通过新开窗口的跳转方式就像原窗口给每个新开的窗口单独存了一个storage。比如新开了两个相同的页面，但是页面中展示的数据不一样，这些不同的数据存在sessionstorage，即使刷新后，这两个新窗口的sessionstorage依然是不一样的，相互独立，不会互相影响。)

## 排序方法

### 对象型数组的排序方法
```js
根据对象中的count属性排序
arr.sort(compareDe('count'))
function compareAdd(property) {
      return function (a, b) {
        return a[property] - b[property];
        return a[property] < b[property] ? 1 : -1 //两种写法
      };
    },
```

### 排序的业务逻辑复杂，需要添加多种逻辑写法：
当要排序的字段是中文时(按照中文的日期排序会出问题)，需要前端写很多逻辑，那么可以采用下面这种写法
```js
listPortData.sort(function(a,b){
    let value1 = a.dateStr.replace(/年|月/g, "-").replace(/([^\u0000-\u00FF])/g, "").replace(" ","").split("-")
    let value2 = b.dateStr.replace(/年|月/g, "-").replace(/([^\u0000-\u00FF])/g, "").replace(" ","").split("-")
    value1 = value1.map(item => {
        if(item.length == 1) return "0"+item
        else return item
    })
    value2 = value2.map(item => {
        if(item.length == 1) return "0"+item
        else return item
    })
    return value1.join("") < value2.join("") ? 1 : -1
})
```


## Math

### 四舍五入保留几位小数
```js
//功能：将浮点数四舍五入，取小数点后2位。保留1位就*10,3位就*1000
function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x*100)/100;
  return f;
}
```

### 查找对象型数组中某一属性的最大值
```js
var max = Math.max.apply(Math, this.list.map(i => {return i.seq }));
var max = Math.max.apply(null, arr);
var min = Math.min.apply(null, arr); 最大最小值
```

## js中常见的类数组
类数组（getElementsByClassName/arguments）转数组 Array.from

## js split通过正则分割字符串为数组
split分割默认","  也可以通过写字符串或者正则来改变。
如：2022年2月28日，想要把转变为2022-2-28，可以通过把字符串通过中文分割成数组后join一起。str.split(/[\u4E00-\u9FA5]/)。

## 动态的富文本生成的dom添加点击事件
`<p onclick="clickHandler()">`,这个点击事件是通过修改富文本的字符串添加的。
如若回调函数无法执行，需要在create()钩子中添加window方法：window.clickHandler = this.clickHandler,之后回调函数即可执行。

## 数组内容互换
`this.mediaTypeList.splice(1, 0, this.mediaTypeList.splice(3, 1)[0]);`
由于splice删除后删除的元素是以数组的形式存储的，所以要用[0]接住
或者
`[arr[0], arr[1]] = [arr[1], arr[0]]  es6中数组内容互换。`


## 前端导出文档流
前端导出后端返回的文件流，直接window.open(接口地址)，即可参数需要用字符串拼接。
这种是打开一个新页面，可能会出现空白页的问题。
可以创建一个不显示的a标签，
```js
const elink = document.createElement("a");
elink.download = "导出"; //默认导出名
elink.style.display = "none";
elink.href = `/cas/statistics/original/main.do?method=exportOriginalArticle&zbGuids=${this.markItems.join(
  ","
)}&fileName=原创稿件导出示例.xls`;
document.body.appendChild(elink);
elink.click();

URL.revokeObjectURL(elink.href); // 释放URL 对象
document.body.removeChild(elink);
```


## 清除多个定时器
清除多个定时器：弄清楚一件事，用一个变量去接定时器，这个变量根本上会变成一个数值，而且一般这个数值是小于9999的，所以如果想要一股脑清掉所有的定时器，可以设置一个for循环，小于9999次，全部清掉。但是慎用，倒不是不能用，考虑清除清理范围就好。

如果一个组件中有多个定时器，而有几个定时器是通过循环产生的，需要只清除这几个循环产生的定时器，则可以：
```timer = setInterval(()=>{})``` 这个是要保存的定时器， 
```js
for(i=0;i<=7;i++){
  clearTimer = setInterval
}
```
这些是要清除的定时器

直接 
```js
for(i=timer+1;i<=clearTimer;i++){
  clearInterval(i)
}
``` 
看似clearTimer去接不同的定时器会被覆盖，实则是js用不同的数字去接受这些定时器，所有在清除时直接拿对应的数字清除即可。

## 列表轮播
可以从Swiper3中引用列表的循环轮播,以下只展示一个实例。
```js
new Swiper('#swiper-topics', {
    direction: 'vertical',
    loop:true,
    slidesPerView: 5,
    autoplay : this.$store.state.time_topic_new
});
```

## scroll和mousewheel事件
mousewheel鼠标滚轮,显而易见动动鼠标滚轮就能触发事件,但是用光标拖拽滚动条就不能触发事件，通过该事件获取scrollTop存在一个bug，这个回调函数的触发频率要比scroll低很多，所以可能获取的scrollTop是上次滚动时获取的高度，导致需求中在自动滚动的过程中，手动滚动记录的scrollTop值不准确，导致效果不丝滑。

## js文件下载，下载后页面跳转出现白屏的问题
### 方案一（最简单，但会处理不了接口异常）：用js触发标签点击事件
```js
  const elink = document.createElement("a");
  elink.download = "原创稿件导出";
  elink.style.display = "none";
  elink.href = `/cas/statistics/original/main.do?method=exportOriginalArticle&zbGuids=${this.markItems.join(
      ","
    )}&fileName=原创稿件导出示例.xls`;
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
```
### 方案二（可操作性大，各方面均可处理）
```js
function Qs (data = {}) { // 生成get请求url
  let keys = Object.keys(data)
  let str = keys.reduce((value, item) => {
    return value + `${item}=${data[item]}&`
  }, '')
  return str.slice(0, str.length - 1)
}

function processErrorInfo (res) {
  const reader = new FileReader()
  reader.readAsText(res, 'UTF-8')
  return new Promise((resolve) => {
    const content = e.target.result
    try {
      /* 如果下载接口报错了，返回的不是文档流，而是JSON格式的，或者字符串等，则这里就会在try里一直运行下去；
      但如果接口没报错，返回的是文档流，则JSON.parse便会报错，进入到catch，resolve个true出去。 */
      const resError = JSON.parse(content)
      if (!resError.success) {
        this.$alert(resError.msg)
      }
      if (resError.code == 401) {} // 这里可以判断是否登陆过期，或者其他逻辑，酌情加
      resolve(resError) 
    } catch (error) {
      resolve(true)
    }
  })
}

function downloadFile (fileName, blob, flag) {
  if (!flag) {
    blob = new Blob([blob], {type: 'application/octet-stream;charset=UTF-8'})
  }
  if (window.navigator && window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    const objURL = URL.createObjectURL(blob)
    const aTag = document.createElement('a')
    aTag.href = objURL
    aTag.download = fileName
    aTag.click()
    URL.revokeObjectURL(objURL)
  }
  return true
}

function xhrDownload (method = 'get', url, data = {}, options = {}) {
  const xhr = new XMLHttpRequest()
  const baseURL = process.env.NODE_ENV === 'development' ? '/dev/api' : ''
  url = baseURL + url
  if (method.toLocaleLowerCase() === 'get' && Object.keys(data).length) {
    url = url + '?' + Qs(data)
  }
  xhr.open(method, url, true)
  xhr.setRequestHeader('TOKEN', localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN')) // 看请求是否需要加TOKEN
  xhr.setRequestHeader('responseType', 'blob')
  if (options['Content-type']) {
    xhr.setRequestHeader('Content-type', options['Content-type'])
  }
  xhr.responseType = 'blob'
  return new Promise((resolve, reject) => {
    xhr.onload = async function (e) {
      if (xhr.status == 401) {
        this.$router.push('/login') // 一般情况下401为登陆超时状态，直接跳转登录页
        return
      }
      if (xhr.status == 500) {
        this.$alert(err) // 500为常规报错
        return
      }
      const res = xhr.response
      const fileName = (xhr.getResponseHeader('content-disposition').split('filename=')[1])
      if (res instanceof Blob) {
        const resData = await processErrorInfo(res)
        if (resData === true) {
          // 从请求头获取下载文件的文件名，一般从content-info 或 content-disposition 
          downloadFile(fileName, res, true)
          resolve(true)
        } else {
          reject(resData)
        }
      } else {
        downloadFile(fileName, res, false)
        resolve(true)
      }
    }
    if (method.toLocaleLowerCase() === 'post') {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  })
}
```
### 方案三（不推荐）

```js
function  download (src) {
  var download_file= {} 
  if (typeof(download_file.iframe) == "undefined") {
    var iframe = document.createElement("iframe");
    download_file.iframe = iframe;
    document.body.appendChild(download_file.iframe);
  }
  download_file.iframe.src = src
  download_file.iframe.style.display = "none";
},
```

### 方案四（从别处copy，未验证）
```js
//下载信息确认函
downloadFile() {
  let that = this
  this.$store
    .dispatch('getCertConfirmFile', { certId: this.id })
    .then(_ => {
      let URL = Util.dataToFile(this.confirmFile.fileData)
      var reader = new FileReader()
      reader.readAsDataURL(URL)
      reader.onload = function(e) {
        // 兼容IE
        if (window.navigator.msSaveOrOpenBlob) {
          var bstr = atob(e.target.result.split(',')[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          var blob = new Blob([u8arr])
          window.navigator.msSaveOrOpenBlob(blob, this.confirmFile.fileName)
        } else {
          // 转换完成，创建一个a标签用于下载
          const a = document.createElement('a')
          a.download = that.confirmFile.fileName // 这里写你的文件名
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    })
    .catch(error => {
      this.$message.error(error.errorMessage)
    })
}
```

## 显示上传的图片
```js
function readImage() {
  const fileReader = new FileReader()
  const file = document.getElementById('uploaded-file').files[0]

  if (file) {
    fileReader.readAsDataURL(file)
  }

  fileReader.addEventListener(
    'load',
    () => {
      const result = fileReader.result
      const resultContainer = document.getElementById('result')
      const img = document.createElement('img')
      img.src = result
      resultContainer.append(img)
    },
    { once: true }
  )
}

```

## 短路运算符
&&： 1 && 2  当1为真时，取2的值
||： 1 || 2  当1有值时就取1，没值时取2

## encodeUrl(url) 编译url(需要拼凑地址时需要)  
`encodeURI/decodeURI  编码与解码`
如果要打开一个新窗口(url),或者做文件导出时，需要直接打开一个url，或者新建一个a，给a的href赋值一个url，都需要把url中的中文，引号，大括号转义为字符，则可直接使用encodeUrl(url)，自动编译url，会出现%7B等。

## 前端解析加密视频格式，类似抖音
在头部加入以下即可,这样类似抖音的加密视频都可以播放了，暂时是这样的，后续可能失效，因为抖音的加密策略可能会变化
https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fg10000cb216kbc77u2mb836180&ratio=360p&line=0
https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300fg10000c581h43c77u54a0h6uu0&ratio=720p&line=0
```html
<meta name="referrer" content="never"></meta>
```

## 判断对象型数组中是否某个属性都一样
```js
isAllEqualObject(array, field) {
  if (array.length > 0) {
    return !array.some(function (value, index) {
      // return value[field] !== array[0][field];
      return !_.isEqual(value[field], array[0][field]);
    });
  } else {
    return true;
  }
},
```

## 将对象型数组中某个属性组合在一起，用特性符号连接。
```js
/* 
  arr:要拼的数组
  params:要拼哪个对象属性
  symbol:用什么符号拼
*/
function assembleParams(arr,paramsName,symbol) {
    let str = "";
    str = arr.reduce(function(value,item,index){
        if(index == arr.length - 1) return value += item[paramsName]
        else return value += (item[paramsName] + symbol)
    },"")
    return str
}
console.log(assembleParams(arr,"id",","))
```

## 利用storage事件传参
* storage事件：当存储的storage数据发生变化时都会触发它，但是它不同于click类的事件会冒泡和能取消，storage改变的时候，触发这个事件会调用所有同域下其他窗口的storage事件，不过它本身触发storage即当前窗口是不会触发这个事件的（当然ie这个特例除外，它包含自己本事也会触发storage事件）。注意，是同域。

* 应用场景：一个系统是由多个小系统合并出来的，不同的两个页面在两套代码里。而希望在一套代码中的页面变化后（可能是稿件详情页中改变了稿件的标题或正文），另一套代码刷新列表数据（可能是稿件列表标题变化后，需要调接口刷新列表）。

* 实例：在页面主动变化后的代码中仅需改变releasePlanaddedit的值，则在需要刷新列表数据的代码中采用如下写法即可

```js 
const fn = function(e) {
    if (e.key === 'ls.releasePlanaddedit') {
        that.getListData(1);
    }
};
window.addEventListener('storage', fn, false);
```

## 在对象型数组中，希望将对象的特定属性单拎出来，汇总成一个新的数组，存在localstorage中
```js
/* 
list: Array<object>。
attributes: 需要单拎出来的属性，多个属性则用","隔开,是个字符串。  example: "id,name,value",
location: 存在localstorage中的位置（即名字）。  example: "releasePlanaddedit"
*/
function previewPageTurningStorage (list, attributes, location) {
    if (!list || list.length == 0) {
        return;
    }
    list = deepCopy(list);
    var attrArray = attributes.split(',');
    localStorageService.remove(location);
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var j in item) {
            if (attrArray.indexOf(j) < 0) {
                delete item[j]; //删除对象中的某个属性
            }
        }
    }
    localStorageService.set(location, JSON.stringify(list));
},
```

## 修改字段名为大写
```js
function keyToUpperCase(data) {
    return Object.keys(data).reduce((obj, item) => {
        obj[item.toUpperCase()] = data[item];
        return obj;
    }, {});
}
```

## 对象型数组根据某一属性去重
```js
let arrObj = [
    { name: "小红", id: 1 },
    { name: "小橙", id: 1 },
    { name: "小黄", id: 4 },
    { name: "小绿", id: 3 },
    { name: "小青", id: 1 },
    { name: "小蓝", id: 4 }
];
// 方法一：
let map = new Map();
for (let item of arrObj) {
    if (!map.has(item.id)) {
        map.set(item.id, item);
    };
};
arr = [...map.values()];
console.log(arr);
 
 
// 方法二： (代码较为简洁)
const map = new Map();
const newArr = arrObj.filter(v => !map.has(v.id) && map.set(v.id, v));
// const newArr = [...new Map(arrObj.map((v) => [v.id, item])).values()];
console.log(newArr);
```

# 函数声明(function定义)与函数表达式(变量去接)，及其执行顺序
函数声明的形式才存在函数提升，而正常的执行顺序是表达式()优于声明

# 将时间戳转化为时间
```js
new Date(Time(Num类型) * 1000).toLocaleString()
new Date(1688669220 * 1000).toLocaleString()
```

# 字节转换函数
```js 
/* 
  value: 字节
  units：单位数组
  decimal：保留小数点后几位
*/
function formatByte(
      value,
      units = ["B", "KB", "MB", "GB", "TB"],
      decimal = 1
    ) {
      let m = Math.pow(10, decimal);
      let unit = units[0];
      for (let i = 0; i < 5; i++) {
        if (value < 1024) break;
        unit = units[i + 1] ? units[i + 1] : "";
        value /= 1024;
      }
      value = Math.round(value * m) / m;
      return value + unit;
    }

// 适当优化一下循环
function formatSizeUnits(value, units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], decimal = 1) {
    let m = Math.pow(10, decimal)
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    value = Math.round(value * m) / m;
    return `${value} ${units[unitIndex]}`;
}
```

## 将文件大小从一个单位转换为另一个单位
```js
/**
 * 将文件大小从一个单位转换为另一个单位。
 *
 * @param {number} size 文件大小。
 * @param {string} fromUnit 初始单位（'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'）。
 * @param {string} toUnit 目标单位（'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'）。
 * @param {number} [decimalPoint=2] 结果保留的小数位数，默认为2。
 * @return {string} 转换后的文件大小，带单位。
 */
function convertFileSize(size, fromUnit, toUnit, decimalPoint = 2) {
  // 定义单位与字节之间的转换关系
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  // 获取初始单位和目标单位的索引
  const fromIndex = units.indexOf(fromUnit);
  const toIndex = units.indexOf(toUnit);

  // 如果单位不在列表中，抛出错误
  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid unit');
  }

  // 计算初始单位与目标单位之间的转换系数
  const exponent = toIndex - fromIndex;
  /* // 计算结果大小
  const resultSize = size / Math.pow(1024, exponent); */
  // 目标单位较小，进行乘法运算, 较大则进行除法，可以合并乘法和除法为单一公式
  const resultSize = size * Math.pow(1024, -exponent);

  // 返回格式化后的结果
  return parseFloat(resultSize.toFixed(decimalPoint)) + ' ' + toUnit;
}

console.log(convertFileSize(1, 'KB', 'B'));  // 输出: 1024.00 B
console.log(convertFileSize(1, 'MB', 'GB', 5)); // 输出: 0.00098 GB
```

# 美化打印console
```js
// 美化打印实现方法
const prettyLog = () => {
  const isEmpty = (value) => {
    return value == null || value === undefined || value === "";
  };
  const prettyPrint = (title, text, color) => {
    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      "background:transparent"
    );
  };
  // 基础信息打印
  const info = (textOrTitle, content = "") => {
    const title = isEmpty(content) ? "Info" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, "#909399");
  };
  const error = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Error' : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, '#F56C6C');
  };
  const warning = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Warning' : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, '#E6A23C');
  };
  const success = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Success ' : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint(title, text, '#67C23A');
  };

  return {
    info,
    error,
    warning,
    success
  };
};
const log = prettyLog()
log.info('注意看')
log.error('low', '这个男人');
log.warning('lower', '叫 ');
log.success('lowest', '小帅');
```

# base64
解码： `window.decodeURIComponent(window.escape(window.atob('string')))`
以上已弃用！
escape 和 unescape 是 JavaScript 中已经弃用的函数，它们对非 ASCII 字符（如中文）的处理方式不一致。

escape 会将某些字符（如 +、/、=）转换为 Unicode 转义序列（如 %2B、%2F、%3D），而 unescape 可能无法正确还原这些字符。

使用 encodeURIComponent 和 decodeURIComponent 可以更好地处理所有字符，包括 Unicode 字符。


编码： `window.btoa(window.encodeURIComponent('程相依'))`
解码： `window.decodeURIComponent(window.atob('JUU3JUE4JThCJUU3JTlCJUI4JUU0JUJFJTlE'))`


# js原生获取文件后缀名
```js
function getExt(fileName) {
    var lastIndex = fileName.lastIndexOf('.');
    return fileName.slice(lastIndex + 1);
    // tips: 获取文件名 fileName.slice(0, lastIndex)
}



// easily
name.split('.').reverse()[0]
```

# 创建一个1-100的数组
```js
let arr = Array(100).toString().split(',').map((item,index)=>index)// 0-> 99
// tips: toString() 方法可把数组转换为字符串，数组中的元素之间用逗号分隔。

let arr = [...Array(100).keys()]
// tips: keys() 方法返回一个新的数组，该数组包含数组中每个元素的键(index)
```

# 限制异步并发
```js
async function asyncPool(poolLimit, iterable, iteratorFn) {
  // 用于保存所有异步请求
  const ret = [];
  // 用于保存正在进行的请求
  const executing = new Set();
  for (const item of iterable) {
    // 构造出请求 Promise
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));
    ret.push(p);
    executing.add(p);
    // 请求执行结束后从正在进行的数组中移除
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    // 如果正在执行的请求数大于并发数，就使用 Promise.race 等待一个最快执行完的请求
    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }
  // 返回所有结果
  return Promise.all(ret);
}

// 使用方法
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
asyncPool(2, [1000, 5000, 3000, 2000], timeout).then(results => {
  console.log(results)
})

```

# 生成uuid
```js
const uuid = (a) =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
```

# 打开 Modal（遮罩层） 时禁止 body 滚动
```js
// 打开 Modal 时，禁止 body 滚动
document.body.style.overflow = 'hidden';

// 恢复滚动
document.body.style.removeProperty('overflow');
```

# 业务场景
## 用js写一个算法，需求为：有一个数组c，其值为['0,0','0,1','1,0','1,1']，和两个空数组a,b。c的每项都是一个字符串，每个项逗号前面的值要push给数组a，逗号后面的值要push给数组b，要去重。
```js 
const c = ['0,0', '0,1', '1,0', '1,1'];
const a = [];
const b = [];

c.forEach(item => {
    const values = item.split(',');
    if (!a.includes(values[0])) {
        a.push(values[0]);
    }
    if (!b.includes(values[1])) {
        b.push(values[1]);
    }
});

console.log(a); // 输出数组 a
console.log(b); // 输出数组 b
```

* 简化一点

```js
const c = ['0,0', '0,1', '1,0', '1,1'];
const a = [...new Set(c.map(item => item.split(',')[0]))];
const b = [...new Set(c.map(item => item.split(',')[1]))];

console.log(a); // 输出数组 a
console.log(b); // 输出数组 b
```

# IP的比较
## IPv6地址补全，方便IP比较
```js
// 补全ipv6
expandIPv6 (addrIPv6) {
  if (addrIPv6.includes('::')){
    const [left, right] = addrIPv6.split('::')
    const leftBlocks = left === '' ? [] : left.split(':')
    const rightBlocks = right === '' ? [] : right.split(':')
    let missingBlocks = 8 - (leftBlocks.length + rightBlocks.length)
    if (left === '') {
      leftBlocks.length = missingBlocks
      missingBlocks = 0
    } else if (right === '') {
      rightBlocks.length = missingBlocks
      missingBlocks = 0
    }
    const expandedBlocks = [...leftBlocks, ...Array(missingBlocks).fill('0000'), ...rightBlocks]
    const blocks = expandedBlocks.join(':').split(':')
    const expandedBlocksAll = blocks.map(block => {
      while (block.length < 4) {
        block = '0' + block
      }
      return block
    })
    return expandedBlocksAll.join(':')
  } else {
    const blocks = addrIPv6.split(':')
    const expandedBlocks = blocks.map(block => {
      while (block.length < 4) {
        block = '0' + block
      }
      return block
    })
    return expandedBlocks.join(':')
  }
}
```

## ip转二进制，方便比较
```js
// ip转二进制
ipToBinary (ip) {
  if (ip.includes(':')) {
    const blocks = ip.split(':')
    const binaryBlocks = blocks.map(block => parseInt(block, 16).toString(2).padStart(16. '0'))
    return binaryBlocks.join('')
  } else {
    return ip.split('.').map(octet => ('00000000' + parseInt(octet).toString(2)).slice(-8)).join('')
  }
}
```

## 校验ip是否在某个范围内
```js
ipInRange (ip, startIp, endIp) {
  const ipBin = this.ipToBinary(ip)
  const startIpBin = this.ipToBinary(startIp)
  const endIpBin = this.ipToBinary(endIp)
  console.log('是否在起始地址范围：', ipBin >= startIpBin && ipBin <= endIpBin)
}
```

# window.AbortController
AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。可以终止fetch或axios（底层也是fetch）请求。
业务场景：可在跳转404页的时候，中断所有请求，节省资源。
```
if (window.AbortController) {
  new AbortController().abort()
}
```

# 解构起别名的写法
```js const
const {
  Provider,
  Consumer: CountConsumer
} = createContext()

import {x as abc} from 'english'

const {state: {from}} = history // 相当于从history中解构出了state中的from属性
```

# 连续的箭头函数写法（柯里化）
在 JavaScript 中，连续的箭头函数（也称为“柯里化函数”）是指多个箭头函数嵌套在一起。这种写法通常用于创建接受多个参数的函数，但每次只接受一个参数，并返回一个新的函数来处理剩余的参数。
`const add = a => b => a + b;`
解析
  * 外层函数：a => ... 接受一个参数 a，并返回一个新的函数 b => a + b。
  * 内层函数：b => a + b 接受一个参数 b，并返回 a + b 的结果。
调用： const result = add(2)(3); // 结果是 5

```js
const multiply = a => b => c => a * b * c;
const result = multiply(2)(3)(4); // 结果是 24

// multiply(2) 返回 b => c => 2 * b * c。
// multiply(2)(3) 返回 c => 2 * 3 * c。
// multiply(2)(3)(4) 调用返回的函数，传入 4，得到 2 * 3 * 4，结果为 24。
```

# getBoundingClientRect
`DOM.getBoundingClientRect()` 获取当前dom的详细信息，包括位置，大小等等，很详细