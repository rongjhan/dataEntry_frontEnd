import {store} from "../store/store"
import {ConfigType,ConfigInfo} from "../store/types"
import {api} from "../store/endpoint"
import { load as loadSource } from "../mod_source"
import { load as loadVisualize } from "../mod_visualize"
import { current } from 'immer';


function loadOption(configType:ConfigType,optionName:string){
    switch(configType){
        case "source":
            return loadSource(optionName)
        case "transform":
            return loadVisualize(optionName)
        case "visualize":
            return loadVisualize(optionName)
    }
}

async function runSingle(configType:ConfigType,configName:string,cachedOutput=undefined){
    let configInfo:ConfigInfo
    const allDeps:Promise<any>[] = []
    let result={executable:undefined,output:undefined}

    cachedOutput = cachedOutput??{
        tramsform:{},
        source:{},
    }

    let loadingInfo = api.endpoints.getConfig.select({configType,configName})(store.getState())
    if(loadingInfo.status=="uninitialized"){
        loadingInfo = await store.dispatch(api.endpoints.getConfig.initiate({configType,configName}))
    }
    configInfo = loadingInfo.data
    
    configInfo?.sourceDeps && allDeps.push(...configInfo?.sourceDeps.map(async function(depName){
        return cachedOutput.source[depName]??runSingle(ConfigType.source,depName,cachedOutput)
    }))

    configInfo?.transformDeps && allDeps.push(...configInfo?.transformDeps.map(async function(depName){
        return cachedOutput.tramsform[depName]??runSingle(ConfigType.transform,depName,cachedOutput)
    }))
    
    try {
        const AllDepsOutput = await Promise.all(allDeps)

        if(store.getState().app[configType+"Option"][configInfo.option].module===undefined){
            await loadOption(configType,configInfo.option)
        }
        const execute = store.getState().app[configType+"Option"][configInfo.option].module.execute
        const exeArg = {config:JSON.parse(configInfo.settings.replaceAll("'","\"")),datas:AllDepsOutput}
        
        if(configType=="visualize"){
            result.output = await new execute(exeArg)
            window.result = result.output
        }else{
            result.output = await execute(exeArg)
        }

        result.executable = true
    } catch (error) {
        console.log(error)
        result.executable = false
        result.output = error
    }

    store.dispatch(
        api.util.updateQueryData("getConfigs",configType,(draft)=>{
            const index = draft.findIndex( config => config.name ===configName)
            if (index !== -1) draft.splice(index, 1,{name:configName,...result})
            // console.log("current",current(draft))
        })
    )

    return result.output

}



export  {runSingle}

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


// store.dispatch(api.endpoints.getConfig.initiate({configType:"source",configName:"config"}));
// c = api.endpoints.getConfig.select({configType:"source",configName:"config"})(store.getState())
