# webpack.config.js
`yarn add webpack -D`
webpack 运行在 node 环境中，所以 js 文件中可以直接用 node 的语法

## webpack原理
原理可以概括为 依赖分析 + 模块打包 + 优化处理。
1. 初始化，读取配置文件
2. 构建依赖图。从Entry出发，通过import等语法递归处理依赖文件。遇到非js文件，通过loader转换
3. 通过代码分割，生成 Chunk
4. 输出文件

## package.json
```js
"script": {
    "dev": "npx webpack-dev-server"
    "build": 'npx webpack'
}
```


```js
const path = require('path')
module.exports = {
    mode: 'development' // 不压缩代码，开发模式，production生产环境
    // 入口
    entry: './src/main.js' // 入口文件，可以多个文件
    entry: ['./src/main.js', './src/index.js']
    // 出口
    output: {
        path: path.resolve(__dirname, './build') // 以webpack.config,js文件为基准的当前目录下的build文件中，__dirname就是物理路径，即当前文件所在的路径
        filename: 'bundle-[contenthash:6].js' // 打包后的文件名，加上了6位hash值
        // contenthash以文件内容为参照，若文件内容不变，则hash不变。文件内容变化，才产生新的hash，能有效防止nginx缓存，同时也不要用时间戳，否则文件不变，时间戳也会变化，从而造成资源浪费。
    }
}
```

## 多文件应用

```js
const path = require('path')
module.exports = {
    mode: 'development'
    // 分模块多入口
    entry: {
        travel: './src/main.js',
        insurance: './src/index.js'
    }
    // 出口
    output: {
        path: path.resolve(__dirname, './build')
        filename: '[name].js' // name对应每个入口定义的名字travel,insurance
    }
}
```

## HtmlWebpackPlugin 打包 html 文件

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.js", // 模板源，默认就是public下的index.js
      filename: "index.html", // 打包后的名字
      inject: true, // 默认true，是否将js文件注入html中
    }),
  ],
};
```

## webpack-dev-server 项目开发环境，包含proxy
`yarn add webpack-dev-server -D`
```js
const path = require('path')
module.exports = {
    // 分模块多入口
    entry: {
        app: './src/main.js',
    }
    // 出口
    output: {
        path: path.resolve(__dirname, './build')
        filename: '[name].js' // name对应每个入口定义的名字travel,insurance
    },
    plugins: [
    ...
  ],
    devServer: {
        contentBase: path.resolve(__dirname, './build'), // 在缓存中生成build文件。
        port: 8080,
        quiet: true, // 安静模式，保持终端简洁
        proxy: { // 反向代理，解决跨域
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
                changeOrigin: true
            },
        },
        // 使用proxy，最好先安装http-proxy-middleware，yarn add http-proxy-middleware -D
    }
}
```

**proxy**


## loader
loader有多种引用写法
```js
{
    test: /\.js$/,
    loader: '', // 1
    loaders: [], // 2
    use:['string', 'string'], // 3
    use: { // 4
        (loader|loaders): (string | array)
    },
    use: [ // 5
        {loader: 'string'},
        {loader: path.resolve(__dirname, './src/loaders/loadText.js')}, // 该写法和上一行一样，只是展示一种加载本地自定义loader的方法
        {loader: '', options:{}}
    ]
}
```
当有多个loader时从后向前解析
`yarn add babel-loader @babel/core @babel/preset-env -D` 解析es6
`yarn add css-loader -D` 解析css
`yarn add style-loader -D` 将css载入浏览器
`yarn add stylus stylus-loader -D` 解析stylus
`yarn add file-loader -D` 解析文件
`yarn add url-loader -D` 将大文件存为单独的文件，小文件转为base64。url-loader是在file-loader的基础上运行的

```js
const path = require('path')
module.exports = {
    // 分模块多入口
    entry: {...}
    // 出口
    output: {...},
    plugins: [...],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    exclude: /(node_modules|bower_components)/,
                    options: { // options相当于给loader传递的参数
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'], 
                // loaders从后向前解析，cssloader将css解析在js中，styleloader解析在页面中。如果想将css单独抽离为一个文件。需要借助插件MiniCssExtractPlugin
            },
            {
                test: /\.styl$/,
                loaders: ['style-loader', 'css-loader', 'stylus-loader'], 
            },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20 * 1000 // url-loader功能：小于20K才转为base64，否则就存为单独的文件
                    }
                }
            }
        ]
    }
    devServer: {....}
}
```
### babel-loader
babel-loader也支持插件，类似解析es6类的语法等等
`yarn add @babel/plugin-proposal-class-properties -D`
```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
            presets: ['@babel/preset-env'],
            plugins: [
                "@babel/plugin-proposal-class-properties" // 解析es6类语法
            ]
        },
    },
},
```

#### @babel/preset-env
* `@babel/preset-env`用于解析常规的es6的组合包，const、let会转为var，但promise无法转换，会原封输出，那么低版本浏览器可能无法解析。此时用到`@babel/polyfill`(垫片)，`yarn add @babel/polyfill -D`
* 可以在源文件中直接引入`import @babel/polyfill`，简单，但会是打包后的文件变大，且全局window会被注入很多全局变量
* 或在webpack配置文件中的入口增加补充配置
```js
module.export = {
    entry: {
        'js/app': ['@babel/polyfill', './src/main.js'] // 入口文件还是main.js， 在出口目录中创建一个文件夹js，并放入其中app.js。且这里的载入顺序是从前向后，即先垫片预解析es6，再载入入口文件
    },
}
```
* 这样还是比较臃肿，所以要借助useBuiltIns，配合target，决定兼容那些目标版本。useBuiltIns必须配合Browserslist（target）才有效果。此时在哪里都已经不需要引入`@babel/polyfill`
```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: { // 可以将options这一坨移入单独的文件中
            presets: [
                ['@babel/preset-env', {
                    'targets': {
                        'browsers': ['ie >= 8', 'iOS 7'] // 支持ie8，直接使用iOS浏览器版本7
                    },
                    "useBuiltIns": "usage"
                    // "entry"：会将文件中的import @babel/polyfill语句，结合targets，转换为一系列引入语句，去掉目标浏览器已支持的polyfill模块，不管代码里有没有用到，所有目标浏览器不支持的语句都会定义在浏览器中
                    // "usage"：不需要手动在代码里写import @babel/polyfill，打包时会自动根据实际代码的使用情况，结合target，定义浏览器不支持的模块到浏览器中
                    // "false"：不做任何处理
                }], 
                '@babel/preset-react'
                ],
        },
    },
}
```

#### babel的options集成（即options配置），并配置useBuiltIns，useBuiltIns必须配合Browserslist（target）才有效果
在与package.json平级的目录中新建.babelrc文件，或babel.config.js文件，这俩文件互斥。修改webpack配置文件
```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: { // 可以将options这一坨移入单独的文件中
            presets: ['@babel/preset-env', '@babel/preset-react'],
        },
    },
}
// 移入后
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
    },
}
```

```json .babelrc文件
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```
```json 载入useBuiltIns配置，此时可以把入口中的“@babel/polyfill”删除”
{   
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": "usage"
            // "entry"：会将文件中的import @babel/polyfill语句，结合targets，转换为一系列引入语句，去掉目标浏览器已支持的polyfill模块，不管代码里有没有用到，所有目标浏览器不支持的语句都会定义在浏览器中
            // "usage"：不需要手动在代码里写import @babel/polyfill，打包时会自动根据实际代码的使用情况，结合target，定义浏览器不支持的模块到浏览器中
            // "false"：不做任何处理
        }],
        "@babel/preset-react"
    ]
}
```

##### babel的Browserslist集成（即target）
babel-loader的Browserslist（target）集成支持在package.json文件里或者新建一个 .browserslistrc 文件来指定对应目标环境。
```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: { // 可以将options这一坨移入单独的文件中
            presets: [
                ['@babel/preset-env', {
                    'targets': {
                        'browsers': ['ie >= 8', 'iOS 7'] // 支持ie8，直接使用iOS浏览器版本7
                    }
                }], 
                '@babel/preset-react'
                ],
        },
    },
}
```

```browserslistrc 集成后
ie >= 8
IOS 7
last 1 version // 最近1个浏览器版本
> 1% // cover浏览器99%的版本
```

##### babel7.4版本之后垫片polyfill的使用，core-js从2版本到3版本的更替
polyfill依赖于两个包`core-js` `regenerator-runtime`。`core-js`3之后的废弃了polyfill，但是有等价实现
`yarn add core-js regenerator-runtime -D`
```json
{   
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": "usage",
            "corejs": 3
        }],
        "@babel/preset-react"
    ]
}
```

##### @babel/preset-env总结
webpack需要解析一些es6代码，但是一些新特性，新API，例如promise，就无法正常识别。这时就需要借助`@babel/polyfill`，这个可以将一些老版本浏览器不支持的特性API，提前预定义在浏览器的全局中。该插件有两个比较重要的配置，useBuiltIns和target。useBuiltIns决定打包时如何处理`@babel/polyfill`，一般设为usage，而usage会结合target的目标浏览器版本，和代码使用api情况，进行打包。而在babel7.4版本后，一般会结合`core-js`3版本和`regenerator-runtime`使用，其更稳定。

## 将各类文件归类放置在各种文件夹中
### js
```js
module.export = {
    entry: {
        'js/app': './src/main.js' // 入口文件还是main.js， 在出口目录中创建一个文件夹js，并放入其中app.js
    },
}
```

### img 借助url-loader，详细配置可查询文档
```js
module.export = {
    module: {
        rules: [
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20 * 1000 // url-loader功能：小于20K才转为base64，否则就存为单独的文件,
                        outputPath: 'images', // 创建一个images文件夹，放入其中
                        name() {
                            return '[contenthash:6].[ext]' // 名字改为6位hash
                        }
                    }
                }
            }
        ]
    }
}
```

### css 借助MiniCssExtractPlugin插件，它将代替style-loader不直接写入页面，而是打为单独的文件
`npm install --save-dev mini-css-extract-plugin`
本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    entry: {
        'js/app': './src/main.js' // 将入口文件main.js 创建一个文件夹js，并放入其中
    },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.js", // 模板源，默认就是public下的index.js
      filename: "index.html", // 打包后的名字
      inject: true, // 默认true，是否将js文件注入html中
    }),

    new MiniCssExtractPlugin({
        filename: ({chunk}) => { // 自定义合入的css文件名，可以加入路径写法自定义写入哪个文件夹
            // chunk.name就是entry中定义的js/app，我们可以将js替换为css，则输出的就是css/app，也就是创建一个css目录，并放入app.css文件
            return `${chunk.name.replace('js', 'css')}-[contenthash:6 ].css`
        }
    })
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'], // 若直接这么写，打包的css路径会继承entry的路径/js
        use: [ // 想配置具体路径的话就展开写
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '/css'
                }
            },
            'css-loader',
            'stylus-loader'
        ]
      }
    ],
  },
};
```

## 解析vue
`npm install -D vue-loader vue-template-compiler`
```js
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```

## 解析react
`yarn add @babel/preset-react`
因为本质还是js代码，所以在babel-loader中新增一种“预设”即可
```js
module: {
    rules: [
        {
            test: /\.jsx?$/,
            use: {
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                        ],
                },
            },
        },
    ]
}
```

## devtool 文档在webpack的配置中，示例的eval-source-map只适合开发环境
```js
const path = require('path')
module.exports = {
    mode: 'development' // 不压缩代码为一行，开发模式
    // 入口
    entry: './src/main.js' // 入口文件，可以多个文件
    // 出口
    output: {
        path: path.resolve(__dirname, './build') // 打包在当前目录下的build文件中
        filename: 'bundle-[contenthash:6].js' // 打包后的文件名，加上了6位hash值
    },
    devtool: 'eval-source-map' // 打包后保存源码至浏览器缓存中，适合开发环境，方便在浏览器中调试
}
```

## clean-webpack-plugin 每次打包前都会删除上一次的包
`yarn add clean-webpack-plugin -D`
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
    ],
};
```

## 配置-resolve
### resoleve
```js
const path = require('path')
// '__dirname'就是以当前配置文件webpack.config.js的位置为路径基准
module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }, // 路径别名
        extensions: ['.js', '.json'] // 默认文件拓展，尽量将常用的文件拓展类型放在前面，能提高打包效率，但是不用这个拓展的打包效率才是最高的
    }
};
```

## 将生产环境和开发环境配置文件分离
1. 可以在根目录(即与package.json平级)下新建的src目录中新建config文件夹，将两套配置文件放在这里。分别起名`webpack.config.dev.js`(开发)和`webpack.config.prod.js`(生产)。文件中除了物理路径，即使用`path.resolve(__dirname, './build')`是以当前文件为基准查找目录的，其他的相对路径，依然是以package.json为基准查找目录的。

修改package.json
```js
"scripts": {
    "dev": "npx webpack-dev-server --config ./src/config/webpack.config.dev.js"
    "build": "npx webpack --config ./src/config/webpack.config.prod.js"
}
```

2. 经过以上处理分离了生产与开发，但是其中有很多重复的逻辑，那么再可以将相同的逻辑单独放在一个`webpack.config.common.js`。同时引入webpack-merge插件，(yarn add webpack-merge)。之后再两个环境的配置项中分别引入该公共配置
```js
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

const developmentConfig = { ... };
module.exports = merge(commonConfig, developmentConfig)


const productionConfig = { ... };
module.exports = merge(commonConfig, productionConfig)
```

3. 引入cross.env，可以给代码中传入自定义的参数变量（环境变量），方便在公共代码中自定义逻辑
cross-env：是一个 npm 包，用于跨平台设置环境变量。它解决了不同操作系统（Windows、macOS、Linux）在设置环境变量时的语法差异问题。其核心作用是允许你在 package.json 的脚本中以统一的方式设置环境变量，无需关心底层操作系统的差异。
`yarn add cross.env`
再次修改package.json
```js
"scripts": {
    "dev": "cross.env NODE_ENV=development npx webpack-dev-server --config ./src/config/webpack.config.dev.js"
    "build": "cross.env NODE_ENV=product npx webpack --config ./src/config/webpack.config.prod.js"
}
```
这样执行脚本后，就可以通过 `process.env.NODE_ENV` 获取环境变量。process 是 Node.js 的全局对象，提供了与当前 Node.js 进程相关的信息和控制能力：包含进程的运行时信息（环境变量、命令行参数、版本信息等）。可以在前端项目中直接使用：虽然浏览器没有 process 对象，但打包工具（如 webpack）会模拟它。
`const env = process.env.NODE_ENV`，获取到这个环境变量后，可以在公共配置common中实现各种各样所需要的逻辑。还可以在实际的业务组件、项目构建中实现想要的逻辑，就比如密管软件硬件版本区分。

## tree-shaking
webpack4默认开启，只会打包被使用的代码。只在production环境中生效。
css文件正常情况下被引入即会生效，但是在webpack看来，就只是被引入了，没有被使用。所以这时要在package.json中引入配置项
```json
{
    "sideEffects": false, // 表示若无副作用，即没有被引用，则会被shake掉
    "sideEffects": [
        "*.css" // css文件无论如何不会被摇掉
    ],
    "scripts": {
        "..."
    }
}
```

## externals
拆包方案一：全局挂载，在模块内部，通过window.module = module，将包挂载在windows上，之后直接在entry入口，把模块定义进去，打包时就会单独创建一个chunk。之后需手动维护脚本加载顺序和版本，易出错，也无法tree-shaking
拆包方案二：防止某些import导入的静态资源包，被webpack打入最终的包中，例如vue，react，jq，这些静态资源不会经常性的更新，那么可以从bootcdn中通过cdn写入html引入到项目中，这个包基本不会变。通过cdn引入后，这些静态资源被挂载在window上。之后在externals中标明该静态资源从哪里取，例如“vue”，那么之后，再`import Vue from 'vue'`要导入vue，则直接从cdn获取vue，不从node-modules中。那么最终打包，包的体积会小很多，vue不会被打进去，而从远程cdn中获取
`<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js"></script>`
```js
module.exports = {
    entry: {...}
    // 出口
    output: {...},
    plugins: [...],
    externals: {
        "vue": "window.vue" // window可以省略
    }
}
```

## SplitChunksPlugin 拆包，webpack内置插件，不需要再次安装。 (optimization中配置)
```js
module.exports = {
    entry: {...}
    // 出口
    output: {...},
    plugins: [...],
    // optimization: {
    //     usedExports: true // 给tree-shaking加的配置。添加webpack注释，告诉我们哪些模块被导出使用了，会知道哪些模块将会被tree-shaking摇掉了，一般配合tree-shaking在开发环境中使用，但没啥大用。
    // },
    optimization: { // 默认配置，不做任何配置的optimization就是这样的。
        splitChunks: {
        chunks: 'async', // "all"：异步和同步的包均分包，"async"仅异步，"initial"仅同步
        minSize: 20000, // 包必须大于20K才会分包，太小就不会
        minRemainingSize: 0, // 通过确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块。基本不需要手动指定它
        minChunks: 1, // 被引入1次以上再拆包
        maxAsyncRequests: 30, // 按需加载时的最大并行请求数，不包含主包
        maxInitialRequests: 30, // 入口点的最大并行请求数，不包含主包
        enforceSizeThreshold: 50000, // 基本不手动指定
        cacheGroups: { // 满足splitChunks配置的包可能会有多个，那么可以通过cacheGroups将多个包再分组，缓存组可以继承或覆盖来自 splitChunks 的任何选项。
            defaultVendors: { // 这就是第三方包的默认配置，即使不配置这个，也会单独拉个Vendors文件夹，放入到这个文件夹里
                test: /[\\/]node_modules[\\/]/,// 控制此缓存组选择的模块。
                priority: -10, // 优先级
                reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
                },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
                },
            },
        },
    },
}
```

### chunks 配置抽离异步或同步包
如何异步引入包呢？以下为同步引入和异步引入
异步引入的包，在某些条件下会被懒加载。
```js
// 同步
import a from "a"

// 异步
import(/* webpackChunkName: "module_name" */ 'lodash').then(_ => {}) // 执行该方法会返回一个promise

// 或（异步）
const { default: _ } = await import(/* webpackChunkName: "module_name" */ 'lodash')
_.join()
```

## 优化首屏加载速度 Prefetching
例如可以拆分一些回调函数，让这些函数异步加载。如果不用webpackPreload，只单单的异步加载也可以，那么就是在真正触发回调的时候，会加载那个模块。若用了preLoad，则是在首屏需要的加载完成之后，再悄悄的加载这些需要预加载的内容。不会影响首屏加载速度。

先将回调函数定义在单独的js文件中
```js
export default () => {
    console.log(1)
}
```

```js
document.addEventListener('click', () => {
    // 异步加载，触发回调时加载回调函数
    import('./src/components/name/handleClick.js').then(obj => {
        obj.default()
    })
})
document.addEventListener('click', () => {
    // 预加载，在首屏加载完成后悄悄加载
    import(/* webpackPreload: true */ './src/components/name/handleClick.js').then(obj => {
        obj.default()
    })
})
```

## 优化webpack打包速度 happypack，多线程打包