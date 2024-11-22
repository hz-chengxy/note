# css属性

## css划过出现禁止图标
`cursor: not-allowed;`

## 关于横向滚动的问题
目前看来横向滚动的元素不能浮动，且需要加white-space: nowrap;，最好的元素属性是行内块元素。

之前所采用的dom结构：
```html
<div style="width:实际页面显示的宽;height:实际页面显示的高;overflow-y:hidden;overflow-x:auto"> //
  <div style="width:实际内容的宽(至少要比实际页面宽)"> 可能是变量，示例如下。
  <div :style="{ width: 100 + 151 * currentChannel.length + 'px' }">  
    <div> //内容区
```

## 浮动元素水平居中
给浮动元素外套一个div，div设置为inline-block（宽度随内容变化变化），然后给div父元素个text-align:center。

## 文字换行问题
若内容中是中文字符，则设置宽度后可自动换行。若内容是纯英文字母，则需要单独设置{width: 100%;word-wrap:break-word;word-break: break-all;overflow-x: hidden;}

## 如果img没有外标签，想让其在有文字的div内水平居中且文字不居中
例：
```html
<div>
    fasfsa
    fasf
    <br>
    fds
    <img src=''>
</div>
```
可以给图片display:block,margin:0 auto

## 元素的内容应该如何去适应指定容器的高度与宽度
object-fit：contain  ：图片在父容器内横向或纵向等比例增大，至少顶满一个方向（保持原有尺寸比例。内容被缩放）。

## 自定义滚动条样式
```css
.test-1::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

.test-1::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
}

.test-1::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
}
```

```css
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #fafafa;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgb(191, 191, 191);
}

/* 较新的 API */
body {
  scrollbar-width: thin;
  scrollbar-color: #718096 #edf2f7;
}
```


# css选择器
## last-child与last-of-type
p:last-child用于选择属于其父元素最后一个子元素中所有的p元素。当最后一个元素不是p元素，就无法选中，改成p:last-of-type即可

## 伪类选择器的使用
```css
:nth-child(2n) 选取偶数标签，2n也可以是even
:nth-child(2n-1) 选取奇数标签，2n-1可以是odd
:nth-child(3n+1) 自定义选取标签，3n+1表示“隔二取一”
:nth-child(n+4) 选取大于等于4标签
:nth-child(-n+4) 选取小于等于4标签
:last-child 选取最后一个标签
:nth-last-child(3) 选取倒数第几个标签,3表示选取第3个
:nth-last-child(-n+3) 选取最后三个元素
```

```css 选中最后几个元素
// 前三个
li:nth-child(-n + 3) {
  text-decoration: underline;
}

// 选中 2-5 的列表项
li:nth-child(n + 2):nth-child(-n + 5) {
  color: #2563eb;
}

// 倒数两个
li:nth-last-child(-n + 2) {
  text-decoration-line: line-through;
}

作者：晓得迷路了
链接：https://juejin.cn/post/7371312967781777418
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## 清除浮动
```css
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
```

## 利用伪类元素画对钩
```css
.checkMark::before{
      content: '';
      width: 6px;
      height: 1px;
      background-color: #fff;
      position: absolute;
      top: 10px;
      left: 2px;
      transform: rotate(45deg);
    }
    .checkMark::after{
      content: '';
      width: 11px;
      height: 1px;
      background-color: #fff;
      position: absolute;
      top: 8px;
      left: 5px;
      transform: rotate(-45deg);
    }
```
参考：https://blog.csdn.net/xt_XiTu/article/details/106851496

## 单行文本与多行文本换行
```css
/* 单行文本省略 */
overflow: hidden;
white-space: nowrap;
 /*文字超出宽度则显示ellipsis省略号*/
 text-overflow: ellipsis;

/* 多行文本省略 */
overflow: hidden;
display: -webkit-box;
 /*弹性伸缩盒子*/
-webkit-box-orient: vertical;
/*子元素垂直排列*/
-webkit-line-clamp: 2;
/*可以显示的行数，超出部分用...表示*/
 text-overflow: ellipsis;
/*（多行文本的情况下，用省略号“…”隐藏溢出范围的文本)*/
```