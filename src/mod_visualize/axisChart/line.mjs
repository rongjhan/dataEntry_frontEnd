import * as d3 from "d3"
import axisChart from "./_axisChart.ts"
import cloneDeep from "lodash.cloneDeep" 


var TimeUnit = {
    month:d3.timeMonth.every(3),
    week: d3.timeWeek,
    fourDay: d3.timeDay.every(4),
    day: d3.timeDay,
    halfDay: d3.timeHour.every(12),
    hour: d3.timeHour,
    minute: d3.timeMinute,
    second: d3.timeSecond
};



var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:800},
        height:{type:"number",defaultValue:300},
        padding:{type:"text",defaultValue:"60,60,80,80"},
        extendUnit:{type:"selection",options:["month","day","week","fourDay", "hour"],defaultValue:"month"},
        axisUnit:{type:"selection",options:["month","week","day", "halfDay", "hour", "minute", "second","fourDay"],defaultValue:"month"},
        axisLine:{type:"checkbox",defaultValue:true},
        marker:{type:"checkbox",defaultValue:false},
        fontSize:{type:"number",defaultValue:13},
        title:{type:"text",defaultValue:""},
        xLabel:{type:"text",defaultValue:""},
        yLabel:{type:"text",defaultValue:""},
        dotRadius:{type:"number",defaultValue:4},
        xOrigin:{type:"number",defaultValue:""},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"color",defaultValue:"#ffffff"},
    }
}

function line({datas,config}){

    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }

    this.xScale = d3.scaleTime()
    this.yScale = d3.scaleLinear()
    this.colorScale = d3.scaleOrdinal(d3.schemeSet2)
    // .domain(["project1", "project2", "project3"]);

    this.extendUnit = TimeUnit[this.extendUnit]
    this.xTicks = TimeUnit[this.axisUnit] 

    axisChart.call(this,datas)    
}

line.prototype = Object.create(axisChart.prototype)
line.prototype.constructor = line

for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    line.prototype[config]=confValue
}

line.prototype.transData = function (datas) {
    var data = datas[0].slice(1) //only support one dataSet
    var copyData = cloneDeep(data)
    var transData =copyData.map(function (d) {
        var day = d[0]
        d[0] = new Date(day.slice(6),day.slice(3,5)*1-1,day.slice(0,2))
        d[1] = d[1].toString().replace(",","")
        return d
    })
    console.log(transData)
    return transData
};

line.prototype.setDomain = function () {

    var xDomain = d3.extent(this.data, function (d) {
        return d[0];
    });
    var yDomain = d3.extent(this.data, function (d) {
        return d[1];
    });

    // console.log(minDay,maxDay)
    this.xScale.domain(xDomain).nice(this.extendUnit);
    //nice以一周的星期天為擴展基準,也有timeSecond timeDay和timeMonday timeMonth等等
    this.yScale.domain(yDomain).nice();
    // var d = this.yScale.domain()
    // d[1] = d[0]+2200
    // this.yScale.domain(d);
};

line.prototype.renderBody = function () {
    var radius = this.dotRadius

    if(this.marker){
        this.svg 
        .append("svg:defs")
        .append("svg:marker")
        .attr('viewBox', [0, 0, radius*2, radius*2])
        .attr("id","dot")
        .attr('refX', radius)
        .attr('refY', radius)
        .attr('markerWidth',radius)
        .attr('markerHeight',radius)
        .append("circle")
        .attr("cx",radius)
        .attr("cy",radius)
        .attr("r", radius)
        .attr("fill", (d) => {return "blue"})
    }


    var body = this.svg
        .append("g")
        .attr("class", "barGroup")
        .attr("transform", `translate(${this.padLeft},${this.padTop})`);

        
    var lineGenerator = d3.line()
                            .x((d)=>{return this.xScale(d[0])})
                            .y((d)=>{return this.yScale(d[1])})

    body.append("path")
        .attr("class","line")
        .datum(this.data)
        .attr("d",(d)=>{return lineGenerator(d)})
        .attr("marker-start","url(#dot)")
        .attr("marker-mid","url(#dot)")
        .attr("marker-end","url(#dot)")
        .attr("stroke","black")
        .attr("fill","none")


};

line.prototype.xTickFormat = function(x,i,a){
    return d3.timeFormat("%y-%b")(x); //
}

line.prototype.styleAxis = function(coordinate){
    coordinate.select(".yAxis").select(".domain").remove()
    coordinate.select(".xAxis").selectAll("text").attr("transform",`translate(-10,10) rotate(-45)`)
}



export {
    line as execute,
    descriptor
}
