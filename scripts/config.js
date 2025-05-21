import { settings } from "./state.js";

const COLORS = {
  YellowGold: new BABYLON.Color3(1, 0.95, 0.2),
  RoseGold: new BABYLON.Color3(0.9, 0.6, 0.6),
  White: new BABYLON.Color3(1, 1, 1),
  Blue: new BABYLON.Color3(0.2, 0.4, 1),
  Red: new BABYLON.Color3(1, 0, 0),
};

let MATERIALS = {};

const initializeMaterials = (scene) => {
    MATERIALS = {
        gold: new BABYLON.PBRMetallicRoughnessMaterial("gold", scene),
        silver: new BABYLON.PBRMetallicRoughnessMaterial("silver", scene),
        stone: new BABYLON.PBRMaterial("stone", scene),
    };

    MATERIALS.gold.baseColor = new BABYLON.Color3(1, 0.95, 0.2);
    MATERIALS.gold.metallic = 0.6;
    MATERIALS.gold.roughness = 0.15;

    MATERIALS.silver.baseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
    MATERIALS.silver.metallic = 0.6;
    MATERIALS.silver.roughness = 0.15;

    MATERIALS.stone.metallic = 0.0;
    MATERIALS.stone.roughness = 0;
    MATERIALS.stone.subSurface.isRefractionEnabled = true;
};

function applySettings(scene, ring, stone) {
  if (!ring || !scene) return;
  ring.material = MATERIALS[settings.ring.material];
  ring.color = MATERIALS[settings.ring.color];

  if (stone) {
    stone.material = MATERIALS[settings.stone.material];
    stone.color = MATERIALS[settings.stone.color];
    stone.setEnabled(settings.stone.visible);
  }
}

export { COLORS, MATERIALS, initializeMaterials, applySettings };
