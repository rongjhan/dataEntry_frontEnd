import {toNumber} from "../../util_num/toNumber.mjs"
import { isNumber } from "../../util_num/isNumber.mjs"
import {toDatetime,isDateTime} from "../../util_time/toDate.mjs"


function parseDataType(array,mode="number",locales=["en"],dateTimeFormats=["YYYY-MM-DD"]){
    if(mode==="none"){return array}
    
    var header = array.splice(0,1)[0]
    var result
    switch (mode){
        case "number":
            result =  array.map(function(row){
                return row.map(function(el){return toNumber(el,locales)})
            });break
        case "dateTime":
            result =  array.map(function(row){
                return row.map(function(el){return toDatetime(el,dateTimeFormats,locales[0])})
            });break
        case "num?date":
            result =  array.map(function(row){
                return row.map(function(el){
                    var testReport = isNumber(el,locales)
                    if(testReport[0]){return toNumber(el,locales,testReport)}
                    return toDatetime(el,dateTimeFormats,locales[0])
                })
            });break
    }
    
    console.log(result)
    result.unshift(header)
    console.log(JSON.stringify(result))
    return result
}



export{parseDataType}