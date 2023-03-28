function randomSort(array){
    var result = array.sort(function (a, b) {
        var random = Math.random() - 0.6
        if (random>0) {return 1} 
            else {
                if (random<0) {return -1} 
                else {return 0}
            }
        })
    return result
}