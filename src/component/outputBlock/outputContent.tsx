import React, {useCallback, useEffect,useRef, useState} from 'react';
import style from "./css/outputContent.css"
import { api } from '../../store/endpoint';
import { ConfigType } from '../../store/types';
import toDisplayData from '../../util_app/toDisplayData.mjs';
export function OutputContent({ showConfig, setShowConfig }){

    return(
        <div className={style.outputContent}>
            {
                Object.keys(ConfigType).map((configType)=>{
                    return <ConfigOutputList {...{configType,showConfig,setShowConfig}}/>
                })
            }
        </div>
    )
}


function ConfigOutput({showed,configType,config}){
    const {executable,output} = config
    const displayArea=useRef<HTMLDivElement>(null)

    const showOutput = useCallback(async function(output){
        if (output===undefined){
            displayArea.current.innerHTML = ""
        }else if(output instanceof Error){
            displayArea.current.innerHTML = toDisplayData(output)
        }else{
            if(configType=="visualize"){
                window.output = output
                displayArea.current.innerHTML = ""
                displayArea.current?.appendChild(await output?.render())
            }else{
                displayArea.current.innerHTML = toDisplayData(output)
            }
        }
    },[])

    useEffect(()=>{
        showOutput(output)
    },[output])

    return (
        <div className={
            [style.configOutput,(showed?style.show:""),executable===undefined?style.unExecute:""].join(" ")
            }
            ref={displayArea}
        />
    )
}


function ConfigOutputList({configType,showConfig,setShowConfig}){
    const {showType,showIndex} = showConfig
    const list = useRef<HTMLDivElement>(null)
    const locate = useRef<number>(showIndex)
    const { data: allConfigs, isSuccess } = api.useGetConfigsQuery(configType)

    useEffect(()=>{
        // scroll動畫
        if (showType==configType){
            if(showIndex!=locate.current){
                const fromIndex = list.current.children[locate.current] as HTMLElement
                const toIndex = list.current.children[showIndex] as HTMLElement

                toIndex.classList.add(style.show)
                list.current.scroll(0,fromIndex.offsetTop)
                
                list.current.scroll({
                    top: toIndex.offsetTop-12, 
                    //12為 margin-top大小
                    //offset是子元素border-box到父元素content-box距離
                    //https://juejin.cn/post/6844903745512275981#:~:text=element.offsetLeft%E6%98%AF%E6%8C%87element%E7%9A%84border%2Dbox%E5%B7%A6%E4%B8%8A%E8%A7%92%E7%9B%B8%E5%AF%B9offsetParent%E7%9A%84content%2Dbox%E7%9A%84%E5%81%8F%E7%A7%BB%E9%87%8F
                    behavior: 'smooth'
                });

                setTimeout(function(){
                    fromIndex.classList.remove(style.show)
                    locate.current=showIndex
                },800)
                //800為確保等待scroll完成,scroll動畫時間長度各瀏覽器不同
                //https://stackoverflow.com/questions/64611389/scroll-duration-for-behaviour-smooth-in-different-browsers#:~:text=So%20for%20clarification%2C%20what%20I%20need%20is%20only%20a%20list%20of%20durations%20like%3A%20Firefox%20500ms%2C%20Opera%20800ms%2C%20Chrome%20500ms%2C%20...%20Or%20whatever%20the

            }
        }

    },[showIndex])

    useEffect(()=>{
        //當有config被刪除時的處理
            if(allConfigs&&locate.current>allConfigs.length-1){
                locate.current = allConfigs.length-1
                if(showType==configType){
                    setShowConfig({showType:configType,showIndex:locate.current})
                }
            }
    },[allConfigs])

    return(
        <div ref={list} className={style.outputList+" "+(showType==configType?style.show:"")}>
            {
                isSuccess?(
                    allConfigs.map((c,i)=><ConfigOutput configType={configType} showed={i==locate.current} config={c}/>)
                ):null
            }
        </div>
    )
}


