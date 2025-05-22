import { initializeMaterials } from "./config.js";

let scene, elements, selectedModel;

let modelConfig;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
selectedModel = urlParams.get('model');

function createScene (engine, canvas) {
  scene = new BABYLON.Scene(engine);

  scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
  //scene.createDefaultSkybox(scene.environmentTexture, true);

  initializeMaterials(scene);

  const camera = new BABYLON.ArcRotateCamera(
      "camera",
      4,
      1.0,
      10,
      new BABYLON.Vector3(0, 1.5, 0),
      scene
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.SpotLight(
      "light",
      new BABYLON.Vector3(-20, 50, -30),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI / 1,
      1,
      scene
  );
  //const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1;

  elements = importModel();

  return scene;
}

async function importModel() {
  const { loadModel, model } = await import(`../models/${selectedModel}.js`);
  modelConfig = model;
  loadConfig();
  return loadModel(scene);
}

function loadConfig() {
  let columnConfig = document.querySelector(".column-config");
  modelConfig.customizableParts.forEach(customObject => {
    for (const custom in customObject.customs) {
      let confDiv = document.createElement("div");
      confDiv.className = "column-config";
      let h3 = document.createElement("h3");
      confDiv.appendChild(h3);
      columnConfig.appendChild(confDiv);
      h3.innerHTML = `${customObject.name} - ${customObject.customs[custom].name}`;
      let rowDiv = document.createElement("div");
      rowDiv.className = "row-config";
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
        confDiv.appendChild(rowDiv);
      });
    }
  })
}

const changeSettings = async (path, value) => {
  const { applySettings } = await import(`../models/${selectedModel}.js`);
  const keys = path.split(".");
  let obj = modelConfig.settings;

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