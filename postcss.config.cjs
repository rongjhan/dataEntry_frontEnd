module.exports= {   //由於postcss-loader無法正確讀取es module的postcss config檔案, 故此處仍用.cjs檔
    plugins: [
        [
            "postcss-preset-env",
            {
                stage:1, //為了使用css nesting rule , 預設stage為2
                browsers :'>1%'  
                //由於目前postcss-preset-env讀取.browserslistrc時無法支援其中的多環境(單一環境配置可以)
                //故於此處單獨配置postcss-preset-env的瀏覽器目標
            },
        ],
    ],
};