import  dayjs from 'dayjs'; //intl於ie11支援度不好因此此處不採用
import parseFormat from './parseFormat.mjs'; 
//若無引入此plugin,則僅能解析用/或-分隔年月日 並於日期和時間用[T t \s]分隔  時間間用:分隔,也是不傳入format預設行為
//引入後可以用[- : . ( ) \s]當作分隔符號,當然要傳入該format參數
import localeData  from "dayjs/plugin/localeData.js"
import updateLocale from "dayjs/plugin/updateLocale.js"
import "dayjs/locale/zh-tw.js" //引入即代表register該locale(看引入方法即知是sideEffect module)
import "dayjs/locale/zh-cn.js"

dayjs.extend(updateLocale)
dayjs.extend(parseFormat)
dayjs.extend(localeData)

dayjs.updateLocale("zh-tw",{
    parse:{
        localeEraShort:[/\d{1,3}/,function(input){console.log(input);this.year = 1911+(+input)}], //對應format為yy
        localeEra:[/民國\d{1,3}/,function(input){console.log(input);this.year = 1911+(+input.slice(2))}] //對應format為yyyy
    }
})//支持民國紀年的輸入


var locales ={
    "en":"en",
    "zh-TW":"zh-tw",
    "zh-CN":"zh-cn"
}


dayjs.prototype.toString = function(){
    return this.format("YYYY-MM-DD HH:mm:ss") //改成excel讀得懂的日期格式
    // return this.$d.toUTCString() 原本預設行為,this.$d是jd Date物件
}


//新增Plugin 和 wrapper

export {dayjs,locales}