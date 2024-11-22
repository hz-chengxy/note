/* 
此方法为解决系统经过resize-one缩放后，echarts的鼠标位置存在偏差而导致的图表提示信息与鼠标位置不一致的问题。
思路为resize缩放了多少，再还原回去即可。
*/
export function resizeEcharts(dom) {
    dom.style.zoom = 1 / document.documentElement.style.zoom
    dom.style.transform = `scale(${1 / dom.style.zoom})`
    dom.style.transformOrigin = "0 0"
}