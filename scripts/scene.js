import { settings } from "./state.js";
import { initializeMaterials, MATERIALS, COLORS, applySettings } from "./config.js";

let scene, ring, stone;

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

  ring  = BABYLON.MeshBuilder.CreateTorus("ring", {diameter: 4, tessellation: 64, thickness: 0.4}, scene);
  ring.position = new BABYLON.Vector3(0, 2, 0);
  ring.rotation.x = Math.PI/3;
  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    "brilliant.stl",
    scene,
    function (meshes) {
      stone = meshes[0];
      stone.name = "stone";
      stone.position = new BABYLON.Vector3(0, 0, -2.5);
      stone.rotation.x = -Math.PI/2;
      stone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
      stone.setEnabled(false);
      stone.parent = ring;
      applySettings(scene, ring, stone);
    }
  );
  return scene;
}

const changeSettings = (path, value) => {
  const keys = path.split(".");
  let obj = settings;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys.at(-1)] = value;
  applySettings(scene, ring, stone);
}

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const renderScene  = createScene(engine, canvas);
engine.runRenderLoop(() => renderScene.render());
addEventListener("resize", () => engine.resize());

export {changeSettings}