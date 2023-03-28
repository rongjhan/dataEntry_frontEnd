import * as dataWorker from "./worker/allocator"


function genCode(config){
    var {key,how} = config
    return `
    function operation(el){ 
        var newElement = el.trim() 
        newElement = parseInt(newElement).toString() //刪除leading zero
        return newElement 
    }
    
    var data1 = toFrame(datas[0])
    var data2 = toFrame(datas[1])
    
    var operatedOne=data1.loc({columns:["${key}"]}).apply({callable:operation}).values.flat()
    var operatedTwo=data2.loc({columns:["${key}"]}).apply({callable:operation}).values.flat()
    
    data1.drop({ columns: ["${key}"],inplace:true})
    data2.drop({ columns: ["${key}"],inplace:true})
    
    
    data1.addColumn({column:"${key}",value:operatedOne})
    data2.addColumn({column:"${key}",value:operatedTwo})
    var result = dfd.merge({left:data1,right:data2,on:["${key}"],how:"${how}"})
    // console.log(result.columns)
    return result.values
    `  //將多餘空白轉為一個,在regex中\s表示空白
    //result.tensor.array()
}






var descriptor = {
    deps:{min:2,max:2},
    inputs:{
        key:{type:"text",defaultValue:"",required:true},
        how:{type:"selection",options:["inner","outer",'left',"right"],defaultValue:"inner"}
    }
}




function runCode({datas,config}){

    var code = genCode(config)
    console.log(code)
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