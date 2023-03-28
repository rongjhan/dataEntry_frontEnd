import {dayjs,locales} from "./initDayjs.mjs"
//不直接從node_module引入dayjs  因為initDayjs中有引入plugin等的副作用
//(module的sideEffect只會被執行一次,即使重複被不同模組import)


function isDateTime(string,dateTimeFormats=["YYYY-MM-DD"],era){
    var dateTime = dayjs(string,dateTimeFormats)
    return dateTime.isValid()?true:false
}

function toDatetime(string,dateTimeFormats=["YYYY-MM-DD"],locale="en"){

    var dateTime = dayjs(string,dateTimeFormats,locales[locale])

    // console.log(dayjs(string).isValid())
    // console.log(dateTime.isValid(),string,dateTimeFormats)
    return dateTime.isValid()?dateTime.$d:string
    //dateTime.$d為Date物件 返回原始物件才可緩存於indexeddb或傳遞給dataOps
}


export {toDatetime, isDateTime}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
// https://day.js.org/docs/zh-CN/parse/string-format
// https://day.js.org/docs/en/i18n/locale-data