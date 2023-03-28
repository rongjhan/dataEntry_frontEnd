import React from 'react';
import styles from "./configBlock.css"
import { useSelector,useDispatch } from 'react-redux';



function DependConfig(props){
    var {configType} = props
    var dispatch = useDispatch()

    var state = useSelector((state)=>{
        var dependBlocks= state.configModal[configType].dependBlocks
        var dependDescribe = state.configModal[configType].editorProducerNow.descriptor.data
        var result = {dependBlocks,dependDescribe}
        dependBlocks.forEach(function(dependBlock){
            result[dependBlock]={}
            result[dependBlock].allConfigs = state.projectNowData[dependBlock]
            result[dependBlock].dependConfigs = state.configModal[configType].configEditorData.depends
        })
        
        return result
        
        // result = {dependDescribe:{mulit:true,required:false},dependBlocks:[],dependBlock:{allConfig:[],dependConfigs:[]}}
    })

    var dependList = function(dependBlock){
        var allChecked = state[dependBlock].dependConfigs.filter((dependConf)=>dependConf.from==dependBlock)
        var multiConfig = state.dependDescribe.multi
        return (
            <div className={styles.formArea}
                id={configType+"Depend"+dependBlock+"Form"}
                key={dependBlock} 
                style={{border:"1px solid gray",borderRadius:5,marginTop:15}}
            >
                <p style={{font:"20px",textAlign:"left",margin:0,padding:"5px 5px"}}>
                    <span style={{paddingRight:"10px"}}>Depend {dependBlock}:</span>
                </p>
                <div  
                    className={styles.formArea} 
                    style={{marginTop:5,marginBottom:5}}
                >
                    {state[dependBlock].allConfigs.map(function(config){
                        var checked = allChecked.find((dependConf)=>dependConf.name==config.name)
                        return (
                        <label key={config.name}>
                            <input 
                            name={multiConfig?config.name:"depend"} 
                            type={multiConfig?"checkBox":"radio"}
                            checked={checked?true:false} 
                            onChange={(e)=>{
                                    dispatch({
                                        type:`${configType}SetDependConfig`,
                                        dependBlock:dependBlock,
                                        config:config.name,
                                        value:e.target.checked,
                                        multiConfig:multiConfig
                                    })
                                }}
                            />
                            {config.name}
                        </label>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <form>
            {state.dependDescribe!==null?state.dependBlocks.map((dependBlock)=>dependList(dependBlock)):null}
        </form>
        
    )

}








export {DependConfig} 