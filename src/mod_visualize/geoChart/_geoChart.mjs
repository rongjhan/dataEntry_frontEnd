import * as d3 from "d3"
import * as topojson from "topojson"
import chart from "../_chart.mjs"
import {legend} from "../legend/colorLevel.mjs"
// var needConfig = {
//     geoLevel: county,
//     areaId: "name",
//     projection: d3.projection,
//     getTopoObject : function(){}
//     
// };

function geoChart(datas) {
    chart.call(this)

    this.colorScale = d3.scaleQuantize(d3.schemeYlOrRd[9]);
    this.legendScale = d3.scaleLinear().range([this.legendHeight, 0])
    //將連續域對應離散的等級,預設分為10個顏色等級,
    this.data = this.transData(datas) 
}

geoChart.prototype = Object.create(chart.prototype)
geoChart.prototype.constructor = geoChart

geoChart.prototype.transData = function(datas){
        var data =datas[0].slice(1) //only support one dataSet
        // this.getTopoObject  defined by child class
        return this.getTopoObject.then((topoObject)=>{
        //this must use arrow function because the "this" problem

        console.log(topoObject)
        // var geojson = topojson.feature(topoObject.default, topoObject.default.objects[this.geoLevel])
        var geojson = topojson.feature(topoObject, topoObject.objects[this.geoLevel])
        // for (var a of geojson.features){
        //   console.log(a)
        //   a is an Object have three attribute{geometry,properties,type} 
        // }
        this.projection.fitSize([this.chartWidth,this.chartHeight],geojson)
        this.projection.clipExtent&&this.projection.clipExtent([[0,0],[this.chartWidth,this.chartHeight]])
        //clipExtent為了截斷超過之經緯線,有些投影並不支持此方法
        var areaCollection = geojson.features
        // console.log(areaCollection)
        for (var area of areaCollection) {

            var target = data.find((element) => {
                var match = (area.properties[this.areaId] == element[0])
                // match||console.log("unmatchedData:",element[0])
                return match
            })
            // console.log(target,area.properties)
            target?(area.properties.index = target[1]):(area.properties.index = null)
        }

        return areaCollection
        // console.log(this.data)
    })
}

geoChart.prototype.setDomain = function (transdata) {

    var domain = d3.extent(transdata, function (d) {
        return d.properties.index
    })
    this.colorScale.domain(domain).nice()
    this.legendScale.domain(this.colorScale.domain())
    // console.log(domain)
}

geoChart.prototype.renderBody = function (transdata) {

    var unFillArea =[]
     // this.projection  defined by child class
    // var projection = this.projection.fitSize([this.chartWidth,this.chartHeight],transdata)


    var geoGenerator = d3.geoPath(this.projection);

    var graticule = this.graticule

    var body = this.svg.append("g")
                        .attr("class","map")
                        .attr("transform",`translate(${this.padLeft},${this.padTop})`)
    // console.log(transdata)
    // console.log(graticule())

    //render經緯座標
    this.graticule && (body.selectAll('path.graticule')
        .data( [this.graticule()])
        .enter()
        .append('path')
        .classed('graticule', true)
        .attr("d",geoGenerator)
        .attr("stroke-dasharray",2)
        .attr("stroke","#dfe6e9")//"#dfe6e9"
    )

    //render地圖
    body.selectAll(".area")
        .data(transdata)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("d", geoGenerator)
        .attr("stroke-width",1)
        .attr("stroke", this.border||"black")
        .attr("fill", (d) => {
            var fillColor = d.properties.index?this.colorScale(d.properties.index):(unFillArea.push(d.properties.name),"darkgray")//"white"
            return fillColor
        })


    console.log("unFillArea:",unFillArea)

    //也可把整個台灣當作一個整體資料繪製而非分成各個鄉鎮繪製,如下只會產生一個path元素
    //利用datum綁定元素是不會有enter和update的概念,因為其對所有元素綁定同一個資料
    // var topoObject = JSON.parse(genTopo());
    // var geojson = topojson.feature(topoObject, topoObject.objects.COUNTY_MOI_1090820)
    // console.log(topoObject,geojson)
    // this.svg
    //    .append("path")
    //    .datum(geojson)
    //    .attr("d",geoGenerator)
    //    .attr("stroke","black")
    //    .attr("fill","none")
};



geoChart.prototype.renderLegend = function () {

    this.svg.append("g")
        .attr("class", "legend")
        .call(legend.bind(this))
    
}

geoChart.prototype.addBehave = function () {
    var index = this.svg.select(".legend")
        .append("line")
        .attr("class", "index")
        .attr("x1", 0)
        .attr("x2", this.legendWidth)
        .attr("y1", this.legendHeight)
        .attr("y2", this.legendHeight)
        .attr("stroke-width", 2)
        .attr("stroke", "black")

    this.svg.selectAll(".area").on("mouseenter", (e) => {
        var areaInfo = e.target.__data__
        var indexLocation = this.legendScale(areaInfo.properties.index)
        index.transition().ease(d3.easeBackInOut)
            .attr("y1", indexLocation)
            .attr("y2", indexLocation)
    })
    this.svg.selectAll(".area").on("mouseleave", (e) => {
        index.transition().ease(d3.easeSin)
            .attr("y1", this.legendHeight)
            .attr("y2", this.legendHeight)
    })

}

geoChart.prototype.render = async function () {
        var transData = await this.data
        this.setDomain(transData)
        this.renderBody(transData)
        this.rendersvgBGC()
        this.renderBorder()
        this.renderTitle()
        this.renderLegend()
        this.addBehave()
        // svgEntry.appendChild(this.svg.node())
        return this.svg.node()
}

export default geoChart