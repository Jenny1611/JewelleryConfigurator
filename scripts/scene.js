import { settings } from "./state.js";
import { initializeMaterials, applySettings } from "./config.js";

let scene, elements, selectedModel;

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
  const { loadModel } = await import(`../models/${selectedModel}.js`);
  return loadModel(scene);
}

const changeSettings = async (path, value) => {
  const keys = path.split(".");
  let obj = settings;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys.at(-1)] = value;
  applySettings(scene, await elements);
}

let currentStone = null;

/* window.loadGem = function(filename) {
  if (currentStone) {
    currentStone.dispose();
    currentStone = null;
  }

  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    filename,
    scene,
    function (meshes) {
      currentStone = meshes[0];
      currentStone.name = "stone";
      currentStone.position = new BABYLON.Vector3(0, 0, 0);
      applySettings(scene, elements);
    }
  );
}; */

function setSelectedModel(value) {
  selectedModel = value;
}

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const renderScene  = createScene(engine, canvas);
engine.runRenderLoop(() => renderScene.render());
addEventListener("resize", () => engine.resize());

export {changeSettings, setSelectedModel};