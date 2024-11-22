/*
 * @Description:可伸缩布局方案
 * @Author: pu.yuchun
 * @LastEditors: zy
 * @Date: 2019-03-30 17:35:53
 * @LastEditTime: 2021-01-22 14:14:51
 */
!(function(window) {
    /* 设计图文档宽度 */
    var docWidth = 1366;
    var doc = window.document;
    var docEl = doc.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var recalc = (function refreshRem() {
        var clientWidth = docEl.getBoundingClientRect().width;
        /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
        // var tem = Math.min(20 * (clientWidth / docWidth), 11.2);
        docEl.style.fontSize
            = Math.max(Math.min(20 * (clientWidth / docWidth), 36.42), 8.55) * 5
            + 'px';

        return refreshRem;
    })();

    /* 添加倍屏标识，安卓倍屏为1 */
    docEl.setAttribute(
        'data-dpr',
        window.navigator.appVersion.match(/iphone/gi)
            ? window.devicePixelRatio
            : 1
    );

    if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
        /* 添加IOS标识 */
        doc.documentElement.classList.add('ios');
        /* IOS8以上给html添加hairline样式，以便特殊处理 */
        if (
            parseInt(
                window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1],
                10
            ) >= 8
        ) {
            doc.documentElement.classList.add('hairline');
        }
    }

    if (!doc.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window);
