# 需要着重看的
1、手写promise
2、同异步执行函数顺序
3、react
4、requestAnimationFrame和虚拟滚动

# 关于数据类型的
* 原生JS的number类型是浮点类型，所以0.1+0.2 !== 0.3。
* typeof null === 'object'的原因：初版本的js是32位系统，为了性能采用的是低位存储变量的类型信息，000开头代表的是对象，而null表示全为0。
* typeof 对于原始类型（boolean、number、string、undefined、null、symbol），除了null都可以显示正确的类型。
* typeof 对于对象来说，除了函数都会显示object， 函数是function

## 数据类型转换
* number =》 boolean  除了0、-0、NaN都是true
* string =》 boolean  除了空串都是true
* undefined、null =》 boolean  false
* 引用类型 =》 boolean  true
* [1,2,3].toString() = "1,2,3"
* 数组转数字：空数组为0，存在一个元素且为数字则转为数字，其他情况NaN
* 转布尔时，除了false、undefined、null、0、-0、NaN、""，都是true

## 类型比较 == 与 ===
* 对于==，如果对比双方的类型不一样的话，就会进行类型转换，然后比大小。
* null == undefined  true
   * 有些解释是因为null与undefined转为布尔都为false，所以才相等，但是JavaScript规范中规定了，不能将null和undefined比较时转换类型比较，并且规定了它们两个是相等的，因为他们两个都代表着无效值。
* string与number比较，会隐式转换为number
* 与bool作比较时，bool会转为number，例如：1 == true，会将boolean转为number再判断，true转为number为1，所以为true
* [] == [] 返回false是因为地址不同
* [] == ![] 返回true是因为 1、"!"优先级大于"=="，所以![]为false,则演变为 [] == false。2、与bool作比较，bool会转为number，则演变为[] == 0。3、空数组转number，为0，所以又演变为 0 == 0，结果为true

# this
* 直接调用函数时，函数中，this指向window；
* 通过对象调用函数，this指向对象；
* 在类中，this指向该类
* 箭头函数的this取决于包裹箭头函数的第一个普通函数
* bind调用时的this，取决于第一个参数，第一个参数为空时，是window
* 不管给函数bind几次，this永远由第一次bind决定。
* 如果该方法存在于一个对象的原型链上，那么this指向的是调用这个方法的对象。
* 当一个函数用作构造函数时（使用new关键字），它的this被绑定到正在构造的新对象(函数是否在new中调用（new绑定）？如果是的话this绑定的是新创建的对象。)。
* 函数是否通过call/apply绑定 ( 显示绑定 ) ？ 如果是的话this绑定的就是指定对象。
* 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话this绑定的是那个上下文对象。(谁调用了函数，谁就是this。)
```js 
var obj = {
  name:"obj:你好帅",
  say:fun1
}
function fun1(){
   console.log(this.name);
}
obj.say(); // 隐式绑定
```
* 如果都不是的话，使用默认绑定，严格模式下绑定到undefined，否则绑定到全局对象下（即window）。

# 闭包
* 闭包的意义：可以间接的访问函数内部的变量。类似函数式编程思想，把参数一步步传进去。
* let可以解决闭包：let声明的变量，仅在块级作用域内有效，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量。

# 深浅拷贝
* 我之前的误解：误以为浅拷贝就是暴力赋值，使两个对象地址相等，其实不是。浅拷贝是为了解决对象中无引用类型数据时拷贝；当有引用类型时，则需要深拷贝
* Object.assign:如果对象的属性值为基础类型，对于通过Object.assign()拷贝的那个属性而言是深拷贝；如果对象的属性值为引用，对于通过通过Object.assign()拷贝的那个属性而言其实是浅拷贝的。(具体到对象中的每个属性)
* 展开运算符"..."，也可以实现浅拷贝。
* 深拷贝JSON.parse(JSON.stringify(object))的问题：1、会忽略 undefined。2、会忽略 symbol。3、不能解决循环引用的对象。

# 构造函数
* 构造函数：用new关键字来进行调用的函数称为构造函数，一般首字母要大写。
* 实例成员：构造函数内部通过this添加的成员（构造函数在实例化以后可以访问的成员），或者通过prototype添加的成员。
* 静态成员：在构造函数上添加的成员就成为静态成员。
* 实例成员只能通过实例对象进行访问，静态成员只能通过构造函数进行访问。
* 构造函数最好首字母大写，但是小写也不会影响程序执行
* 通过prototype为构造函数添加或者修改的属性和方法，访问到哪个内容主要是看访问的位置是在属性和方法添加之前还是之后，和实例化对象的位置没有关系。

```js
/* Person是一个构造函数 */
function Person(name,age){
    /*构造函数中，实例成员就是构造函数内部通过this添加的成员，name、age、say就是实例成员（个人理解就是构造函数在实例化以后可以访问的成员）*/
    this.name=name;
    this.age=age;
    this.say=function(){
        console.log('我是人')
    }
}

/* 在构造函数上添加的成员就成为静态成员 */
Person.height='165';

var p1=new Person('张三',25);//实例化对象

/*通过prototype添加的成员不是静态成员，是实例成员，也就是只要是实例化的对象都可以访问到*/
Person.prototype.weight='70kg';
console.log(p1.weight);//70kg
console.log(Person.weight);//undefined

/*静态成员只能通过构造函数进行访问*/
console.log(Person.height);//输出165
console.log(p1.height);//输出undefined

/*实例成员只能通过实例对象进行访问*/
console.log(p1.name);//输出张三
p1.say();//输出我是人

console.log(Person.age);//输出undefined
Person.say();//报错，Person.say is not a function
```

# 原型与原型链
* 每个函数都有一个prototype属性，被称为显示原型
* 每个实例对象都会有__proto__属性,其被称为隐式原型
* 每一个实例对象的隐式原型__proto__属性指向自身构造函数的显式原型prototype（person.__proto__ === Person.prototype）
* 所有构造函数的prototype的__proto__都指向Object.prototype
* 每个prototype原型都有一个constructor属性，指向它关联的构造函数本身。
   * console.log(Person.prototype.constructor); 输出 function Person(){}
* 原型链：每一个实例化对象都有一个__proto__属性，而这个__proto__属性指向构造函数的原型对象prototype，原型对象上也有一个__proto__属性，就这样一层一层往上找，直到找到object.phototype，就这样查找的过程就叫原型链(__proto__ 将对象和原型连接起来组成了原型链)。
* Object 是所有对象的爸爸，所有对象都可以通过 __proto__ 找到它，Function 是所有函数的爸爸，所有函数都可以通过 __proto__ 找到它。


# ES6
* console.log(a);var a = 1; 即使使用a在var定义之前,也不会报错，而是返回undefined，因为变量提升后相当于已经定义过了，只是还没有赋值。
* 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，包括函数体，即函数的实际逻辑。而变量提升只会把声明挪到作用域顶部。
* 即使变量声明在函数之后，函数也会被提升，并且优先于变量提升。
* 暂时性死区：在声明前就使用变量。let和const存在死区，而var不会，因为var存在变量提升。暂时性死区主要是为了模块化开发中的模块保护与变量隔离。
* 模块化：目前经常使用的ESM，即javascript官方模块化规范，使用import，export。
* var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会。
* 一旦在代码里使用const声明的简单类型的数据（数值、字符串、布尔值）其值就不可改变。当使用const声明一个对象和数组时后，此变量的引用便不可修改，但是此变量内部属性还是可以进行修改的。
* 组合继承：通过Parent.call(this,value)继承父类的属性，然后改变子类的原型为new Parent()，但这样会有一些不需要的父类属性。
* 寄生组合继承：继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。
* class继承：class 实现继承的核心在于使用 extends 表明继承自哪个父类，并且在子类构造函数中必须调用 super。
* Proxy:Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。
* ...展开运算符 、 Array.from 、 Object.keys 、 Object.assign
* 箭头函数
* 导出的写法： import React,{Component} from 'react'; 这种写法就是让React对象和React.Component同时可以单独使用的写法。
```js
let p = new Proxy(target, handler)
//target 代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。
```

## 模块化
* 作用：提供复用性；提高代码可维护性；解决命名冲突；
* 立即执行函数 是早期常见的手段。
* AMD:很少用了，只了解AMD通过define一个自执行函数将一些变量或方法return出去，然后其他模块通过require按需引入
```js AMD定义a.js 相似的还有b,c
define((function(){
    var a=1;
    return {
        b:2,
        init:function(){
            console.log(a);
            console.log(this.b);
        }
    }
})());
```
```js AMD 引入
require(["./a","./b","./c"],function(obj,obj2,div){
    obj.init();
    obj2.init(10,obj.b);
    document.body.appendChild(div);
})
//导入a,b,c 分别当做参数obj，obj2，div
```
* CMD:与AMD类似，只不过引入方式变了
```js CMD 引入
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})
```
* commonjs：module.exports = {a:1}定义一个模块，然后在另一个文件中require这个模块var module = require('./a.js')，module.a即可获取该属性。
* ES Module：ES Module 会编译成 require/exports 来执行的
```js
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}

// 有一种比较综合的写法，可以有默认导出和单独导出合并
export { // 假设是react.js的文件，有以下两个方法需要导出
  React as default,
  Component
}
// 这样导出之后，便可以通过以下写法导入
import React, {Component} from 'react'
```

# 异步
* 并发：并发是宏观概念，我分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。
* 并行：并行是微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。
* Promise: then之后返回的都是一个Promise，如果then中使用了return，那么return的值会被Promise.resolve()包装。
* async就是将函数返回值使用Promise.resolve()包裹了下，和then中处理返回值一样，并且await只能配套async。await将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了await，这个样子线程阻塞,很耗费时间，会导致性能上的降低。Promise.all方法,可以将多个await变成并行的去await。
* Date.now() === new Date().getTime() === +new Date() 返回true。

## Promise/A+规范
* Promise的当前状态必须为：等待态(Pending)、执行态(Fulfilled,后来多为Resolve)、拒绝态(rejected)。
* resolve和rejected都必须拥有一个不可变的终值或者据因。不可变指的是恒等，可用===判断，但当value或reason不是基础值时，只要求其引用地址相等，属性值可被更改。
* 一个promise必须提供一个then方法以访问其当前值、终值和据因。then必须返回一个promise。
* then方法可以接受两个参数：onFulfilled与onRejected都是可选参数，如果这两个参数不是函数，则必须被忽略。
* promise手写还是不行...，找视频看吧。

# Event Loop
* 进程：CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。
* 线程：进程中的更小单位，描述了执行一段指令所需的时间。
* 执行栈是一个存储函数调用的栈结构，遵循先进后出的原则。
* 浏览器中的 Event Loop：执行JS就是往执行栈中放入函数。当遇到异步代码时，会被挂起并在需要执行的时候加入到Task(有多种Task)队列中。一旦执行栈为空，Event Loop就会从Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。
* 不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。
* 微任务：process.nextTick ，promise.then，MutationObserver(被Proxy代替)。(将当前任务的内容挪至当前任务列的最低端执行)
* 宏任务：script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering。(将当前的任务挪至下一个新任务列的最顶端执行)
* await 会阻塞下面的代码（即加入微任务队列,并非微任务队列队尾，而且await当行会被当做同步执行），先执行 async外面的同步代码，同步代码执行完，再回到 async 函数中，再执行之前阻塞的代码
```js
console.log('script start')

async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
}
async1()

setTimeout(function () {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
    .then(function () {
        console.log('promise1')
    })
    .then(function () {
        console.log('promise2')
    })

console.log('script end')

// script start => async2 end => Promise => script end => async1 end => promise1 => promise2 => setTimeout
```

```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('settimeout')
})
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')
// script start => async1 start => async2 => promise1 => script end => async1 end => promise2 => settimeout
```
* 宏任务里的微任务优先于微任务里的宏任务?
* 微任务里的微任务比微任务优先?

# js进阶
* call，apply：都为改变this指向。fn.call(obj,1,2,3); fn.apply(obj,[1,2,3]);
* bind也为改变this指向。setTimeout((() => {}).bind(obj,1,2,3),1000),传参和call一样，但他返回的是一个函数，所以可以用来改变回调函数的this，因为他不是立即执行的，需要bind(params)()才会执行。
```js call重构
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  //如果该方法存在于一个对象的原型链上，那么this指向的是调用这个方法的对象
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}
```
```js apply重构
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```
```js bind重构
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，外面可以 new F()来调用，相当于构造函数实例化了新对象，那么其中的this是固定的，就是新创建的对象本身，所以需要判断。
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```
* instanceof： 内部机制是通过判断对象的原型链中是不是能找到类型的 prototype(原型链的最终为null)。
* new的理解：先创建个对象，并链接到原型，在绑定this，最后返回这个对象。
* 垃圾回收机制(新生代算法，针对生命周期短的对象)：内存空间分为From空间和To空间，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入From空间中，当From空间被占满时，回收机制启动。检查From中存活的对象并复制到To空间中，如果有失活的就会销毁。复制完成后两个空间互换。
* 垃圾回收机制(老生代算法，针对生命周期长的对象):使用两个算法，标记清除算法和标记压缩算法。

  * 标记清除算法：会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。
    * 后为了提高性能，先改变成了增量标记：将垃圾回收过程分成多个小步骤，与程序执行交替进行。这样可以避免一次性回收导致程序长时间停顿，减少垃圾回收对程序性能的影响。
    * 又变成并行标记：使用多个线程并行执行垃圾回收，提高垃圾回收的效率，充分利用多核 CPU 的性能。
  * 标记压缩算法：清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。
    * 内存如何出现碎片呢？标记回收的内存不一定都是连续的内存，好比 a|b|c|d 四块内存，清掉了b和d，那么剩余的a和c就变成了两段不连续的内存，那么接下来若要分配一个所需大于a或大于c的内存任务，但又小于a与c之和的任务，那么就会报错。这时就需要标记压缩算法，又叫标记整合算法，将内存整合为连续的。从而提升内存的利用率与性能，防止内存分配失败。

  * 何种情况会出现在老生代空间中
    * 新生代中的对象是否已经经历过一次 Scavenge 算法（即上面的新生代算法），如果经历过的话，会将对象从新生代空间移到老生代空间中。
    * To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

  * 在老生代中，以下情况会启动标记清除算法
      * 某一个空间没有分块的时候
      * 空间中被对象超过一定限制
      * 空间不能保证新生代中的对象移动到老生代中


# 浏览器基础
* 事件触发三阶段：1、window 向事件触发处传播，遇到注册的捕获事件(从上往下)会触发（捕获阶段）；2、传播到事件触发处时触发注册的事件（目标阶段）；3、从事件触发处往 window 传播，遇到注册的冒泡(从下往上)事件会触发。（冒泡阶段）
* addEventListener有三个参数，1：事件类型字符串；2：回调函数；3：默认false(在事件冒泡阶段调用事件处理函数)，true(事件捕获阶段调用处理函数)。
```html
<div id="outer">
    <div id="inner">
        <button id="btn">点击我</button>
    </div>
</div>
```
```js
document.getElementById('outer').addEventListener('click', function() {
    console.log('outer - 捕获阶段');
}, true);

document.getElementById('inner').addEventListener('click', function() {
    console.log('inner - 捕获阶段');
}, true);

document.getElementById('btn').addEventListener('click', function() {
    console.log('btn - 目标阶段');
});

document.getElementById('inner').addEventListener('click', function() {
    console.log('inner - 冒泡阶段');
}, false);

document.getElementById('outer').addEventListener('click', function() {
    console.log('outer - 冒泡阶段');
}, false);

/* 
点击按钮时，控制台输出顺序为：

outer - 捕获阶段
inner - 捕获阶段
btn - 目标阶段
inner - 冒泡阶段
outer - 冒泡阶段

原因：捕获阶段优先于冒泡阶段
*/

document.addEventListener('click', (e) => {
  e.stopPropagation() // 阻止冒泡和捕获。
  // 若第二个参数为true，即捕获阶段执行，则可保证，除了这个回调，其他的捕获和冒泡均被阻断。除非触发回调的是这个回调的外层dom结构
}, true)
```

* 事件委托（事件广播）：如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上。优点：节省内存，不需要给子节点注销事件。
* 之前的误区：事件捕获与事件冒泡在第三个参数中的区别主要体现在触发时间段上。而不是如果参数为false(冒泡)，就无法捕获式的从上而下的广播事件，反之true(捕获)亦然。
* 跨域：因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名或者端口有一个不同就是跨域，Ajax 请求会失败。
* 解决跨域方式：
   * jsonp：利用 script 标签没有跨域限制的漏洞，通过 script 标签指向一个需要访问的地址并提供一个回调函数来接收数据。其兼容性不错，但只限于get请求。
   * CORS 主要是后端处理。
   * 反向代理
* 存储
   * cookie一般由服务器生成，与服务端通信每次都会携带在header中，对于请求性能有影响，现已不建议用于存储。4K
   * 如果没有大量数据存储需求，可以使用localstorage、sessionstorage。5M
   * 对于不怎么改变的数据尽量使用 localStorage 存储，否则可以用 sessionStorage 存储。
   * Service Worker：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。

# 浏览器缓存机制
<!-- 不太清晰的总结
* 缓存位置：
   * Service Worker：Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。
   * Memory Cache：也就是内存中的缓存，读取内存中的数据肯定比磁盘快。但是内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。(大文件大概率不存在内存中，且系统内存使用率高的话，文件优先存储进硬盘)
   * Disk Cache：也就是存储在硬盘中的缓存，读取速度慢点，比之 Memory Cache 胜在容量和存储时效性上。
   * Push Cache：当以上三种缓存都没有命中时，它才会被使用。并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就被释放。
   * 如果所有缓存都没有命中的话，那么只能发起请求来获取资源了。
* 缓存策略：根据是否需要向服务器重新发起 HTTP 请求将缓存过程分为两种
   * 强缓存(本地缓存)：强缓存表示在缓存期间不需要发送请求，直接从缓存中读取资源，不管资源是否改动。强缓存不关心服务端文件是否更新，只关心缓存是否过期。强缓存可以通过设置两种 HTTP Header 实现：Expires 和 Cache-Control ，后者优先级高
   * 协商缓存(弱缓存)：当发送请求时，就需要发起请求验证资源是否有更新，如果没有改变，则服务端返回304，并更新浏览器缓存有效期，本次资源从缓存中获取，有就重发请求。
* 应用缓存策略：现在的打包工具都对文件名进行hash处理，只有代码修改后才会生成新的文件名。那么可以将文件设置缓存有效期，这样只有引入的文件名发生改变才会下载最新的代码文件，否则一直使用缓存。 
-->

deepseek的解释：
1. 缓存的类型：主要分为两类：强缓存与协商缓存
    * 强缓存：浏览器直接从本地缓存读取资源，不发送请求到服务器。
      * HTTP Header:
        * Expires：指定资源的过期时间（HTTP/1.0）。
        * Cache-Control：更灵活，常用指令有：
          * max-age：资源有效期（秒）。
          * no-cache：需验证资源是否过期。
          * no-store：禁止缓存。
          * public：允许所有用户缓存。
          * private：仅允许特定用户缓存。
    * 协商缓存：当强缓存失效后，浏览器向服务器验证资源是否更新。
      * HTTP Header:
        * Last-Modified / If-Modified-Since：基于资源修改时间。
        * ETag / If-None-Match：基于资源唯一标识。

2. 缓存流程：
    * 首次请求：浏览器向服务端请求资源，服务端返回资源并设置缓存头。
    * 再次请求：
          * 检查强缓存是否过期，若未过期，则直接使用缓存
          * 若强缓存过期失效了，则请求服务端验证资源是否更新
          * 若资源未更新，服务端返回304，浏览器使用缓存。若已更新，则返回更新资源并更新缓存。

3. 缓存位置：
    * Memory Cache：内存缓存，快速但容量有限，页面关闭后失效。
    * Disk Cache：磁盘缓存，速度较慢但容量大，持久化存储。

4. 缓存策略：
    * HTML文件：通常设置no-cache，确保每次获取最新内容。
    * 静态资源：css、图片、js等。设置较长的资源有效期max-age，使用强缓存
    * 动态资源：如api数据，视情况使用no-cache或max-age
5. 缓存更新
    * 更改文件名或路径：通过修改文件名或路径强制更新缓存。
    * 版本控制：在URL中添加版本号或哈希值，如style.v2.css。


# 浏览器渲染原理
* 浏览器渲染过程
   * 浏览器接收到HTML文件并转换为DOM树：当浏览器接收到html文件后，字节数据(html文件实际会被解析为0和1的字节数据)  =>  字符串(被浏览器解析成字符串)  =>  标记(token，浏览器通过词法分析转为标记)  =>  节点(Node)  =>  DOM。
   * 将CSS文件转换为CSSOM树：过程与html的转换过程差不多，但是因为样式无法确定是从哪里获得的，所以该过程浏览器是递归的过程，比较消耗资源。
   * 当生成dom和cssom树后，开始将这两棵树组合为渲染树(渲染树只会包括需要显示的节点和这些节点的样式信息)。
   * 当浏览器生成渲染树后，就会根据渲染树进行布局(回流，回流必将引起重绘，重绘不一定会引起回流。)，然后GPU绘制，合成图层。
* 操作dom慢的原因是因为，渲染引擎和js引擎是两个线程通信，不停地通信会导致性能上的问题，操作dom也会带来重绘回流的情况。
* 插入几万个dom，如何实现页面的不卡顿？
   * requestAnimationFrame：你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
   * 虚拟滚动：只渲染可视区域内的内容，非可见区域的那就完全不渲染了，当用户在滚动的时候就实时去替换渲染的内容。(更加精辟的说辞：虚拟滚动技术的实现是合理运用“回流必定发生重绘，而重绘不一定会引发回流”的理论进行实现。)
   ```js
    function VirtualList(props) {
      const { list, itemHeight } = props;
      const [start, setStart] = useState(0);
      const [count, setCount] = useState(0);
      const scrollRef = useRef(null);
      const contentRef = useRef(null);
      const totalHeight = useMemo(() => itemHeight * list.length, [list.length]);
      useEffect(() => {
        setCount(Math.ceil(scrollRef.current.clientHeight / itemHeight));
      }, []);
      const scrollHandle = () => {
        const { scrollTop } = scrollRef.current;
        const newStart = Math.floor(scrollTop / itemHeight);
        setStart(newStart);
        contentRef.current.style.transform = `translate3d(0, ${
          newStart * itemHeight
        }px, 0)`;
      };
      const subList = list.slice(start, start + count);
      return (
        <div className="virtual-list" onScroll={scrollHandle} ref={scrollRef}>
          <div style={{ height: totalHeight + "px" }}>
            <div className="content" ref={contentRef}>
              {subList.map(({ idx }) => (
                <div
                  key={idx}
                  className="item"
                  style={{ height: itemHeight + "px" }}
                >
                  {idx}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
   ```
* 什么情况阻塞渲染：
   * 渲染的前提是生成渲染树，所以html和css在生成树前会阻塞渲染。如果想要渲染的更快，则需要扁平DOM层级。
   * 解析到script标签时会暂停构建DOM，所以建议script标签放在body底部。
* 回流与重绘
   * 重绘是当节点需要更改外观而不会影响布局的，比如改变 color 就叫称为重绘。
   * 回流是布局或者几何属性需要改变就称为回流。
   * 回流必定会发生重绘，重绘不一定会引发回流。
   * 影响性能的动作：改变窗口的大小；改变字体；添加或删除样式；定位或者浮动；盒模型；
   * 减少回流和重绘：使用transform替代top；visibility(重绘)替换display none(回流)；不要把节点的属性值放在循环里作变量；不要使用table布局；动画的速度越快，回流次数越多，最好使用requestAnimationFrame；
   * 最快的渲染页面(关键渲染路径)：1、扁平dom层级，减小文件大小；2、script标签添加defer或者async属性，使js放到html解析后顺序并行执行；3、减少回流重绘；4、首屏上减少需要下载的内容。

# 从V8引擎中看JS性能优化
* JS会被V8引擎编译成Machine Code(效率更高)。
* 上述过程中，JS会解析为抽象语法树，解析过程是略慢的，代码越多，解析过程也就耗费越长，这就是需要压缩代码的原因之一。
* 应该尽可能避免声明嵌套函数，这样会导致函数的重复解析。
* JS是弱类型语言，数据类型无法被限制。但是当一个函数被多次调用并且参数一直传入相同类型，则会被编译成Machine Code，因为你固定了类型。但是如果传入的参数类型改变，则Machine Code会被再次编译成Bytecode(性能不及Machine Code)，所以要尽可能保证传入类型一致。TypeScript的好处之一。

# 性能优化琐碎点
* 图片加载优化：1、修饰图片是否可用CSS代替。2、小图是否可用Base64格式。3、雪碧图。
* DNS预解析来预先获取域名所对应的IP。
* 节流场景：滚动事件中会发起网络请求，但是我们并不希望用户在滚动过程中一直发起请求，而是隔一段时间发起一次，对于这种情况我们就可以使用节流。
```js
// func是用户传入需要防抖的函数
// wait是等待时间
const throttle = (func, wait = 50) => {
  // 上一次执行该函数的时间
  let lastTime = 0
  return function(...args) {
    // 当前时间
    let now = +new Date() // +new Date() === new Date().getTime() 
    // 将当前时间和上一次执行函数时间对比
    // 如果差值大于设置的等待时间就执行函数
    if (now - lastTime > wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}
setInterval(
  throttle(() => {
    console.log(1)
  }, 500),
  1
)
```
* 防抖场景：有一个按钮点击会触发网络请求，但是我们并不希望每次点击都发起网络请求，而是当用户点击按钮一段时间后没有再次点击的情况才去发起网络请求，对于这种情况我们就可以使用防抖。
```js
// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
```
或
```js
debounce(fn,delayTime){
  if(this.timer){
    clearTimeout(this.timer)
  }
  this.timer = setTimeout(() => {
    fn();
  },delayTime)
}
```
* 懒加载：懒加载就是将不关键的资源延后加载。原理：懒加载的原理就是只加载自定义区域（通常是可视区域，但也可以是即将进入可视区域）内需要加载的东西。
* CDN：CDN 的原理是尽可能的在各个地方分布机房缓存数据，这样即使我们的根服务器远在国外，在国内的用户也可以通过国内的机房迅速加载资源。

# webpack性能优化
* 减少webpack打包时间
   * babel-loader：用于将 ES6+ 代码转换为 ES5 代码，以便在旧版浏览器中运行。
   ```js
    module.exports = {
      module: {
        rules: [
          {
            // js 文件才使用 babel
            test: /\.js$/,
            // 将 Babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间
            loader: 'babel-loader?cacheDirectory=true',
            // 只在 src 文件夹下查找
            include: [resolve('src')],
            // 不会去查找的路径,node_modules 中使用的代码都是编译过的。
            exclude: /node_modules/
          }
        ]
      }
    }
   ```
   * HappyPack：受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。HappyPack 可以将 Loader 的同步执行转换为并行的。
   ```js
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [resolve('src')],
          exclude: /node_modules/,
          // id 后面的内容对应下面
          loader: 'happypack/loader?id=happybabel'
        }
      ]
    },
    plugins: [
      new HappyPack({
        id: 'happybabel',
        loaders: ['babel-loader?cacheDirectory'],
        // 开启 4 个线程
        threads: 4
      })
    ]
   ```
   * 代码压缩：Webpack4中只需要将 mode 设置为 production 就可以默认开启代码压缩。且可以通过配置实现比如删除console.log这类代码的功能。
   * resolve.extensions：用来表明文件后缀列表，默认查找顺序是 ['.js', '.json']。我们应该尽可能减少后缀列表长度，然后将出现频率高的后缀排在前面。
   * resolve.alias：可以通过别名的方式来映射一个路径，能让 Webpack 更快找到路径。
* 减少webpack打包后的文件体积
   * 按需加载：将每个路由页面单独打包为一个文件，加载的文件体积就会变小。当然不仅仅路由可以按需加载，对于 loadash 这种大型类库同样可以使用这个功能。其底层的机制为：当使用的时候再去下载对应文件，返回一个 Promise，当 Promise 成功以后去执行回调。
   * tree shakin：Tree Shaking 可以实现删除项目中未被引用的代码
# MVVM 与 MVC
* react和vue都不是MVVM框架，都只是借鉴其思路。
<!-- * View ：用户看到的视图。
* Model ：一般就是本地数据和数据库中的数据。
* 如何将数据展示到视图上，然后又如何将用户的输入写入到数据中，不同的人就产生了不同的看法，从此出现了很多种架构设计。
* MVC：用户对View的操作交给了Controller处理,在Controller中响应View的事件，并调用Model的接口对数据进行操作，一旦Model发生变化便通知相关视图进行更新。当用户有输入时，会通过控制器去更新modal，并且通知view进行更新。MVC是单向通信。也就是View跟Model，必须通过Controller来承上启下。
   * V就相当于html  C就相当于JS  M就相当于AJAX，通过ajax从服务器获取数据。所以需要手动js操作dom。
   * 优点：多视图共享一个模型，大大提高代码的可重用性；MVC三个模块相互独立；
   * 缺点：视图与控制器间的过于紧密的连接并且降低了视图对模型数据的访问；控制器承担的责任太大，视图没有控制器的存在，其应用是很有限的，这样就妨碍了他们的独立重用。制器中的代码也会越来越臃肿，导致出现不利于维护的情况；
* MVVM(双向数据绑定)：引入了 ViewModel 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据。
   * VM：将视图 UI 和业务逻辑分开，它可以取出 Model 的数据同时帮忙处理 View 中由于需要展示内容而涉及的业务逻辑。
   * MVVM采用双向数据绑定，view中数据变化将自动反映到viewmodel上，model中数据变化也将会自动展示在页面上。把Model和View关联起来的就是ViewModel。ViewModel负责把Model的数据同步到View显示出来，还负责把View的修改同步回Model。
   * MVVM核心思想，是关注model的变化，让MVVM框架利用自己的机制自动更新DOM，也就是所谓的数据-视图分离，数据不会直接影响视图。
   * 以 Vue 框架来举例，ViewModel 就相当于模板语法来声明式的渲染dom元素，ViewModel层的核心是Vue中的双向数据绑定。View相当于是html部分。Model 的话，相当于组件中的data，在引入 Vuex 的情况下是完全可以和组件分离的。
* MVVM与MVC的区别
   * ViewModel存在目的在于抽离Controller中展示的业务逻辑，简化了业务与界面的依赖，这种低耦合模式提高代码的可重用性，也就是说MVVM实现的是业务逻辑组件的重用。
   * -MVVM主要解决了MVC中大量的dom操作使页面渲染性能降低,加载速度变慢,影响用户体验。
   * mvc是单向的，而mvvm是双向的，并且是自动的，也就是数据发生变化自动同步视图，视图发生变化自动同步数据 -->
* MVC
  * Model（模型）：负责管理应用程序的核心数据和业务逻辑。它不直接与用户界面交互，而是通过 Controller 与 View 进行通信。（AJAX）
  * View（视图）：负责展示数据（UI）。它从 Model 中获取数据并呈现给用户，但不处理业务逻辑。（页面、html）
  * Controller（控制器）：作为 Model 和 View 之间的中介，处理用户输入并更新 Model，然后通知 View 更新显示。（JS）
  * 工作流程
    * 用户与 View 交互（如点击按钮）。
    * View 将用户操作传递给 Controller。
    * Controller 处理用户输入，更新 Model。
    * Model 更新后，Controller 通知 View 更新显示。
    * View 从 Model 中获取最新数据并重新渲染。
  * 优点
    * 适用于中小型项目，职责分离，结构清晰。
  * 缺点
    * 在复杂应用中，View 和 Model 对 Controller 的过渡依赖，可能导致 Controller 变得臃肿，使代码耦合，难以维护。
* MVVM
  * Model（模型）：与 MVC 中的 Model 类似，负责管理数据和业务逻辑。
  * View（视图）：负责展示 UI，但不直接与 Model 交互，而是通过 ViewModel 获取数据。
  * ViewModel（视图模型）：作为 View 和 Model 之间的桥梁，负责将 Model 中的数据转换为 View 可以直接使用的形式。它还处理用户输入并更新 Model。
  * 工作流程
    * 用户与 View 交互（如输入文本）。
    * View 将用户操作传递给 ViewModel。
    * ViewModel 处理用户输入，更新 Model。
    * Model 更新后，ViewModel 自动更新其状态（通常通过数据绑定）。
    * View 通过数据绑定自动从 ViewModel 中获取最新数据并更新显示。
  * 优点
    * 数据绑定机制减少了手动更新 View 的代码，降低了出错概率。
    * View 和 Model 完全解耦，职责更加清晰。
    * 更适合大型复杂应用，尤其是需要频繁更新 UI 的场景。
  * 缺点
    * 对于简单项目，MVVM 可能显得过于复杂。
* MVVM与MVC的区别
   * ViewModel存在目的在于抽离Controller中展示的业务逻辑，简化了业务与界面的依赖，这种低耦合模式提高代码的可重用性，也就是说MVVM实现的是业务逻辑组件的重用。
   * -MVVM主要解决了MVC中大量的dom操作使页面渲染性能降低,加载速度变慢,影响用户体验。
   * mvc是单向的，而mvvm是双向的，并且是自动的，也就是数据发生变化自动同步视图，视图发生变化自动同步数据
   * MVC 是一种经典的架构模式，适合中小型项目，结构简单但可能导致 Controller 臃肿。
   * MVVM 通过引入 ViewModel 和数据绑定机制，进一步解耦 View 和 Model，适合大型复杂项目，但可能增加复杂度。
# Virtual Dom(虚拟DOM)
* 真实dom慢的原因：首先浏览器接受html生成dom树，接受css生成cssom树，最后结合为渲染树。生成为渲染树后，根据该树进行布局回流和GPU渲染图层。而渲染和js是两个不同的线程，两个线程之间的通信会导致性能上的问题，引发的回流重绘也会影响性能。
* 相较于操作DOM来说，操作JS对象会快很多。虚拟 DOM 是一个轻量级的 JavaScript 对象，用来描述真实 DOM 的结构。当应用状态变化时，框架会先在虚拟 DOM 上进行更新，然后通过高效的算法计算出最小的 DOM 操作，最后将这些操作应用到真实 DOM 上。
## Vue的虚拟DOM
1. 模板编译：Vue 通常使用模板语法，模板会被编译成渲染函数，生成虚拟 DOM。
2. 响应式系统：Vue 的响应式系统会自动追踪依赖，状态变化时，相关的组件会重新渲染。
3. 更新策略：Vue 在更新虚拟 DOM 时，会尽量复用已有的 DOM 元素，减少不必要的操作。
## React的虚拟DOM
1. JSX：React 使用 JSX 语法，JSX 会被编译成 React.createElement 调用，生成虚拟 DOM。
2. 不可变数据：React 推崇不可变数据，状态变化时，组件会重新渲染整个虚拟 DOM 树。
3. Diff 算法：React 使用高效的 Diff 算法（如 Reconciliation）来比较新旧虚拟 DOM，找出最小的更新操作。
## Vue与React在虚拟DOM上的差异
1. 语法：
    * Vue：模板语法，更接近 HTML。
    * React：JSX，JavaScript 的语法扩展。
2. 更新机制：
    * Vue：依赖追踪，自动更新相关组件。
    * React：状态变化时，重新渲染整个组件树，通过 Diff 算法优化更新。
3. 性能：
    * Vue：响应式系统减少了不必要的渲染。
    * React：通过 Diff 算法和 Fiber 架构优化渲染性能。
4. 开发体验：
    * Vue：模板语法直观，适合快速开发。
    * React：JSX 灵活，适合复杂逻辑。

# diff算法
Diff 算法是虚拟 DOM 的核心机制之一，用于比较新旧虚拟 DOM 树的差异，并计算出最小的 DOM 操作，从而高效地更新真实 DOM。它的目标是尽量减少对真实 DOM 的直接操作，提升性能。
Diff 算法的核心思想是：
  1. 分层比较：只比较同一层级的节点，不跨层级比较。
  2. 节点复用：如果节点类型相同，则复用 DOM 元素，只更新属性或子节点。
  3. 唯一key：通过 key 属性标识节点，优化列表渲染的性能。

## vue的diff算法
Vue 的 Diff 算法是基于 **双端比较** 的策略，主要针对列表渲染优化。
1. 双端比较：
    * Vue 在比较子节点时，会从列表的两端（头部和尾部）同时向中间比较。
    * 通过四个指针（旧列表的头尾、新列表的头尾）来高效地找到可复用的节点。
2. key 的作用：
    * Vue 强烈建议为列表项设置唯一的 key，以便更准确地识别节点，避免不必要的 DOM 操作。
3. 原地更新：
    * 如果节点类型相同，Vue 会尝试复用 DOM 元素，只更新其属性和子节点。
4. 优点
    * 高效：双端比较策略在大多数情况下能快速找到可复用的节点。
    * 简单直观：Vue 的模板语法和响应式系统使得 Diff 算法的实现相对直观。
5. 缺点：
    * 对 key 的依赖：如果没有正确使用 key，可能会导致性能下降或渲染错误。
    * 不适合极端复杂场景：在极端复杂的列表更新场景中，双端比较可能不如 React 的 Fiber 架构灵活。

### vue中对key的理解
* key是给每一个vnode的唯一id，也是diff的一种优化策略，可以根据key，更准确， 更快的找到对应的vnode节点。
* 如果没有k，往dom中加一个节点，即使遇到相同类型的节点，但是数据不同，自此往后所有的节点都会进行dom操作。
* 如有k，则先从头部比较，相同类型节点且数据相同，直接做patch渲染，如遇到不同的数据，说明可能在附近发生了dom的变化，则再从末尾比较，直到遇到不同的数据前，都不发生dom操作。最后将新的dom插入到变化的那个点即可。
* 为什么不推荐key使用index？
   * 使用 index 做 key，破坏顺序操作的时候， 因为每一个节点都找不到对应的 key，导致部分节点不能复用,所有的新 vnode 都需要重新创建。
   * 数据错位的问题，当有两条数据时，每条后面都有一个输入框，而输入框中有一些特定的内容。在节点最前面添加了一条数据，此时新加的数据后的数据框会存着之前第一条的数据。也就是说：当在比较时，发现虽然文本值变了，但是当继续向下比较时发现 DOM 节点(key)还是和原来一摸一样，就复用了。

## react的diff算法
React 的 Diff 算法是基于 递归比较 的策略，并结合 Fiber 架构实现了更细粒度的更新控制。
1. 递归比较：
    * React 会递归地比较新旧虚拟 DOM 树的每个节点。
    * 如果节点类型不同，则直接销毁旧节点并创建新节点。
2. Fiber 架构：
    * React 16 引入的 Fiber 架构将 Diff 过程拆分为多个小任务，支持中断和恢复，避免长时间阻塞主线程。
3. key 的作用：
    * React 也依赖 key 来优化列表渲染，通过 key 识别节点的移动、添加或删除。
4. 优点：
    * 灵活性高：Fiber 架构使得 React 能够处理更复杂的更新场景。
    * 性能优化：通过任务分片和优先级调度，React 能够更好地处理大规模更新。
    * 更适合复杂场景：在极端复杂的 UI 更新中，React 的 Diff 算法表现更优。
5. 缺点：
    * 实现复杂：Fiber 架构和 Diff 算法的实现较为复杂，学习成本较高。
    * 全量比较：React 默认会重新渲染整个组件树，虽然通过 Diff 算法优化，但在某些场景下可能不如 Vue 高效。


# 路由原理
* 本质：监听 URL 的变化，然后匹配路由规则，显示相应的页面。
* Hash 模式：当 # 后面的哈希值发生变化时，可以通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 www.test.com。即，Hash 路由通过 URL 中的 # 符号实现，# 后的内容不会发送到服务器，仅用于前端路由。
  * 优点
    1. 兼容性好：支持所有浏览器，包括旧版 IE。
    2. 无需服务器配置：# 后的内容不会发送到服务器，适合静态资源托管。
    3. 简单易用：实现简单，适合小型项目或快速原型开发。
  * 缺点
    1. URL 不美观：# 符号影响 URL 的美观和可读性。
    2. SEO（搜索引擎优化） 不友好：搜索引擎对 # 后的内容处理不佳，影响 SEO。
    3. 功能受限：无法利用 HTML5 History API 的完整功能。
* History 模式： HTML5 新推出的功能，主要使用 history.pushState 和 history.replaceState 改变 URL。通过 History 模式改变 URL 同样不会引起页面的刷新，只会更新浏览器的历史记录。当用户做出浏览器动作时，比如点击后退按钮时会触发 popState 事件。
  * 优点
    1. URL 美观：URL 更简洁，提升用户体验。
    2. SEO（搜索引擎优化） 友好：搜索引擎能更好地索引页面内容，有利于 SEO。
    3. 功能强大：支持更多高级路由功能，如状态管理。
  * 缺点
    1. 兼容性差：不支持 IE9 及以下版本。
    2. 需服务器配置：需服务器配置以支持所有路径返回同一 HTML 文件，否则刷新页面会导致 404 错误。
    3. 实现复杂：相比 Hash 路由，实现和维护更复杂。
* 两种模式的对比
   * Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL。
   * History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串。
   * Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候。

# vue和react的区别
* Vue 的表单可以使用 v-model 支持双向绑定，相比于 React 来说开发上更加方便，当然了 v-model 其实就是个语法糖，本质上和 React 写表单的方式没什么区别。
* 改变数据方式不同，Vue 修改状态相比来说要简单许多，React 需要使用 setState 来改变状态，并且使用这个 API 也有一些坑点。并且 Vue 的底层使用了依赖追踪，页面更新渲染已经是最优的了，但是 React 还是需要用户手动去优化这方面的问题。
* React 需要使用 JSX，有一定的上手成本，并且需要一整套的工具链支持，但是完全可以通过 JS 来控制页面，更加的灵活。Vue 使用了模板语法，相比于 JSX 来说没有那么灵活，但是完全可以脱离工具链，通过直接编写 render 函数就能在浏览器中运行。
* 在上手成本上来说，Vue 一开始的定位就是尽可能的降低前端开发的门槛，然而 React 更多的是去改变用户去接受它的概念和思想，相较于 Vue 来说上手成本略高。

# 组件中 data 什么时候可以使用对象
* 组件复用时所有组件实例都会共享data，如果data是对象的话，就会造成一个组件修改data后，影响到其他所有组件，所以需要将data写成函数，每次用到就调用一次函数获取新的数据。
* 当使用new Vue()的方式时，data是对象还是函数都可以，因为new Vue()的方式时生成一个根组件，该组件不会复用，不会共享。

# Vue进阶知识点
* Vue2内部使用了Object.defineProperty()来实现数据响应式，通过这个函数可以监听到 set 和 get 的事件。
* Vue 组件挂载时添加响应式的过程：在组件挂载时，会先对所有需要的属性调用Object.defineProperty()，然后实例化Watcher，传入组件更新的回调。在实例化过程中，会对模板中的属性进行求值，触发依赖收集。
* Object.defineProperty 的缺陷：通过下标方式修改数组数据或者给对象新增属性并不会触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作，更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数($set的本质也是splice触发派发更新)的方式解决了这个问题。
* AST：AST抽象语法树，通过抽象语法树解析，我们可以像童年时拆解玩具一样，透视Javascript这台机器的运转，并且重新按着你的意愿来组装。全称abstract syntax code，是源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构，这所以说是抽象的，是因为抽象语法树并不会表示出真实语法出现的每一个细节。
* 模板是怎么在浏览器中运行的：Vue 会通过编译器将模板通过几个阶段最终编译为 render 函数，然后通过执行 render 函数生成 Virtual DOM 最终映射为真实 DOM。
* 编译过程三阶段：
   * 将模板解析为 AST(通过各种各样的正则表达式去匹配模板中的内容，然后将内容提取出来做各种逻辑操作，接下来会生成一个最基本的 AST 对象)。
   * 优化 AST(标记静态节点，实现复用 Virtual DOM，跳过对比算法的功能)。
   * 将 AST 转换为 render 函数。
* nextTick：可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。

# Vue路由
动态路由(/movie/:id)的参数可以加一个props:true的属性，这样在组件里，动态路由的参数就相当于props，可以直接拿到。

this.$router.push() 内的参数对象使用:
* path表示去往哪里，传参的写法，如果目标地是动态路由，传参直接写在path字符串后，例如/tv/1。如果是正常路由，则用query，相当于参数是新加的。
```js
// query 参数会附加在 URL 的查询字符串中（即url主体后面的一长串），适合传递少量数据。
// 路由跳转时传递参数
this.$router.push({ path: '/about', query: { id: 123 } });

// 在目标组件中获取参数
this.$route.query.id; // 123
```
* 通过name跳转,当路由表中路由命名了，则可以将path替换成name，并且传参可以用params
```js
// 路由配置
{
  path: '/user/:id',
  name: 'User',
  component: User
}

// 路由跳转时传递参数
this.$router.push({ name: 'User', params: { id: 123 } });

// 在目标组件中获取参数
this.$route.params.id; // 123
```

## 组件内守卫
* beforeRouteEnter(to,from,next)  //即将进入路由时
   * 在该守卫触发时期，没有this，可以在next函数执行时给个参数vm，这个vm就是this
* beforeRouteLeave(to,from,next)  //即将离开路由时
* beforeRouteUpdate(to,from,next) //用于监测动态路由。例如 /movie/:id 这个id变化时，守卫触发

## 全局守卫钩子
可以在路由表里直接定义route.beforeEach,也可以在APP.vue中this.$router.beforeEach
* beforeEach(to,from,next) //进入前触发
* afterEach(to,from,next) //离开前触发

## 全局解析守卫
* beforeResolve 是 Vue Router 提供的一个全局解析守卫，它在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。它的主要作用是确保在导航完成之前，所有相关的数据和逻辑都已经准备就绪。
* beforeResolve 的作用
  * 确保数据加载完成：在导航被确认之前，确保所有异步操作（如数据加载、权限验证等）已经完成。
  * 统一处理逻辑：可以在全局范围内统一处理一些逻辑，而不需要在每个组件中重复编写。
  * 导航确认前的最后检查：在导航被确认之前，进行最后的检查或处理。

## 路由独享守卫
* beforeEnter

## 导航被触发的触发顺序
全局前置守卫 (beforeEach) => 路由独享守卫 (beforeEnter) => 组件内守卫（beforeRouteEnter） => 组件内守卫（beforeRouteUpdate） => 组件内守卫（beforeRouteLeave）=> 全局解析守卫(beforeResolve) => 全局后置守卫 (afterEach)
  * 示例： 假设用户从 /home 跳转到 /user/123，且 /user/:id 是一个动态路由：
    1. 触发导航：用户点击链接或调用 this.$router.push('/user/123')。
    2. 全局前置守卫 (beforeEach)：检查用户是否有权限访问 /user/123。
    3. 路由独享守卫 (beforeEnter)：检查 /user/123 是否需要特殊权限。
    4. 组件内守卫 (beforeRouteEnter)：在进入 /user/123 之前执行。
    5. 全局解析守卫 (beforeResolve)：确保所有异步操作已完成。
    6. 导航被确认：路由跳转到 /user/123。
    7. 全局后置钩子 (afterEach)：记录日志或统计。
    8. 更新 DOM：渲染 /user/123 对应的组件。


# nextTick
* nextTick 是 JavaScript 中用于将回调函数推迟到下一个事件循环中执行的机制。它允许你在当前事件循环结束后立即执行某个操作，常用于确保在 DOM 更新或其他异步操作完成后执行代码。
* 原理： 涉及js事件循环。JavaScript 是单线程的，它通过事件循环机制来处理异步任务。事件循环分为以下几个阶段：
  1. 宏任务（Macro Task）：如 setTimeout、setInterval、I/O 操作等。
  2. 微任务（Micro Task）：如 Promise、MutationObserver 等。
  3. 渲染（Render）：浏览器会在每一轮事件循环的末尾进行渲染，更新 DOM。
  * nextTick 利用微任务机制，将回调函数推迟到当前事件循环的末尾执行，确保在 DOM 更新后立即执行。
* 在 Vue.js 中，nextTick 是一个实例方法，用于在 DOM 更新完成后执行回调函数。Vue 的响应式系统会在数据变化时异步更新 DOM，而 nextTick 可以确保你在 DOM 更新完成后执行某些操作。
* vue中nextTick的实现原理：
  * Vue 的 nextTick 实现依赖于浏览器的微任务队列。Vue 会根据当前环境选择最合适的微任务实现方式，通常是 Promise，如果 Promise 不可用，则会回退到 MutationObserver 或 setTimeout。
* vue中nextTick的执行流程
  1. 数据变化：当 Vue 实例的数据发生变化时，Vue 会触发依赖更新。
  2. 异步更新队列：Vue 会将需要更新的 Watcher 推入一个队列中，并在下一个事件循环中批量执行这些 Watcher 的更新操作。
  3. nextTick 回调：在 Watcher 更新完成后，Vue 会执行通过 nextTick 注册的回调函数，确保这些回调在 DOM 更新后执行。

# gulp，webpack，vite
* gulp是工具链，构建工具。可以利用插件处理html,css，js等文件，并且可以压缩为一行，强调的是前端开发的工作流程，通过一系列task配置(例如处理文件压缩，雪碧图等)，定义执行顺序，总体来看，他是基于流的自动化构建工具。
* webpack是打包工具，可以把项目的各种js文件、css文件合并成一个文件或多个文件，它的思想是万物皆为模块，他能够将各个模块按需加载，不会导致加载无用冗余的模块。
* vite和webpack一样是打包工具，但它更快，因为它启动的时候不会打包。当浏览器请求对应模块时，才会对模块进行编译，这种按需加载，极大缩短了编译时间
* webpack是先打包再启动开发服务器，vite是直接启动开发服务器，然后按需编译依赖文件。

# vue3相对于vue2有哪些改进
* 性能提升：
  1. 更快的渲染速度： vue3使用了proxy而弃用了Object.defineProperty，更高效。
  2. 更小的包体积： 通过tree-shaking支持，核心代码体积减少约40%。
  3. 更好的内存使用：优化了虚拟 DOM 的实现，减少了内存占用。
   * 如何优化了虚拟DOM呢？
      1. 静态树提升：vue3在编译时会检测模板中的静态内容，并将其提升到渲染函数之外。这样每次渲染时不需要重新比对和创建。减少了虚拟Dom的创建和比对时间。
      2. 静态属性提升： 对于DOM的静态属性，例如class名、id名等，也会提取出来，避免每次创建和比对。
      3. Patch Flag（补丁标志）： vue3在编译阶段会为每个Dom节点添加一个标志，用于标记节点的动态部分（文本、属性、子节点）。在更新时，通过标记快速定位节点，减少比对时间。
      4. block tree（块树）： vue3将模块分为多个块，每个块都是独立的子树。在比对时，只比对动态块，静态块直接跳过，不需要遍历整个树。减少比对开销
      4. 更高效的diff算法：
          * patch flag： 直接在节点上标记，若需要更新该节点的动态部分，例如内容，属性，子节点等。直接定位，不再需要整个树遍历。
          * block tree。
          * 动态节点追踪： 在编译阶段生成一个动态节点列表，更新时只遍历这个列表，减少比对范围。
          * 静态提升。
          * 更智能的子节点对比： 1、优先利用key匹配，避免全量遍历。也减少了不必要的节点创建和销毁。 2、最长递增子序列算法（LIS）：对于没有key的子节点，会采用该算法。该算法会找到新旧子节点中最长的递增子序列，确定哪些节点可以保留，哪些需要移动或删除。减少节点的移动操作。例如：新旧子节点变化不大，vue3只会移动少数节点，而不是重新排列所有节点。 比如一个A｜B｜C｜D 排列的节点变化为了B｜A｜C｜D，vue2会逐个比对节点，发现顺序变化后重新排列所有节点，这导致了多次DOM操作。而vue3，使用key或者LIS算法，发现只需AB交换位置，只进行一次DOM操作。提升性能。
          

# vue3生命周期
* beforeCreate与created均转为了setup
* beforeMount ===> onBeforeMount     mounted=======>onMounted
* beforeUpdate===> onBeforeUpdate    updated =======>onUpdated
* beforeUnmount ==> onBeforeUnmount  unmounted =====>onUnmounted

# keep-alive
* keep-alive 是 Vue 内置的一个抽象组件，用于缓存不活动的组件实例，而不是销毁它们。当组件被包裹在 keep-alive 中时，它的状态（如数据、DOM 等）会被保留，避免重复渲染和销毁，从而提升性能。
* 原理： 
  1. 缓存机制：keep-alive通过一个缓存对象存储组件实例，第一次渲染后，实例会被缓存。再次渲染时，直接从缓存中取出，避免重新创建。
  2. 生命周期钩子：keep-alive会触发组件的activated和deactivated。activated 在组件激活时调用，deactivated 在组件停用时调用。
  3. LRU 算法：当缓存数量超过 max 设置时，keep-alive 使用 LRU（最近最少使用）算法移除最久未使用的实例。

# vuex原理
vuex的核心就是仓库store，相比于单纯的全局变量，vuex具有响应式，不能直接的改变其中的状态，必须通过commit

# React
* react虚拟DOM：同层比较，建立在两个假设的基础上。1、类似的组件会产生类似的UI界面。2、每个兄弟组件都会有一个唯一的key。
* 使用组件时，在组件中写了类似slot的dom内容，可以在子组件中用props.children直接获取dom，并用{prop.children}渲染。
* setState可以在状态改变后单独调用一次,this.setState({})，去告诉react更新DOM；也可以把对象具体位改变哪些属性。如果想根据原来的state去更新现有的state，需要如下写法
```js
this.setState(preState => {
  return {
    isShow: !preState.isShow
  }
}, ()=> {})
```
* setState的第二个参数相当于vue的nextTick，指数据变化渲染完DOM后的数据情况，可以拿到最新的状态。
* 受控组件中需要value绑定状态，之后通过onChange改变对应状态，达到vue中modal语法糖的效果。
* 非受控组件需要在constructor中定义一些this.ipt = createRef(),然后在表单中用ref = this.ipt，之后就可以通过this.ipt获取该表单。

## 生命周期
* initialization（初始化阶段，只会执行一次）
   * setup up props and state （实际上就是constructor）
* Mounting （挂载阶段，只会执行一次）
   * componentWillMount => render => componentDidMount (仅执行一次)
* updation （更新阶段）
  * props的相关钩子： componentWillReceiveProps(nextProps) => shouldComponentUpdate(nextProps, nextState) 返回true或者false => componentWillUpdate => render => componentDidUpdate
    * componentWillReceiveProps的参数nextProps，代表了最新的props 
    * shouldComponentUpdate 两个参数nextProps, nextState。代表了最新的props和最新的state
  * state的相关钩子： shouldComponentUpdate => componentWillUpdate => render => componentDidUpdate (因为不需要接收props，所以只有后四个钩子)
* unmounting (卸载阶段)
  * componentWillUnmount

父组件render执行，子组件render一定会执行：例如父组件中调了setState改了状态，触发了updation中render，即使改的状态与子组件无关，没有传给子组件，子组件也会触发生命周期，执行render等钩子。vue则不会，vue只会在父组件相关props更新时，才会重复渲染

* getDerivedStateFromProps(nextProps,prevState) 根据props，生成新的state，mounte和update阶段均会触发的钩子，16.3版本后新出的。
```js
static getDerivedStateFromProps(nextProps,prevState) {
  // 若nextProps.color === prevState.color判断，会有更新bug。
  /* 
    因为这个钩子触发频率过于频繁，自身的setState也会触发，外部props更新也会触发。所以导致，若内外部同时改内部的状态，可能存在问题。
    比如： 外部更新了一次color后，若有一个内部更新color的需求时，setState触发了更新，但此时nextProps.color依然为上次外部更新的值，而此时prevState.color已经为内部更新后的值，两个值已经不相等了，则会走else中自动merge一次state的逻辑，导致这次内部更新color被再次替换，又改回了上一次外部更新的color值。
    所以： 用prePropColor去存储一下上一次props中传下来的color的值，若相等，就不做merge。省的再把内部改的color给覆盖了。
    这个钩子根据名字所探得的本意就是从prop更新内部的state，所以要尽可能避免内部更新导致的触发钩子。 
  */
  if (nextProps.color === prevState.prePropColor) {
    return null // 不再merge
  } else { // 会自动做一个merge操作
    color: nextProps.color,
    prePropColor: nextProps.color, //额外存储一下上次渲染的color，因为这个钩子触发的阈值太低，所以为了防止自身做状态改变无法正常渲染，做了这么一步冗余操作。
  }
}
```

# 监控
* 前端监控一般分为三种：页面埋点、性能监控、异常监控。
* 页面埋点：一般会监控 PV/UV、停留时间、流量来源、用户交互等数据。对于这几类统计，一般实现思路大致分为两种：手写埋点和无埋点。
   * 手写埋点：可以自主选择需要监控的数据然后在相应的地方写入代码。这种方式的灵活性很大，但是唯一的缺点就是工作量较大，每个需要监控的地方都得插入代码。
   * 无埋点：不需要开发者手写埋点了，而是统计所有的事件并且定时上报。这种方式虽然没有前一种方式繁琐了，但是因为统计的是所有事件，所以还需要后期过滤出需要的数据。
* 性能监控：性能监控可以很好的帮助开发者了解在各种真实环境下，页面的性能情况是如何的。对于性能监控来说，我们可以直接使用浏览器自带的 Performance API 来实现这个功能。其实我们只需要调用 performance.getEntriesByType('navigation') 这行代码就行了。
* 异常监控：代码报错以及接口异常上报。
   * 代码运行报错，通常的办法是使用 window.onerror 拦截报错。该方法能拦截到大部分的详细报错信息。
   * 对于异步代码来说，可以使用 catch 的方式捕获错误。

# UDP
* 网络协议中传输层的两个协议：UDP 以及 TCP。
* UDP：首先 UDP 协议是面向无连接的，也就是说不需要在正式传递数据之前先连接起双方。然后 UDP 协议只是数据报文的搬运工，不保证有序且不丢失的传递到对端，并且UDP 协议也没有任何控制流量的算法，总的来说 UDP 相较于 TCP 更加的轻便。
* 面向无连接：首先 UDP 是不需要和 TCP 一样在发送数据前进行三次握手建立连接的，想发数据就可以开始发送了。并且也只是数据报文的搬运工，不会对数据报文进行任何拆分和拼接操作。
* 不可靠性：
   * 首先不可靠性体现在无连接上，通信都不需要建立连接，想发就发，这样的情况肯定不可靠。并且收到什么数据就传递什么数据，并且也不会备份数据，发送数据也不会关心对方是否已经正确接收到数据了。
   * 再者网络环境时好时坏，但是 UDP 因为没有拥塞控制，一直会以恒定的速度发送数据。即使网络条件不好，也不会对发送速率进行调整。这样实现的弊端就是在网络条件不好的情况下可能会导致丢包，但是优点也很明显，在某些实时性要求高的场景（比如电话会议）就需要使用 UDP 而不是 TCP。
* 高效：虽然 UDP 协议不是那么的可靠，但是正是因为它不是那么的可靠，所以也就没有 TCP 那么复杂了，不需要保证数据不丢失且有序到达。
* 传输方式：UDP 不止支持一对一的传输方式，同样支持一对多，多对多，多对一的方式，也就是说 UDP 提供了单播，多播，广播的功能。
* 适用场景：
   * 直播：正是因为可不可靠，所以UDP实时性较好。
   * 实时性很高的游戏(王者荣耀、吃鸡等)

# TCP
* TCP 基本是和 UDP 反着来，建立连接断开连接都需要先需要进行握手。在传输数据的过程中，通过各种算法保证数据的可靠性，当然带来的问题就是相比 UDP 来说不那么的高效。
* 建立连接三次握手
   * 客户端向服务端发送连接请求报文段。该报文段包含自身的数据通讯初始序号。请求发送后，客户端进入 SYN-SENT（同步-已发送状态） 状态
   * 服务端收到连接请求报文后，如果同意连接，则会发送一个应答，该应答中也会包括自身数据通讯的初始序号，发送后便进入SYN-RECEIVED（同步-已接收状态）状态。
   * 客户端收到应答后，还要向服务器发送一个确认的报文。发送后便变为ESTABLISHED(确定建立连接)状态，服务端收到应答后也进入ESTABLISHED状态。此时连接建立成功。
* 三次握手简短版
  * 客户端：发送SYN包，进入SYN-SENT状态。
  * 服务器：收到SYN包，发送SYN-ACK包，进入SYN-RECEIVED状态。
  * 客户端：收到SYN-ACK包，发送ACK包，连接建立完成。
* 为什么 TCP 建立连接需要三次握手，明明两次就可以建立起连接：
  * deepseek版回答： 如果只有两次握手，服务器收到旧的SYN包（网络连接不稳定导致的）后会直接建立连接，但客户端并没有真正发起新连接，导致服务器浪费资源。
  * 简短回答： 为了防止出现失效的连接请求被服务端接收的情况，从而产生错误。
  * 例如：客户端发送A请求，网络连接超时，TCP的重传机制会再发送一个请求B，B顺利连接完成后，接受数据，释放了连接。然后这时A到达了服务端，那么此时服务器又以为要建立TCP连接 ，而进入ESTABLISHED状态。但是客户端已经CLOSE状态，那么就会导致服务器一直等待，造成浪费。
* 断开连接的四次握手
   * 若客户端认为数据发送完成，则需要向服务端发送连接释放请求FIN包，客户端进入FIN-WAIT-1阶段
   * 服务端收到请求后，会告诉应用层释放TCP链接。然后发送ACK包(确认字符)，并进入CLOSE_WAIT状态，此时表明客户端到服务端的连接已经断开了，不再接受该客户端发送的数据了。客户端接收到ACK包后进入FIN-WAIT-2状态，但是TCP连接是双向的，所以服务端还可以向客户端发送数据。
   * 服务端此时如果还有未发送完的数据会继续发送，完毕后会向客户端发送连接释放请求。之后服务端会进入LAST_ACK状态。
   * 客户端收到释放请求后，会向服务端发送确认关闭应答，此时客户端进入TIME-WAIT 状态，该状态会持续 2MSL（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有 服务端 的重发请求的话，就进入 CLOSED 状态。当 服务端 收到确认应答后，也便进入 CLOSED 状态。
* 为什么 客户端 要进入 TIME-WAIT 状态，等待 2MSL 时间后才进入 CLOSED 状态？
    1. 确保最后一个ACK能被服务器收到：如果客户端最后一个ACK确认包丢失，服务端会重新发送一个FIN包，等待客户端确定
    2. 防止旧的重复报文干扰新连接： 网络中存在延迟的数据包（网络延迟导致的），若客户端立即关闭，并用相同的端口重新建立连接，这些旧报文会被误认为新连接的数据，导致数据混乱。
    3. 2MSL的意义： MSL是指tcp报文在网络中的最大生存时间。2个最大生存时间，确保了客户端最后发送的ACK确认包在网络中存活了1MSL，但因为网络不稳定而丢失，未正常被服务端接收到，而服务端又发送了最终的FIN包，确保存活了1MSL。
    4. 双向连接，确保双向彻底关闭

# 输入 URL 到页面渲染的整个流程
* DNS：DNS 的作用就是通过域名查询到具体的 IP。因为 IP 存在数字和英文的组合（IPv6），很不利于人类记忆，所以就出现了域名。你可以把域名看成是某个 IP 的别名，DNS 就是去查询这个别名的真正名称是什么。
* 在 TCP 握手之前就已经进行了 DNS 查询。当你在浏览器中想访问 www.google.com 时，会进行一下操作：
   * 操作系统会首先在本地缓存中查询 IP。
   * 没有的话会去系统配置的 DNS 服务器中查询。
   * 如果这时候还没得话，会直接去 DNS 根服务器查询，这一步查询会找出负责 com 这个一级域名的服务器
   * 然后去该服务器查询 google 这个二级域名
   * 接下来三级域名的查询其实是我们配置的，你可以给 www 这个域名配置一个 IP，然后还可以给别的三级域名配置一个 IP
   * TCP握手。
   * 数据进入服务端之前，可能还会先经过负责负载均衡的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设服务端会响应一个 HTML 文件。
   * 之后浏览器判断状态码，200继续解析，400/500会报错，300会进行重定向，多次重定向后也会报错。
   * 解码成功后开始渲染流程，先会根据HTML构建DOM树，CSS构建CSSOM树。等待JS执行完毕后再开始渲染(async会并行进行下载并执行 JS，defer 会先下载文件)
   * CSSOM 树和 DOM 树构建完成后会开始生成 Render 树，这一步就是确定页面元素的布局、样式等等诸多方面的东西
   * 在生成 Render 树的过程中，浏览器就开始调用 GPU 绘制，合成图层，将内容显示在屏幕上了。

# 设计模式
* 工厂模式：假设有一份很复杂的代码需要用户去调用，但是用户并不关心这些复杂的代码，只需要你提供给我一个接口去调用，用户只负责传递需要的参数，至于这些参数怎么使用，内部有什么逻辑是不关心的，只需要你最后返回我一个实例。这个构造过程就是工厂。工厂起到的作用就是隐藏了创建实例的复杂度，只需要提供一个接口，简单清晰。
* 单例模式：单例模式很常用，比如全局缓存、全局状态管理(Vuex )等等这些只需要一个对象，就可以使用单例模式。
* 装饰模式：不需要改变已有的接口，作用是给对象添加功能。在 React 中，装饰模式其实随处可见。
* 代理模式：代理是为了控制对对象的访问，不让外部直接访问到对象。比如事件代理就用到了代理模式。因为存在太多的 li，不可能每个都去绑定事件。这时候可以通过给父节点绑定一个事件，让父节点作为代理去拿到真实点击的节点。
* 发布-订阅模式：也叫做观察者模式。通过一对一或者一对多的依赖关系，当对象发生改变时，订阅方都会收到通知。比如我们点击一个按钮触发了点击事件就是使用了该模式。在 Vue 中，如何实现响应式也是使用了该模式。对于需要实现响应式的对象来说，在 get 的时候会进行依赖收集，当改变了对象的属性时，就会触发派发更新。

# 数据结构
* 栈：栈的特点是只能在某一端添加或删除数据，遵循先进后出的原则
* 队列：队列是一个线性结构，特点是在某一端添加数据，在另一端删除数据，遵循先进先出的原则。
* 遍历二叉树：先序遍历、中序遍历、后序遍历。
   * 先序遍历先访问根节点，然后访问左节点，最后访问右节点。
   * 中序遍历表示先访问左节点，然后访问根节点，最后访问右节点。
   * 后序遍历表示先访问左节点，然后访问右节点，最后访问根节点。

# 常见算法
* 左移 << ：10 << 1 ，左移就是将二进制全部往左移动，10 在二进制中表示为 1010 ，左移一位后变成 10100 ，转换为十进制也就是 20。
* 算数右移 >> ： 算数右移就是将二进制全部往右移动并去除多余的右边，10 在二进制中表示为 1010 ，右移一位后变成 101 ，转换为十进制也就是 5。
* 按位与：每一位都为 1，结果才为 1。 8 & 7  -> 1000 & 0111 -> 0000 -> 0。
* 按位或：其中一位为 1，结果就是 1。 8 | 7  -> 1000 | 0111 -> 1111 -> 15
* 按位异或：每一位都不同，结果才为 1。 8 ^ 7 -> 1000 ^ 0111 -> 1111 -> 15
* 下面要排序算法通用的方法。
```js
function checkArray(array) {
    if (!array) return
}
function swap(array, left, right) {
    let rightValue = array[right]
    array[right] = array[left]
    array[left] = rightValue
}
```
* 冒泡排序：从第一个元素开始和下一个索引比较，如果当前元素大，则交换位置，重复操作直到最后一个元素，下一轮从第一个重复上述操作，不过不需要比对最后一个元素。
```js
function bubble(array) {
  checkArray(array);
  for (let i = array.length - 1; i > 0; i--) {
    // 从 0 到 `length - 1` 遍历
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) swap(array, j, j + 1)
    }
  }
  return array;
}
```
* 插入排序：第一个元素默认已排序，取出下一个元素和当前元素作比较，如果当前元素大就交换位置。那么此时的第一位就是最小的元素，下次取出操作从第三个元素开始比较，依次向前对比。
```js
function insertion(array) {
  checkArray(array);
  for (let i = 1; i < array.length; i++) {
    for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--)
      swap(array, j, j + 1);
  }
  return array;
}
```
* 选择排序：从下标0开始，遍历数组，将最小的那位的索引值替换为0。之后从下标1开始，遍历数组，将最小的那位测索引值替换为1.
```js
function selection(array) {
  checkArray(array);
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      minIndex = array[j] < array[minIndex] ? j : minIndex;
    }
    swap(array, i, minIndex);
  }
  return array;
}
```
* 归并排序:略复杂，建议自己看
* 快排：模棱两可，建议自己看

# 某些结论
## sessionStorage 不能在多个窗口或标签页之间共享数据，但是当通过 window.open 或链接打开新页面时(不能是新窗口)，新页面会复制前一页的 sessionStorage。
https://juejin.cn/post/7362080157190570010

## ['1','5','11'].map(parseInt)会返回[1,NaN,3]
https://juejin.cn/post/7370630910071373874