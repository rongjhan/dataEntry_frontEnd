import React, { useEffect, useMemo, useState } from "react";
import { ConfigType } from "../../store/types";
import { InputCluster } from "./inputCluster";
import {DependenceSelect} from "./depSelect"
import style from "./css/configInput.css"
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import {load as loadSource} from "../../mod_source"
import {load as loadVisualize} from "../../mod_visualize"
import {load as loadTransform} from "../../mod_tansform"




type optionProp = {
    configType: ConfigType,
    config: string,
}


export function ConfigOption({ configType, config }) {
    const [selected, setSelect] = useState<string>(config.option)
    const [options,load] = useSelector((state:RootState) => {
        switch (configType) {
            case "source":
                return [state.app.sourceOption,loadSource]
            case "transform":
                return [state.app.transformOption,loadTransform]
            case "visualize":
                return [state.app.visualizeOption,loadVisualize]
            default:
                throw "configType Value Error"
        }
    })

    const modDesc = options[selected].module?.descriptor
    
    // const [modDesc, setModDesc] = useState<any>(options[selected].module?.descriptor)
    

    useEffect(() => {setSelect(config.option)}, [config])

    useEffect(() => {(options[selected].module === undefined)?load(selected):undefined}, [selected])

    return (
            <>
                <label htmlFor="option">
                    <span className={style.name}>option</span>
                    <select name="option" id="option" onChange={(e)=>{setSelect(e.target.value)}}>
                        {Object.entries(options).map(function (o) {
                            return (<option disabled={!o[1].available} selected={o[0] == selected} value={o[0]}>{o[0]==""?"none":o[0]}</option>)
                        })}
                    </select>
                </label>
                {(modDesc!=undefined)?(
                    <React.Fragment key={selected}>
                    {configType=="source"?null:
                        <DependenceSelect {...{configType,modDesc,config,selected}}/>
                    }
                    <InputCluster {...{modDesc,config,selected}}/>
                    </React.Fragment>
                ):null}
            </>
    )
}
// key={selected}