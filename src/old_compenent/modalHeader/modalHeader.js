import React from 'react';
import {OpsPanel} from "./opsPanel"
import {ToggleList} from "./togglePanel"
import styles from "./modalHeader.css"
// import {useSelector} from "react-redux"


function ModalHeader(props){


    return(
        <div className={styles.modalHeader}>
            <OpsPanel></OpsPanel>
            <ToggleList></ToggleList>
        </div>
    )
}

export {ModalHeader} 