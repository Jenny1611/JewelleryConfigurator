import { settings } from "./state.js";

const COLORS = {
    YellowGold: new BABYLON.Color3(1, 0.95, 0.2),
    RoseGold: new BABYLON.Color3(0.9, 0.6, 0.6),
    White: new BABYLON.Color3(1, 1, 1),
    Blue: new BABYLON.Color3(0.2, 0.4, 1),
    Red: new BABYLON.Color3(1, 0, 0)
};

let MATERIALS = {};

const initializeMaterials = (scene) => {
    MATERIALS = {
        gold: new BABYLON.PBRMetallicRoughnessMaterial("gold", scene),
        silver: new BABYLON.PBRMetallicRoughnessMaterial("silver", scene),
        stone: new BABYLON.StandardMaterial("stone", scene)
    };

    MATERIALS.gold.baseColor = new BABYLON.Color3(1, 0.95, 0.2);
    MATERIALS.gold.metallic = 0.6;
    MATERIALS.gold.roughness = 0.15;

    MATERIALS.silver.baseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
    MATERIALS.silver.metallic = 0.6;
    MATERIALS.silver.roughness = 0.15;

    MATERIALS.stone.alpha = 0.5;
}

function applySettings(scene, ring, stone) {
    if (!ring || !scene) return;
    ring.material = MATERIALS[settings.ring.material];
    ring.color = MATERIALS[settings.ring.color];

    if (stone) {
    const stoneColor = COLORS[settings.stone.color];
    const stoneMat = new BABYLON.StandardMaterial("m2", scene);
    stoneMat.diffuseColor = stoneColor;
    stone.material = stoneMat;
    stone.setEnabled(settings.stone.visible);
    }
}

export {COLORS, MATERIALS, initializeMaterials, applySettings};