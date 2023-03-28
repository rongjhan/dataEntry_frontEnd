import React,{useEffect} from 'react';
import styles from "./configBlock.css"
import {useSelector,useDispatch,shallowEqual} from 'react-redux';




function ProducerSelect(props){
    var {configType} = props
    var dispatch = useDispatch()

    var state = useSelector((state)=>{
        var block = state.configModal[configType]
        
        return {
            producers:block.producers,
            configEditorData:block.configEditorData,
            editorProducerNow:block.editorProducerNow,
            loadProducer:block.loadProducer,
        }
    },shallowEqual)

    useEffect(()=>{
        var producer = state.editorProducerNow
        if(producer.loaded===false){
            state.loadProducer(producer.name).then((module)=>{
                dispatch({type:`${configType}LoadProducer`,name:producer.name,module:module})
                dispatch({type:`${configType}SetProducerType`,producerType:producer.name})
                //需load完再一次changeProducerNow否則會因還沒取得load資訊,Config仍為null
            })
        }
    }
    ,[state.configEditorData.producerType])

    
    return(
        <label className={styles.formArea}>
            {configType+"Type"}:
            <select 
                name={"producerType"} 
                className={styles.producerSelect} 
                value={state.configEditorData.producerType}
                onChange = {(e)=>{dispatch({type:`${configType}SetProducerType`,producerType:e.target.value})}}
            >
                {state.producers.map((producer)=>(<option value={producer.name} key={producer.name}>{producer.name}</option>))}
            </select> 
        </label>
    )

}




export {ProducerSelect} 