import {storePromise} from "../index.js"
import genDisplayData from "./toDisplayData.mjs"
import {runSingle} from "./runSingle.js"

function findConfig(state,configName,configTypa){
    return state.projectNowData[configTypa].find((config)=>config.name===configName)
}

function findProducer(state,producerName,configType){
    return state.configModal[configType].producers.find((producer)=>producer.name===producerName)
}


async function runDynamicRelyConf(depends,configName,configType){
    var store = await storePromise
    var state = store.getState()
    var {dispatch} = store

    var dynamicConfig = findConfig(state,configName,configType)
    var config = {...dynamicConfig,depends} //change config depends

    if(config.producerType==="none"){return}

    var dependsData = []
    var inValidDepened=undefined 

    for (var depnedConfig of config.depends){
        let {name,from} = depnedConfig

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
            
        var result = await runSingle(depnedConfig,from) 

        if(result instanceof Error){console.log(result);return}
        state = store.getState() //should reget state after store update
        // depnedConfig = findConfig(state,name,from)
        dependsData.push(result)
    }

        // var runConfigNow = findConfig(state,"defult",configType)
        var updateConfig = {...config}
        var configOutput

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
            configOutput = new Error(message)
            return configOutput
        }

        try {
            var configProducer = findProducer(state,config.producerType,configType)
            var producerParam = {datas:dependsData,config:config.producerConfig}
            // console.log(producerParam.data)
            if(configType==="chart"){
                var chart =new configProducer.produce(producerParam)
                configOutput = await chart.render() //geoChart的render回傳Promise
            }else{
                configOutput = await configProducer.produce(producerParam)
            }
            

            updateConfig.displayData = genDisplayData(configOutput)
            updateConfig.passTest = true
            updateConfig.cacheData = (config.cache?configOutput:null)
            dispatch({type:`${configType}SetConfigOutput`,config,updateConfig})
        } catch (error) {
            configOutput = error
            updateConfig.passTest = false
            updateConfig.cacheData = null
            updateConfig.displayData = genDisplayData(error)
            dispatch({type:`${configType}SetConfigOutput`,config,updateConfig})
        }

        if(config===state.configModal[configType].configNow){
            dispatch({type:`${configType}ChangeConfigNow`,config:updateConfig})
        }
        return configOutput
}



export  {runDynamicRelyConf}

// var sampleConfig = {
//     name:"",
//     cache:true, 
//     producerType:"",
//     producerConfig:{},
//     default:false,
//     depends:[],
//     passTest:undefined,
//     cacheData:null    //cacheData
// }


