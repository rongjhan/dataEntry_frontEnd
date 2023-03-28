try {
    // importScripts("https://127.0.0.1:3000/static/assets/tf.js")
    self.importScripts("https://127.0.0.1:3000/static/assets/danfo.min.js")
    self.importScripts("https://127.0.0.1:3000/static/assets/textEncoder.js")
    console.log("backend")
    dfd.tf.setBackend("cpu")
} catch (error) {
    self.importScripts("https://cdn.jsdelivr.net/npm/danfojs@0.2.7/lib/bundle.min.js")
    dfd.tf.setBackend("webgl")
}


function toFrame(array) {
    var header = array.slice(0, 1)[0]
    var body = array.slice(1)
    return new dfd.DataFrame(body, { columns: header })
}
var datas

self.onmessage = function (msg) {
    datas = msg.data.datas
    var code = new Function(msg.data.code);
    var processID = msg.data.processID
    try {
        var result = code()
        if (result instanceof Promise) {
            result.then(function (final) { postMessage({ result: final, processID: processID }) })
            //postMessage can't send promise
        } else {
            self.postMessage({ result: result, processID: processID})
        }
    } catch (error) {
        console.log("catchError: ", error)
        self.postMessage({ result: error.toString(), processID: processID})
    }

}







