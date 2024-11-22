## 接口写法
可以用于定义对象内各个属性的类型

### 普通写法
```ts
interface Num {
  mediaNum: string | Number;
  spreadNum: string | Number;
  mediaArr: Array<string>;
  spreadArr: Array<string>;
}
```

### 内置属性可有可无的写法
```ts
interface Video {
  IR_COVERPIC?: string;
  DOCTITLE?: string;
}
```

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
