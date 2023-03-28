import * as d3 from "d3"
import chart from "../_chart.mjs"
import ObjectArray from "../../util_data/ObjectArray.mjs"
// var needConfig = {
//     layout: d3.tree(),  
// };

function treeChart(datas) {
  chart.call(this)
  this.layout.size([this.chartHeight,this.chartWidth])
  this.header = datas[0].slice(0,1)[0];
  this.data = this.transData(datas);
}


treeChart.prototype = Object.create(chart.prototype)
treeChart.prototype.constructor = treeChart

treeChart.prototype.transData = function (datas){

    var data = datas[0].slice(1) //only support one dataSet
    
    //stratify用於將二維表格(物件陣列),轉換為階層json資料
    var stratify = d3.stratify()
                    .id(function(d){return d.Name})
                    .parentId(function(d){return d.Parent})

    var hierarchyData = d3.hierarchy(stratify(ObjectArray(data,this.header)))
    return this.layout(hierarchyData)
}


treeChart.prototype.render = function(){

    this.rendersvgBGC()
    this.renderBody()
    this.renderTitle()

    // svgEntry.appendChild(this.svg.node())
    return this.svg.node()

}


export default treeChart
