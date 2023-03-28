import * as d3 from "d3"
import axisChart from "./_axisChart.ts"
import cloneDeep from "lodash.cloneDeep" 
import ObjectArray from "../../util_data/ObjectArray.mjs"



var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:600},
        height:{type:"number",defaultValue:600},
        padding:{type:"text",defaultValue:"50,50,50,50"},
        dotRadius:{type:"number",defaultValue:3},
        fontSize:{type:"number",defaultValue:15},
        axisLine:{type:"checkbox",defaultValue:true},
        title:{type:"text",defaultValue:""},
        xLabel:{type:"text",defaultValue:""},
        yLabel:{type:"text",defaultValue:""},
        xOrigin:{type:"number",defaultValue:""},
        yOrigin:{type:"number",defaultValue:""},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#ffffff"},
    }
}



function scatter({datas,config}){

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    this.xScale = d3.scaleLinear()
    this.yScale = d3.scaleLinear()
    // this.colorScale = d3.scaleOrdinal(d3.schemeSet2)

    axisChart.call(this,datas)    
}

scatter.prototype = Object.create(axisChart.prototype)
scatter.prototype.constructor = scatter

for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    scatter.prototype[config]=confValue
}


scatter.prototype.transData = function (datas) {
    var data = datas[0].slice(1) //only support one dataSet
    var copyData = cloneDeep(data)
    var ObjectArrayData = ObjectArray(copyData,this.header)
    return ObjectArrayData
};

scatter.prototype.setDomain = function () {

    var xDomain = d3.extent(this.data,function(d){return d.x})
    var yDomian = d3.extent(this.data,function(d){return d.y})
    // console.log(minDay,maxDay)
    this.xScale.domain(xDomain).nice();
    //nice以一周的星期天為擴展基準,也有timeSecond timeDay和timeMonday timeMonth等等
    this.yScale.domain(yDomian).nice();
};

scatter.prototype.renderBody = function () {
    // console.log(usedData)
    var g = this.svg
        .append("g")
        .attr("class", "barGroup")
        .attr("transform", `translate(${this.padLeft},${this.padTop})`);
    var selection = g.selectAll(".dot").data(this.data);
    selection
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => {return this.xScale(d.x);})
        .attr("cy", (d) => {return this.yScale(d.y);})
        .attr("r", this.dotRadius)
        .attr("fill", (d) => {return "blue"})
};


export {
    scatter as execute,
    descriptor
}


