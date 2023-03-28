import React, { useEffect, useState } from "react";
import run from "../../asset/run.png"
import confirm from "../../asset/confirm.png"
import style from "./css/configEditor.css"
import { api } from "../../store/endpoint";
import { ConfigType } from "../../store/types";
import { ConfigOption } from "./configOption";
import { runSingle } from "../../util_app/runSingle";

type editorProp = {
    configType: ConfigType,
    opened: string,
    setOpened:React.Dispatch<React.SetStateAction<string | null>>,
}

export function ConfigEditor({configType, opened ,setOpened}: editorProp) {
    
    const [changed, setChanged] = useState<boolean>(false)
    const { data: config, isSuccess } = api.useGetConfigQuery({ configType, configName: opened })
    const [editConfig] = api.endpoints.editConfig.useMutation()
    useEffect(()=>{setChanged(false)},[opened])
    return isSuccess?(
        <div className={style.editor}>  
            <div className={style.editorHead}>
                <span className={style.action} onClick={()=>{runSingle(configType,opened)}}>
                    <img src={run} />
                </span>
                <span className={[(changed?style.shine:""),style.action].join(" ")} onClick={function(){
                    const form = document.querySelector(`.${configType} .editForm`) as HTMLFormElement
                    const fd = new FormData(form)
                    if(fd.get("depInvalid")||!form.checkValidity()){form.reportValidity()}
                    else{
                        const data:unknown = Object.fromEntries(fd)
                        delete data.deps
                        if(configType!="source"){
                            data.sourceDeps = []
                            form.querySelectorAll(".sourceDeps input:checked").forEach((i)=>{
                                data.sourceDeps.push(i.value)
                            })
                            if (configType=="visualize"){
                                data.transformDeps= []

                                form.querySelectorAll(".transformDeps input:checked").forEach((i)=>{
                                    data.transformDeps.push(i.value)})
                            }
                        }
                        
                        editConfig({configType,configName:opened,settings:data});
                        (opened!=data.newName)&&(setOpened(data.newName))
                        setChanged(false)
                    }

                }}>
                    <img src={confirm}/>
                </span>
            </div>
            <form key={opened} className="editForm" onChange={()=>{changed||setChanged(true)}}>
                <label htmlFor="">
                    <span className={style.name}>name</span>
                    <input name="newName" type="text" defaultValue={opened}/>
                </label>    
                <ConfigOption {...{configType,config}}/>
            </form>
        </div>
    ):null
}