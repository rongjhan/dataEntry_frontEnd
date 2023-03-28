function loadModule (moduleName){
    return import(
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "mod_exportData" */
        `./${moduleName}.mjs`)
}



export {
    loadModule as loadExportData
}