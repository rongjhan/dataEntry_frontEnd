import * as d3 from "d3"
function legend(legendGroup) {

    var levelArray = this.colorScale.range().reverse()
    var levelSize = this.legendHeight / levelArray.length

    legendGroup.attr("transform", `translate(${this.legendX},${this.legendY})`)
    legendGroup.selectAll(".level")
        .data(levelArray)
        .enter()
        .append("rect")
        .attr("class", "level")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * levelSize
        })
        .attr("height", levelSize)
        .attr("width", this.legendWidth)
        .attr("fill", function (d) {
            return d
        })
    var axis = d3.axisRight().scale(this.legendScale).ticks(4)

    legendGroup.append("g")
        .attr("class", "legendAxis")
        .attr("transform", `translate(${this.legendWidth},0)`)
        .call(axis)

}


export {legend}