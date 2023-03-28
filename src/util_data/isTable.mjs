function isTable(data){
    if(typeof data!=="object"||data===null){console.log("zero dimension");return false}
    //以下都只有檢查第一個元素,假設了所有完素均為同一個type
    if(data instanceof Array){
        var oneElement = data[0]
        switch (true){
            case (typeof oneElement !== "object" || oneElement===null):
                console.log("plainArray")
                return "plainArray"
            case (oneElement instanceof Array):
                var twoElement = oneElement[0]
                if(typeof twoElement !== "object" || twoElement===null){
                    console.log("arrayArray")
                    return "arrayArray" // array with array element
                }else{console.log("exceed dimension");return false}
            case (oneElement instanceof Object):
                var twoElement = oneElement[Object.keys(oneElement)[0]]
                if(typeof twoElement !== "object" || twoElement===null){
                    console.log("objectArray")
                    return "objectArray"  //array with object elment
                }else{console.log("exceed dimension");return false}
        }
    }
    if(data instanceof Object){
        var oneElement = data[Object.keys(data)[0]]
        switch (true){
            case (typeof oneElement !== "object" || oneElement===null):
                console.log("plainObject")
                return "plainObject"
            case (oneElement instanceof Array):
                var twoElement = oneElement[0]
                if(typeof twoElement !== "object" || twoElement===null){
                    console.log("arrayObject")
                    return "arrayObject" //object with array value
                }else{console.log("exceed dimension");return false}
            case (oneElement instanceof Object):
                console.log("exceed dimension");return false
        }
    }
}


export default isTable
