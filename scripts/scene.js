import { settings } from "./state.js";
import { initializeMaterials, MATERIALS, COLORS, applySettings } from "./config.js";

function createScene (engine, canvas) {
  const scene = new BABYLON.Scene(engine);

  initializeMaterials(scene);

  const camera = new BABYLON.ArcRotateCamera(
      "camera",
      4,
      1.0,
      6,
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

  const ring  = BABYLON.MeshBuilder.CreateTorus("ring", {diameter: 4}, scene);
  ring.position = new BABYLON.Vector3(0, 2, 0);
  ring.rotation.x = Math.PI/3;
  let stone;
  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    "gem.stl",
    scene,
    function (meshes) {
      stone = meshes[0];
      stone.name = "stone";
      stone.position = new BABYLON.Vector3(0, 1.8, -2);
      stone.setEnabled(false);
      stone.parent = ring;
      applySettings(scene, ring, stone);
    }
  );
  return scene;
}

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene  = createScene(engine, canvas);
engine.runRenderLoop(() => scene.render());
addEventListener("resize", () => engine.resize());