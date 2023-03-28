import * as dataWorker from "./worker/allocator"




var defaultCode = `
function operation(el){  //以免多餘贅字造成比較時的不同
    var newElement = el.trim() //刪除字串前後空白(包含\\t嗎?)
    newElement = parseInt(newElement).toString() //刪除leading zero
    return newElement 
}

var data1 = toFrame(datas[0])
var data2 = toFrame(datas[1])

var operatedOne=data1.loc({columns:["統一編號"]}).apply({callable:operation}).values.flat()
var operatedTwo=data2.loc({columns:["統一編號"]}).apply({callable:operation}).values.flat()

data1.drop({ columns: ["統一編號"],inplace:true})
data2.drop({ columns: ["統一編號"],inplace:true})

console.log(operatedOne)

data1.addColumn({column:"統一編號",value:operatedOne})
data2.addColumn({column:"統一編號",value:operatedTwo})
var result = dfd.merge({left:data1,right:data2,on:["統一編號"]})

return result.values
`.replace(/\s{2,}/g," ")  //將多餘空白轉為一個,在regex中\s表示空白
//result.tensor.array()




var descriptor = {
    deps:{min:0,max:Infinity},
    inputs:{
        code:{type:"textarea",defaultValue:defaultCode,height:"300px",spellCheck:"false"}
    }
}




function runCode({datas,config}){
    //data is array of promise
    var code = config.code.trim()
    if(!code){
        console.log("empty code")
        return Promise.resolve([])
    }
    
    // var datas = await Promise.all(data)
    
    return new Promise(function(resolve){

        var processID = dataWorker.getProcessID()
        var {resultQue,timeoutQue,worker} = dataWorker

        function checkFinish(){
            // console.log(`wait process ${processID}`)

            if(resultQue[processID]!==undefined){ 
                resolve(resultQue.splice(processID,1,undefined)[0])
                clearInterval(timeoutQue.splice(processID,1,undefined)[0])
            }
        }

        timeoutQue[processID] = setInterval(checkFinish,100);
        worker.postMessage({processID,code,datas})
        
    })

}

export{runCode as execute,descriptor}
// exports.produce = runCode
// exports.defaultConfig = defaultConfig


// Array.from(datas[0][0][0]).forEach((e)=>{console.log(e.charCodeAt())})
// Array.from(datas[1][0][2]).forEach((e)=>{console.log(e.charCodeAt())})
