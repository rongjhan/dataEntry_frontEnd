




var defaultCode = `
# variable result will return unexplicitly,and it must be an dataframe or series

data1 = pd.DataFrame(datas[0],columns=datas[0].pop(0))
#print(data1["統一編號"].to_string())
data1["統一編號"] = data1["統一編號"].astype(str).apply(lambda num: num.strip()) #移除頭尾whiteSpace
data1["統一編號"] = data1["統一編號"].apply(lambda num: num.lstrip('0'))  #移除leading zero

data2 = pd.DataFrame(datas[1],columns=datas[1].pop(0))
data2["統一編號"] = data2["統一編號"].astype(str).apply(lambda num: num.strip())
data2["統一編號"] = data2["統一編號"].apply(lambda num: num.lstrip('0'))

reserveColumn = ['統一編號',"廠商中文名稱","中文營業地址","代表人","電話號碼","傳真號碼","補助金額(元)","原始登記日期"]
result= pd.merge(data1,data2,on="統一編號",how="inner").loc[:,reserveColumn]
`.replace(/\s{2,}/g," ")  //將多餘空白轉為一個,在regex中\s表示空白
//result.tensor.array()




var descriptor = {
    deps:{min:0,max:Infinity},
    inputs:{
        code:{type:"textarea",defaultValue:defaultCode,height:"300px"}
    }
}


function runCode({datas,config}){
    //data is array of promise
    var code = config.code.trim()
    if(!code){
        console.log("empty code")
        return Promise.resolve([])
    }
    
    //https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
    return fetch("./operate",{
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({datas,code})
    }).then((response)=>response.json()).then((data)=>data)//data已經是parse過的json(即已轉成js物件)
    
}

export{runCode as execute,descriptor}
