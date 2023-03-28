import * as d3 from "d3"
import treeChart from "./_treeChart.mjs"


var descriptor = {
    deps:{min:1,max:1},
    inputs:{
        width:{type:"number",defaultValue:600},
        height:{type:"number",defaultValue:450},
        padding:{type:"text",defaultValue:"10,40,10,40"},
        fontSize:{type:"number",defaultValue:16},
        dotRadius:{type:"number",defaultValue:12},
        svgBGC:{type:"color",defaultValue:"#ffffff"},
        chartBGC:{type:"selection",options:["black","white"],defaultValue:"white"},
    }
}


function tree({datas,config}) {
    // treeChart.call(this,data,config,defaultConfig)
    for (var item in config){
        var confValue = config[item];
        !(confValue=== undefined) && (this[item]=confValue)
    }
    
    this.layout = d3.tree().separation(function(a,b){return (a.parent == b.parent)?1:1.5})
    treeChart.call(this,datas)

}

tree.prototype = Object.create(treeChart.prototype)
tree.prototype.constructor = tree

for(let config in descriptor.config){
    var confValue = descriptor.config[config].defaultValue;
    tree.prototype[config]=confValue
}

tree.prototype.renderBody = function () {
    console.log("render body")
    var linkData = this.data.descendants().slice(1)
    var link = this.svg.selectAll(".link")
                    .data(linkData)
                    .enter()
                    .append("g")
                    .attr("class","link")
                    .attr("transform",`translate(${this.padLeft},${this.padTop})`)
                    // .attr("transform",`translate(${padding},${height*0.63})`)
    link.append("path")
        .attr("fill","none")
        .attr("stroke","gray")
        .attr("stroke-width","1")
        .attr("d",function(d){
            var path = d3.path();
            path.moveTo(d.y, d.x);
            path.bezierCurveTo(
                (d.y + d.parent.y) / 2,
                d.x,
                (d.y + d.parent.y) / 2,
                d.parent.x,
                d.parent.y,
                d.parent.x
            );
            // console.log(path.toString())
            return path.toString();
        })



    var nodeData = this.data.descendants()
    var node = this.svg.selectAll(".node")
                    .data(nodeData)
                    .enter()
                    .append("g")
                    .attr("class","node")
                    .attr("transform",`translate(${this.padLeft},${this.padTop})`)

    node.append("circle")
        .attr("cx",function(d){return d.y})
        .attr("cy",function(d){return d.x})
        .attr("r",this.dotRadius)
        .attr("stroke","black")
        .attr("stroke-width",this.dotRadius/4)
        .attr("fill","white")
    node.append("text")
        .attr("class","nodeName")
        .attr("x",(d)=>{return d.y})
        .attr("y",(d)=>{return d.x+2*this.dotRadius+5})
        .attr("font-size",this.fontSize)
        .attr("text-anchor",function(d){
            return d.children?"middle":"end"
        })
        .text(function(d){return d.data.id})

}


export {
    tree as execute,
    descriptor
}