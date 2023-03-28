import React, {useEffect,stylesuseRef} from 'react';
import styles from "./outputBlock.css"
import {useSelector,useDispatch} from "react-redux"
// import download from "../../../../_asset/download.png"
import exportFile from "../../../../_asset/export.png"
import {runDynamicRelyConf} from "../../../../util_app/runDynamicRelyConf.mjs"

function OutputItem(props){
    var {config} = props
    var item = useRef()
    var outDated = (config.passTest===undefined?"2px dashed #e17055":"")
    useEffect(()=>{
        var {displayData} =config
        if(displayData instanceof Element){
            item.current.innerHTML="" //clear previous one firsts
            item.current.appendChild(displayData)
        }else{
            item.current.innerHTML= displayData
        }
    })


    return(
        <div ref={item} className={styles.item} onWheel={(e)=>{e.stopPropagation()}}
        style={{border:outDated}}
        >
        </div>
    )
}


function OutputItemList(props){
    var {showConfigTypeNow} = props
    var list = useRef()
    var dispatch = useDispatch()
    
    var state = useSelector((state)=>{
        return {
            configs:state.projectNowData[showConfigTypeNow],
            locate:state.configModal.output.locateConfig
        }
    })

    useEffect(()=>{
        var children = list.current.children
        if(children.length>0){
            var offset = children[state.locate].offsetTop
            // console.log(state.locate,children.item(state.locate),offset)
            // list.current.scrollTop=offset-children.item(0).offsetTop
            list.current.scrollTo({
                top: offset-children.item(0).offsetTop,
                behavior: 'smooth'
            });
        }
    },[state.locate])


    return(
    <div style={{flex:"1",position:"relative",overflow:"hidden"}}
            onWheel={(e)=>{
                if(e.deltaY>0){
                    state.locate+1<state.configs.length&&(
                    dispatch({type:"changeConfigType",configType:showConfigTypeNow,locate:state.locate+1}))
                }else{
                    state.locate>0&&(
                    dispatch({type:"changeConfigType",configType:showConfigTypeNow,locate:state.locate-1}))
                }
        }}
        >
        
        <div ref={list} style={{overflowY:"hidden",height:"100%",verticalAlign:"middle"}}>
            {
                state.configs.map((config)=>
                <OutputItem key={showConfigTypeNow+config.name} config={config}></OutputItem>
            )}
        </div>
        <div className={styles.wheel}>
            <div className={styles.wheelButton}
                onClick={(e)=>{
                    var dependConfig = state.configs[state.locate]
                    if(showConfigTypeNow==="chart"){
                        var depends = [{name:dependConfig.name,from:"chart"}]
                        runDynamicRelyConf(depends,"default","exportChart")
                    }else{
                        var depends = [{name:dependConfig.name,from:showConfigTypeNow}]
                        runDynamicRelyConf(depends,"default","exportData")
                    }
            }}
            ><img src={exportFile} style={{width:"20px"}}/></div>
        </div>
    </div>
    )
}


export {OutputItemList}