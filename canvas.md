## 初始化
```js
//获取canvas对象
var canvas = document.querySelector("#canvas")
//定义canvas画笔
var ctx = canvas.getContext("2d")
```

## 绘制路径
### rect
ctx.rect('x','y','宽','高')

## 填充
### fillStyle 填充颜色
ctx.fillStyle = "red" 

### fill
ctx.fill() 填充路径

## 设置样式

### 描边 
ctx.strokeStyle = "red" //边(路径)颜色
ctx.lineWidth = 20 //边宽度
ctx.strock()

## 直线 lineTo
ctx.beginPath() //起始 最好声明

//设置绘制的起始点
ctx.moveTo(50,50)
//经过某个位置
ctx.lineTo(50,300)
ctx.lineTo(300,300)
ctx.lineTo(300,250)

ctx.closePath() //结束 最好声明

ctx.lineCap = "round" //起始路径的线段边缘设置为圆角
ctx.lineJoin = "round" // 两条线相交时，拐角为圆角
miterLimit

ctx.strokeStyle = "aqua" //边(路径)颜色
ctx.lineWidth = 10 //边宽度

ctx.strock()

## 圆 arc
ctx.arc(圆心x，圆心y，半径，起始角度，结束角度，是否是逆时针)
ctx.arc(300,300,100,0,Math.PI,false) 

ctx.strock()

## 文本 fillText
ctx..font = "50px 微软雅黑"

ctx.fillText("helloworld",100,100) //实体字体
ctx.strokeText("fsd",200,200) //镂空字体

### 弹幕滚动效果
var x = 600
setInterval(() => {
    ctx.clearRect(0,0,600,600) //清空画布 
    x-=10;
    ctx.fillText("helloworld",x,100)
    ctx.strokeText("fsd",x,200)
},10)

## 图像 drawImage
ctx.drawImage(图片对象,x,y)
ctx.drawImage(图片对象,x,y,宽度，高度)
ctx.drawImage(图片对象,图像裁剪的位置x，图像裁剪y的位置,x,y,宽度，高度)
var img =new Img()
img.src = "**"

img.onload = function(){
    ctx.drawImage(img,50,50)
}

## 视频
见视频图片

## 移动 translate
移动即是，会将整个坐标尺进行移动
ctx.translate(300,0) //水平坐标静态移动300

ctx.fillRect(100,100,300,100) 在100,100处绘制300宽100高的矩形

## 旋转 rotate
ctx.rotate(Math.PI/4)

## 缩放 scale
ctx.save() 保留缩放前的状态
ctx.scale(2,4) 水平缩放倍数，竖直缩放倍数

ctx.restore() 恢复保留的状态
ctx.scale(0.5,0.25) 缩放回来

## 静态时钟
`<canvas id="canvas" width="800" height="600"></canvas>`

```js
var canvas = document.querySelector("#canvas")
var ctx = canvas.getContext('2d')

cxt.save() //保留下原始画笔状态
cxt.translate(400,300) //将坐标移动到画布的中央
cxt.rotate(-2*Math.PI/4) // 不旋转的话时间相当于是从3点的刻度开始转的，所以要逆时针旋转90度
cxt.save() // 保存一下初始化圆心时的坐标系

//绘制表盘
ctx.beginPath()
ctx.arc(0,0,200,0,2*Math.PI)
ctx.strokeStyle="darkgrey"
ctx.lineWidth = 10
cxt.stroke() //绘制
ctx.closePath()


//绘制刻度
for(var i =0;i<12;i++){
    cxt.rotate(Math.PI/6) //2π/12
    cxt.beginPath()
    cxt.moveTo(180,0)  //首先画圆心右侧，数字3的刻度，因为和圆心是同一y轴，所以都是0，
    cxt.lineTo(200,0)  //半径是200，所以到200
    ctx.strokeStyle="darkgrey"
    cxt.stroke()
    cxt.closePath()
}
cxt.restore() //恢复到初始化圆心时的坐标系
cxt.save() //再保存一下当下初始化圆心时的坐标系

var time = new Date()
var hour = time.getHours()
var min = time.getMinutes()
var sec = time.getSeconds()
hour = hour > 12 ? hour - 12 : hour

//绘制秒针
cxt.beginPath()
//根据秒针的时间进行旋转
cxt.rotate(2*Math.PI/60 * sec)
cxt.moveTo(-30,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
cxt.lineTo(170,0)  
ctx.lineWidth = 2
ctx.strokeStyle="red"
cxt.stroke()
cxt.closePath()

cxt.restore()
cxt.save()

//绘制分针
cxt.beginPath()
//根据分针和秒针的时间进行旋转
cxt.rotate(2*Math.PI/60 * min + 2*Math.PI/60/60 * sec)
cxt.moveTo(-20,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
cxt.lineTo(150,0)  
ctx.lineWidth = 4
ctx.strokeStyle="darkblue"
cxt.stroke()
cxt.closePath()

cxt.restore()
cxt.save()

//绘制时针
cxt.beginPath()
//根据分针和秒针的时间进行旋转
cxt.rotate(2*Math.PI/12 * hour + 2*Math.PI/60/12 * min + 2*Math.PI/12/60/60 * sec)
cxt.moveTo(-10,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
cxt.lineTo(140,0)  
ctx.lineWidth = 6
ctx.strokeStyle="darkslategray"
cxt.stroke()
cxt.closePath()

cxt.restore()
cxt.save()

cxt.beginPath()
cxt.arc(0,0,10,0,2*Math,PI)
cxt.fillStyle = "deepsky"
cxt.fill()
cxt.closePath()

```

## 让你的时钟随时间变化
```js
function renderClock(){
    cxt.clearRect(0,0,800,600) //恢复画布初始状态
    cxt.save() //保留下原始画笔状态
    cxt.translate(400,300) //将坐标移动到画布的中央
    cxt.rotate(-2*Math.PI/4) // 不旋转的话时间相当于是从3点的刻度开始转的，所以要逆时针旋转90度
    cxt.save() // 保存一下初始化圆心时的坐标系

    //绘制表盘
    ctx.beginPath()
    ctx.arc(0,0,200,0,2*Math.PI)
    ctx.strokeStyle="darkgrey"
    ctx.lineWidth = 10
    cxt.stroke() //绘制
    ctx.closePath()


    //绘制刻度
    for(var i =0;i<12;i++){
        cxt.rotate(Math.PI/6) //2π/12
        cxt.beginPath()
        cxt.moveTo(180,0)  //首先画圆心右侧，数字3的刻度，因为和圆心是同一y轴，所以都是0，
        cxt.lineTo(200,0)  //半径是200，所以到200
        ctx.strokeStyle="darkgrey"
        cxt.stroke()
        cxt.closePath()
    }
    cxt.restore() //恢复到初始化圆心时的坐标系
    cxt.save() //再保存一下当下初始化圆心时的坐标系

    var time = new Date()
    var hour = time.getHours()
    var min = time.getMinutes()
    var sec = time.getSeconds()
    hour = hour > 12 ? hour - 12 : hour

    //绘制秒针
    cxt.beginPath()
    //根据秒针的时间进行旋转
    cxt.rotate(2*Math.PI/60 * sec)
    cxt.moveTo(-30,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
    cxt.lineTo(170,0)  
    ctx.lineWidth = 2
    ctx.strokeStyle="red"
    cxt.stroke()
    cxt.closePath()

    cxt.restore()
    cxt.save()

    //绘制分针
    cxt.beginPath()
    //根据分针和秒针的时间进行旋转
    cxt.rotate(2*Math.PI/60 * min + 2*Math.PI/60/60 * sec)
    cxt.moveTo(-20,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
    cxt.lineTo(150,0)  
    ctx.lineWidth = 4
    ctx.strokeStyle="darkblue"
    cxt.stroke()
    cxt.closePath()

    cxt.restore()
    cxt.save()

    //绘制时针
    cxt.beginPath()
    //根据分针和秒针的时间进行旋转
    cxt.rotate(2*Math.PI/12 * hour + 2*Math.PI/60/12 * min + 2*Math.PI/12/60/60 * sec)
    cxt.moveTo(-10,0)  //秒针从圆心的左侧一点点开始，不到半径处停止。
    cxt.lineTo(140,0)  
    ctx.lineWidth = 6
    ctx.strokeStyle="darkslategray"
    cxt.stroke()
    cxt.closePath()

    cxt.restore()

    cxt.beginPath()
    cxt.arc(0,0,10,0,2*Math,PI)
    cxt.fillStyle = "deepsky"
    cxt.fill()
    cxt.closePath()
    cxt.restore()
}

setInterval(function(){
    renderClock
},1000)
```
 
## globalCompositeOpeeration 设置或返回新图像如何绘制到已有的图像上
源图像 = 打算放置到画布上的绘图
目标图像 = 已经放置在画布上的绘图

### 准备两个矩形，分别为源图像和目标图像
```js
`<canvas id="canvas" width="800" height="600"></canvas>`

var canvas = document.querySelector("#canvas")
var ctx = canvas.getContext('2d')

//第一个红色矩形为目标图像
ctx.fillStyle = "hotpink"
ctx.fillRect(100,100,200,200)

ctx.globalCompositeOpeeration = "source-over"

//第二个蓝色矩形为源图像
ctx.fillStyle="deepskyblue"
ctx.fillRect(200,200,200,200)
```

### api
#### source-over 
默认，在目标图像上显示源图像

#### source-atop
在目标图像(y轴)顶部显示源图像。源图像位于目标图像之外的部分是不可见的。

#### source-in 
现有的画布内容保持在新图形和现有画布内容重叠的位置。其他的都是透明的。

#### source-out
现有内容保持在新图形不重叠的地方。

#### destination-over
在现有的画布内容(y轴)后面绘制新的图形。

#### destination-atop
现有的画布只保留与新图形重叠的部分，新的图形是在画布内容后面绘制的。

#### destination-out
现有内容保持在新图形不重叠的地方,显示现有内容

#### destination-in
现有的画布内容保持在新图形和现有画布内容重叠的位置。其他的都是透明的，显示现有内容

#### lighter
显示源图像+目标图像 相叠加的位置是透明的

#### copy
显示源图像，忽略目标图像
