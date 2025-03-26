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
* 渲染富文本：dangerouslySetInnerHTML
```html
<div dangerouslySetInnerHTML={{__html:data}}>
// 这个data就是要渲染的富文本
```

## 利用柯里化解决传参的问题
```js
handleChange = (params) => {
  return (e) => {
    this.setState({
      textValue: e.target.value
    })
  }
}
<input 
  type="text" 
  value={this.state.textValue}
  onChange={this.handleChange(params)}
/>
```

### 在子组件中调用了父组件定义的柯里化函数，需要传参
```js 情景一：父组件定义时直接执行了回调函数
// 传参的时候执行了函数，则传到子组件里函数就是实际执行的函数，则在父组件中接收参数时，就在return里执行。
<Form onReceiveKeywords={this.handleReceiveKeywords()}></Form>

// 这里的柯里化接受参数放在了实际执行的函数里，因为子组件拿的onReceiveKeywords函数，实际上就是return后面的实际执行的函数。
handleReceiveKeywords = () => {
  return (keywords) => {
    console.log(keywords )
  }
}
```
```js 情景二：父组件定义时不执行
// 传参的时候不执行回调函数，则相当于子组件拿到的就是整个柯里化函数，那么就要在外层接收参数
<Form onReceiveKeywords={this.handleReceiveKeywords}></Form>

// 这里的柯里化接受参数放在了外层函数里，因为父组件相当于将整个参数传递给子组件
handleReceiveKeywords = (keywords) => {
  return () => {
    console.log(keywords )
  }
}
```

```js 子组件调用
this.props.onReceiveKeywords(this.state.value)
```

## 受控组件与非受控组件
一般来讲表单的value被定义了，就会变成受控，即使是` value='' ` 不与状态绑定，也会变为受控组件。受控后就需要绑定事件@change={this.handleChange}，这样可以通过value给默认值，比较方便。
若不定义value，则需要用createRef承接表单，获取表单值，并通过defaultValue给默认值
文件上传一般只能是非受控组件，因为file属性只读 

```js
import React, {createRef} from 'react'

export default class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.input = createRef();
  }

  handleSubmit = () => {
    return (e) => {
      console.log(this.input.current.value)
      e.preventDefault();
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit()}>
        <label>
          Name:
          <input type="text" ref={this.input} defaultValue="abc" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

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


## pureComponent 实现类似vue的，子组件只在父组件相关状态更新时才会触发渲染。
```js
import React, {pureComponent} from 'react'
export default class Child extends pureComponent
```
pureComponent与shouldComponentUpdate互斥 

## context 具体示例请看context文件夹中的父子文件
```js 定义context
import { createContext } from 'react'

const testContext = createContext()
const { Provider, Consumer } = testContext

export {
  testContext,
  Provider, 
  Consumer
}
```

```js 在函数式和类组件中的使用
import React, { Component } from 'react'
import { Consumer, Provider, testContext } from './testContext'

class ChildA extends Component {
  static contextType = testContext // 类组件直接接收参数后，this中的context就接收到了provider的参数

  render() {
    return (
      <div>child a: {this.context}</div> //this.context => hello
    )
  }
}

// 函数组件
const ChildD = function(props) {
  return (
    <div>ChildD
      {/* 只能借助consumer接受参数 */}
      <Consumer>
        {
          (value) => {
            return <div>{value}</div>
          }
        }
      </Consumer>
    </div>
  )
}

// 定义根组件，定义provider，传入value为hello
export default class App extends Component {
  render() {
    return (
      <Provider value="hello">
        <ChildA></ChildA>
        <ChildD></ChildD>
      </Provider>
    )
  }
}
```

## HOC 高阶组件
给组件添加一些属性或逻辑。
```js
import React, { Component } from 'react'

const hoc = (Comp) => {
  return class extends Component {
    render() {
      return (
        // 展开运算符是为了防止组件中原有的属性消失。
        <Comp title="hello" {...this.props}></Comp>
      )
    }
  }
}

export default hoc
```

### 装饰器
想要使用装饰器需要安装一些依赖和增加一些配置。
参考：https://juejin.cn/post/6935440015639969828
* 安装依赖
`yarn add @babel/core @babel/plugin-proposal-decorators @babel/preset-env`

* 根目录创建创建.babelrc
```js
{  "presets": [
    "@babel/preset-env"  ],
  "plugins": [
    [ 
     " @babel/plugin-proposal-decorators",
      {
      "legacy": true
      }
    ]
  ]
}
```

* 根目录创建或修改config-overrides.js
```js
const path = require('path')
const { override,addDecoratorsLegacy} = require('customize-cra');
function resolve(dir) {
    return path.join(__dirname,dir)
}
const customize = () =>(config,env) =>{
    config.resolve.alias['@'] = resolve('src')
    if(env === 'production'){
        config.externals = {
            'react':'React',
            'react-dom': 'ReactDOM'
        }
    } 
   return config
}
module.exports = override(addDecoratorsLegacy(),customize())
```

* 安装依赖
`yarn add customize-cra react-app-rewired`

* 修改package.json文件
```js
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

### portal 利用高阶组件，将dom创建在任意位置
示例为将任意调用该高阶组件的组件，创建在body下 
```js
import React, {Component} from 'react'
import { createPortal } from 'react-dom'

function withPortal(WrappedComponent) {
  return class extends Component {
    render() {
      return createPortal(
        <WrappedComponent {...this.props} />,
        document.querySelector('body')
      )
    }
  }
}

export default withPortal
```

## redux(flux思想的一种实现)
* 纯函数reducer定义
```js
const defaultState = {
  count: 0
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1
      }
    case 'decrement':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

export default reducer
```

* redux的定义
```js
import { createStore } from 'redux'

import reducer from './reducer' //代表了一个纯函数的js，只用作更改状态，无副作用。

const store = createStore(reducer) // store中包含了dispatch（修改）, subscribe（为渲染等函数添加响应式）, getState（获取state）等方法

export default store
```

* redux使用
```js
import React, { Component } from 'react'

import store from './store'

class App extends Component {
  decrement = () => {
    store.dispatch({type: 'decrement'})
  }

  increment = () => {
    store.dispatch({type: 'increment'})
  }

  render() {
    return (
      <div>
        <button onClick={this.decrement}>-</button>
          <span>{store.getState().count}</span>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}

export default App;
```

* 此时还有点问题，redux运行依赖观察者模式，而还未将渲染页面的函数加入观察列表，故改变了状态还不足以同步渲染页面。则需要在根节点处添加观察列表，不断地渲染dom

```js
import store from './store'
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App></App>
    </Provider>,
    document.querySelector('#root')
  )
}
render()
store.subscribe(render)
```
* 此时，react和redux就用自己的方式结合起来了，这个完整的示例，有助于理解redux的运行逻辑


## react-redux插件
* 该插件借助context思想，完善redux的使用

  * **定义store与对应的纯函数**
    ```js 创建纯函数
    const defaultState = {
      list: []
    }
    export default (state = defaultState, action) => {
      switch(action.type) {
        case 'LOAD_DATA':
          return state
        case 'PUT_DATA':
          return {
            list: [
              ...state.list,
              action.task
            ]
          }
        case 'REMOVE_DATA':
          let newList = state.list.filter((value, index) => {
            return index !== action.index
          })
          return {
            ...state,
            list: newList
          }
        default: // default似乎是必须定义的，并返回state，因为redux源码中，每次dispatch，都会初始化一次reducer，case是一个几乎不太可能重复的action，所以必然会走进default的逻辑一次
          return state
      }
    }
    ```

    ```js 创建store
    import { createStore } from 'redux'

    import reducer from './reducer' 

    export default createStore(reducer)
    ```

    根节点provider注册全局store
    ```js
    import { Provider } from 'react-redux'
    import store from './store'
    ReactDOM.render(
        <Provider store={store}>
          <App></App>
        </Provider>,
        document.querySelector('#root')
      )
    ```

  * **读取store**
    ```js
    import React, { Component } from 'react'
    import { connect } from 'react-redux'

    const mapStateToProps = (state) => {
      return {
        list: state.list
      }
    }
    const mapDispatchToProps = dispatch => {
      return remove(index) {
        dispatch({
          type: 'REMOVE_DATA',
          index
        })
      }
    }

    @connect(mapStateToProps, mapDispatchToProps) // 若用装饰器，则直接导出List即可
    class List extends Component {
      render() {
        return (
          <ul>
            {
              this.props.list.map((value, index) => {
                return (
                  <li 
                    key={index}
                  >
                    {value} 
                  </li>
                )
              })
            }
          </ul>
        )
      }
    }
    // 这个connect方法第一次调用的返回值是个高阶组件，故需要再将组件当参数执行一次高阶组件，给组件添加上所需要的属性
    export default connect(mapStateToProps)(List)
    // 也可以使用装饰器
    export default List
    ```

  * **改变store**
    ```js
    import React, { Component } from 'react'
    import { connect } from 'react-redux'

    const mapDispatchToProps = (dispatch) => {
      return {
        putData(task) {
          dispatch({
            type: 'PUT_DATA',
            task
          })
        }
      }
    }
    @connect(null, mapDispatchToProps)
    class Form extends Component {
      state = {
        task: ''
      }
      handleChange (e) => {
        this.setState({
          task: e.target.value
        })
      }
      handleKeyup (e) => {
        if (e.keyCode === 13) {
          this.props.putData(this.state.task)
          this.setState({
            task: e.target.value
          })
        }
      }
      render() {
        return (
          <div>
            <input 
              type='text' 
              value={this.state.task} 
              onChange={this.handleChange}
              onKeyUp={this.handleKeyup}
            />
          </div>
        )
      }
    }
    export default Form
    ```
  
  * 副作用函数合集actionCreator
    * 引入redux-thunk中间件插件，帮助craetor副作用函数中可以返回一个非扁平的对象
    在store创建中引入thunk
    ```js
      import { createStore, applyMiddleware } from 'redux'

      import reducer from './reducer' 
      import thunk from 'redux-thunk'

      const middleware = applyMiddleware(thunk)

      export default createStore(reducer, middleware)
    ```

    * 在creator中定义副作用函数，将副作用函数传入
    ```js
      const setdataAction = data => {
        return dispatch
      }
    ```

### redux-thunk中间件
目前所有redux的读写，均为同步操作，action均为简单的扁平化对象。一旦需要ajax请求，action不可避免的就需要返回一个非扁平的对象，包括函数什么的。
这时需要redux-thunk这个中间件起到了作用，可以返回一个函数。处理副作用函数等。
示例请看完整的redux-todolist。
其实整体的思想和前面react-redux是一致的，只是将所有的action抽离出去。并将同异步操作分离。

#### 自定义中间件
在定义store的途中，你可以自定义一些中间件，只要被applyMiddleware执行，中间件就会被挂载上next的参数和action参数。
```js
import { createStore, applyMiddleware } from 'redux'

import reducer from './reducer'

import m1 from './middlewares/m1'
import m2 from './middlewares/m2'

// 中间一旦挂上，dispatch 就会被中间件拦下来
const middleware = applyMiddleware(m1, m2)

const store = createStore(reducer, middleware)

export default store
```

定义中间件
```js
export default ({dispatch, getState}) => (next) => (action) => {
  console.log('m1')
  next(action)
}
```
```js
export default ({dispatch, getState}) => next => action => {
  console.log('m2')
  // 想写什么写什么
  const ac = {
    type: 'hello'
  }
  next(ac)
}
```

## 纯函数






















## immutable
不可变数据 (Immutable Data )就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。契合redux。
Immutable 实现的原理是持久化数据结构，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。
vue会通过比对（diff）找出变化的部分，但修改的是原组件的状态和 DOM，而不是完全替换，因为做了响应式。
react与immutable思想就类似，通过生成新的虚拟 DOM 树，与旧树进行比对（diff），最终以最小代价更新真实 DOM。这与 Immutable 的“最小化变更”思想一致。

* 降低diff比对的复杂度
  * 两个地址不同的对象，即使对象中的属性一致，直接===比较也是返回false。
  * 但是，let map1 = Map({a:0,b:1}); let map2 = map1.set('a', 100)
  * map1 === map2，也是false，且map1.get('a')还为0。
  * 因为步骤二做的赋值相当于是返回了一个新的对象
  * 但是 let map2 = map1.set('a', 0)，没改mp1的值直接赋值
  * map1 === map2是会返回true的
* 优化内存
* 函数式编程
* 历史追溯性，因为每次修改都是产生了一个新的对象，每一步骤的数据均得到保留，类似git

* 但容易与原生api混淆

### api
* toJS() immutable对象可以转为js对象，递归转

* Map.set(filed, value)  set无法修改原对象，一定返回一个新对象
  * let map1 = Map({x:0}); let mapcopy = map1; mapcopy.set(x, 100)是无法修改mapcopy的值的，修改完后通过mapcopy.get(x)依然为0
  * 只能let mapcopy = map1.set(x, 100)，直接在赋值时就获取需要更改后的值

* Map.get(filed)

* Map(List).getIn(['z', 'w', 1]) 获取immutable对象中的“z”属性中的“w”属性中的（List数组）第“1”位属性值

* Map(List).setIn同理。

* Map(List).update 依托原值修改现值(类似vue计算属性)
  * const alpha = Map({ a: 1, b: 2, c: 3, d: 4 })
  * alpha.update('a', (v) => v+99 ) // Map({ a: 100, b: 2, c: 3, d: 4 })

* Map(List).updateIn 同理 
  * alpha.updateIn(['a', 'b', 1], (v) => v+99 ) // 查找alpha对象中“a”属性中的"b"属性中的第"1"位

* Map(List).withMutations(类似vue中的watch)，无返回值，方便进行业务逻辑。但始终只会执行一次。
```js
const list1 = List(['a', 'b', Map({x: 0, y: 1})])
list1.get(2).withMutations((map) => {
  console.log(map)
  map.set('x', 1)
})
```

* Map.equals(Map) 对比map中的所有属性，若都一致，返回true

* List.push  思想与map差不多，都是即使是直接赋值过去的，也不影响原来的
  * const list1 = List([1, 2])
  * const list2 = list1.push(3, 4, 5)
  * list1.size === 2 true； list2.size === 5 true；

* Map.map 会直接修改属性值；join会直接将属性值拼接；flip会反转属性和属性值
  * const alpha = Map({ a: 1, b: 2, c: 3, d: 4 })
  * const upperCase = alpha.map((v, k) => k.toUpperCase())  // Map({ a: A, b: B, c: C, d: D })
  * const upperCase = alpha.map((v, k) => k.toUpperCase()).join()  // A,B,C,D
  * const flip = alpha.flip()  // Map({ 1: a, 2: b, c: 3, d: 4 })

* merge：浅merge，若存在一样属性名，且属性值都为对象，则直接覆盖，不会合并。 mergeDeep则为深merge，会合并
  * const map3 = map1.merge(map2)
  * map对象可以merge原生js对象，不会报错，会直接merge，返回的也是immutable对象，很智能

* concat: 同merge一样，也可以和原生js对象concat，返回的也是immutable对象

* Seq惰性对象，提高性能。可以将原生js对象转为immutable对象，但惰性强，不该执行时不执行，性能极高，只执行相关内容

* fromJS 会将原生js对象或数组，递归的转为immutable对象，每个节点都会转，深度转！object => Map; list => List

* “...”展开运算符不能直接用于immutable对象（Map），但可以展开immutable数组（List）

* is 与equals类似，写法不一样： `is(Map1, Map2)`

* Set 与原生set类似，不允许重复。 const set = Set().add(map1).has(map1)  // true

## mobx的使用
与redux的类似的产品，思想更接近vuex

### observable可观察状态
引入 `import {observable} from 'mobx'`
* map数据类型
  * 声明 `const map = observable.map({a: 1, b: 2})`
  * 设置 `map.set('a', 11)`
  * 获取 `map.get('a')`
  * 删除 `map.delete('a')`
  * 判断是否存在属性 `map.has('a')`

* object数据类型，添加观察底层采用ES6 proxy，和vue3响应式类似
  * 声明`const obj = observable({a: 1, b: 2})`
  * 修改`obj.a = 11`
  * 访问`console.log(obj.a, obj.b)`
* list数组
  * 声明`const arr = observable(['a', 'b', 'c', 'd'])`
  * 访问`console.log(arr[0], arr[10])`
  * 操作`arr.pop(); arr.push('e');`等等
* 基础类型
  * 声明`const num = observable.box(10); const str = observable.box('hello'); const bool = observable.box(true);`
  * 获得值`console.log(num.get(), str.get(), bool.get())`
  * 修改值`num.set(100); str.set('hi'); bool.set(false);`

### observable装饰器，一般用于类式组件
引入 `import {observable} from 'mobx'`
```js
class Store{
  @observable 
  arr = [];
  @observable obj = {a: 1};
  @observable map = new Map();
  @observable str = 'hello';
  @observable num = 123;
  @observable bool = false;
  @computed // couputed可用作装饰器
  get result_de(){
    return this.str + this.num;
  }  
}

const store = new Store();
const result = computed(()=>store.str + store.num);
result.observe((change)=>{
  console.log('result:', change);
})
//两次对store属性的修改都会引起result的变化
store.str = 'world';
store.num = 220;
```

### 响应
引入 `import {observable, computed, when} from 'mobx'`
* computed，与vue的计算属性类似。`@computed get result() {return this.str + this.num}`
* autorun 添加上observable之后，可以利用autorun来观察变量的变化，类似redux中的subscribe。但他会遵循js执行顺序，例如：将obj.x=100放在定义autorun的上面，那么就只会执行一次，打印100（mobx6版本以上有修改）
```js
import {observable, autorun} from 'mobx'
const obj = observable({a: 1, b: 2})
autorun(() => {
  console.log(obj.x)
  // 也会根据观察对象的变化而执行，若观察对象没变化，就不会执行
  // 会打印两次，0，100。变化一次就会执行一下。
})
obj.x = 100
```

* reaction `autorun` 的变种，赋予了更细粒度的控制。它接收两个函数参数，第一个定义了要追踪哪些数据，并要返回一个值，作为第二个参数的输入。且`reaction`不会直接运行，只有在数据表达式首次返回一个新值后才会运行。
```js
// Example-1
reaction(()=>[store.str, store.num], (arr)=>{
  console.log(arr.join('/'));
})
store.num = 220; store.str = 'world'; //相关变量变化时，才会第一次触发

// Example-2
reaction(() => {
  return store.x + store.y
}, (value) => {
  console.log(value)
})
store.x = 100
```

* when 类似短路运算符&&，第一个参数是函数，返回true或者false。第二个参数也是函数，代表副作用函数effect
```js
when(() => {
  return true // true代表观察，当下个参数中的相关变量改变时，给定的effect才会触发。false不会。
}, () => {
  console.log(store.x)
})
```

### 改变 observables状态
* `action` 类似vuex的mutation
* `action.bound` 可以用来自动地将动作绑定到目标对象。在外部函数中调用时，可以防止this指向变化
```js
class Store{
  @observable str = 'hello';
  @observable num = 123;

  @action bar(){
    this.str = 'world';
    this.num = 40;
  }

  //this 永远都是正确的
  @action.bound foo(){
    this.str = 'world';
    this.num = 40;
  }
}
const store = new Store();

//调用action，只会执行一次
store.bar();
setInterval(store.foo, 1000)
```
* `runInAction` 能更好的处理异步函数。
它不是要替代 action，而是填补了 action 在异步和灵活更新场景中的不足，两者配合使用才能发挥MobX的最大威力。
在严格模式下，所有状态修改必须在 action 内进行，异步回调默认不在 action 上下文中，所以为了多次用action装饰器，则采用runInAction。
```js
import { observable, runInAction } from 'mobx';

class Store {
  @observable data = null;
  @observable loading = false;
  @observable error = null;

  // --------------------------------------- 尝试只用 @action ---------------------------------------
  @action
  async fetchData() {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch('/api/data'); // ← 这里开始异步
      this.data = await response.json(); // ← 警告！已不在action上下文中
      this.loading = false;
    } catch (err) {
      this.error = err; // ← 警告！
      this.loading = false; // ← 警告！
    }
  }

  // --------------------------------------- 你可能会尝试这样修复 ---------------------------------------
  @action
  async fetchData() {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      // 需要再定义一个action方法
      this.setData(data);
    } catch (err) {
      this.setError(err);
    }
  }

  @action setData(data) { /*...*/ }
  @action setError(err) { /*...*/ }

  // --------------------------------------- runInAction的优雅解法 --------------------------------------
  async fetchData() {
  runInAction(() => {
    this.loading = true;
    this.error = null;
  });
  
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    runInAction(() => {
      this.data = data;
      this.loading = false;
    });
  } catch (err) {
    runInAction(() => {
      this.error = err;
      this.loading = false;
    });
  }
}
  // --------------------------------------- 它也是第三方回调中的救星 ---------------------------------------
  setupUpload() {
    thirdPartyUploader.onProgress((percent) => {
      this.progress = percent; // ← 警告！不在action中
    });
  }

  setupUpload() {
    thirdPartyUploader.onProgress((percent) => {
      runInAction(() => {
        this.progress = percent;
      });
    });
  }

}
```


## react-router

### 基础用法与switch
```js
import { Route, Link, Switch } from 'react-router-dom'
const Topics = (props) => {
  let { url } = props.match
  // 这样解构出props.match.url是表示取到当前路由地址的上层路由地址。
  return (
    <>
      <h1>Topics</h1>
      <hr/>
      <ul>
        <li><Link to={`${url}/rendering`}>Rendering</Link></li>
        <li><Link to={`${url}/components`}>Components</Link></li>
        <li><Link to={`${url}/propsstate`}>Props v. State</Link></li>
      </ul>
      <Route path={`${url}/rendering`} component={Rendering}></Route>
      <Route path={`${url}/components`} component={Components}></Route>
      <Route path={`${url}/propsstate`} component={PropsState}></Route>
    </>
  )
}
export default class Nesting extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">home</Link></li>
          <li><Link to="/topics/rendering">topics</Link></li>
        </ul>
        {/* 不加switch为包容性路由 */}
        <Switch>
          {/* 加了switch为排他性路由 */}
          {/* 加了switch之后，加载了默认的之后就不会再加载其他路由了
          可以将特殊性的路由放在上面优先加载，将一般性的路由放在下面 */}
          <Route path="/topics" component={Topics}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </div>
    )
  }
}
```

### NavLink render children 
* NavLink作为Link的替代品。高亮时会添加上默认的class名active，方便自定义样式，也可以写activeClassName给高亮时定义一个自定义的class名
`li><NavLink activeClassName='active_custom' to="/about">About</NavLink></li>`
* render、children、component
  * render与children只接收函数式写法，函数需要把props传入组件中，这样组件内可以正常获取props `this.props`
  ```js
  <Route path="/about" render={props=><About {...props}/>}></Route>
  <Route path="/dashbord" children={props => <DashBord {...props}/>}></Route>
  ```
  * component可接收函数式，也接收类式
  * children无论路由是否匹配，均会渲染，render则和component一样，匹配才会渲染。但是switch会打断该个性，严格的唯一性匹配

### withRouter装饰器
如果在某个组件的props中获取不到路由信息，例如某些组件不是通过路由渲染出来的，`<Route path="/" component={Home}></Route>` Home组件就是直接通过路由渲染的。而直接`<Home/>`就不是。
则需要用withRouter装饰器状态提升一下，方可获取，通常用在类组件中
```js
@withRouter
class Home extends Component {render(){}}
```

但是装饰器无法直接放在函数组件上方装饰函数式组件，只能通过高阶组件的方式进行状态提升
const Home = withRouter((props) => (<div>Home</div>))

### Redirect
`<Redirect from="/" to="/home"></Redirect>` 当访问“/”时，重定向到“/home”
`<Redirect to="/login"></Redirect>` 可以适当加一些逻辑，即无论访问哪个页面，只要没权限，都跳到登录。

参数to，支持写一个object
`<Redirect to={{pathname:'/login', state: { from: pathname }}}></Redirect>`
```js
<Redirect
  to={{
    pathname: "/login",
    search: "?utm=your+face",
    state: { referrer: currentLocation }
  }}
/>
```
state相当于多传了一个参数，同时会被埋在this.props.location里，

### history.push
let history = this.props.history
history.push('path') 实现路由跳转

### useLocation useParams useHistory useRouteMatch
useLocation: 可获取this.props.location，仅在函数式组件中使用
useHistory: 可获取this.props.history
useParams： 可获取动态路由的传参。例如：`<Route path='/about/:id'>` 此时就可以通过const { id } = useParams获取id这个参数
useRouteMatch: 可精确获取当前匹配的url，若路由定义的是/a，实际进入的是/a/b，那么精确获取的let { url } = useRouteMatch()，这个url是/a

### 传参
* 通过动态路由，参考useParams使用
* 参数to用对象的方式
  ```js
  to={{
    pathname: "/login",
    state: { referrer: currentLocation }
  }}
  ```
  然后通过const { state: {id} } = useLocation()
* 通过url传参 `<NavLink to="/search?id=14">search</NavLink>` let { search } = useLocation()

### 404
```js
<Switch>
  <Route path="/about/:id">
    <About></About>
  </Route>
  <Route path="/search">
    <Search></Search>
  </Route>
  <Redirect exact from ="/" to={{pathname: '/home', state: {id: 13}}}></Redirect>
  <Route path="*">
    <Page404></Page404>
  </Route>
</Switch>
```

## React.lazy()
懒加载模块，要配合React.Suspense使用

## React Hooks
* useState
```js
  let [count, setCount] = useState({count: 1})
  setCount(2)
  setCount(() => count+1)
  setCount((count) => {
    return count + 1
  })
```

* useEffect
```js
  let [count, setCount] = useState({count: 1})
  useEffect(() => {}) // mount + update
  useEffect(() => {}, []) // mount
  useEffect(() => {}, [count]) // mount + watch(count)
  useEffect(() => { // mount + unmount
    console.log('mount')
    return () => {
      console.log('unmount')
    }
  }, [])


  function loadData () {
    fetch('url').then(res => res.json()).then(result => result)
  }
  function loadDataReturn () {
    return fetch('url').then(res => res.json()).then(result => result)
  }
  useEffect(() => { // 当副作用函数loadData是采用return的写法，返回一个promise时，在useEffect中调用时，需要用一个自执行函数包裹一下。若没有return，则不需要自执行函数包裹。
    ;(async() => {
      await loadDataReturn()
    })()
    loadData()
  }, [])
```

* useContext
```js
import React, { createContext, useContext } from 'react'

let nameContext = createContext({name: 'zhangsan'})
let ageContext = createContext({age: 12})

export default function UseContext() {
  let name = useContext(nameContext)
  let age = useContext(ageContext)
  return (
    <div>
      {name.name} {age.age}
    </div>
  )
}
```

* useReducer react-redux的简化
```js
import React, { useReducer } from "react";
const initialState = {
  count: 0
};
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload };
    case "decrement":
      return { count: state.count - action.payload };
    default:
      throw new Error();
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
        +
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: 5 })}>
        -
      </button>
    </>
  );
}
```

* useCallback 记忆函数
为了防止父组件刷新，导致子组件也刷新而导致的性能浪费。
比如类组件中的render，父组件往下传递了一些props和函数。当父组件状态改变时，即使是和子组件不相关的状态，也会导致子组件重复渲染，同时每次render也会产生一次新地址的props和对应函数。
当然可以将向子组件传的参数和函数，都抽离为一个对象。但函数式组件整个组件相当于都是render和class组件的语法糖。所以无论是否抽离出去，都会重复渲染。所以要使用useCallback
具体去看react-markdown吧。
它需要搭配React.memo使用，一般都是搭配函数式组件使用
```js
import React, { useState, useCallback, memo } from 'react'

const Child = memo(function(props) {
  console.log('child run...')
  return (
    <>
      <h1>hello</h1>
      <button onClick={props.onAdd}>add</button>
    </>
  )
}, () => {
   /* memo缓存，接收两个参数，第一个就是组件本身。
   第二个为业务逻辑，可写可不写，return一个true或者false。为true的话，硬性缓存，即使父组件不使用useCallback包裹，甚至改的prop是与子组件相关的，也会导致子组件不被渲染
   类似shouldComponentUpdate() */
   return true
})

export default function UseCallback() {
  console.log('parent run...')
  let [ count, setCount ] = useState(0)

  const handleAdd = useCallback(
    () => {
      console.log('added.')
    },
    []
    // 第二个参数传入一个数组，数组中的每一项一旦值或者引用发生改变，useCallback 就会重新返回一个新的记忆函数提供给后面进行渲染。
  )

  return (
    <div>
      <div>{count}</div>
      <Child onAdd={handleAdd}></Child>
      <button onClick={() => setCount(100)}>change count</button>
      {/* 修改count和子组件child无关，但是如果不使用memo，则改变count时，也会使子组件渲染。 */}
    </div>
  )
}
```

* useMemo
useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的。
`useCallback(fn, inputs) === useMemo(() => fn, inputs).`
例如上个例子中的useCallback可改为
```js
  const handleAdd = useMemo(() => {
    return () => {
      console.log('added.')
    }
  },[])
```

唯一的区别是：**useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你。**所以在前面的例子中，可以返回 handleClick 来达到存储函数的目的。
所以 useCallback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而 useMemo 更适合经过函数计算得到一个确定的值，比如记忆组件。
不推荐本来是useMemo的写法，改成useCallback

* useRef 与createRef一样，获取dom用的。除此之外，还可以规避函数式组件的特性Capture Value。
```js
const bt = useRef()
<button ref={bt}/> // bt.current

// 利用 useRef 就可以绕过 Capture Value 的特性。
const [count, setCount] = useState(0)
// Capture Value 特性：在函数组件中特有的。有一个状态count默认为0，先点击增加count+1，后点击减少button-1，3秒后先log 1，后log 0，而不是log两次0。就类似打印了整个过程，而不是最终的结果
// 可以认为 ref 在所有 Render 过程中保持着唯一引用，因此所有对 ref 的赋值或取值，拿到的都只有一个最终状态，而不会在每个 Render 间存在隔离。
const count = useRef(0)
// 这样定义的状态，然后需要通过原生JS去修改count.current的值后，就可以规避Capture Value的渲染过程特性，而直接拿到最终状态
```

* useImperativeHandle 传递ref
```js
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

function ChildInputComponent(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current); // 将本组件中的inputRef和父组件中的ref绑定在一起
  return <input type="text" name="child input" ref={inputRef} />;
}

const ChildInput = forwardRef(ChildInputComponent);

function App() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div>
      <ChildInput ref={inputRef} />
      {/* 正常来讲ref是传不到子组件中的，需要用forwardRef传递一下，再在子组件中用useImperativeHandle接收一下 */}
    </div>
  );
}
```

* useLayoutEffect 同步执行副作用
大部分情况下，使用 useEffect 就可以帮我们处理组件的副作用，但是如果想要同步调用一些副作用，比如对 DOM 的操作，就需要使用 useLayoutEffect，useLayoutEffect 中的副作用会在 DOM 更新之后同步执行。而不是在整个页面渲染完成后才执行。

**useEffect和useLayoutEffect有什么区别？**
  * 简单来说就是调用时机不同，`useLayoutEffect`和原来`componentDidMount`&`componentDidUpdate`一致，在react完成DOM更新后马上同步调用的代码，会阻塞页面渲染。而`useEffect`是会在整个页面渲染完才会调用的代码。
  * 官方建议优先使用`useEffect`
  * 在实际使用时如果想避免**页面抖动**（在`useEffect`里修改DOM很有可能出现）的话，可以把需要操作DOM的代码放在`useLayoutEffect`里。
  * 就好比在`useEffect`中改了DOM，极有可能页面在前一帧渲染了修改前的样子，下一帧就直接调到期望修改后的样子。，即页面抖动。
  * 不过`useLayoutEffect`在服务端渲染时会出现一个warning，要消除的话得用`useEffect`代替或者推迟渲染时机。

* 自定义hooks 主要是用来分离业务逻辑的
```js
import { useState, useEffect } from 'react'
const useDataList = function(id) {
  let [list, setList] = useState([])

  useEffect(() => {
    setTimeout(() => {
      id === 1 ? setList(['a', 'b', 'c']) : setList(['d', 'e', 'f'])
    }, 1000)

    return () => {
      // cleanup
    }
  }, [])

  return list
}

export default useDataList
```

## memoization
和React.memo类似，不过memo缓存的是组件（函数式），而memoization缓存的是函数，并且可以顺便作为vue的计算属性来使用。
```js
import React, { useState } from 'react'
import memoize from 'memoize-one'

// 在函数式的组件里，将memoize放到组件外。
// 因为函数式组件相当于是class组件与render的语法糖，若放在函数组件里，每次定义都相当于触发了一次render，render里的方法全部会被重新定义一次。
const getNewString = memoize((str) => {
  console.log('change') // 只有str，也就是props.title改变的时候，才会触发这个函数
  return str + 'world!'
})

const Child = function(props) {  

  return (
    <div>
      <h1>Child</h1>
      {getNewString(props.title)}
    </div>
  )
}

export default function Memoization() {
  let [title, setTitle] = useState('hello')
  let [count, setCount] = useState(0)

  return (
    <div>
      <div>{count}</div>
      <Child title={title}></Child>
      <button onClick={() => setTitle('hello+')}>change</button>
      <button onClick={() => setCount(100)}>change2</button>
    </div>
  )
}

```

## gogocode