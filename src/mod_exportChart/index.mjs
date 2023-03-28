function loadModule (moduleName){
    return import(
        /* webpackMode: "lazy-once" */
        /* webpackChunkName: "mod_exportChart" */
    `./${moduleName}.mjs`)
}

export {
    loadModule as loadExportChart
}