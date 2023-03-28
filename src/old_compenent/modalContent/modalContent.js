import React, {useEffect,useRef,useState} from 'react';
import {useSelector} from "react-redux"
import {ConfigBlock} from "./configBlock/configBlock"
import {OutputBlock} from "./outputBlock/outputBlock"
import styles from "../modal.css"



function ModalContent(){

    var block = null
    var state = useSelector((state)=>{return {
        blocks:state.configModal.blocks
    }})

    return(
        <div className={styles.modalContent}
            onMouseDown={(e)=>{if(e.target.classList[1]=="resizer"){block=e.target.parentElement}}}
            onMouseUp={(e)=>{e.currentTarget.style.cursor = "";block=null}}
            onMouseMove={(e)=>{
                
                if(block){
                    e.currentTarget.style.cursor = "col-resize"
                    var newWidth = e.clientX-block.offsetLeft
                    block.style.width = newWidth+"px"
                }
            }}
        >
            {state.blocks.map((block)=>{
                return <ConfigBlock key={block} configType={block}></ConfigBlock>
            })}
            <OutputBlock key={"output"}></OutputBlock>
        </div>
    )
}

export {ModalContent} 