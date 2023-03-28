import * as d3 from "d3"
// var needConfig = {
//     width: 700,
//     height: 400,
//     padding: "50,50,50,50",
//     svgBGC:"white",
//     chartBGC:"white",
//     
// };

function chart() {

    this.setPadding(this.padding)
    this.chartWidth = this.width - this.padLeft - this.padRight
    this.chartHeight = this.height - this.padTop - this.padBottom
    this.svg = this.createSvg()
}

chart.prototype.setPadding = function(padding){
    var padArray = padding.split(",")

    switch(padArray.length){
        case 1:
            padArray.length=4
            padArray.fill(padArray[0],1,4)
            break;
        case 2:
            padArray.splice(2,0,...padArray)
            break;
        case 3:
            padArray.push(padArray[2])
            break;
    }

    this.padTop = parseInt(padArray[0])
    this.padRight = parseInt(padArray[1])
    this.padBottom = parseInt(padArray[2])
    this.padLeft = parseInt(padArray[3])
}

chart.prototype.renderTitle = function(){
    //it aboout the drawing order so it called by child class
    var size = 20

    this.title&&(
    this.svg.append("text")
            .attr("x",this.chartWidth/2 + this.padLeft)
            .attr("y",this.padTop-5)
            .attr("text-anchor","middle")
            .attr("font-size",size)
            .text(this.title)
    )    

}

chart.prototype.rendersvgBGC = function(){
    //it can cover everything exceed the chart
    //it aboout the drawing order so it called by child class
    this.svg.append("path")
    .attr("d",`M${this.padLeft} ${this.padTop} v${this.chartHeight} h${this.chartWidth} v${-this.chartHeight} h${-this.chartWidth} M0 0 h${this.width} v${this.height} h${-this.width} v${-this.height}`)
    .attr("stroke",this.svgBGC)
    .attr("fill",this.svgBGC)
}

chart.prototype.renderBorder = function(){
    this.svg.append("path")
    .attr("d",`M${this.padLeft} ${this.padTop} v${this.chartHeight} h${this.chartWidth} v${-this.chartHeight} h${-this.chartWidth}`)
    .attr("stroke","black")
    .attr("fill","none")
}

chart.prototype.createSvg= function(){
    var svg = d3.create("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .style("border", "2px solid black")
                

    svg.append("rect")
        .attr("x",this.padLeft)
        .attr("y",this.padTop)
        .attr("width",this.chartWidth)
        .attr("height",this.chartHeight)
        .attr("fill",this.chartBGC)
        .attr("stroke","none")
    // nested svg內部svg元素並非完全視為一般dom元素
    // 故無法設置style背景色,此用一個滿版rect當作背景色
    
    return svg
}


export default chart
