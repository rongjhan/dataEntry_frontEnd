import {optionState,ConfigType} from "../store/types"
import { store } from "../store/store"

enum SourceOption{
    none="",
    api="api",
    stockApi="stockApi",
    upload="upload"
}



export function load(optionName:SourceOption){
    const optionInfo = store.getState().app.sourceOption[optionName]

    if (optionInfo.available){
        if (optionInfo.module===undefined){
            return import(/* webpackChunkName: " source-[request]" */`./${optionName}.ts`).then(
                (module)=>{
                    store.dispatch({
                        type:"init/loadOptionModule",
                        payload:{optionName,module,configType:ConfigType.source}
                    })
                }
            )
        }
    }else{
        throw "unpermit operation"
    }
    
}


export default function initOption(avlList:string[]):ReturnType<typeof Object.fromEntries<optionState>>{
    const optionsEntry = Object.values(SourceOption).map((i):[SourceOption,optionState]=>{
        return [i,{module:(i==""?null:undefined),available:avlList.includes(i)}]
    }).sort((a,b)=>{
        const compareAvl = -(a[1].available-b[1].available)
        return compareAvl==0?a[0].localeCompare(b[0]):compareAvl
    })
    
    return Object.fromEntries(optionsEntry)
}



