import {store} from "./store/store"
import { ConfigBlock } from "./component/configBlock"
import { OutputBlock } from "./component/outputBlock"
import { Provider } from "react-redux"
import ReactDOM  from "react-dom"
import React from "react"
import { fetchInit } from "./store/appSlice"
import "./template/js/event.js"  //import just for side effect
import { ConfigType } from "./store/types"


let init = store.getState().app.init

let unsubscribeInit = store.subscribe(()=>{
    let previousInit = init
    init = store.getState().app.init
    if(init!=previousInit){
        unsubscribeInit()
        ReactDOM.render(
            <Provider store={store}>
                <ConfigBlock configType={ConfigType.source}/>
            </Provider>,
            document.querySelector(".source.root")
        )
        
        ReactDOM.render(
            <Provider store={store}>
                <ConfigBlock configType={ConfigType.visualize}/>
            </Provider>,
            document.querySelector(".visualize.root")
        )

        ReactDOM.render(
            <Provider store={store}>
                <ConfigBlock configType={ConfigType.transform}/>
            </Provider>,
            document.querySelector(".transform.root")
        )
        
        
        ReactDOM.render(
            <Provider store={store}>
                <OutputBlock/>
            </Provider>,
            document.querySelector(".output.root")
        )
    }
})

store.dispatch(fetchInit())



