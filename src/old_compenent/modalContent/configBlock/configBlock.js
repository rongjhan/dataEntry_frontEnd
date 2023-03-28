import React, {useEffect,useRef} from 'react';
import styles from "./configBlock.css"
import run from "../../../../_asset/Start.png"
import {useSelector} from "react-redux"

import{ConfigFolder} from "./configFolder"
import {ConfigEditor} from "./configEditor"
import {runConfigs,cleanRuntimeCache} from '../../../../util_app/runConfigs.mjs';

function ConfigBlock(props){

    var {configType} =props
    var block = useRef()

    var state = useSelector((state)=>{
        var finalState =  {
                show:state.configModal[configType].show,
                configs:state.projectNowData[configType],
                producers:state.configModal[configType].producers,
                dependBlocks:state.configModal[configType].dependBlocks,
                editorOpened:state.configModal[configType].configEditorData?true:false
            }
        finalState.dependBlocks.forEach((dependBlock)=>{
            finalState[dependBlock] = state.projectNowData[dependBlock]
        })
        return finalState
    })
    var display = state.show?"flex":"none"

    useEffect(()=>{
        block.current.style.width=""
    },[state.show])

    return(
        <button ref={block} className={styles.block} style={{display:display}}>        
            <div className={styles.blockHeader}>
                <span style={{paddingLeft:5}}>{configType}</span>
                <img
                    src={run} 
                    style={{width:"18px",float:"right",cursor:"pointer",padding:"3px 6px 3px 3px"}}
                    onClick={async function(e){
                        await runConfigs(state.configs,configType)
                        cleanRuntimeCache()
                    }}
                />
            </div> 

            <ConfigFolder configType={configType}/>
            {state.editorOpened?<ConfigEditor configType={configType}/>:null}
            
            <div className={styles.resizer+" "+"resizer"}></div>
        </button>
    )
}

export {ConfigBlock} 