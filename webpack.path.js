import path, { dirname } from "path"
import { fileURLToPath } from "node:url"

//此檔案需要與webpack.config.js放在同一目錄下
const __filename = fileURLToPath(import.meta.url); //用es module時無內建此變數
const __dirname = dirname(__filename);

export const context = path.resolve(__dirname)

const DEV_OUTPUT_PATH ={
    JS:context+"/dist", 
    PIC:context+"/dist/pic" ,
    CSS:context+"/dist/css",
    HTML:context+"/dist",         
    FONT:context+"/dist/font",
    GEOJSON:context+"/dist/geojson"
}


const PRODUCTION_OUTPUT_PATH ={
    JS:"E:/dataEntryV4/backend/static/editor",
    PIC:"E:/dataEntryV4/backend/static/editor/pic",
    CSS:'E:/dataEntryV4/backend/static/editor/css',
    HTML:'E:/dataEntryV4/backend/static/editor',
    FONT:"",
    GEOJSON:"E:/dataEntryV4/backend/static/editor/geojson"
}

export default function genPath(dev=true){
    return dev?DEV_OUTPUT_PATH:PRODUCTION_OUTPUT_PATH
}