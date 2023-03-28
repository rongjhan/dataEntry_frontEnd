import React from 'react';
import close from "../../../../_asset/Close.png"
import {useSelector,useDispatch} from "react-redux"
import styles from "./configBlock.css"



function ConfigItem(props){
    var {config,configType} = props
    var dispatch = useDispatch()
    var configNow = useSelector((state)=>{return state.configModal[configType].configNow})
    var opened = (configNow!==undefined&&config.name==configNow.name)?"0px 0px 3px 2px #f1c40f":"none"
    var configState = (function(){
        // console.log("update state",config.passTest)
        switch (config.passTest){
            case undefined:
                return undefined
            case true:
                return "#2ecc71"
            case false:
                return "#e66767"
        }
    })()

    return(
        <div 
            className={styles.configItem} 
            style={{boxShadow:opened,backgroundColor:configState}}
            onClick={()=>{
                dispatch({type:`${configType}ChangeConfigNow`,config:config})
            }}
        >
            <span 
                className={styles.clickEffect} 
                style={{font:"20px",backgroundColor:"inherit",padding:"0px 3px"}}
                // borderRight:"1px solid black"
            >
                {config.name}
            </span>
            {config.default?null:(
                <span className={styles.clickEffect+" "+styles.deleteItem} 
                    style={{boxShadow:opened,}}
                    onClick={(e)=>{
                        e.stopPropagation();
                        if(configNow==undefined||configNow.name!=config.name){ dispatch({type:`${configType}DeleteConfig`,config:config}) }
                                //cant delete when not configNow
                        else{
                            dispatch({type:`${configType}DeleteConfig`,config:config})
                            dispatch({type:`${configType}ChangeConfigNow`,config:undefined})
                        }
                    }}
                >
                    <img style={{width:"12px",marginTop:"5px"}} src={close} />
                </span>
            )}
        </div>
    )
}

function ConfigFolder(props){
    var dispatch = useDispatch()
    var {configType} =props
    var state = useSelector((state)=>{
        return{
            configs:state.projectNowData[configType],
            editorOpened:state.configModal[configType].configEditorData?true:false
        }
    })

    var {configs} = state

    return (

        <div style={{border:"1px solid black", borderRadius:5,width:"92%",margin:"10px auto",padding:5}}>
            <div 
                className={styles.formArea} 
                style={{font:"20px",fontWeight:"bold",textAlign:"left",paddingLeft:"3px"}}
            >
                <span style={{paddingRight:"10px"}}>Config List:</span>

                {configs.map((config)=>{
                    return (<ConfigItem  configType={configType} config={config}  key={config.name}/>)
                })}
            </div>
    
            <div  
                className={styles.formArea} 
                style={{textAlign:"right",marginTop:5,marginBottom:5}}
            >
                <span className={styles.pseudoButton} 
                    onClick={(e)=>{dispatch({type:`${configType}CreateNew`,configType:configType})}}
                >
                    Create
                </span>
            </div>
        </div>
    )
        
    
}


export {ConfigFolder}