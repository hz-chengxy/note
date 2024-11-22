## 在现有的iconfont中添加一个或一些新的矢量图：
1、先下载新的矢量图的压缩包，并解压。
2、将文件夹中的eot/svg/ttf/woff/woff2结尾的文件类型改名，防止与原icon文件中的名字重复，并把这些文件拷贝进项目中。原因：因为矢量图实际引用的是这些文件，所以只需要把这些文件拷贝进项目中的原icon文件夹中。
3、在新下载文件的iconfont.css文件中，@font-face中src也要随着更改的文件名而变化，并把修改后的@font-face直接拷贝进原项目中的iconfont.css中，直接整体复制进去就好。并把新的伪类css名一起拷进去。
4、之后就可以用了，目测不需要更新iconfont.json。
`<i class="iconfont icon-***"></i>`
参考：https://blog.csdn.net/guzhao593/article/details/103314628