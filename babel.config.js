export default {
    //babel-loader以webpack cli工作目錄去尋找此檔案
    //webpack cli工作目錄也就是下webpack指令時的目錄
    //因此請確保此檔案位置與webpack工作目錄相同
    //僅僅與webpack.config.js設置位置相同是無效的

    browserslistConfigFile:true,
    browserslistEnv:"modern",
    // sourceType: "unambiguous",
    presets:[
        ["@babel/preset-env",
            {
                useBuiltIns:"usage",
                corejs:"3",
            }
        ],
        ["@babel/preset-react"],
        ["@babel/preset-typescript"]
    ]
}