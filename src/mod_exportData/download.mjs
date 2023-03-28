import { arrayToCSv,createDataURI } from "./_dataUtil.mjs";


var descriptor = {
    data:{required:true,multi:false},
    config:{
        fileType:{type:"selection",options:["csv"],defaultValue:"csv"}
    }
}


function downloadData({datas,config}) {
    console.log(config)
    var promise = Promise.resolve(arrayToCSv(datas[0]))
    var fileName = `data.${config.fileType}`
    //雖為同步方法 回傳promise只是為了回傳接口一致,故用promise
    switch(config.fileType){
        case "csv":
            console.log("in download csv")
            return promise.then(function (csvString) {
                // https://stackoverflow.com/questions/49700028/how-to-download-files-using-office-web-add-in
                var link = document.createElement("a");
                link.download = fileName
                link.href =  createDataURI(csvString)
                console.log(createDataURI(csvString))
                link.click()
                return "success"
            }).catch((error)=>{console.error(error); return null})

    }

}

export {
    downloadData as produce,
    descriptor
}

