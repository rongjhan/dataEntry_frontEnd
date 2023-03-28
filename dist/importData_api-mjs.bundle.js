"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk"] = self["webpackChunk"] || []).push([["importData_api-mjs"],{

/***/ "./src/mod_source/api.mjs":
/*!********************************!*\
  !*** ./src/mod_source/api.mjs ***!
  \********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"descriptor\": function() { return /* binding */ descriptor; },\n/* harmony export */   \"produce\": function() { return /* binding */ getData; }\n/* harmony export */ });\nvar descriptor = {\r\n    data:null,\r\n    config:{\r\n        route:{type:\"text\",defaultValue:\"\",required:true}\r\n    }\r\n}\r\n\r\n\r\n\r\nfunction getData({config}){\r\n    if(!config.route){console.log(\"url can't be empty\");return}\r\n    var encodeUrl = encodeURIComponent(config.route)\r\n    var url = document.location.origin+`/request/requestApi?url=${encodeUrl}`\r\n    console.log('fetch data from',url)\r\n    return fetch(url)\r\n        .then(function(response){return response.json()})\r\n}\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/mod_source/api.mjs?");

/***/ })

}]);