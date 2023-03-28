import {tooltip} from "../tooltip/tooltip.mjs"
import {legend} from "../legend/colorType.mjs"
import * as d3 from "d3"
import axisChart from "./_axisChart.ts"
import cloneDeep from "lodash.cloneDeep" 


var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:600,required:true},
        height:{type:"number",defaultValue:450,required:true},
        padding:{type:"text",defaultValue:"40,60,40,60",required:true},
        fontSize:{type:"number",defaultValue:15,required:true},
        axisLine:{type:"checkbox",defaultValue:true},
        legendHeight:{type:"number",defaultValue:12,required:true},
        legendWidth:{type:"number",defaultValue:60,required:true},
        legendPad:{type:"number",defaultValue:1,required:true},
        svgBGC:{type:"color",defaultValue:"#ffffff",required:true},
        chartBGC:{type:"color",defaultValue:"#ffffff",required:true},
    }
}


function stackBar({datas,config}) {

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    this.xScale = d3.scaleBand().paddingInner(0.1).paddingOuter(0.2)
    this.yScale = d3.scaleLinear()
    this.colorScale = d3.scaleOrdinal(d3.schemeSet2)
    
    axisChart.call(this,datas)

}

stackBar.prototype = Object.create(axisChart.prototype)
stackBar.prototype.constructor = stackBar

for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    stackBar.prototype[config]=confValue
}

stackBar.prototype.transData = function(datas){
    console.log(datas)
    var data = datas[0].slice(1) //only support one dataSet
    //it should call after defining this header 
    var rawData = cloneDeep(data)  //因為cache資料會複用,以防未來會破壞原資料,故用複製品來操作
    var transformedData = rawData.map((d)=>{
        var row = {}
        for(var i=0;i<this.header.length;i++){
            row[this.header[i]]=d[i]
        }  
        return row
    })

    var stackedData = d3.stack().keys(this.header.slice(1))(transformedData)
    // console.log(this.header.slice(1),transformedData,stackedData)
    return stackedData
}

stackBar.prototype.setDomain = function(){
        var xDomain = this.data[0].map((d)=>{
            return d.data[this.header[0]]
        })

        var yMax = d3.max(this.data[this.data.length-1],function(d){
            return d[1]
        })

        this.xScale.domain(xDomain)
        //nice需在每次domain更新後重新調用
        this.yScale.domain([0,yMax]).nice()
        this.colorScale.domain(this.header.slice(1))
}

stackBar.prototype.styleAxis = function(coordinate){
    coordinate.selectAll(".xGrid .tick").remove()
}

stackBar.prototype.renderBody= function(){
        
        for (const keyData of this.data){
            // console.log(keyData)
            var key = keyData.key
            
            var selection = this.svg.append("g")
                                .attr("transform", `translate(${this.padLeft},${this.padTop})`)
                                .attr("class",`group${key}`)
                                //類別為數字開頭時,選擇器會發生錯誤,須轉譯,此處避免麻煩前面加上group
                                .selectAll(`.stack`)
                                .data(keyData)
                                
            selection.enter()
                .append("rect")
                .attr("class",`_${key}`)
                .classed("stack",true)
                .attr("data-value",(d)=>{return d[1]-d[0]})
                .attr("x",(d)=>{return this.xScale(d.data[this.header[0]])}) 
                 //d等於 [0,3840] =>(with attribute data)
                .attr("width",(d)=>{return this.xScale.bandwidth()})
                .attr("y",this.height-2*this.padBottom) //don't figure out why 2*this.padding yet
                .attr("height",0)
                .attr("fill",(d)=>{return this.colorScale(key)})
                .attr("fill-opacity",1)
                //綁定事件selection.on()須於transition之前綁定,
                //因為transition  selection也有一個同名函數transition.on(),兩者同名但作用不同
                .transition().duration(1000)
                .attr("y",(d)=>{return this.yScale(d[1])})
                .attr("height",(d)=>{return this.yScale(d[0])-this.yScale(d[1])})
        }

        this.renderLegend()
        this.svg.selectAll(".stack").call(tooltip.bind(this))
        //tooltip should create after all element then it can shown on highest level
        
}

stackBar.prototype.renderLegend =function(){

    this.svg.append("g")
            .attr("class","legendSet")
            .attr("transform", `translate(${this.width-this.padRight},${this.padTop})`)
            .call(legend.bind(this))
}




export {
    stackBar as execute,
    descriptor
}








//!commet below is temporarily data for test code

// var importData = [
//     ["month","apples","bananas"],
//     ["2015/1/1","3840","1920"],
//     ["2015/2/1","1600","1440"]
// ]

// var transData = [
//     {month: "2015/1/1", apples:3840, bananas:1920},
//     {month: "2015/2/1", apples:1600, bananas:1440},
// ];

// var stackedLayoutData = [
//      [               =>(with attribute key, ex:"apples")   
//          [0,3840],   =>(with attribute data, ex:{month: "2015/1/1", apples:3840, bananas:1920})
//          [0,1600]
//      ],              
//      [                 =>(with attribute key, ex:"bananas")
//          [3840,5760],  =>(with attribute data)
//          [1600,3040]
//      ]               
// ]  



