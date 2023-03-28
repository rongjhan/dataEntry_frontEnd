import * as d3 from "d3"
import axisChart from "./_axisChart.ts"
import cloneDeep from "lodash.cloneDeep" 


var descriptor = {
    deps:{min:0,max:0},
    inputs:{
        width:{type:"number",defaultValue:600},
        height:{type:"number",defaultValue:600},
        padding:{type:"text",defaultValue:"50,50,50,50"},
        relationFunc:{type:"textarea",defaultValue:"return Math.pow(x,2)"},
        dotDensity:{type:"number",defaultValue:80},
        axisLine:{type:"checkbox",defaultValue:true},
        fontSize:{type:"number",defaultValue:15},
        xOrigin:{type:"number",defaultValue:""},
        yOrigin:{type:"number",defaultValue:""},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#ffffff"},
    }
}



function relation({datas,config}){
    
    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    this.relationFunc = new Function("x",this.relationFunc)
    this.xScale = d3.scaleLinear()
    this.yScale = d3.scaleLinear()
    // this.colorScale = d3.scaleOrdinal(d3.schemeSet2)

    axisChart.call(this,datas) 

}

relation.prototype = Object.create(axisChart.prototype)
relation.prototype.constructor = relation

for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    relation.prototype[config]=confValue
}

relation.prototype.transData = function (datas) {
    var data = datas[0].slice(1) //only support one dataSet
    var copyData = cloneDeep(data)
    return copyData
};

relation.prototype.setDomain = function () {
    var func = this.relationFunc
    var xMin = d3.min(this.data,function(d){return d[0]})
    var xMax = d3.max(this.data,function(d){return d[1]})
    console.log([func(xMin),func(xMax)])
    var ydomain = [func(xMin),func(xMax)].sort((a,b)=>{
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    })
    
    // console.log(minDay,maxDay)
    this.xScale.domain([xMin,xMax]).nice();
    //nice以一周的星期天為擴展基準,也有timeSecond timeDay和timeMonday timeMonth等等
    this.yScale.domain(ydomain).nice();
};

relation.prototype.renderBody = function () {
    // console.log(usedData)
    var body = this.svg
        .append("g")
        .attr("class", "line")
        .attr("transform", `translate(${this.padLeft},${this.padTop})`);

    var ticks = this.xScale.ticks(this.dotDensity)
    var lineGenerator = d3.line()
                        .x((d)=>{return this.xScale(d)})
                        .y((d)=>{ return this.yScale(this.relationFunc(d))})

    for( var segment of this.data){

        var filter = ticks.filter(function(value){
            return (value>=segment[0])&&(value<=segment[1])
        })

        body.append("g")
            .attr("class", "lineSegment")
            .datum(filter)
            .append("path")
            .attr("d",(d)=>{return lineGenerator(d)})
            .attr("stroke","black")
            .attr("stork-width",3)
            .attr("fill","none")//prevent the path closed automatically

    }
    
};



export {
    relation as execute,
    descriptor
}



function a (x) {
    // var sqrt = Math.sqrt, pow = Math.pow, e = Math.E, pi = Math.PI;
    // var a = 1 / (Math.sqrt(2 * Math.PI));
    // return (1/Math.sqrt(2*Math.PI))*Math.exp(x**2/-2)
    return (1 / (Math.sqrt(2 * Math.PI)))*Math.pow( Math.E, -(x**2)/2)
}