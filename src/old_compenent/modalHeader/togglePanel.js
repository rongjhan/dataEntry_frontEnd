import React from 'react';
import {useSelector,useDispatch} from "react-redux"
import styles from "./modalHeader.css"
import switchIcon from "../../../_asset/Switch.png"

function ToggleButton(props){
    var {show,blockName,toggle} = props
        
    return(
        <div onClick={toggle} 
            className={`${styles.toggle} ${show?styles.active:""}`}
        >
            {blockName}
        </div>
    )
}

function ToggleList(props){
    const dispatch = useDispatch();
    var state = useSelector((state)=>{
        return {
            blocks:state.configModal.blocks,
            modal:state.configModal
        }
    })

    function toggle(blockType){
        return ()=>{
            dispatch({type:`${blockType}Toggle`})
        }
    }

    return(
        <div style={{height:"100%"}}>
            {
                state.blocks.map(function(block){
                    return <ToggleButton toggle={toggle(block)} show={state.modal[block].show} blockName={block} key={block}></ToggleButton>
                })
            }
            <div className={styles.switch}
                onClick={(e)=>{dispatch({type:"changeModalContentNow"})}}
            >
                <img className={styles.icon} src={switchIcon}/>
            </div>
        </div>
    )
}

export {ToggleList}