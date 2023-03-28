import { optionState,ConfigType } from "../store/types"
import {store} from "../store/store"

enum visualOption{
    none="",
    connectDot="connectDot",
    stack="stack",
    candleStick="candleStick",
    tree="tree",
    scatter="scatter",
    line="line",
    relation="relation",
    geoTaiwan="geoTaiwan",
    geoUS="geoUS",
    geoWorld="geoWorld",
}


const chartPath:{[key in visualOption]:string} = {
    connectDot:"./otherChart/connectDot.mjs",
    stack:"./axisChart/stack.mjs",
    candleStick:"./axisChart/candleStick.mjs",
    tree:"./treeChart/tree.mjs",
    scatter:"./axisChart/scatter.mjs",
    line:"./axisChart/line.mjs",
    relation:"./axisChart/relation.mjs",
    geoTaiwan:"./geoChart/geoTaiwan.mjs",
    geoUS:"./geoChart/geoUS.mjs",
    geoWorld:"./geoChart/geoWorld.mjs",
}

export function load(optionName:visualOption){
    const optionInfo = store.getState().app.visualizeOption[optionName]

    if (optionInfo.available){
        if (optionInfo.module===undefined){
            import(/* webpackChunkName: "visual-[request]" */`${chartPath[optionName]}`).then(
                (module)=>{
                    store.dispatch({
                        type:"init/loadOptionModule",
                        payload:{optionName,module,configType:ConfigType.visualize}
                    })
                }
            )
        }
    }else{
        throw "unpermit operation"
    }
    
}


export default function initOption(avlList:string[]):ReturnType<typeof Object.fromEntries<optionState>>{
    const optionsEntry = Object.values(visualOption).map((i):[visualOption,optionState]=>{
        return [i ,{module:(i==""?null:undefined),available:avlList.includes(i)}]
    }).sort((a,b)=>{
        const compareAvl = -(a[1].available-b[1].available)
        return compareAvl==0?a[0].localeCompare(b[0]):compareAvl
    })
        
    return Object.fromEntries(optionsEntry)
            
}


