# 如何将公网工具包放置在内网

## 获取package.json 
* https://registry.npmmirror.com/package.name
该地址下的文件，就是所需包的package.json文件，复制下来即可
例如vue-clipboard3包的地址就为：https://registry.npmmirror.com/vue-clipboard3
* 在package.json找tgz关键词，找所需版本的包，直接将下载地址复制至浏览器，下载到本地
* 访问12服务器，路径：/home/lsadmin/work/verdaccio/storage，在该目录下创建与包名一致的文件夹，将package.json和不同版本的包放进该目录下即可。