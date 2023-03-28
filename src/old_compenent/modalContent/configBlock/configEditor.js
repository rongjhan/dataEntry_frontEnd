import React from 'react';
import styles from "./configBlock.css"
import {useSelector,useDispatch,shallowEqual} from 'react-redux';
import {InputCluster} from "./inputCluster"
import {DependConfig} from "./dependConfig"
import {EditorHeader} from "./editorHeader"
import {ProducerSelect} from "./producerSelect"


function ConfigEditor(props){
    var {configType} = props

    var state = useSelector((state)=>{
        var block = state.configModal[configType]
        // console.log(block.configEditorData,block.configNow)
        return {
            configEditorData:block.configEditorData,
            dependBlocks:block.dependBlocks
        }
    },shallowEqual)

    var dispatch = useDispatch()

    return(
        <div id={configType} className={styles.configEditor}>
            <EditorHeader configType={configType}></EditorHeader>
            <form id={configType+"ConfigForm"} className={styles.formArea}>
                <label className={styles.formArea}> 
                    <span style={{display:"block"}}>
                        ConfigName
                        <span style={{color:"#EA2027"}}>*</span>
                    </span>
                    <input
                        type="text" name={"name"} 
                        value={state.configEditorData.name?state.configEditorData.name:""}
                        onChange={(e)=>{dispatch({type:`${configType}SetConfigName`,name:e.target.value})}}
                        required={true}
                        disabled={state.configEditorData.default?true:false}
                    />
                </label>
                <ProducerSelect configType={configType}></ProducerSelect>
                <label className={styles.formArea} style={{marginTop:"10px"}}>
                    <input
                        type="checkbox" name={"name"}
                        checked={state.configEditorData.cache}
                        onChange={(e)=>{dispatch({type:`${configType}SetCacheConfig`})}}
                    />Cache
                </label>
            </form>

            {state.dependBlocks.length>0 && !state.configEditorData.default?<DependConfig configType={configType}/>:null}
            {/* default config used by dynamic depend so it didn't need to set depends by explicitly*/}
            <InputCluster configType={configType}></InputCluster>

        </div>
    )

}




export {ConfigEditor} 