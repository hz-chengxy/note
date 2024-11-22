## jQuery的一些实践
使用了jquery实现页面的平滑滚动click事件的回调函数可以用原生代替
```js
$('#btn').click(function(){
    let scroll = 100
    let offsetTop = $('#d3').offsetTop
    let clientHeight = $('#d1').clientHeight
	// 总长度
    let scrollLength = offsetTop - 100
    // 总花费200ms
    let time = 200
    let step = scrollLength / time
	$('#d1').animate({scrollTop: scrollLength },200)
})
```
应用到项目中的点击事件中
```js
let offsetLeft = $(".img-wrap")[0].scrollLeft;
let scrollLength = offsetLeft + 1800;
$(".img-wrap").animate({ scrollLeft: scrollLength }, 777);
```