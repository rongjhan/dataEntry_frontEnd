import {svgURI} from "./_imgUtil.mjs"

var descriptor = {
    data:{required:true,multi:false},
    config:{}
}

function downloadSvg({datas,config}) {
    var promise = new Promise(function(resolve){
        var svgElement = datas[0]
        var uri = svgURI(svgElement,"objectUri")
        var link = document.createElement("a");
        link.download = "pic.svg";
        link.href = uri
        link.click();
        resolve("success")
    }).catch(
        (error)=>{console.error(error);return null}
    )


    return promise 
}

export {
    downloadSvg as produce,
    descriptor
}
