"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk"] = self["webpackChunk"] || []).push([["importData_stockApi-mjs"],{

/***/ "./src/mod_source/stockApi.mjs":
/*!*************************************!*\
  !*** ./src/mod_source/stockApi.mjs ***!
  \*************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"descriptor\": function() { return /* binding */ descriptor; },\n/* harmony export */   \"produce\": function() { return /* binding */ getData; }\n/* harmony export */ });\n/* harmony import */ var _util_parseDataType_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/_parseDataType.mjs */ \"./src/mod_source/util/_parseDataType.mjs\");\n\r\n\r\nvar descriptor = {\r\n    data:null,//null means it can't handle any data,and also dont need it\r\n    config:{\r\n        stockNo:{type:\"text\",defaultValue:\"2330\",required:true},\r\n        parse:{type:\"selection\",options:[\"none\",\"number\",\"dateTime\",\"num?date\"],defaultValue:\"number\"},\r\n        locales:{type:\"text\",defaultValue:'en',required:true},\r\n        dateTimeFormats:{type:\"text\",defaultValue:'YYYY-MM-DD',required:true}\r\n    }\r\n}\r\n\r\nfunction getData({config}){\r\n    var {stockNo,parse} = config\r\n    var locales = config.locales.split(\",\")\r\n    var dateTimeFormats = config.dateTimeFormats.split(\",\")\r\n    var url = document.location.origin+`/request/stockApi?stockNo=${stockNo}`\r\n\r\n    console.log('fetch data from',url)\r\n    \r\n    return fetch(url)\r\n        .then((response)=>response.json())\r\n        .then((data)=>(0,_util_parseDataType_mjs__WEBPACK_IMPORTED_MODULE_0__.parseDataType)(data,parse,locales,dateTimeFormats))\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/mod_source/stockApi.mjs?");

/***/ })

}]);