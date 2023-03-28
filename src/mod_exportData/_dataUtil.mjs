import {dayjs} from "../util_time/initDayjs.mjs"

function createDataURI(csvString, uritype="dataUri") {
    if (uritype == "dataUri") {
        return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(csvString)))
        // 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString) 不同編碼的dataUri
    }

    if (uritype == "objectUri") {
        var blob = new Blob([svgString], {
            type: 'text/plain;charset=utf-8'
        });
        return URL.createObjectURL(blob)
    }
    //dataURI有永久性而blobURI沒有
}


function arrayToCSv(array){
    
    var csvString = array.map(function(row){
        return row.map((function(d){
            switch(true){
                case d instanceof Date:
                    return dayjs(d).toString().replace(/,/g,"\",")
                default:
                    return d.toString().replace(/,/g,"\",")
            }
        })).join()
        //replaceComma in row
    }).join("\n")

    return "\ufeff"+csvString
    // "\ufeff" means utf8 with bom
}


export {arrayToCSv,createDataURI}