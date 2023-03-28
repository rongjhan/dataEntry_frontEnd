import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import genPath, { context } from "./webpack.path.js"



export default async (env, options) => {
    const devPath = false
    const dev = options.mode === "development";
    const outputPath = genPath(devPath)

    return {
        context: context,
        //entry路徑相對於context路徑,需為絕對路徑,此設為相對於webpack.config.js路徑
        //預設是webpack cli工作目錄(雖然很多時候兩者是相同的)
        entry: {
            "index": "./src/index.tsx",
        },
        output: {
            path: outputPath.JS, //此需設置為絕對路徑
            clean: true,//作用是清除前次打包文件,webpack5後支援,之前需要CleanWebpackPlugin
            filename: '[name].js', //entry文件打包後文件名
            chunkFilename: '[name].bundle.js', //一些非entry文件但會被分離出單獨文件的文件名,例如:import()或webworker
        },
        externals: {
            // externals 下指定的属性名称 office-js 表示 import $ from 'office-js' 中的模块 office-js 应该从打包产物中排除。 为了替换这个模块，Office 值将用于检索全局 Office 变量
            "office-js": "Office",
        },
        resolve: {
            extensions: [".js",'.ts', '.tsx', '.jsx']
        },
        module: {
            rules: [
                {//js transpiler
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules\\(?!table\\).*/,
                    use: "babel-loader"
                },
                {//css in js
                    test: /\.css$/i,
                    issuer: /\.(ts|tsx|js|jsx)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: ".121213312", //該設置沒有用,只是擺著為了證明
                            }
                            //當asset資源有設置PublicPath,則我們自定義此loader的publicPath會失效(MiniCssExtractPlugin 2.7.2)
                            //失效後其預設行為或依據extrac-plugin的filename,添加返回OUTPUT_PATH的相對路徑並於後面多加"/",再加上asset設置的publicPath + asset檔名
                            //預設行為多加後面這個"/"會導致路徑無法正確解析(若哪天修復這個問題其實預設行為是好用的)
                            //若我們的靜態檔案與css檔案保持目前這個配置,該多加的"/"並不會造成路徑解析錯誤(所以不確定修復沒不要隨便改)

                            //我們是一定會為asset設置PublicPath的,因為於js中引入才會是正確的路徑(所以此loader的publicPath等同虛設)
                            //此時我們可以直接於css_loader設置不對css中的url和import進行處理
                            //並直接於js中import靜態檔案(圖片或字型等等),讓css中需要的靜態檔案輸出到Output中,
                            //然後css file內直接寫Output後的路徑 
                            //當然如果你用"asset/inline"或"asset/source"則可以完全避免這個問題,因為根本不用請求也就沒有路徑問題
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                // url:false,
                                // import:false,
                                modules: {
                                    localIdentName: "[name]_[local]--[hash:base64:5]",
                                    //不同的js去import相同的css檔案,會產生不一樣的className專屬給該js檔案用
                                }
                            }
                        },
                        {
                            loader: "postcss-loader",
                        }
                    ],
                },
                {//css in pug
                    test: /\.css$/,
                    issuer :/\.pug$/,
                    type: "asset/resource",
                    generator: { //目前generator僅與asset module一起工作,其他loader無法使用(webpack 5.75.0)
                        filename: '[name][ext]',
                        publicPath: path.relative(outputPath.HTML, outputPath.CSS).replace(/\\/g, '/') + "/",
                        //只接受相對路徑故要做轉換(相對於html的output path)
                        outputPath: path.relative(outputPath.JS, outputPath.CSS)
                        //只接受相對路徑故要做轉換(相對於output.path),此設置可以用空字串表示路徑相同
                    },
                    use:[ "postcss-loader"]
                },
                {//asset
                    test: /\.(png|jpe?g|gif|svg|geojson)$/,
                    type: "asset/resource",
                    generator: { //目前generator僅與asset module一起工作,其他loader無法使用(webpack 5.75.0)
                        filename: '[name][ext]',
                        publicPath: path.relative(outputPath.HTML, outputPath.PIC).replace(/\\/g, '/') + "/",
                        //只接受相對路徑故要做轉換(相對於html的output path)
                        outputPath: path.relative(outputPath.JS, outputPath.PIC)
                        //只接受相對路徑故要做轉換(相對於output.path),此設置可以用空字串表示路徑相同
                    }
                },
                {//html
                    test: /\.pug$/,
                    use: [
                        {
                            loader: "pug-loader",
                            options: {
                                pretty: dev ? true : false //不壓縮
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: (path.relative(outputPath.JS, outputPath.CSS) || ".") + "/[name].css",
                //只接受相對路徑故要做轉換(相對於output.path),且此設定最後須包含css本身輸出檔名
                chunkFilename: '[id].css'
            }),
            new HtmlWebpackPlugin({
                filename: (path.relative(outputPath.JS, outputPath.HTML) || ".") + "/editor.html",
                //只接受相對路徑故要做轉換(相對於output.path),且此設定最後須包含html本身輸出檔名
                //路徑相同時輸出""(空字串),故要判斷補上"."
                template: './src/template/index.pug',
                chunks: ["index"], //會被引入的chunk檔案
                minify: dev ? false : true //不壓縮
            })
        ],
        
        watchOptions: {
            poll: 1000, // 每秒检查一次变动
            ignored: /node_modules/,
        }
    }
}