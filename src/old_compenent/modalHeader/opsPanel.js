import React from 'react'
import styles from "./modalHeader.css"
import run from "../../../_asset/Start.png"
import close from "../../../_asset/Close.png"
import setting from "../../../_asset/Setting.png"
import save from "../../../_asset/save.png"
import {useSelector,useDispatch} from "react-redux"


function OpsPanel(){

    var projectNow = useSelector((state)=>{
        return state.projectNowData
    })

    var dispatch = useDispatch()

    var ops = {
        Run:{icon:run,command:()=>{}},
        Save:{icon:save,command:()=>{dispatch({type:"saveProject"})}},
        Setting:{icon:setting,command:()=>{}},
        Close:{icon:close,command:()=>{dispatch({type:"clearProjectNow"})}},
    }

    var buttons = Object.keys(ops).map(function(item){
        return (
            <div className={styles.button} key={item}
                onClick={ops[item].command}
            >
                <img className={styles.icon}src={ops[item].icon} alt={item} />
            </div>
        )
    })

    return (
        <div className={styles.panel}>
            {/* {projectNow&&projectNow.name} */}
            {buttons}
        </div>
    )
}

export {OpsPanel}