import React, { useRef, useState } from "react";
import {ConfigType} from "../store/types/index"
import { ConfigList } from "./configList";
import { ConfigEditor } from "./configEditor";




export function ConfigBlock(props:{configType:ConfigType}){
    const { configType } = props
    const [opened , setOpened] = useState<string|null>(null) 
    return (
        <>
            <ConfigList configType={configType} opened={opened} setOpened={setOpened}/>
            {opened?<ConfigEditor configType={configType} opened={opened} setOpened={setOpened}/>:null}
        </>
    )
}