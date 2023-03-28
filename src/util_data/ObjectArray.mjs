// change two dimension array to Object array
// Object key represent the header data
// data should include header information


function ObjectArray(data,headers){

    function translate(d){
        var object = {}
        for(var header of headers){
            object[header] = d[headers.indexOf(header)]
        }
        return object
    }

    return data.map(translate)
}

export default ObjectArray
