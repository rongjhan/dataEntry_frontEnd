import {store} from "../store/store"
import {optionState,ConfigType} from "../store/types"

export enum TransformOption{
    none="",
    merge="merge",
    python="python",
    javascript="javascript"
}


export function load(optionName:TransformOption){
    const optionInfo = store.getState().app.transformOption[optionName]

    if (optionInfo.available){
        if (optionInfo.module===undefined){
            return import(/* webpackChunkName: " trans-[request]" */`./${optionName}.ts`).then(
                (module)=>{
                    store.dispatch({
                        type:"init/loadOptionModule",
                        payload:{optionName,module,configType:ConfigType.transform}
                    })
                }
            )
        }
    }else{
        throw "unpermit operation"
    }
    
}


export default function initOption(avlList:string[]):ReturnType<typeof Object.fromEntries<optionState>>{
    const optionsEntry = Object.values(TransformOption).map((i):[TransformOption,optionState]=>{
        return [i,{module:(i==""?null:undefined),available:avlList.includes(i)}]
    }).sort((a,b)=>{
        const compareAvl = -(a[1].available-b[1].available)
        return compareAvl==0?a[0].localeCompare(b[0]):compareAvl
    })
    
    return Object.fromEntries(optionsEntry)
}


