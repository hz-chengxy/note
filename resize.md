# 不同resize函数说明
## resize.js
仅针对设计稿为6600 * 2792的网页实现等比例缩放，实现不同分辨率下显示效果相同。

使用方法：直接引入resize.js即可，他是自执行函数
import resize.js

## resizes.js
针对不同设计稿在不同分辨率的屏幕的缩放逻辑，该示例是 6600 * 2792 与 4964 * 2792 两种设计稿实现在同一屏幕下的缩放逻辑。
resizeHome函数是任何分辨率下都采用6600 * 2792的缩放逻辑。
resizeSmall函数是4964 * 2792的缩放逻辑，在不同的屏幕中缩放的比例不同，且横向移动的距离也不一样

使用方法：引入并执行
import {resizeHome,resizeSmall} resizes.js
resizeHome,resizeSmall

## resize-one.js
针对任意分辨率下显示相同效果，修改js中的targetWidth与设计图的宽度一致即可

使用方法：直接引入，自执行
import resize-one.js

## resize-echarts
在经过resize-one缩放后echarts图表中鼠标的位置与实际的位置会存在偏差，是缩放的导致。
解决逻辑：resize缩放了多少，再还原回去即可。

使用方法：引入并执行，resizeEcharts参数是传入canvas父容器的dom元素，或者canvas本身，看那个dom比较容易获取。
resizeEcharts(dom)，每次create echarts后都需要执行resizeEcharts方法，最好的就是侦听resize，当分辨率改变后从新创建echarts并执行resizeEcharts
有resizeEcharts使用截图。
