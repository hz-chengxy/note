# vue3里model的使用

# vue3定义属性的两种方式
reactive定义的属性是一个对象，ref主要是一个值，包括一段字符串或者一个数值。据官方解释，ref的本质也是reactive，为了方便开发者直接调用一层ref，不通过调用reactive对象中的某个值，方便观察变化。
另外，reactive在js里调用不需要加value，而直接调用定义过得ref，需要加value。但在template也直接调用即可，不需要写value。
## reactive
```vue
<script>
    import {reactive} from 'vue'
    export default {
        setup(){
            const message = reactive({
                title:''
            })

            return {
                message
            }
        }
    }
</script>
```

标准写法如上，如要获取reactive的值只需{{ message.title }},如果写了setup语法糖，就不需要写setup了，也不用return出去就可以直接用

### 在项目中遇到的监听reactive的问题 (reactive数据类型不要改变其地址，否则监听不到变化)
在watch监听reactive数据的变化时，直接改变reactive属性的地址时，比如reactive.arr = [],如此操作后数据的地址发生变化，导致watch即使加上了deep属性，也获取不到变化，需要reactive.arr.length = 0等不改变对象数组地址的方法来改变数据，才能让watch监听到

### 优雅的初始化reactive类型的数据
优雅的初始化reactive类型的数据，因为reactive类型的数据如果动了数据地址，则不再能响应式改变视图，所以才有了以下方法，但是有一处弊端，目前仅支持初始化其内部的所有属性都是同一类型的数据。(后续可以再优化。)
```js
const clear = (clearObj) => {
  const keys = Object.keys(clearObj);
  let obj: { [name: string]: string } = {};
  keys.forEach((item) => {
    obj[item] = "";
  });
  Object.assign(clearObj, obj);
};
```

## ref
```vue
<template>{{keywords}}</template>
<script>
    import { ref, reactive} from 'vue'
    export default {
        setup(){
            const keywords = ref("hello")
            onMounted(() => {
                console.log(keywords.value)
            })

            return {
                keywords
            }
        }
    }
</script>
```

# toRef  toRefs
两者都是将非响应式的数据转换为响应式的，大多情况均用在reactive类型的数据。因为reactive整体是一个响应式的对象，但从中取出的所有属性值、或者展开对象，会让数丢失相应的能力。
```js
import {reactive} from 'vue'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 18
    });
    return {
      name: person.name,
      age: person.age
    }
    // 或者用展开运算符
    return {
      ...person
    }
    // 以上两种写法都会让person中的属性丢失响应
  }
}
```

## toRef
toRef可以让某个属性转变为响应式数据
```js
import {reactive, toRef} from 'vue'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 18
    });
    return {
      name: toRef(person, 'name'),
      age: toRef(person, 'age')
    }
  }
}
```

## toRefs
展开响应式对象时，想使用reactive中的多个或者所有属性作为响应式数据时。可在函数返回响应式对象时，使用toRefs。
```js
import {reactive, toRef} from 'vue'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 18
    });
    return {
      ...toRefs(person)
    }
  }
}
```

# setup语法糖
## defineProps
```js 三种写法
* defineProps<{ msg: string }>()  //无需引入，直接调用msg就能获取
* const props = defineProps<{
  formData: {
    siteName: string
    channel: string
    date: string
    options: Array<object>
    bmList: Array<object>
    selectedOption: {
      bm: string
      bc: string
    }
  }
  articleInfo: {
    detailType: string
    currArtcleId: string
  }
}>()  //拿props接受的写法
* const props = defineProps(["defaultInfo"])
```

## defineEmits
在父组件中传递方法addNumb
`<my-component @addNumb="func" @getDetailInfo="numb(detailInfoTo)"></my-component>`
在子组件中接受并调用
```js
const emit = defineEmits(['addNumb']);
const onClickButton = ()=>{
    //emit(父组件中的自定义方法,参数一,参数二,...)
    emit("addNumb");
}
```
或者(该写法待确定)
```js
const emit = defineEmits<{
  (
    e: 'getDetailInfo',
    detailInfoTo: {
      detailType: string
      currArtcleId: string
    }
  ): void
}>()
```

## defineExpose
子组件暴露变量，在父组件中获取。方法应该也是同理
```js 子
let numb = ref(0);
//暴露出子组件中的属性
defineExpose({
    numb 
})
```

```js 父
<my-comp ref="myComponent"></my-comp>
import {ref,onMounted} from 'vue';
//注册ref，获取组件
const myComponent = ref();

//注意：在生命周期中使用或事件中使用都可以获取到值，
//但在setup中立即使用为undefined
console.log(myComponent.value.numb)  //undefined
const init = ()=>{
    console.log(myComponent.value.numb)  //undefined
}
init()
onMounted(()=>{
    console.log(myComponent.value.numb)  //0
})

```

# onMounted与各种指令
## onMounted与v-for
在vue3中v-for已经不需要加key，框架已经会自动生成一个唯一的key值
```vue
<template>
    <ul>
        <li v-for="item in state.list">{{item}}</li>
    </ul>
</template>
<script>
    import {reactive,onMounted} from 'vue'
    export default {
        setup(){
            const state = reactive({
                list:[]
            })
            onMounted(() => {
                fetch(./data.json).then(res => {
                    state.list = res
                })
            })

            return {
                state
            }
        }
    }
</script>
```

## watch 写法
### 监听整个对象
其第一个参数是直接传入要监听的对象。当监听整个对象时，只要这个对象有任何修改，那么就会触发 watch 方法。无论是其子属性变更（如 demo.name），还是孙属性变更（如 demo.soulmate.name）...，都是会触发 watch 方法的。
```js
watch(demo, (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
```

### 监听对象的所有属性
这个相当于监听整个对象（效果与上面的第一种相同）。但是实现方式与上面第一种是不一样的，这里我们可以看到，第一个参数是箭头函数，并且还多了第三个参数 { deep: true }。当加上了第三个参数 { deep: true }，那么就不仅仅是监听对象的子属性了，它还会监听 孙属性，曾孙属性 ...

通常要实现监听对象的所有属性，我们都会采用上面第一种方法，原因无他，第一种编码简单，第一个参数直接传入 demo 即可。
```js
watch(() => demo, (newValue, oldValue) => {
	console.log('watch 已触发', newValue)
}, { deep: true })
```

### 监听对象中的某个属性
```js
watch(() => demo.name, (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
```

### 只监听对象的子属性
这种情况，只有当 demo 的子属性发生变更时才会触发 watch 方法。孙属性，曾孙属性... 发生变更都不会触发 watch 方法。也就是说，当你修改 demo.soulmate.name 或者 demo.soulmate.nickName 时是不会触发 watch 方法的。
```js
watch(() => ({ ...demo }), (newValue, oldValue) => {
    console.log('watch 已触发', newValue)
})
```

### 组合监听
```js
watch(
  () => [
    demo.child1,
    demo.child2,
    demo.child3,
  ],
  ([newValue, newTime,newData],[oldValue,oldTime,oldData]) => {
    console.log()
  },
  {
    immediate: true,
    deep: true,
  }
);
``` 

## watch与watchEffect
1、watch 是惰性执行，而 watchEffect 不是，不考虑 watch 的第三个参数配置的情况，watch 在组件第一次执行的时候是不会执行的，只有在之后依赖项变化的时候再执行，且当监听的是多个数据源时，即使多个数据同时变化，watch也只会执行一次。而 watchEffect 是在程序执行到此处的时候就立即执行，而后再响应其依赖变化执行。
2、watch 一般传入两个参数，第一个参数是说明什么状态应该触发侦听器重新运行，第二个参数定义侦听器回调函数，并且该回调函数还可以接受两个参数，指向状态变化前后的值，这样我们就可以看到状态前后的变化，而在 watchEffect 则看不到，并且也不能像 watch 那样在第一个参数更具体地定义依赖项。
3、watch 只能监听响应性数据 reactive 和 ref 定义的值，若要监听一个单一的值，需要传递相应值的 getter 函数，而 watchEffect 不能监听 reactive 和 ref 定义的值，只能监听其对应的具体的值（即reactive对象中的属性）。

### 针对第三点区别的示例
#### 整体监听reactive数据
```js 监听reactive定义的值,watch会响应state的变化执行，但初始并未执行；watchEffect仅在组件第一次加载时执行，之后不会响应
const state = reactive({ count: 0, attr: { name: "" } });
watch(state, (post, pre) => {
    console.log(post);
    console.log(pre);
    console.log("watch 执行了");
});

watchEffect(() => {
    console.log("watchEffect 执行了");
    console.log(state);
});

const clickEvent = () => {
    state.count++;
};

```

#### 整体监听ref数据
```js watch 可以响应 ref 定义的值，而 watchEffect 则不能。
const count = ref(0);
watch(count, (post, pre) => {
    console.log("watch 执行了");
    console.log(post);
    console.log(pre);
});

watchEffect(() => {
  console.log("watchEffect 执行了");
  console.log(count);
});

const clickEvent = () => {
    count.value++;
};
```

#### watch 和 watchEffect 响应单一值的变化
```js 第一种写法的watch肯定检测不到变化，但这是写法的问题，换成第二种写法的箭头函数可以检测到(目的是：需要给第一个参数传入 getter 函数)；但是watchEffect可以。
const state = reactive({ count: 0 });
watch(state.count, (post, pre) => {
    console.log("watch 执行了");
    console.log(post);
    console.log(pre);
});

watch(
    () => state.count,
    (post, pre) => {
        console.log("watch 执行了");
        console.log(post);
        console.log(pre);
    }
);

watchEffect(() => {
    console.log("watchEffect 执行了");
    console.log(state.count);
});

const clickEvent = () => {
    state.count++;
};
```

## $nextTick用法
```js
import {nextTick} from "vue"
nextTick(() => {
  // something
})
```
同时nextTick函数也可以作为异步函数，可以await，即等待页面渲染完成后再执行后续操作。
比如有如下需求：在使用element的轮播图时，自定义了轮播图的底部导航和左右轮播按钮，而每次数据变化时需要调用carousel定义的方法setActiveItem。但是有一个问题，数据变化后，页面未渲染完成时，是轮播图组件也未出现，那么执行setActiveItem方法时会报错，那么就需要用到nextTick
```js
/* bannerData就是轮播图需要的数据。infoBanner.value就代表着获取的carousel，它带了setActiveItem方法。 */
watch(
  () => props.bannerData,
  async (newTotal) => {
    if (!newTotal) return;
    await nextTick();
    if (infoBanner.value) infoBanner.value.setActiveItem(0);
  },
  { immediate: true, deep: true }
);
```

# vuex的使用
首先下载安装，并在main.js中引入
import store from './store/index.js'

```js 定义index.js 引入多模块
import { createStore } from 'vuex'
import spreadDetail from './modules/spreadDetail'
import mediaMatrixDetail from './modules/mediaMatrixDetail'
import evaluate from './modules/evaluate'

export default createStore({
  state: {},
  mutations: {},
  modules: {
    spreadDetail,
    mediaMatrixDetail,
    evaluate,
  },
})
```

```js 各个模块的写法，不需要createStore
import axios from "axios"
export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        requestAppData({ state, commit },data) {
            axios.get("/bigscreen/mtjz-app.json").then((res) => {
                if (res.data.data) {
                    if (res.data.data.newData && res.data.data.newData.length > 0) {
                        commit('setAppData', res.data.data.newData[0])
                    } else {
                        commit('setAppData', res.data.data.oldData[0])
                    }
                }
            })
        },
    }
}
```

```js 在vue中引入
import {useStore} from "vuex"
const store = useStore()

console.log(store.state.x)
console.log(store.state.module.x)

store.commit('setValue',data)
store.commit('module/setValue',data)

store.dispatch('setValue',data)
store.dispatch('module/setValue',data)
```

# vue3引入echarts 或 定义全局方法
## 引入echarts 与 调用
在main.js中引入
```js 引入
import * as echarts from 'echarts'
const app = createApp(App);
app.config.globalProperties.$echarts = echarts
app.mount('#app');
```

```js 调用
import { getCurrentInstance } from "vue";
const echarts = getCurrentInstance()!.appContext.config.globalProperties.$echarts;
```

## 定义全局方法
```js 定义
app.config.globalProperties.$iconfontCode = function (m: string) {}
```

```js 调用
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;
proxy.$iconfontCode()
```

引入axios也是同理
```js
import axios from 'axios'
app.config.globalProperties.$axios = axios

const { proxy } = getCurrentInstance() as any;
proxy.$axios
```

# vue3 $slot用法
## 配置component直接渲染
想通过$slot实现插槽名称、数量不定，编程式获取所有插槽的内容，可以通过$slot获取到所有的内容。在子组件中，$slots.slotName() slotName这是一个方法 返回的是数组，基本包含了所有的参数，甚至配合component就可以直接渲染
```vue
<!-- 父组件，传递一个search的插槽 -->
<template  #search>
  <el-input v-model="searchForm.name" label="name" ></el-input>
  <el-input v-model="searchForm.Activity" label="Activity" ></el-input>
  <el-input v-model="searchForm.age" label="age" ></el-input>
</template>

<!-- 子组件通过执行$slot.search()，再配合component就可以直接渲染 -->
<template>
  <el-col :span="defaultSpan" v-for="(item, index) in $slots.search()" :key="index">
    <el-form-item :label="item.props?.label">
      <component :is="item"></component>
    </el-form-item>
  </el-col>
</template>
```
## 更加灵活的，获取参数等信息，自由渲染内容
```vue
<!-- 父组件传递一个插槽，这个插槽是有传参的，那么在子组件中执行$slot['append-page-left']方法时，就也要带着这个参数 -->
<template v-slot:append-page-left="{selected}">
  <el-button size="mini" type="primary" @click="fn" buttonLabel="按钮文字">按钮文字</el-button>
  <el-button size="mini" @click="fn">按钮文字</el-button>
  <el-button size="mini" @click="fn">按钮文字</el-button>
</template>
```

```vue
<!-- 如何获取这些button呢？ -->
<script>
const obtainSlotsProp() => {
  let list = []
  const appendLeft = this.$slot['append-page-left']
  if (typeof appendLeft === 'function') {
    console.log(appendLeft({selected: this.selected})) // 执行的时候要带上参数
    list = appendLeft({selected: this.selected}).map(item => {
      console.log(item) // item即为父组件中每个button，props中存着传进来的每个参数
      /* 那么如何获取按钮中的按钮文字了，可以向第一个按钮一样，存在一个prop中，但这可能得一个一个页面的改，如果不想改动单个页面，可以继续仔细找找item的参数 */
      console.log(item.children.default) // 这个default相当眼熟，也是一个方法，和$slot.slotName这个方法简直太过于相似了！那么执行看看
      console.log(item.children.default()[0].children) // 他执行完之后，就可以找到children里，存了按钮的文字，也很形象，相当于el-button的子元素。
      const text = item.children.default()[0].children
      return ({
        text,
        prop: item.props
      })
    })
  }
  return list
} 
</script>
```

# vue3自定义hooks(分隔业务逻辑)
```js 在主组件中引入hooks,并向里传参(假设setup语法糖)
import useForm from './useForm'
import useList from './useList'
let { state,handleClick } = useList()
let { keywords,handleEnter } = useForm(state)
```

```js 完整定义的一个hooks
import {ref} from "vue"
const useForm = (state) => {
  const keywords = ref('hello')
  
  const handleEnter = () => {
    state.list.push(keywords.value)
    keywords.value = ''
  }
}
export default useForm
```

# vue3中目前已知的ts写法
## 定义接口
```js
interface Book {
  title:string
  author:string
  [props:string]: any
}

interface Num {
  mediaNum: string | Number;
  spreadNum: string | Number;
  mediaArr: Array<string>;
  spreadArr: Array<string>;
}

data() {
  return {
    title:'',
    author:'',
    year:2000
  } as Book
}
```
其中[props:string]: any 是可索引接口：是对 对象或数组的约束

## 可索引接口
### 对数组的约束
```js
interface UserArr{
  [index:number]:string;
}
var arr:UserArr = ['aa','bb']
```

### 对对象的约束
```js
interface UserObj{
  [index:string]:string
}
var arr:UserObj = {
  name:'123'
}
```

## computed验证、props验证
```js computed
computed:{
  title2(): string{
    return title.value + 'hello'
  }
}
```

```js props
import { PropType } from 'vue'
interface Book {
  title:string
  author:string
  year:number
}
const props = defineProps({
  message:{
    type:Object as PropType<Book>
  }
})
```

## reactive
```js
interface Book {
  title:string
  author?:string
  year?:number
}

const book = reactive<Book>{title:'Vue 3'}
```

## watch约束及在接口获取用于渲染视图数据的约束
### 视图
```js
interface Num {
  erji: Number;
  hexin: Number;
  numCount: Number;
  yiji: Number;
}
let selectArticleMedia = ref({} as Num);
```
之后在视图中用selectArticleMedia.erji便不会再报错，否则会变红，但不影响显示。

### watch
```js
interface idObj{
  zbGuid:string
}

watch(
  () => [selectArticle.value, articleDate.value],
  ([newIndex, newData]:[number,Array<idObj>]) => {
    if (newData[newIndex]) {
      requestMediaData(newData[newIndex].zbGuid);
    }
  }
);
```

