import React from 'react';
import style from "./css/configInput.css"



function InputCluster({modDesc,config,selected}){
    const inputs = modDesc.inputs
    const settings = config.settings?JSON.parse(config.settings.replaceAll("\'","\"")):null
    // console.log("settings",settings)
    return(
        <div>
        {Object.keys(inputs).map(function(name){
            const defaultValue = ((selected==config.option)&&(settings?.[name]))?
                settings?.[name]:inputs[name].defaultValue
            return (<InputElement {...inputs[name]} defaultValue={defaultValue} name={name}/>)
        })}
        </div>
    )
}


function InputElement(props){
    const {type,name} = props
    let element :React.ReactElement|null= null

    if(type=="text"||type=="number"||type=="color"){
        element=(
            <label className={style.inline} htmlFor={name} >
                <span className={style.name}>
                    {name}
                    <span className={style.require}>{`${props.required?"*":""}`}</span>
                </span>            
                <input {...props}/>
            </label>
        )
    }
    if(type =="checkbox"){
        element=(            
        <label className={style.inline} htmlFor={name} >
            <input {...props} defaultChecked={props.defaultValue}/>
            <span className={style.radioName}>
                {name}
                <span className={style.require}>{`${props.required?"*":""}`}</span>
            </span>            
        </label>)
    }


    if(type =="selection"){
        element=(
            <label className={style.inline} htmlFor={name} >
                <span className={style.name}>
                    {name}
                    <span className={style.require}>{`${props.required?"*":""}`}</span>
                </span>
                <select name={name}>
                    {props.options.map((item)=><option value={item} key={item} selected={item==props.defaultValue}>{item}</option>)}
                </select>          
            </label>
        )
    }
    if(type=="textarea"){
        element=(
            <label htmlFor={name} >
                <span className={style.name}>
                    {name}
                    <span className={style.require}>{`${props.required?"*":""}`}</span>
                </span>
                <textarea {...props}/>      
            </label>
        )
    }
    
    return element
}






export {InputCluster,InputElement} 