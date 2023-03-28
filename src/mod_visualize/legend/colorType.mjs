function legend(legendGroup) {

        var size = this.legendHeight - this.legendPad
        var legendSet = legendGroup
                .selectAll(".legend")
                .data(this.colorScale.domain())
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => {
                        return `translate(0,${i*this.legendHeight})`
                })
        legendSet.append("rect")
                .attr("fill", (d) => {
                        return this.colorScale(d)
                })
                .attr("width", size)
                .attr("height", size)
        legendSet.append("text")
                .style("font-size", `${size}px`)
                .attr("x", this.legendHeight)
                .attr("y", "0.8em")
                .text((d) => { return d})

}


export{legend}