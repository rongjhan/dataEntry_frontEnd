// var excelToJsDate = require("../../util_data/excelToJsDate")
//已假設接收資料日期已剔除休市日
import * as d3 from "d3"
import axisChart from "./_axisChart.ts"
import ObjectArray from "../../util_data/ObjectArray.mjs"


var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:700},
        height:{type:"number",defaultValue:400},
        padding:{type:"text",defaultValue:"50,50,50,70"},
        // dateType:{type:"selection",options:["excelValue", "jsValue"],defaultValue:"excelValue"},
        dateBasis:{type:"selection",options:["民國","西元"],defaultValue:"民國"},
        axisLine:{type:"checkbox",defaultValue:true},
        fontSize:{type:"number",defaultValue:15},
        // yOrigin:{type:"number",defaultValue:undefined},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"selection",options:["black","white"],defaultValue:"white"},
    }
}


function candleStick({datas, config}) {
    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) &&(this[item]=confValue)
    }
    // this.xScale = d3.scaleTime().range([0, this.width - 2 * this.padding]);
    this.xScale = d3.scaleBand().padding(0.2);
    this.yScale = d3.scaleLinear()
    axisChart.call(this,datas)
    
}

candleStick.prototype = Object.create(axisChart.prototype)
candleStick.prototype.constructor = candleStick


for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    candleStick.prototype[config]=confValue
}

candleStick.prototype.transData = function (datas) {
    
    var data = datas[0].slice(1) //only support one dataSet
    var objectArrayData = ObjectArray(data,this.header)
    objectArrayData = objectArrayData.map((d) => {
        //將日期轉為Date物件  日期格式須為 年/月/日
        var dayArray = d["日期"].split("/");
        dayArray[1] = dayArray[1] * 1 - 1; //月份為zero index
        if (this.dateBasis == "民國") {
            dayArray[0] = dayArray[0] * 1 + 1911;
        }
        d["日期"] = new Date(...dayArray);
        return d;
    });

    console.log(objectArrayData)
    return objectArrayData;
};

candleStick.prototype.setDomain = function () {
    var dayRange = d3.extent(this.data, (d) => {
        return new Date(d["日期"])
    })
    //重新new一個 Date 後面操作才不會改變原資料
    dayRange[1].setDate(dayRange[1].getDate() + 1)
    //最後日期加一,在timeDay.range才會產生正確結果
    var xDomain = d3.timeDay
        .range(dayRange[0], dayRange[1])
        .filter(d => d.getDay() !== 0 && d.getDay() !== 6)
    var yDomainMin = d3.min(this.data, (d) => {
        return d["最低價"];
    });
    var yDomainMax = d3.max(this.data, (d) => {
        return d["最高價"];
    });
    this.xScale.domain(xDomain);
    this.yScale.domain([yDomainMin, yDomainMax]).nice();
    // console.log(this.xScale.domain(),this.yScale.domain())
};

candleStick.prototype.xTickFormat = function (x, i, a) {return d3.timeFormat("%-m/%-d")(x);}
candleStick.prototype.yTickFormat = function (x, i, a) {return  "NT" + x}

candleStick.prototype.styleAxis = function (coordinate) {
    coordinate.select(".yAxis").select(".domain").remove()
    coordinate.selectAll(".xGrid .tick").remove()
}

candleStick.prototype.renderBody = function () {
    var drawArea = this.svg.append("g")
        .attr("class", "drawArea")
        .attr("transform", `translate(${this.padLeft},${this.padTop})`)

    var selection = drawArea.selectAll(".dayStock").data(this.data).enter()

    //render 最高點最低點價
    selection
        .append("g")
        .attr("class", "dayStock")
        .attr("transform", (d) => {
            return `translate(${this.xScale(d["日期"])+(this.xScale.bandwidth()/2)},0)`
        })
        .append("line")
        .attr("class", "highLow")
        .attr("x1", 0)
        .attr("y1", (d) => {
            return this.yScale(d["最高價"])
        })
        .attr("x2", 0)
        .attr("y2", (d) => {
            return this.yScale(d["最低價"])
        })
        .attr("stroke", ()=>{return (this.chartBGC=="black")?"white":"black"})
        .attr("stroke-width", 2)
    
    //render 開盤收盤價
    selection.append("rect")
        .attr("class", "openClose")
        .attr("transform", (d) => {
            return `translate(${this.xScale(d["日期"])+(this.xScale.bandwidth()/2)},0)`
        })
        .attr("x", -this.xScale.bandwidth() / 2)
        .attr("y", (d) => {
            return this.yScale(Math.max(d["開盤價"], d["收盤價"]))
        })
        .attr("width", this.xScale.bandwidth())
        .attr("height", (d) => {
            var extent = d3.extent([d["開盤價"], d["收盤價"]])
            var height = this.yScale(extent[0]) - this.yScale(extent[1])
            return height
        })
        .attr("rx", this.xScale.bandwidth() / 4)
        .attr("fill", (d) => {
            if (d["收盤價"] < d["開盤價"]) {
                return "red"
            }
            return "green"
        })
}


export {
    candleStick as execute,
    descriptor
}
