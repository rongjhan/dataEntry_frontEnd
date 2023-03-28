import * as d3 from "d3"
import chart from "../_chart.mjs"

// var needConfig = {
//     axisLine: true,
//     xScale: d3.scale, 
//     yScale: d3.scale,

// };

// var choiceableConfig = {
//     xOrigin: number,    //! defined after calling axisChart
//     yOrigin: number,    //! defined after calling axisChart
//     xTicks/yTicks : tickInterval || tickQuantity,
//     xTickFormat/yTickFormat : format function(){},
//     styleAxis : function(){},
// }

function axisChart(datas:any[][]) {
    chart.call(this)
    this.header = datas[0].slice(0,1)[0];
    this.data = this.transData(datas);
    this.xScale.range([0,this.chartWidth])
    this.yScale.range([this.chartHeight,0])
    this.setDomain(); // this.setDomain  defined by child class
    // console.log(this.xOrigin,this.yOrigin)
    this.xOrigin = (this.xOrigin)? this.xScale(this.xOrigin) : 0
    this.yOrigin = (this.yOrigin)? this.yScale(this.yOrigin) :this.chartHeight
    this.coverAxis = (this.xOrigin!=0)&&(this.yOrigin!=this.chartHeight)
}

axisChart.prototype = Object.create(chart.prototype)
axisChart.prototype.constructor = axisChart

axisChart.prototype.renderGridLine = function () {
    //多用一個axis來畫grid,如此axis與grid不相依,才不會造成grid畫到axis線上
    var grid = this.svg
                        .append("g")
                        .attr("class","coordinate grid")
                        .attr(
                            "transform", 
                            `translate(${this.padLeft},${this.padTop})`
                        )

    var xGrid = d3.axisBottom().scale(this.xScale).tickFormat("").tickSize(this.chartHeight)
    var yGrid = d3.axisLeft().scale(this.yScale).tickFormat("").tickSize(-this.chartWidth)
    grid.append("g")
        .attr("class","xGrid")
        .call(xGrid)
        .call((g)=>{
            g.select(".domain").remove()
            g.selectAll(".tick line").attr("stroke","#dfe6e9")
        })

    grid.append("g")
        .attr("class","yGrid")
        .call(yGrid)
        .call((g)=>{
            g.select(".domain").remove()
            g.selectAll(".tick line").attr("stroke","#dfe6e9")
        })
};    

axisChart.prototype.renderAxis = function () {
    //this ticks/tickformat attribute can defined by child Class
    //but also can ignore it ,beause undefined or null is working well 
    var xAxis = d3.axisBottom().scale(this.xScale)
                                .ticks(this.xTicks)
                                .tickFormat(this.xTickFormat)
    var yAxis = d3.axisLeft().scale(this.yScale)
                                .ticks(this.yTicks)
                                .tickFormat(this.yTickFormat)

    
    var axis = this.svg
            .append("g")
            .attr("class", "coordinate axis")
            .attr(
                "transform",
                `translate(${this.padLeft},${this.padTop})`
            )

    axis
        .append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${this.xOrigin},0)`)
        .call(yAxis)
        .call((g)=>{(this.xOrigin===0)&&g.select(".domain").remove()})
        // styleYAxis is function to modilfy axis, the argument in select.call method can't be undefined  
        // for example : (g) => {g.select(".domain").remove()}
    axis
        .append("g")
        .attr("class", "xAxis")
        .attr("transform",`translate(0,${this.yOrigin})`)
        .call(xAxis)
        .call((g)=>{(this.yOrigin===this.chartHeight)&&g.select(".domain").remove()})
        // this.yOrigin===this.chartHeight is default when bot set the yOrigin
};

axisChart.prototype.renderLabel = function () {
    this.yLabel&&(
    this.svg.append("text")
        .attr("text-anchor","middle")
        .attr("x",-(this.padTop+this.chartHeight/2))
        .attr("y",this.padLeft-50)
        .attr("transform",`rotate(-90)`)
        .text(this.yLabel)
    )

    this.xLabel&&(
    this.svg.append("text")
        .attr("text-anchor","middle")
        .attr("x",this.padLeft+this.chartWidth/2)
        .attr("y",this.padTop+this.chartHeight+50)
        .text(this.xLabel)
    )
};

axisChart.prototype.render = function() {

    if (this.axisLine) {this.renderGridLine();}
    // gridline should draw first then it can't cover other element
    this.renderBody();// this.renderBody  defined by child class

    if(this.coverAxis){
        this.renderAxis();
        this.rendersvgBGC()
    }else{
        this.rendersvgBGC()
        this.renderAxis()
    }


    this.renderBorder()

    this.svg.selectAll(".coordinate").call((coordinate)=>{
        this.styleAxis&&this.styleAxis(coordinate)
        coordinate.selectAll("text").attr("font-size",this.fontSize||12)
    })
    
    this.renderTitle()
    this.renderLabel()
    
    return this.svg.node()

};

export default axisChart
// exports.chart = axisChart