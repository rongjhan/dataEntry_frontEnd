export function svgURI(svgElement, uritype) {
    //svg標籤需添加xmlns命名空間,否則用於img.src無效,用了XMLSerializer()則無此問題,其會幫你自動添加xlmns
    //console.log(svgString)
    var oSerializer = new XMLSerializer();
    var svgString = oSerializer.serializeToString(svgElement);

    if ((uritype == "dataUri") || (uritype == undefined)) {
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)))
        // 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString) 不同編碼的dataUri
    }

    if (uritype == "objectUri") {
        var blob = new Blob([svgString], {
            type: 'image/svg+xml;charset=utf-8'
        });
        return URL.createObjectURL(blob)
    }
    //dataURI有永久性而blobURI沒有
}

export function svgToPngURI(svgElement, uritype) {

    var uriPromise = new Promise((resolve, reject) => {
        
        var img = new Image()
        img.onload = function(e){
            //svg檔需透過canvas drawImage的方式轉成Png或其他raster檔案格式
            var svgBOX = svgElement.getBBox() 
            //getBBox() only works when svgElemnt is shown in document,or width/height will be 0
            console.log(svgBOX.width,svgElement.getAttribute("width"))
            console.log(svgElement.parentElement)

            let canvas = document.createElement('canvas')
            //以下操作為canvas對於不同裝置devicePixelRatio不同而會造成模糊所做的調整
            let scale = window.devicePixelRatio
            canvas.width = svgBOX.width * scale||svgElement.getAttribute("width")*scale
            canvas.height = svgBOX.height * scale||svgElement.getAttribute("height")*scale

            
            let canvasContext = canvas.getContext('2d')
            // canvasContext.scale(scale, scale) 有時須調整畫布的scale 此處不用
            canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
            if ((uritype == "dataUri") || (uritype == undefined)) {
                resolve(canvas.toDataURL('image/png', 1.0))
                //base64編碼的dataURI
            }
            if (uritype == "objectUri") {
                canvas.toBlob(function (blob) {
                    resolve(URL.createObjectURL(blob))
                }, 'image/png', 1.0)
            }
        }
        img.src = svgURI(svgElement,"dataUri")

    })
    
    return uriPromise
}


export function svgShowAsBackGround(putWhere, svgElement) {
    var put = putWhere
    var uri = svgURI(svgElement)
    put.style.backgroundImage = `url(${uri})`
    put.style.backgroundSize = "contain"
    put.style.backgroundRepeat = "no-repeat"
}

