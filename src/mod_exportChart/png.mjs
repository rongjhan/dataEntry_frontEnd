import {svgToPngURI} from "./_imgUtil.mjs"

var descriptor = {
    data:{required:true,multi:false},
    config:{}
}

function downloadPng({datas,config}) {
    var svgElement = datas[0]
    var uriPromise = svgToPngURI(svgElement, "objectUri")
    uriPromise.then(function (uri) {
        var link = document.createElement("a");
        link.download = "pic.png"
        link.href = uri
        link.click();
        return "success"
    }).catch((error)=>{console.error(error); return null})
    
    return uriPromise
}


export {
    downloadPng as produce,
    descriptor
}
