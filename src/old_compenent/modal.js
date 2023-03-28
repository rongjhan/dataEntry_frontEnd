import React,{useEffect,useRef,useState}from "react"
import {useSelector} from "react-redux"
import {ModalHeader} from "./modalHeader/modalHeader"
import styles from "./modal.css"
import { ModalContent } from "./modalContent/modalContent"

function ProjectModal(props){
    var modal=useRef()

    var state = useSelector((state)=>{return {
        projectNow:state.projectNow,
        projectNowData:state.projectNowData,
        modalContentNow:state.configModal.modalContentNow
    }})


    useEffect(()=>{
        modal.current.style.top=pageYOffset+"px"
    },[pageYOffset])

    return(
        <div ref={modal} 
            className={`${styles.modal} ${state.projectNow?"":styles.hide}`}
        >
            <ModalHeader></ModalHeader>
            <ModalContent></ModalContent>
        </div>
    )

}

export {ProjectModal}