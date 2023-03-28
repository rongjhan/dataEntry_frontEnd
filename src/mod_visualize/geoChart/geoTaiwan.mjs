import geoChart from "./_geoChart.mjs"
import taiwan from "../../asset/taiwan.geojson"
import * as d3 from "d3"



var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:500},
        height:{type:"number",defaultValue:500},
        padding:{type:"text",defaultValue:"20,20,20,20"},
        legendX:{type:"number",defaultValue:60},
        legendY:{type:"number",defaultValue:300},
        legendHeight:{type:"number",defaultValue:150},
        legendWidth:{type:"number",defaultValue:20},
        geoLevel:{type:"selection",options:["COUNTY_MOI_1090820"],defaultValue:"COUNTY_MOI_1090820"},
        areaId:{type:"selection",options:["COUNTYNAME"],defaultValue:"COUNTYNAME"},
        border:{type:"selection",options:["black"],defaultValue:"black"},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#F5F5F5"},
    }
}


function geoTaiwan ({datas,config}){

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }
    geoChart.call(this,datas)
}

geoTaiwan.prototype = Object.create(geoChart.prototype)
// 上述會回傳一個空物件但其__proto__為geoChart.prototype
// below two also work but have performance issue and deprecated soon
// Object.setPrototypeOf(geoTaiwan.prototype,geoChart.prototype)
// geoTaiwan.prototype.__proto__ = geoChart.prototype 

geoTaiwan.prototype.constructor = geoTaiwan
//函數prototype自帶屬性constructor被洗掉,故此處重新附加


for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    geoTaiwan.prototype[config]=confValue
}


geoTaiwan.prototype.getTopoObject = (function(){
    var origin = document.location.origin
    return fetch(taiwan).then(response => response.json())
})()
geoTaiwan.prototype.graticule = d3.geoGraticule().step([1,1]).extent([[110,30],[130,20]])
//step表示多少經緯度繪製一條經緯線
//extent將座標範圍限制在台灣本島,不用設置也沒關西,會預設繪製全球經緯線
geoTaiwan.prototype.projection = d3.geoMercator()
//d3.geoMercator().center([123, 24]).scale(5500) 此處不自定義投射的中央位置和縮放大小
//會於父類別的trnasData方法中調用 Projeciton.fitSize依地圖算出符合圖表大小的蘇放和位置



export {
    geoTaiwan as execute,
    descriptor
}