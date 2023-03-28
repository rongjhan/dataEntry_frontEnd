function create(svg) {

    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    return tooltip
}


function tooltip(selection){

    var tooltip = create(this.svg)
    
    
    selection
        .on("mouseover", () => {
            tooltip.style("display", null);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        })
        .on("mousemove", (e) => {
            var inverse = this.svg.node().getScreenCTM().inverse()

            var xPosition = e.clientX* inverse.a + inverse.e - 15;
            var yPosition = e.clientY* inverse.d + inverse.f - 25 
            //在各方向上減去長寬尺寸,讓其顯示於數標上方
            //getscreenCTM 是用於client座標的轉換,故此用clientX而非相對於document的offsetX

            // console.log(e)
            // if (navigator.userAgent.match("Edge")) {
            //     console.log("edge")
            //     // taskpane has IE render behavior but js console is old edge(not chromium)
            //     xPosition = xPosition+ this.padLeft
            //     yPosition = yPosition + this.padTop
            //     // IE calculate coordinate related to "g" after transformed ,but chrome not
            // }


            // console.log(e,inverse,xPosition,yPosition)
            tooltip.attr("transform", "translate(" +xPosition+ "," + yPosition + ")")
            tooltip.select("text").text(e.target.getAttribute("data-value"));
            // this.tooltip.select("text").text(`${e.offsetX}/${e.offsetY}`);
        })
}

export {tooltip}