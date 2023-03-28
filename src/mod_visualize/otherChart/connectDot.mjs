import * as d3 from "d3"
import chart from "../_chart.mjs"
// var importData = [[boy,girl],[alan,sophia],[eric,amy]] 
// var usedData = [[alan,sophia],[eric,amy]] 
// [boy,girl]為header資訊



var descriptor = {
  deps:{min:1,max:1},
  inputs:{
    width:{type:"number",defaultValue:400},
    height:{type:"number",defaultValue:450},
    padding:{type:"text",defaultValue:"20,20,20,20"},
    fontSize:{type:"number",defaultValue:18},
    dotRadius:{type:"number",defaultValue:4},
    svgBGC:{type:"color",defaultValue:"#ffffff"},
    chartBGC:{type:"selection",options:["black","white"],defaultValue:"white"},
  }
}



function connectDot({datas, config}) {

  for (var item in config){
    var confValue = config[item];
    !(confValue=== undefined) &&(this[item]=confValue)
  }

  chart.call(this)

  this.dotScale = d3.scaleBand().range([0,this.chartHeight]).paddingOuter(0.63).paddingInner(1);
  this.data = this.transData(datas)
  this.setDomain()
  
}

connectDot.prototype = Object.create(chart.prototype)
connectDot.prototype.constructor = connectDot

for(let config in descriptor.config){
  var confValue = descriptor.config[config].defaultValue;
  connectDot.prototype[config]=confValue
}

connectDot.prototype.transData = function (datas){
      return datas[0] 
      //it only support one dataset even if dataSet array been send in
}

connectDot.prototype.setDomain = function (){
  this.dotScale.domain([...Array(this.data.length).keys()])
}

connectDot.prototype.renderBody = function () {

  var leftDot = this.svg
    .selectAll(".leftDot")
    .data(this.data)
    .enter()
    .append("g")
    .attr("class", "leftDot")
    .attr("transform", (d, i) => {
      return `translate(${this.padLeft},${this.dotScale(i)+this.padTop})`;
    })
    // .attr("fill", "red")
    .attr("data-match", function (d) {
      return d[0];
    });

  leftDot
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 80)
    .attr("y", this.fontSize / 3)
    .text(function (d) {
      return d[0].toUpperCase();
    })
    .style("font-size", `${this.fontSize}px`);

  leftDot
    .append("circle")
    .attr("r", this.dotRadius)
    .attr("fill", "black")
    .attr("cx", 100)



  var rightDot = this.svg
    .selectAll(".rightDot")
    .data(this.data)
    .enter()
    .append("g")
    .attr("class", "rightDot")
    .attr("transform", (d, i) => {
      return `translate(${this.width - this.padRight - 100},${this.dotScale(i)+ this.padTop})`;
    })
    // .attr("fill", "red")
    .attr("data-match", function (d) {
      return d[1];
    });

  rightDot
    .append("circle")
    .attr("r", this.dotRadius)
    .attr("fill", "black")

  rightDot
    .append("text")
    .attr("x", 20)
    .attr("y", this.fontSize / 3)
    .text(function (d) {
      return d[1].toUpperCase();
    })
    .style("font-size", `${this.fontSize}px`);
    
}

connectDot.prototype.addBehave = function () {
  var gList = this.svg.node().querySelectorAll("g")

  var handler = (e) =>{
    e = e||window.event
    e.currentTarget.setAttribute("fill", "blue"); // currentTarget = this
    // console.log(e.target,e.currentTarget) 
    //此處用currenTarget不用target因為,target有可能為text或是circle而不是g
    var match
    var svg = this.svg.node()

    if (e.currentTarget.getAttribute("class") == "leftDot") {
      match = svg.querySelector(`g[data-match=${e.currentTarget.__data__[1]}`)
    } else {
      match = svg.querySelector(`g[data-match=${e.currentTarget.__data__[0]}`)
    }
    match.setAttribute("fill", "blue")

    var coordinate = e.currentTarget.querySelector("circle").getBoundingClientRect();
    var coMatch = match.querySelector("circle").getBoundingClientRect();

  
    var inverse = svg.getScreenCTM().inverse()
    // var inverse = this.getCTM()
    // console.log(coordinate,coMatch,inverse,e.currentTarget.getBoundingClientRect())
    console.log(inverse)
    var line = document.createElementNS("http://www.w3.org/2000/svg","line")
    line.setAttribute("x1", coordinate.left*inverse.a + inverse.e + this.dotRadius)
    line.setAttribute("y1", coordinate.top*inverse.d + inverse.f + this.dotRadius)
    line.setAttribute("x2", coMatch.left*inverse.a + inverse.e + this.dotRadius)
    line.setAttribute("y2", coMatch.top*inverse.d + inverse.f + this.dotRadius)
    //(a,b)表示新x單位向量;(c,d)表示新y單位向量;(e,f)表示新原點(視為平移)
    line.style.stroke = "black"
    line.style.strokeWidth = "2px"
    svg.appendChild(line)
    // getBoundingClientRect取得相對於畫面左上角(即document)的座標定位 還需轉換成相對svg左上角定位
    // getBBox取得的座標是相對於svg元素的,但是會忽略所有transform的調整
  }

  for (var item of gList) {
    // item.setAttribute("onclick","("+handler.toString()+")()")
    item.onclick = handler
  }
}


connectDot.prototype.render = function(svgEntry){

  this.renderBody()
  this.rendersvgBGC()
  this.renderTitle()
  this.addBehave()

  return this.svg.node()
  // svgEntry.appendChild(this.svg.node())
}




export {
  connectDot as execute,
  descriptor
}