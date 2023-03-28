import numeral from "numeral"
import "numeral/locales/chs.js"  //引入即代表register該locale(看引入方法即知是sideEffect module)
//或者直接引入"numeral/locales.js" 會register所有內建支持的locale
numeral.register('locale', "zh-tw", {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: '千',
        million: '百萬',
        billion: '十億',
        trillion: '兆'
    },
    ordinal: function (number) {
        return '.';
    },
    currency: {
        symbol: 'NT$'
    }
});//numeral 無內建台灣locale 需自行設置,locale預設為en,因此en不必特別register

numeral.fn.toString = function(){
    return "N:"+this._input
}//目前沒用到

var locales = { //為了統一 numeraljs 和 dayjs locale的寫法
    "zh-CN":"chs",
    "en":"en",
    "zh-TW":"zh-tw"
}

export {numeral,locales}