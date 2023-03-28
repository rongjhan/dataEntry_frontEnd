import React, { useEffect, useState } from 'react';
import style from "./css/outputMenu.css"
import { ConfigType } from '../../store/types';
import { api } from '../../store/endpoint';


export function MenuHeader({ showConfig, setShowConfig }) {
    return (
        <div className={style.menuHeader}>
            {
                Object.keys(ConfigType).map((configType)=>{
                    return <MenuList {...{configType,showConfig, setShowConfig}}/>
                })
            }
        </div>
    )
}




function MenuList({ configType, showConfig, setShowConfig }) {
    const { showType, showIndex } = showConfig
    const [expand, setExpand] = useState<boolean>(false)
    const { data: allConfigs, isSuccess } = api.useGetConfigsQuery(configType)


    const isPresent = showType==configType;
    const displayList = (expand && allConfigs?.length > 0) ? "initial" : "none"

    return (
        <div className={style.menuItem +" "+(isPresent?style.show:"")}
            onClick={(e) => { setShowConfig({ showType:configType, showIndex: 0 }) }}
            onMouseEnter={(e) => { setExpand(true) }}
            onMouseLeave={(e) => { setExpand(false) }}
        >{isSuccess ? (
            <>
                <span>{`${configType} (${allConfigs.length})`}</span>
                <div className={style.listBlock}
                    style={{ display: displayList }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (e.target!=e.currentTarget){
                            //event delegation 緣故,要保證click事件由列表元素觸發,而非parent元素本身
                            setExpand(false);
                            setShowConfig({showType:configType,showIndex:e.target.dataset["index"]})
                        }
                    }}
                >
                    {allConfigs.map((c,i) => {
                        return (
                            <li className={style.list+" "+(isPresent&&showIndex==i?style.show:"")} 
                                key={c.name} 
                                data-index={i}
                            >
                                {c.name}
                            </li>
                        )
                    })}
                </div>
            </>
        ) : null}
        </div>
    )
}



