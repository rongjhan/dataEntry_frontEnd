const descriptor = {
    deps:null,
    inputs:{
        route:{type:"text",defaultValue:"",required:true}
    }
}



function getData({config}){
    if(!config.route){console.log("url can't be empty");return}
    var encodeUrl = encodeURIComponent(config.route)
    var url = document.location.origin+`/request/requestApi?url=${encodeUrl}`
    console.log('fetch data from',url)
    return fetch(url)
        .then(function(response){return response.json()})
}


export {
    getData as execute,
    descriptor
}
