import {storePromise} from "../index.js"
import genDisplayData from "./toDisplayData.mjs"


function findConfig(state,configName,configTypa){
    return state.projectNowData[configTypa].find((config)=>config.name===configName)
}

function findProducer(state,producerName,configType){
    return state.configModal[configType].producers.find((producer)=>producer.name===producerName)
}

function cleanRuntimeCache(){
    runtimeCache = {
        importData:{},
        dataOps:{},
        chart:{}
    }
}/* webpackChunkName: "importData_[request]" */

var runtimeCache = {
    importData:{},
    dataOps:{},
    chart:{}
}

async function runConfigs(configs,configType){
    var store = await storePromise
    var state = store.getState()
    var {dispatch} = store

    for (let config of configs){
        if(config.producerType==="none"){continue}

        var dependsData = []
        var inValidDepened=undefined 

        for (var depnedConfig of config.depends){
            let {name,from} = depnedConfig

            if(runtimeCache[from][name]){
                dependsData.push(runtimeCache[from][name])
                console.log("useRuntimeCache")
                continue
            }

            var depnedConfig = findConfig(state,name,from)
            if(depnedConfig===undefined){ inValidDepened=`${from}  >>>  ${name}`;break}
            if(depnedConfig.passTest){
                if(depnedConfig.cache){
                    dependsData.push(depnedConfig.cacheData)
                    console.log("useDataCache")
                    continue
                }
                if(from==="chart"){
                    dependsData.push(depnedConfig.displayData)
                    console.log("useDataCache")
                    continue
                }
            }
            
            await runConfigs([depnedConfig],from) //runConfigs函數不返回任何值

            state = store.getState() //should reget state after store update
            // depnedConfig = findConfig(state,name,from)
            // runtimeCache[from][name]=depnedOutput
            dependsData.push(runtimeCache[from][name])
            
        }

        // var runningConfig = findConfig(state,config.name,configType)
        var updateConfig = {...config}

        if(inValidDepened){
            var message = `
            missing dependecy :  ${inValidDepened}\n
            the dependency don't exist, you should recreate it\n
            ,or save this config without this dependency
            `
            updateConfig.passTest=false
            updateConfig.cacheData=null
            updateConfig.displayData=genDisplayData(message)
            dispatch({type:`${configType}SetConfigOutput`,config,updateConfig})

            if(config===state.configModal[configType].configNow){
                dispatch({type:`${configType}ChangeConfigNow`,config:updateConfig})
            }
            inValidDepened = undefined //清空inValidDepened還原下一個config執行狀態
            continue
        }

        try {
            var configProducer = findProducer(state,config.producerType,configType)
            var producerParam = {datas:dependsData,config:config.producerConfig}
            // console.log(producerParam.data)
            if(configType==="chart"){
                var chart =new configProducer.produce(producerParam)
                var configOutput = await chart.render() //geoChart的render回傳Promise
            }else{
                var configOutput = await configProducer.produce(producerParam)
            }
            

            runtimeCache[configType][config.name]= configOutput

            updateConfig.displayData = genDisplayData(configOutput)
            updateConfig.passTest = true
            updateConfig.cacheData = (config.cache?configOutput:null)
            dispatch({type:`${configType}SetConfigOutput`,config,updateConfig})

        } catch (error) {
            // console.error(error)
            updateConfig.passTest = false
            updateConfig.cacheData = null
            updateConfig.displayData = genDisplayData(error)
            dispatch({type:`${configType}SetConfigOutput`,config,updateConfig})
        }

        if(config===state.configModal[configType].configNow){
            dispatch({type:`${configType}ChangeConfigNow`,config:updateConfig})
        }
    }

}



export  {runConfigs,cleanRuntimeCache}

// var sampleConfig = {
//     name:"",
//     cache:true, 
//     producerType:"",
//     producerConfig:{},
//     depends:[],
//     passTest:undefined,
//     cacheData:null    //cacheData
// }


