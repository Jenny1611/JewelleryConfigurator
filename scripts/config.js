import { settings } from "./state.js";

const COLORS = {
  YellowGold: new BABYLON.Color3(1, 0.95, 0.2),
  GreySilver: new BABYLON.Color3(0.75, 0.75, 0.75),
  RoseGold: new BABYLON.Color3(0.9, 0.6, 0.6),
  White: new BABYLON.Color3(1, 1, 1),
  Blue: new BABYLON.Color3(0.2, 0.4, 1),
  Red: new BABYLON.Color3(1, 0, 0),
  Green: new BABYLON.Color3(0, 1, 0),
};

let MATERIALS = {};

const initializeMaterials = (scene) => {
  MATERIALS = {
    gold: new BABYLON.PBRMetallicRoughnessMaterial("gold", scene),
    silver: new BABYLON.PBRMetallicRoughnessMaterial("silver", scene),
    roseGold: new BABYLON.PBRMetallicRoughnessMaterial("roseGold", scene),
    stone: new BABYLON.PBRMaterial("stone", scene),
  };

  MATERIALS.gold.baseColor = COLORS.YellowGold;
  MATERIALS.gold.metallic = 0.6;
  MATERIALS.gold.roughness = 0.15;

  MATERIALS.silver.baseColor = COLORS.GreySilver;
  MATERIALS.silver.metallic = 0.6;
  MATERIALS.silver.roughness = 0.15;

  MATERIALS.roseGold.baseColor = COLORS.RoseGold;
  MATERIALS.roseGold.metallic = 0.6;
  MATERIALS.roseGold.roughness = 0.15;

  MATERIALS.stone.roughness = 0.1;
  MATERIALS.stone.subSurface.isRefractionEnabled = true;
  MATERIALS.stone.subSurface.indexOfRefraction = 1.5;
  MATERIALS.stone.albedoColor = COLORS.White;
  MATERIALS.stone.subSurface.tintColor = COLORS.White;
  MATERIALS.stone.subSurface.transparencyMode =
    BABYLON.PBRMaterial.PBRMATERIAL_OPAQUE;
  MATERIALS.stone.alpha = 0.95;
};

function applySettings(scene, ring, stone) {
  if (!ring || !scene) return;
  ring.material = MATERIALS[settings.ring.material];

  if(stone) {
    stone.dispose();
  }

    BABYLON.SceneLoader.ImportMesh(
        null,
        "assets/",
        `${settings.stone.shape}.stl`,
        scene,
        function (meshes) {
            stone = meshes[0];
            stone.name = "stone";
            stone.position = new BABYLON.Vector3(0, 0, -2.5);
            stone.rotation.x = -Math.PI/2;
            stone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            stone.setEnabled(true);
            stone.parent = ring;
            applySettings(scene, ring, stone);
        }
        );
    MATERIALS[settings.stone.material].subSurface.tintColor =
        COLORS[settings.stone.color];
    MATERIALS[settings.stone.material].albedoColor =
        COLORS[settings.stone.color];
    stone.material = MATERIALS[settings.stone.material];
    stone.setEnabled(settings.stone.visible);
}

export { COLORS, MATERIALS, initializeMaterials, applySettings };
