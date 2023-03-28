import React, {useState} from 'react';
import styles from "./outputBlock.css"
import {useSelector,useDispatch} from "react-redux"

function MenuItem(props){
    var {configType,showConfigTypeNow} = props
    var dispatch = useDispatch()
    var [spanState,setSpanState] = useState(false)
    var state = useSelector((state)=>{
        return {
            configs:state.projectNowData[configType],
        }
    })

    var color = showConfigTypeNow?"#b2bec3":"inherit"
    var display = (spanState&&state.configs.length>0)?"initial":"none"
    // var transform = spanState?"rotateZ(90deg)":"rotateZ(-90deg)"
    return(
        <ul className={styles.menu} 
            style={{backgroundColor:color}} 
            onClick={()=>{dispatch({type:"changeConfigType",configType:configType,locate:0})}}
            onMouseEnter={(e)=>{setSpanState(true)}}
            onMouseLeave={(e)=>{setSpanState(false)}}
        >
            <span>{`${configType} (${state.configs.length})`}</span>
            {/* <span className={styles.menuSpan}  
                onClick={(e)=>{e.stopPropagation();setSpanState(!spanState)}}
            >
                <img src={span} className={styles.spanIcon} style={{transform}}/>
            </span> */}
            <div className={styles.listBlock} 
                style={{display:display}}
                onClick={(e)=>{
                    e.stopPropagation();
                    setSpanState(false);
                    var list =e.currentTarget.children
                    for(var i=0;i<list.length;i++){
                        if(list[i] == e.target){
                            dispatch({type:"changeConfigType",configType:configType,locate:i})
                            break
                        }
                    }
                }} 
            >
                {state.configs.map((config)=>{
                        return (<li className={styles.list} key={config.name}>{config.name}</li>)
                    })
                }
            </div>
        </ul>
    )
}


function OutputMenu(props){

    // var dispatch = useDispatch()
    var state = useSelector((state)=>{
        return {
                showConfigTypeNow:state.configModal.output.showConfigTypeNow,
                configTypes:state.configModal.output.configTypes
            }
    })


    return(
        <div style={{textAlign:'right',backgroundColor:"#dcdde1"}}>
            {state.configTypes.map((configType)=>{return (
                <MenuItem key={configType} configType={configType} showConfigTypeNow={configType==state.showConfigTypeNow}/>
            )})}
        </div>
    )
}



export {OutputMenu}