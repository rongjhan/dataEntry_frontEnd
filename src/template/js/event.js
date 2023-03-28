
(function blockToggleEvent(){
    const togglers = document.querySelectorAll(".toggler")

    for(let i=0;i<togglers.length;i++){
        let el = togglers[i]
        let configType = el.dataset.configtype

        el.addEventListener("click",function(event){
            event.target.classList.toggle("active")
            document.querySelector(`.config.block[data-configtype=${configType}]`).classList.toggle("active")
        })
    }
})();


(function resizeEvent(){
    const configBlocks = document.querySelectorAll(".config.block")
    const body = document.querySelector(".body")
    let resizeBlock = null
    let timer = null; //for mousmove event debounce
    let debounceDelay = 8

    for(let i=0;i<configBlocks.length;i++){
        configBlocks[i].querySelector(".resizer").addEventListener("mousedown",function(){
            resizeBlock=this.parentElement.dataset.configtype
        })
    }

    body.addEventListener("mouseup",function(event){
        if(resizeBlock){
            event.currentTarget.style.cursor = ""
            resizeBlock=null
        }
    })

    body.addEventListener("mousemove",function(event){
        if(resizeBlock){
            if (timer){clearTimeout(timer)}
            event.currentTarget.style.cursor = "col-resize"
            const block = document.querySelector(`.block[data-configtype=${resizeBlock}]`)
            timer = setTimeout(function(){
                block.style.flexBasis = event.clientX-(block.offsetLeft)+"px"
            },debounceDelay)
        }
    })
})()
