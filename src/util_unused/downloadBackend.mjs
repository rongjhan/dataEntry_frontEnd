function downloadBackendPost(dataUri) {
    //https://stackoverflow.com/questions/53027657/office-js-web-word-add-in-window-open-method-is-not-working-with-aboutblank
    //office web addin can't use POST method in target _blank
    var form = document.createElement("form")
    form.style.display = "none"
    form.name = "data"
    form.method = "post"
    form.id = "downloadForm"
    form.target = "_blank"
    form.action = "https://127.0.0.1:3000/download"
    // console.log(dataUri)
    var input = document.createElement("input")
    input.type = "text"
    input.for = "downloadForm"
    input.name = "dataUri"
    input.value = dataUri

    form.appendChild(input)
    document.body.appendChild(form)

    console.log(form.method)
    form.submit()
    // document.body.removeChild(form)
}


function downloadBackendGet(dataUri) {
    //https://stackoverflow.com/questions/53027657/office-js-web-word-add-in-window-open-method-is-not-working-with-aboutblank

    console.log(`https://127.0.0.1:3000/download?dataUri=${dataUri.replace(/\+/g,"%2B")}`)
    window.open( `https://127.0.0.1:3000/download?dataUri=${dataUri.replace(/\+/g,"%2B")}`,"download")
    //此處因為office addin 將 127.0.0.1和localhost視為不同域名,故利用此得以點開啟外部瀏覽器下載檔案
    //雖然get能攜帶資料帶小有限制但是,但因為office addin無法於新視窗送出post請求,此為暫時解法
    //+號於url中需用%2B替換
}



//data:text/plain;base64,57Wx5LiA57eo6JmfLOW7oOWVhuS4reaWh+WQjeeosQo1NzAwLOWkp+S4reemj+Wci+S8gealreaciemZkOWFrOWPuAo2ODA3LOmKgOemj+WVhuW6lw==

export default downloadBackendGet