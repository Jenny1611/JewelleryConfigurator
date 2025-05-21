import { changeSettings } from "./scene.js";

document.querySelectorAll(".settingsButton").forEach(button => {
    button.addEventListener("click" , () => {
        changeSettings(button.getAttribute('property'), button.getAttribute('value'));
    })
})

const loadModel = (modelId) => {

}

