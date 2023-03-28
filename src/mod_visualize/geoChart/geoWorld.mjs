import geoChart from "./_geoChart.mjs"
import * as d3 from "d3"
import world from "../../asset/world.geojson"


var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:1000},
        height:{type:"number",defaultValue:500},
        padding:{type:"text",defaultValue:"40,65,40,65"},
        legendX:{type:"number",defaultValue:100},
        legendY:{type:"number",defaultValue:250},
        legendHeight:{type:"number",defaultValue:150},
        legendWidth:{type:"number",defaultValue:20},
        geoLevel:{type:"selection",options:["countries","land"],defaultValue:"countries"},
        areaId:{type:"selection",options:["name"],defaultValue:"name"},
        border:{type:"selection",options:["#C0C0C0"],defaultValue:"#C0C0C0"},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#F5F5F5"},
    }
}


function geoWorld ({datas,config}){

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    geoChart.call(this,datas)

    // geoChart.call(this,data,config,defaultConfig)
}

geoWorld.prototype = Object.create(geoChart.prototype)
// 上述會回傳一個空物件但其__proto__為geoChart.prototype
// below two also work but have performance issue and deprecated soon
// Object.setPrototypeOf(geoWorld.prototype,geoChart.prototype)
// geoWorld.prototype.__proto__ = geoChart.prototype

geoWorld.prototype.constructor = geoWorld
//函數prototype自帶屬性constructor被洗掉,故此處重新附加


for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    geoWorld.prototype[config]=confValue
}

geoWorld.prototype.getTopoObject = (function(){
    return fetch(world).then(response => response.json())
})()
geoWorld.prototype.graticule = d3.geoGraticule().step([10,10])
//step表示多少經緯度繪製一條經緯線
geoWorld.prototype.projection = d3.geoEquirectangular()
//d3.geoEquirectangular()此處不自定義投射的中央位置和縮放大小
//會於父類別的trnasData方法中調用 Projeciton.fitSize依地圖算出符合圖表大小的蘇放和位置



export {
    geoWorld as execute,
    descriptor
}