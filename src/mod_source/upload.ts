import {parseDataType} from "./util/_parseDataType.mjs"
import {parseCsvToArray} from "../util_data/parseCsvToArray.mjs"


var descriptor = {
    deps:null,//null means it can't handle any data,and also dont need it
    inputs:{
        fileType:{type:"selection",options:["csv"],defaultValue:"csv"},
        parse:{type:"selection",options:["none","number","dateTime","num?date"],defaultValue:"number"},
        locales:{type:"text",defaultValue:'en',required:true},
        dateTimeFormats:{type:"text",defaultValue:'YYYY-MM-DD',required:true}
    }
}

function getData({config}){
    var {fileType,parse} = config
    var locales = config.locales.split(",")
    var dateTimeFormats = config.dateTimeFormats.split(",")
    switch(fileType){
        case "csv":
            return new Promise(
                function(resolve){
                    var input = document.createElement("input")
                    input.type="file"
                    input.accept = "."+fileType
                    input.addEventListener("change",function(e){
                        const reader = new FileReader(); 
                        reader.onload = function fileReadCompleted() {
                            var array = parseCsvToArray(reader.result)
                            resolve(parseDataType(array,parse,locales,dateTimeFormats))
                        };
                        reader.readAsText(this.files[0]); 
                        // reader.readAsText會自動把utf8文件的BOM頭（如果有的話）去除，其它讀取方式要注意手動去除。
                    })
                    input.click()
                }
            )
    }

}

export {
    getData as execute,
    descriptor
}
