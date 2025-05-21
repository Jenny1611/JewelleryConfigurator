import { settings } from "./state.js";

const COLORS = {
    YellowGold: new BABYLON.Color3(1, 0.84, 0),
    RoseGold: new BABYLON.Color3(0.9, 0.6, 0.6),
    White: new BABYLON.Color3(1, 1, 1),
    Blue: new BABYLON.Color3(0.2, 0.4, 1)
};

let MATERIALS = {};

const initializeMaterials = (scene) => {
  MATERIALS = {
      gold: new BABYLON.StandardMaterial("gold", scene),
      silver: new BABYLON.StandardMaterial("silver", scene),
      stone: new BABYLON.StandardMaterial("stone", scene)
  };

  MATERIALS.gold.diffuseColor = new BABYLON.Color3(1, 0.84, 0);
  MATERIALS.silver.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  MATERIALS.stone.alpha = 0.5;
}

function applySettings(scene, ring, stone) {
  if (!ring || !scene) return;
  ring.material = MATERIALS[settings.ring.material];

  if (stone) {
    const stoneColor = COLORS[settings.stone.color];
    const stoneMat = new BABYLON.StandardMaterial("m2", scene);
    stoneMat.diffuseColor = stoneColor;
    stone.material = stoneMat;
    stone.setEnabled(settings.stone.visible);
  }
}

export {COLORS, MATERIALS, initializeMaterials, applySettings};