import {setSelectedModel} from "./scene.js";
 
let ringsButton = document.getElementById("load-rings")
ringsButton?.addEventListener('click', () => {
    document.querySelector("div.container#models").style.display = "flex";
})

document.querySelectorAll(".load-model").forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.getAttribute('id'))
        setSelectedModel(button.getAttribute('id'));
    })
})