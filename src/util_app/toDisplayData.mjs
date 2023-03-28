import { table } from "table"
import isTable from "../util_data/isTable.mjs";
//有在node_module修改table模組內的stringifyTableData.js內容
//讓其不僅僅是對所有類型都僅是呼叫String(cell)
//而是依據cell 的type有不一樣的行為


var tableConfig = {
    drawVerticalLine: (lineIndex, columnCount) => {
        return lineIndex === 0 || lineIndex === columnCount;
    },
    border:{
        bodyLeft: "",
        bodyRight: "",
        joinLeft:"",
        joinRight:"",
        topLeft: "",
        topRight: "",
        bottomLeft: "",
        bottomRight: "",
    },
    columnDefault:{
        truncate: 20
    }
}

function displayTable({array,dimension=2,maxCol=20,maxRow=50,maxWidth=12,config=tableConfig,widthScale=2}){
    // console.log(JSON.stringify(array))
    console.log(array.length)
    if(dimension==1){ array = [array]}//統一轉為二維表格操作

    var omitRowArray = array.slice(0,maxRow-1)
    var finalArray = omitRowArray.map((row)=>{return row.slice(0,maxCol-1)})
    
    var coloumnsWidth = finalArray[0].map((heardString,index)=>{
        var headWidth = String(heardString).length
        var contentWidth = finalArray[1]?String(finalArray[1][index]).length:0
        //比較第一列元素寬度和head寬度,大者決定元素寬度
        return {width:(Math.min(Math.max(contentWidth,headWidth)+2,maxWidth)||1)*widthScale}
        //但最終寬度不能超過maxwidth設定,且width should >=1
    })
    config.columns = coloumnsWidth
    
    return "<pre>" + table(finalArray,config).replace(/\n/g,"<br/>") + "</pre>"
}


function toDisplayData(output){
    
    if (typeof output!=="object"){
        // console.log(String(output).replace(/\n/g,"<br/>"))
        return String(output).replace(/\n/g,"<br/>")
    }else{
        var tableType
        switch (true){
            case output===null:
                return "Empty"
            case output instanceof Error:
                return output.toString().replace(/\n/g,"<br/>")
            case (tableType=isTable(output),tableType===("arrayArray")||tableType===("plainArray")):
                try {return displayTable({array:output,dimension:(tableType==="plainArray"?1:2)})} 
                catch (error){
                    console.log(error)
                    return JSON.stringify(output).replace(/\n/g,"<br/>")
                    //因為isTable檢查機制有缺陷, 故需要catchError
                }
            default:
                return JSON.stringify(output).replace(/\n/g,"<br/>")
        }
    }
}


export default toDisplayData