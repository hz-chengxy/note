# webpack.config.js
`yarn add webpack -D`
webpack 运行在 node 环境中，所以 js 文件中可以直接用 node 的语法

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
                    options: {
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
`const env = process.env.NODE_ENV`，获取到这个环境变量后，可以在公共配置common中实现各种各样所需要的逻辑。还可以在实际的业务组件、项目构建中实现想要的逻辑，就比如密管软件硬件版本区分