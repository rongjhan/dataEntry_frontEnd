const worker = new Worker(/* webpackChunkName: "transform-worker" */ new URL('./worker.ts', import.meta.url));
let process = 0
const resultQue = []
const timeoutQue = []

function getProcessID(){return process++}

worker.onmessage=async function(e){
    //e.data 不能是Promise因為 postMessage不能傳送Promise
    console.log("new",e.data)
    resultQue[e.data.processID]= e.data.result
}




export {worker,resultQue,timeoutQue,getProcessID}