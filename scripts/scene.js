import { initializeMaterials } from "./config.js";

let scene, elements, selectedModel;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
selectedModel = urlParams.get('model');

  const { loadModel, model } = await import(`../models/${selectedModel}.js`);

function createScene (engine, canvas) {
  scene = new BABYLON.Scene(engine);
  scene.environmentTexture = new BABYLON.HDRCubeTexture("assets/environment.hdr", scene, 256, false, true, false, true);
  scene.createDefaultSkybox(scene.environmentTexture);

  initializeMaterials(scene);

  const camera = new BABYLON.ArcRotateCamera(
      "camera",
      4.2,
      Math.PI/3,
      model?.scene?.cameraZoom || 20,
      new BABYLON.Vector3(0, 0, 0),
      scene
  );
    camera.wheelPrecision = 30;
    camera.panningSensibility = 0;
    camera.lowerRadiusLimit = model?.scene?.lowerRadiusLimit || 5;
    camera.upperRadiusLimit = model?.scene?.upperRadiusLimit || 40;
    camera.attachControl(canvas, true);

  const light = new BABYLON.SpotLight(
      "light",
      new BABYLON.Vector3(0, 15, 0),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 1,
      1,
      scene
  );
  //const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  let defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
  defaultPipeline.bloomEnabled = true;
  defaultPipeline.bloomKernel = 50;
  defaultPipeline.bloomWeight = 0.4;
  defaultPipeline.bloomThreshold = 1;

  elements = importModel();

  return scene;
}

async function importModel() {
  let model = loadModel(scene);
  loadConfig();
  return model;
}

function loadConfig() {
  let columnConfig = document.querySelector(".column-config");
  model.customizableParts.forEach(async customObject => {
    for (const custom in customObject.customs) {
      let confDiv = document.createElement("div");
      confDiv.className = "column-config";
      let h3 = document.createElement("h3");
      confDiv.appendChild(h3);
      columnConfig.appendChild(confDiv);
      h3.innerHTML = `${customObject.name} - ${customObject.customs[custom].name}`;
      let rowDiv = document.createElement("div");
      rowDiv.className = "row-config";
      if(customObject.customs[custom].options) {
        customObject.customs[custom].options.forEach(option => {
          let cardButton = document.createElement("div");
          cardButton.className = "card settingsButton";
          cardButton.setAttribute("property", `${customObject.value}.${custom}`);
          cardButton.setAttribute("value", `${option.value}`);
          let p = document.createElement("p");
          p.innerHTML = `${option.name}`
          cardButton.appendChild(p);
          cardButton.addEventListener("click" , () => {
            changeSettings(cardButton.getAttribute('property'), cardButton.getAttribute('value'));
          })
          rowDiv.appendChild(cardButton);
        });
      } else if(customObject.customs[custom].slider) {
        let slider = document.createElement('input');
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', parseInt(customObject.customs[custom].slider.min));
        slider.setAttribute('max', parseInt(customObject.customs[custom].slider.max));
        let property = `${customObject.value}.${custom}`;
        slider.setAttribute('value', parseInt(model.settings[customObject.value][custom]));
        slider.addEventListener('input', () => {
          changeSettings(property, slider.value);
        })
        rowDiv.appendChild(slider);
      }
      confDiv.appendChild(rowDiv);
    }
  })
}

const changeSettings = async (path, value) => {
  const { applySettings } = await import(`../models/${selectedModel}.js`);
  const keys = path.split(".");
  let obj = model.settings;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys.at(-1)] = value;
  applySettings(scene, await elements);
}

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const renderScene  = createScene(engine, canvas);
engine.runRenderLoop(() => renderScene.render());
addEventListener("resize", () => engine.resize());

export {changeSettings};