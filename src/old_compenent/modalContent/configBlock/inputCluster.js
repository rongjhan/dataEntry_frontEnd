import React,{useEffect,useRef} from 'react';
import styles from "./configBlock.css"
import { useSelector,useDispatch } from 'react-redux';



function inputElement(name,config,configValue,changeHanlder){
    var {type,required,width,height,defaultValue} = config

    if(type=="text"||type=="number"||type=="color"){
        return(
            <input type={type} name={name} placeholder={defaultValue} value={configValue} required={required}
            onChange={changeHanlder}
            />
        )
    }
    if(type =="checkbox"){
        // will modify to  instanceof Object with boolean property
        return( <input type={type}  name={name} checked={configValue} onChange={changeHanlder}/> )
    }

    if(type =="selection"){
        return(
            <select name={name} value={configValue} onChange={changeHanlder}>
                {config.options.map((item)=><option value={item} key={item}>{item}</option>)}
            </select>
        )
    }
    if(type=="textarea"){
        return(
            <textarea name={name} style={{height,width:"100%"}} spellCheck={false} value={configValue} 
            onChange={changeHanlder}/>
        )
    }
}


function ConfigInput(props){
    var {configType,name,config}=props
    var configEditorData = useSelector((state)=>{return state.configModal[configType].configEditorData})
    var dispatch = useDispatch()

    var configValue = configEditorData.producerConfig[name] 
    //this configValue is value set by user not config default value

    var changeHanlder = function(e){
        var  replaceConfig = {}
        replaceConfig[e.target.name]= (e.target.type==="checkbox"?e.target.checked:e.target.value)
        dispatch({type:`${configType}SetProducerConfigValue`,replaceConfig})
    }

    return(
        <label htmlFor={name} 
        style={{display:"inline-block",paddingLeft:`${config.type=="textarea"?"":"10px"}`,paddingTop:10,width:`${config.type=="textarea"?"98%":""}`}}
        >
            <span style={{display:"block"}}>
                {name}
            <span style={{color:"#EA2027"}}>{`${config.required?"*":""}`}</span>
            </span>            
            {inputElement(name,config,configValue,changeHanlder)}
        </label>
    )
}


function InputCluster(props){

    var {configType} = props
    var inputListenEvent = useRef(null)
    var dispatch = useDispatch()
    var producerNow = useSelector((state)=>{return state.configModal[configType].editorProducerNow})

    function setValue(replaceConfig){
        dispatch({type:`${configType}SetProducerConfigValue`,replaceConfig})
    }

    function registerEvent(){
        Excel.run(function (context) {
            inputListenEvent.current = context.workbook.onSelectionChanged.add(producerNow.setValueHandler(setValue));
            return context.sync().then(()=>{console.log("register scucceed")});
        }).catch((error)=>{console.log(error)});
    }

    function removeEvent(){
        Excel.run(function (context) {
            inputListenEvent.current.remove()
            return context.sync().then(()=>{inputListenEvent.current=null;console.log("remove scucceed")});
        }).catch((error)=>{console.log(error)});
    }

    useEffect(()=>{
        inputListenEvent.current&&removeEvent()
        producerNow.setValueHandler&&registerEvent()
    },[producerNow])


    return(
        <form id={configType+"ProducerConfigForm"} style={{marginTop:20,textAlign:"left",width:"100%"}}>
            
                {producerNow.descriptor.config===null?null:(Object.keys(producerNow.descriptor.config).map((name)=>{
                        if(producerNow.descriptor.config[name].type==="form"){
                            return 
                        }
                        return (<ConfigInput
                            configType={configType}
                            name={name} 
                            config={producerNow.descriptor.config[name]}
                            key={name} 
                        />)
                        }
                    ))
                }
            
        </form>
    
    )

}







export {InputCluster} 