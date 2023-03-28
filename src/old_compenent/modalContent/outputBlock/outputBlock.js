import React, {} from 'react';
import styles from "./outputBlock.css"
import {useSelector,useDispatch,shallowEqual} from "react-redux"
import { OutputMenu } from './outputMenu';
import { OutputItemList } from './outputItem';




function OutputBlock(props){

    var dispatch = useDispatch()
    var state = useSelector((state)=>{
        return {
                show:state.configModal.output.show,
                showConfigTypeNow:state.configModal.output.showConfigTypeNow,
            }
    },shallowEqual)

    var display = state.show?"flex":"none"

    return(
        <div className={styles.block} style={{display:display}}>        
            <div 
                style={{verticalAlign:"middle",lineHeight:"25px",fontSize:"16px",textAlign:"center",borderBottom:"1px solid black",backgroundColor:"#c7ecee"}}>
                <span style={{paddingLeft:5}}>output</span>
            </div>
            <OutputMenu></OutputMenu>
            <OutputItemList showConfigTypeNow={state.showConfigTypeNow}></OutputItemList>
        </div>
        
    )
}

export {OutputBlock} 