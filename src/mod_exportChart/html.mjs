var config = {}


function downloadHtml(event){//only support officeOnline
    var d3Script = document.createElement("script")
    d3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js'
    
    var userScript = document.createElement("script")
    userScript.type  = "text/javascript"
    userScript.innerText = 'var tooltip = d3.select(".tooltip");d3.selectAll("rect").on("mouseover", function(){tooltip.style("display", null)}).on("mouseout", function(){tooltip.style("display", "none"); }).on("mousemove", function(e){var xPosition = e.offsetX-15;var yPosition = e.offsetY-25;tooltip.attr("transform", "translate(" + xPosition + "," + yPosition+ ")");tooltip.select("text").text(this.getAttribute("data-value"));})'
    
    var root = document.createElement("html")
    root.appendChild(document.querySelector(".two svg").cloneNode(deep=true))
    root.appendChild(d3Script)
    root.appendChild(userScript)

    var blob = new Blob([root.outerHTML],{type: "text/html;charset=utf-8"})
    var url = URL.createObjectURL(blob)
    
    document.getElementById("save").href = url
    //若有自訂事件則須用dispatchEvent
}


export {
    downloadHtml as produce,
    config
}
