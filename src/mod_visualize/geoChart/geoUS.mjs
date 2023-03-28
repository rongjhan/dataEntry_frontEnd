import geoChart from "./_geoChart.mjs"
import * as d3 from "d3"
import us from "../../asset/us.geojson"


var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:730},
        height:{type:"number",defaultValue:350},
        padding:{type:"text",defaultValue:"20,20,20,20"},
        legendX:{type:"number",defaultValue:40},
        legendY:{type:"number",defaultValue:150},
        legendHeight:{type:"number",defaultValue:150},
        legendWidth:{type:"number",defaultValue:20},
        geoLevel:{type:"selection",options:["states"],defaultValue:"states"},
        areaId:{type:"selection",options:["name"],defaultValue:"name"},
        border:{type:"selection",options:["#C0C0C0"],defaultValue:"#C0C0C0"},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#F5F5F5"},
    }
}



function geoUS ({datas,config}){

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    geoChart.call(this,datas)
}

geoUS.prototype = Object.create(geoChart.prototype)
// 上述會回傳一個空物件但其__proto__為geoChart.prototype
// below two also work but have performance issue and deprecated soon
// Object.setPrototypeOf(geoUS.prototype,geoChart.prototype)
// geoUS.prototype.__proto__ = geoChart.prototype

geoUS.prototype.constructor = geoUS
//函數prototype自帶屬性constructor被洗掉,故此處重新附加


for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    geoUS.prototype[config]=confValue
}

geoUS.prototype.getTopoObject = (function(){
    return fetch(us).then(response => response.json())
})()

geoUS.prototype.graticule = undefined //此投影為特殊投影不適合畫經緯線
geoUS.prototype.projection = d3.geoAlbersUsa()
//d3.scale(650).translate([260, 153]) 此處不自定義投射的中央位置和縮放大小
//會於父類別的trnasData方法中調用 Projeciton.fitSize依地圖算出符合圖表大小的蘇放和位置
// d3.geoAlbersUsa().scale(1300).translate([487.5, 305])


export {
    geoUS as execute,
    descriptor
}