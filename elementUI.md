## elementPlus转中文模式
在vue3中用的elementplus默认英文，改变为中文模式
在main.js中
```js
import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App);
app.use(ElementPlus, { locale })
app.mount('#app');
```


## vue3 elementplus 轮播图问题，指示器显示出来了但是图片不出来。
el-carousel加载缓慢，如果点击下一个或者上一个按钮时，加载速度很快，否则需要等2秒左右才能显示。已经确定不是接口问题，后来各种百度才知道el-carousel会自动添加了一个空的数据
两种解决办法：
1、el-carousel-item v-for 遍历数值，显示的会非常快。
2、给el-carousel加个 v-if 判断carousel-item遍历的变量是否存在或者length是否大于0。

## button高亮
在css上设置el-button的高亮样式，伪类选择器不是:active
而是.el-button:focus

## 修改elementui默认样式
从dom中找到class名。
.el-table /deep/ .has-gutter tr th:nth-child(1)
/deep/前面是自己命名的class名，/deep/后是element生成的dom默认的class名
现在的写法是:deep(.el-carousel-item){}

或者直接在穿透的css里（即不加scope的），直接在element生成的dom默认class名下写样式，也可以生效，就是记得约束好父元素，因为这样穿透的css是全局生效的。

# el-table
## 设置表头样式
```html
<el-table-column
    :header-cell-style="{ background: 'rgb(49,125,215)', color: '#fff' }"
>
</el-table-column>
```

## 自定义表格内容的两种方式
### template
```vue
<template slot-scope="scope">
    {{
        connectMsg.ORIGINAL_TITLE == undefined
        ? (currentPage - 1) * 5 + (scope.$index + 1)
        : scope.$index == 0
        ? scope.row.isconnect
            ? "已关联"
            : "未关联"
        : (currentPage - 1) * 5 + scope.$index
    }}
</template>
```
scope参数会给很多渲染需要的数据，$index代表在当前表格的第几个数据，从0开始计数，scope.row代表渲染改行所用的数据，字段和每个每列字段一一对应,还有一个column用得不多。

### formatter函数
```html
<el-table-column
    prop="styleMark"
    label="体裁标记"
    width="200"
    show-overflow-tooltip
    :formatter="formatter"
>
</el-table-column>
```

```js
formatter(row, column) {
    var str = "";
    if (row.styleMark["1"]) {
        str +=
        "评论" +
        (row.styleMark["1"] == "评论" ? "" : "-" + row.styleMark["1"]);
    }
    if (row.styleMark["2"]) {
        str += "深度调研-" + row.styleMark["2"];
    }
    if (row.styleMark["3"]) {
        str += "专栏-" + row.styleMark["3"];
    }
    return str;
    }
},
```
如例，formatter函数(row,column)，有两个参数row,column。和scope的row，column字段是一个意思。
row是当行的数据，column是当前列的一些参数。


## elementui修改某一列或某一行样式

### 写css相关函数
```html
<el-table :cell-style="cellStyle">
```

```js
cellStyle ({ row, column, rowIndex, columnIndex }) {
    if (columnIndex == 0) {   //下表从0开始
    return "padding:2px;color:rgb(51,51,51);fontWeight:bold";
    } else {
    return "padding:2px";
    }
},
```

### 添加class名加样式，但对应样式需要穿透
```html
<el-table :cell-class-name="cellName">
```

```js
cellName ({ row, column, rowIndex, columnIndex }) {
    if (columnIndex == 0) {   //下表从0开始
    return "resAndSug";
    } else {
    return "";
    }
},
```

## elementui 表格序列自定义
```js
<template slot-scope="scope">
      {{ (currentPage - 1) *pageSize + (scope.$index + 1) }}
</template>
```

# notify message
## 不自动关闭，手动关闭的问题
```js
let n1 = this.$notify({
        title: "成功",
        message: "正在加载数据，请稍后..",
        type: "success",
        duration: 0,
      });
n1.close(),  
//需要用一个变量接住创建的notify实例，才能调用手动关闭函数，如果用this.$notify.close(),是默认新创建一个notify实例，则无法正常关闭。
```

# upload
## 自定义上传回调
```html
<el-upload ref="upload" :limit="1"
    :auto-upload="true"
    :http-request="uploadFile"
    accept='.xls,.xlsx'
    action="">
    <button slot="trigger">点击上传</button>
    </div>
</el-upload>
```

```js
uploadFile(params){
    console.log(file)
    let formData = new FormData();
    formData.append("file",params.file)
    this.axios.get()
}
```

## 自定义上传调用时机
```html
<el-upload ref="upload" :limit="1"
    :auto-upload="false"
    :http-request="uploadFile"
    ref="upload"
    accept='.xls,.xlsx'
    action="">
    <button slot="trigger">点击上传</button>
    <el-button @click="submitUpload">上传到服务器</el-button>
    </div>
</el-upload>
```

```js
submitUpload() {
    this.$refs.upload.submit();
},

uploadFile(params){
    console.log(file)
    let formData = new FormData();
    formData.append("file",params.file)
    this.axios.get()
}
```

## 验证表单多字段但不是全字段时，验证通过逻辑
```js
// 如果validateField验证通过，valid会返回空字符串''，如果不通过验证，会返回不通过的理由，是一个字符串。
this.validFieldList.length = 0
let validFields = ['user_name', 'cert_validity'] // 要验证的字段名称
this.$refs.form.validateField(validFields, (valid) => {
    if (!valid) {
        this.validFieldList.push(valid)
        if (this.validFieldList.length === validFields.length && this.validFieldList.every(item => item === '')) {
            console.log('验证通过')
        }
    } else {
        console.log('有字段不通过验证，不确定是几个')
    }
})
```

# el-table有合并行，且有斑马纹需求。不处理会导致合并行的斑马纹显示混乱。
```vue
<template>
    <el-table :data="tableData" ref="tableData" :row-class-name="tabRowClassName" :span-method="objectSpanMethod" :cell-class-name="cellClass" :stripe="false">
        <el-table-column  label="序号" width="60" align="center" prop="Nosort"></el-table-column>
    </el-table>
</template>

<script>
data () {
    return {
        tableData: []
    }
},
watch: {
    tableData: {
        handle (val) {
            this.getSpanArr(val)
        },
        immediate: true,
        deep: true
    }
}
methods: {
    // 第0行#fff 第一行#fafafa，以此循环。且如果有classStripe，加个span-row，为第一列即合并列的样式做准备
    tabRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
            return row.classStripe ? 'span-row fff' : 'fff'
        } else {
            return row.classStripe ? 'span-row fafafa' : 'fafafa'
        }
    },
    // 第1列的元素加'border-cell'
    cellClass ({columnIndex}) {
        if (columnIndex == 1) {
            return 'border-cell'
        }
    },
    isValidArray (arr) {
        if (arr.length <= 1) {
            return true
        }
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 2; j < arr.length; j++) {
                if (arr[i].cert_label === arr[j].cert_label) {
                    return false
                }
            }
        }
        return true
    }
    // 给数据加上rowspan，并根据cert_label字段来合并单元格，classStripe用来判断是否新加class
    getSpanArr (data) {
        data.forEach(v => {
            v.rowspan = 1
            v.classStripe = false
        })
        // 为了防止列表数据，不是以想要合并的字段排序的，做了以下函数防止死循环产生，但目前测试还有问题，待改正
        // if (!this.isValidArray(data)) return
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                // 根据这里的字段(cert_label)判断是否满足合并条件
                if (data[i].cert_label === data[j].cert_label) {
                    // 当前行rowspan+1 下一行-1
                    data[i].rowspan++
                    data[j].rowspan--
                    data[j].classStripe = data[i].classStripe
                } else {
                    data[j].classStripe = !data[i].classStripe
                }
            }
            i = i + data[i].rowspan - 1
        }
    }
    
    // 合并列，数字代表需要合并的列号，从0开始。
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
        if ([1].includes(columnIndex)) {
            return {
                rowspan: row.rowspan, // 合并的行数
                colspan: 1 // 合并的列数
            }
        }
    }

}
</script>

<style lang="scss" scope>
// 第一列先加个边框
:deep(.border-cell){
    border-left: 1px solid #ebeef5 !important;
    border-right: 1px solid #ebeef5 !important;
}
// 先统一加 #fafafa，实现基础的斑马纹
:deep(.fafafa){
    background-color: #fafafa;
}
// 再来单独处理第一行的，默认先给#fff，有span-row的则为#fafafa，单独实现合并列的斑马纹
:deep(.border-cell){
    background-color: #fff;
}
:deep(.span-row .border-cell){
    background-color: #fafafa;
}
</style>
```

# 统一修改表单验证的报错信息
```js
import Schema from 'async-validator'
Schema.message.required = fieldName => {
    return '该项为必填项'
}
```

# element自带了一个监听页面变化的插件，可以配合echarts的resize函数实时变化
```js
// vue3没有
import {addResizeListener, removeResizeListener} from 'element-ui/src/utils/resize-event' // vue2

//echarts 随窗口缩放而改变
mounted() {
    addResizeListener(this.$refs.chart, () => {
        this.myChart && this.myChart.resize()
    })
}
beforeDestroy() {
    removeResizeListener(this.$refs.charts)
}
```

vue3则借助了一个包"resize-observer-polyfill"

```js
import ResizeObserver from 'resize-observer-polyfill'

const isServer = typeof window === 'undefined'

const resizeHandler = function (entries) {
    for (let entry of entries) {
        const listeners = entry.target.__resizeListeners__ || []
        if (listeners.length) {
            listeners.forEach((fn) => {
                fn()
            })
        }
    }
}

export const addResizeListener = function (element, fn) {
    if (isServer) return
    if (!element.__resizeListeners__) {
        element.__resizeListeners__ = []
        element.__ro__ = new ResizeObserver(resizeHandler)
        element.__ro__.observe(element)
    }
    element.__resizeListeners__.push(fn)
}

export const removeResizeListener = function (element, fn) {
    if (!element || !element.__resizeListeners__) return
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
    if (!element.__resizeListeners__.length) {
        element.__ro__.disconnect()
    }
}
```

# elementplus 中新增了一个虚拟列表，用以解决数据量大的问题
该组件不太好用，特别是在有筛选或远程搜索的时候，输入了关键词后筛选出了可选择项。但当你有创建临时项的需求时，想把输入的字符作为一个表单数据选中，则必须要用鼠标点击，才能选中这个新的临时项。如果直接点击空白处即触发了blur，则这个select依然是空白的，没有选中。很不方便！
为此，做了一些小改造，可以blur触发选中。但是这样依然有些硬伤，比如，选中了一条数据，因为是可输入的嘛，很容易误导人从中间或该条数据的某处修改这条数据，但当光标聚焦的时候，会发现输入框会直接变为空，根本无法修改该条选中的数据，所以真想倒腾的话，自己找空自定义一个把。

```vue
<template>
    <el-select-v2 v-bind="$attrs" ref="elSelectV2" @blur="blurSelect">
        <template v-for="(slot) in computeSlot" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
        </template>
    </el-select-v2>
</template>

<script>
export default{
    name: 'wSelectV2',
    emit: ['blur'],
    computed: {
        computeSlot() {
            return Object.keys(this.$slots)
        }
    },
    methods: {
        blurSelect(e) {
            const value = this.$refs.elSelectV2.inputRef.value
            const list = this.$refs.elSelectV2.filteredOptions
            // fix:下拉框选择出错问题
            if(value && list && list.length && (!e || !e.relatedTarget || !e.relatedTarget.classList || !Array.from(e.relatedTarget.classList).includes('el-select-v2__popper'))){
                const checked = list.filter(item => item.filed === value[0]) // 根据filed字段判断，具体字段视情况而定
                checked && this.$refs.elSelectV2.onSelect(checked)
            }
            this.$emit('blur', e)
        }
    }
}
</script>
```
