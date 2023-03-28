import {numeral,locales as localeOptions} from "./initNumeral.mjs"
import {isNumber} from "./isNumber.mjs"

function toNumber(string,locales=["en"],testReport){ 
    //testReport would be undefined or [validation,fitLocale]
    //testReport is used when tested numberString outSide this function 
    switch(typeof string){
        case "number":
            return string
        case "string":
            var [validation,fitLocale] = testReport||isNumber(string,locales)

            if(!validation){return string} //若無法轉成數字則不轉型直接返回

            numeral.locale(localeOptions[fitLocale])
            return numeral(string).value()//返回原始物件才可緩存於indexeddb或傳遞給dataOps
        default:
            throw "firstParam should be string or number"
    }
}


export {toNumber}
