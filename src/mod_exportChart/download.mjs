import {svgToPngURI} from "./_imgUtil.mjs"
import {svgURI} from "./_imgUtil.mjs"


var descriptor = {
    data:{required:true,multi:false},
    config:{fileType:{type:"selection",options:["svg","png"],defaultValue:"png"}}
}

function downloadChart({datas,config}) {
    var svgElement = datas[0]
    var fileName = `pic.${config.fileType}`

    switch(config.fileType){
        case "png":
            return svgToPngURI(svgElement, "dataUri").then(function (uri) {
                var link = document.createElement("a");
                link.download = fileName
                link.href = uri
                link.click();
                return "success"
            }).catch((error)=>{console.error(error); return null})
            
        case "svg":
            return new Promise(function(resolve){
                var link = document.createElement("a");
                link.download = fileName;
                link.href = svgURI(svgElement,"dataUri")
                link.click();
                resolve("success")
            }).catch((error)=>{console.error(error);return null})

    }

}


export {
    downloadChart as produce,
    descriptor
}
