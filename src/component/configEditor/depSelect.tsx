import React, { useEffect, useMemo, useState,useRef, ChangeEvent } from "react";
import { api } from "../../store/endpoint"
import { ConfigInfo, ConfigType } from "../../store/types";
import style from "./css/configInput.css"

type props = {
    configType:ConfigType,
    modDesc:any,
    config: ConfigInfo,
    selected:string
}


export function DependenceSelect({configType,modDesc,config,selected}:props) {
    const {data:allSources,isSuccess:sourceSuccess} = api.endpoints.getConfigs.useQuery("source")
    const {data:allTrans,isSuccess:transSuccess} = api.endpoints.getConfigs.useQuery("transform")

    const [selectSource,setSelectSource] = useState(config.sourceDeps||[])
    const [selectTrans,setSelectTrans] = useState(config.transformDeps||[])
    const invalidChecker = useRef<HTMLInputElement>(null)
    const {min,max} = modDesc.deps
    const [radio,required] = [(min>0&&max==1),(max>0)]
    const selectQty = selectSource.length+selectTrans.length
    const addable = selectQty<max

    // console.log(selectSource,selectTrans)

    useEffect(()=>{
        //刪除不再allSource中的selectSource
        if(configType!=="source"){
            setSelectSource(selectSource?.filter((s)=>allSources?.find((i)=>i.name===s)))
        }
    },[allSources])

    useEffect(()=>{
        //刪除不再allTrans中的selectTrans
        if(configType=="visualize"){
            setSelectTrans(selectTrans?.filter((s)=>allTrans?.find((i)=>i.name===s)))
        }
    },[allTrans])

    useEffect(()=>{
        if(config.option!=selected){
            setSelectSource([]);
            configType=="visualize"&&setSelectTrans([])
        }
        else{
            setSelectSource(config.sourceDeps)
            configType=="visualize"&& setSelectTrans(config.transformDeps)
        }
    },[selected])

    useEffect(()=>{
        if(selectQty<min){
            invalidChecker.current?.setCustomValidity(`at least ${min} deps,${selectQty} selected now`)
        }else{
            invalidChecker.current?.setCustomValidity("")
        }
    },[selectQty])

    return (
        sourceSuccess&&required?(
            <div 
                onChange={function(e:React.ChangeEvent<HTMLInputElement>){
                    const [setThis,setThat,thisSelect] = (
                        e.target.closest(".sourceDeps")==null?
                        [setSelectTrans,setSelectSource,selectTrans]:
                        [setSelectSource,setSelectTrans,selectSource]
                    )
                    if(e.target.checked==true){
                        radio?(setThat([]),setThis([e.target.value])):setThis(thisSelect?.concat([e.target.value]))
                    }else{
                        setThis(thisSelect?.filter((i)=>i!=e.target.value))
                    }
                }}
            >

                <div className={"sourceDeps "+style.dependence}>
                    <div>SourceDeps:</div>
                    {allSources.map((s)=>{
                        const checked = selectSource?.includes(s.name)
                        return <label className={style.inline+" "+style.radioGroup}>
                            <input 
                                type={radio?"radio":"checkbox"} 
                                name="deps" 
                                value={s.name}
                                key={s.name}
                                checked={checked}
                                disabled={!(radio||checked||addable)}
                            />
                            <span className={style.radioName}>{s.name}</span>
                        </label>
                    })}
                        <input type="checkbox" name="depInvalid" checked={selectQty<min} ref={invalidChecker}/>
                </div>
                {transSuccess&&(configType=="visualize")?(
                    <div className={"transformDeps "+style.dependence}>
                        <div>TransformDeps:</div>
                        {allTrans.map((t) => {
                            const checked = selectTrans?.includes(t.name)
                            return <label className={style.inline+" "+style.radioGroup}>
                                <input 
                                    type={radio?"radio":"checkbox"}  
                                    name="deps"
                                    value={t.name}
                                    key={t.name}
                                    checked={checked}
                                    disabled={!(radio||checked||addable)}
                                />
                                <span className={style.radioName}>{t.name}</span>
                            </label>
                        })}
                    </div>
                    ):null
                }
            </div>
        ):null
    )
}