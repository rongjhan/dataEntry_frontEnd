// import { SourceOption } from "../../mod_source"
// import { TransformOption } from "../../mod_tansform"
// import { VisualizeOption } from "../../mod_visualize"


export enum ConfigType{
    source="source",
    transform="transform",
    visualize="visualize"
}

export type ConfigInfo = {
    name:string,
    option:string,
    settings:Object,
    sourceDeps?:string[],
    transformDeps?:string[],
}

export type configStatus = {
    name:string,
    executable:undefined|boolean,
    output:any
}

export type optionModule = {descriptor:any,execute:(config:any)=>Promise<any>}|null
export type optionState = {module:undefined|optionModule,readonly available:boolean}


export type updateConfig= {
    newName:string,
    option:string,
    [others:string]:string
    // https://stackoverflow.com/questions/33836671/typescript-interface-that-allows-other-properties
}

