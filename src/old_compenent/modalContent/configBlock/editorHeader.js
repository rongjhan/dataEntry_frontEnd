import React from 'react';
import styles from "./configBlock.css"
import run from "../../../../_asset/run.png"
import confirm from "../../../../_asset/confirm.png"
import {confirmEditor}  from '../../../../util_app/confirmEditor.mjs';
import {useSelector,useDispatch,shallowEqual} from "react-redux"
import {runSingle} from "../../../../util_app/runSingle.mjs"


function EditorHeader(props){

    var {configType} =props

    var state = useSelector((state)=>{
        var block = state.configModal[configType]
        // console.log(block.configEditorData,block.configNow)
        return {
            configNow:block.configNow,
            configEditorData:block.configEditorData,
        }
    },shallowEqual)

    var dispatch = useDispatch()

    var changed = state.configNow!==state.configEditorData

    return(
    <div className={styles.editorHead}>
        <span style={{marginRight:"8px",cursor:"pointer"}}
            onClick={(e)=>{
                    confirmEditor(configType,state.configNow,state.configEditorData,dispatch)(e);
                    runSingle(state.configEditorData,configType)
                }
            }
        >
            <img src={run} style={{width:"20px"}} />
        </span>
        <span className={changed?styles.shine:null} 
            style={{marginRight:"8px",cursor:"pointer"}}
            onClick={confirmEditor(configType,state.configNow,state.configEditorData,dispatch)}
        ><img src={confirm} style={{width:"20px"}}/>
        </span>
    </div>
    )
}

export {EditorHeader} 


// onClick={(e)=>{
//     if(state.configNow===state.configEditorData){return}//means there aren't any change

//     var reTest = true

//     if(state.configNow.producerType===state.configEditorData.producerType){ 
//         // var sameDepend , maybe find other way to check depend is the same

//         var sameConf = (
//             shallowEqual(state.configNow.producerConfig,state.configEditorData.producerConfig)
//         )
//         if(sameConf){
//             reTest = false
//             console.log("producerConfig unchange")
//         }
//     }
        
//     var configFormId = `#${configType}ConfigForm`
//     var producerConfigFormId = `#${configType}ProducerConfigForm`
    
//     validateForms([configFormId,producerConfigFormId])//if not pass would show error

//     //do validate required depend config
//     var newConfig = {...state.configEditorData}
//     reTest&& (newConfig.passTest =undefined)

//     // console.log(newConfig.passTest)
//     dispatch({
//         type:`${configType}SaveConfig`,
//         configNow:state.configNow,
//         config:newConfig,
//     })
//     dispatch({type:`${configType}ChangeConfigNow`,config:newConfig})
//     // dispatch({type:`${configType}CreateNew`})
//     }}