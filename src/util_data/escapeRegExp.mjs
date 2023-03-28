function escapeRegExp(string,get="group") {
    var escapedString = string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') //$& means the whole matched string
    switch(get){
        case "group":
            return `(${escapedString})`
        case "set":
            return `[${escapedString}]`
    }
}

export {escapeRegExp}