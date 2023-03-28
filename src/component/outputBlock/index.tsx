import React, { useState } from 'react';
import { MenuHeader } from './outputMenu';
import { OutputContent } from './outputContent';
import { ConfigType } from '../../store/types';



function OutputBlock(){

    const [showConfig,setShowConfig] = useState<{showType:ConfigType,showIndex:number}>({showType:ConfigType.source,showIndex:0})

    return(
        <>        
            <MenuHeader {...{showConfig,setShowConfig}}/>
            <OutputContent {...{showConfig,setShowConfig}}/>
        </>
        
    )
}

export {OutputBlock} 