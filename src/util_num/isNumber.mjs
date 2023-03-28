import { escapeRegExp } from "../util_data/escapeRegExp.mjs";
import {numeral,locales} from "./initNumeral.mjs"
//不直接從node_module引入numeraljs  因為initnumeral中有引入plugin等的作用
//(module的add plugin sideEffect只會被執行一次,即使重複被不同模組import)

function _isNumber(string,locale){ //numeral.validate無法滿足需求故自建
    //雖然numeral支持解析foamt成時間但不打算支持,而科學記號等待未來添加
    if(!string.match(/\d/)){return false}  //若不存在數字字元,則直接返回false
    var localeData = numeral.localeData(locales[locale]) 
    var array = string.trim().split("")
    var firstDigitIndex = array.findIndex((i)=>!isNaN(parseInt(i)))
    var lastDigitIndex = -([...array].reverse().findIndex((i)=>!isNaN(parseInt(i))))-1

    if(!(()=>{ //validateBody
        var body =array.slice(firstDigitIndex,lastDigitIndex===-1?undefined:lastDigitIndex+1).join("")
        var decimal = escapeRegExp(localeData.delimiters.decimal)
        var thousands = escapeRegExp(localeData.delimiters.thousands)
        var thousandReg = new RegExp(`${thousands}(\\d{0,2}$|\\d{0,2}\\D|\\d{4,})`)
        var decimalReg = new RegExp(`${decimal}(?=.*\\D+)`)
        if(!body.match(/[^\d\,\.]/)){//沒找到非[\d\,\.]中字元則繼續檢查
            return !(thousandReg.test(body)||decimalReg.test(body))
            //  /\,(\d{0,2}$|\d{0,2}\D|\d{4,})/ 表示若逗號後面出現的並非剛好連續三個數字,則非合格逗號
            //  /\.(?=.*\D+)/  表示小數點後不能出現非數字字元(同時也保證了小數點只有一個)
        }
        return false
    })()){return false}

    if(!(()=>{  //validateHeader
        var header = array.slice(0,firstDigitIndex)
        var currencySymbol = escapeRegExp(localeData.currency.symbol)
        if(header.length<2){return new RegExp(`^([\\+\\(-]?${currencySymbol}?)$`).test(header.join(""))}
        //若少於兩個字元且當locale為en時 必然是^([\+\(\-]?\$?)$這個形式
        return false
    })()){return false}


    if(!(()=>{ //validateTail
        var units = []
        for(let unit in localeData.abbreviations){units.push(escapeRegExp(unit))}
        var unitSet = `(${units.join("|")})`
        var tail = array.slice(lastDigitIndex,lastDigitIndex===-1?-1:undefined).join("")
        return new RegExp(`^(${unitSet}?|%?)$`).test(tail)
        // ^([mkbt]|%)$  當locale為en時,regexp表示僅能存在這些字元 且單位與%二選一
    })()){return false}


    return true
}


function isNumber(string,locales=["en"]){
    var fitLocale
    for(let locale of locales){if(_isNumber(string,locale)){fitLocale=locale;break}}
    return [fitLocale?true:false,fitLocale]
}


export{isNumber}


// var b = numeral("$10000")
// console.log(numeral.localeData(numeral.locale()))
// console.log(numeral.validate("10m"),numeral("1mm"))
// numeral.nullFormat('N/A');
// console.log(numeral.options)
// var a =numeral(1000000).format("$0,0.00a")
//https://npmdoc.github.io/node-npmdoc-numeral/build/apidoc.html
//https://www.elastic.co/guide/en/kibana/current/numeral.html#_displaying_abbreviated_numbers
//https://npmdoc.github.io/node-npmdoc-numeral/build/apidoc.html