function newTabDownLoad(downLoadDataUri,fileName){ //can work without backend
    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840))
    //雖然window.open不受制於<AppDomain>設定,但office web addin 不支持開啟 about:blank路由
    //而window.open本身則不支持開啟data://和object://
    var script =document.createElement("script")
    var code = `function a(){var a = document.createElement("a");a.download="${fileName}";a.href="${downLoadDataUri}";a.click()};a()`
    
    script.innerHTML = code
    win.document.querySelector("head").appendChild(script)
}


export default newTabDownLoad