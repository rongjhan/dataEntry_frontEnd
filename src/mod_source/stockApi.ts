import {parseDataType} from "./util/_parseDataType.mjs"

var descriptor = {
    deps:null,//null means it can't handle any data,and also dont need it
    inputs:{
        stockNo:{type:"text",defaultValue:"2330",required:true},
        parse:{type:"selection",options:["none","number","dateTime","num?date"],defaultValue:"number"},
        locales:{type:"text",defaultValue:'en',required:true},
        dateTimeFormats:{type:"text",defaultValue:'YYYY-MM-DD',required:true}
    }
}

function getData({config}){
    var {stockNo,parse} = config
    var locales = config.locales.split(",")
    var dateTimeFormats = config.dateTimeFormats.split(",")
    var url = document.location.origin+`/request/stockApi?stockNo=${stockNo}`

    console.log('fetch data from',url)
    
    return fetch(url)
        .then((response)=>response.json())
        .then((data)=>parseDataType(data,parse,locales,dateTimeFormats))
}

export {
    getData as execute,
    descriptor
}
