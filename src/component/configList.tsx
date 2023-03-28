import React,{ Dispatch,SetStateAction } from "react";
import { api } from "../store/endpoint"
import style from "./configList.css"
import close from "../asset/Close.png"
import { ConfigType,configStatus } from "../store/types";

type bulletProps = {
    configType:ConfigType,
    isOpened:boolean,
    configStatus: configStatus,
    setOpened:Dispatch<SetStateAction<string | null>>,
}

type listProps = {
    configType:ConfigType,
    opened:string|null,
    setOpened:Dispatch<SetStateAction<string | null>>,
}


export function ConfigList(props:listProps) {
    const { configType, opened, setOpened } = props
    const {data:allConfigs,isSuccess} = api.endpoints.getConfigs.useQuery(configType)
    const [addConfig] = api.endpoints.addConfig.useMutation()
    return (
        <div className={style.folder}>
            <div className={style.header}>
                <div style={{alignSelf:"center",fontSize:17}}>Config List:</div>
                <div style={{flexGrow:1}}></div>
                <div className={style.add} onClick={()=>{addConfig(configType)}}>Add</div>
            </div>
            <div className={style.content}>
                {isSuccess?allConfigs.map((config) => {
                    return <ConfigBullet key={config.name} isOpened={opened===config.name} configStatus={config} setOpened={setOpened} configType={configType}/>
                }):null}
            </div>
        </div>
    )

}



function ConfigBullet(props:bulletProps) {
    const {configType,isOpened,setOpened,configStatus:status}= props
    let openStyle = {boxShadow : isOpened?"0px 0px 3px 2px #f1c40f":"none"}

    let executableStyle = {
        backgroundColor : status.executable===undefined?
                            undefined:(status.executable?"#2ecc71":"#e66767")
    }
    const [delConfig] = api.endpoints.delConfig.useMutation()
    return (
        <div className={style.configFile} style={{...openStyle,...executableStyle}} 
            onClick={()=>{setOpened(status.name)}}
        >
            <span style={{padding:"0 3px"}}>{status.name}</span>
            <span className={style.delete} style={openStyle}
                onClick={(e)=>{
                    if(!isOpened){delConfig({configType,configName:status.name})}
                    e.stopPropagation()
            }}
            >
                <img src={close}/>
            </span>
        </div>
    )
}
