import { csvParse } from "d3-dsv"

function parseCsvToArray(csvString){
    var rawCsv = csvParse(csvString)

    // console.log(reader.result,rawCsv); 
    //將csv格式由[{},{}]轉成[[header],[]]
    var csv = rawCsv.map(function(d,i,array){
        var list = []
        for (var title of array.columns){
            list.push(d[title])
        }
        return list
    })

    csv.splice(0,0,rawCsv.columns)
    return csv
}

export {parseCsvToArray}