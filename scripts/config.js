const COLORS = {
  YellowGold: new BABYLON.Color3(1, 0.95, 0.2),
  GreySilver: new BABYLON.Color3(0.75, 0.75, 0.75),
  RoseGold: new BABYLON.Color3(0.9, 0.6, 0.6),
  White: new BABYLON.Color3(1, 1, 1),
  Blue: new BABYLON.Color3(0.2, 0.4, 1),
  Red: new BABYLON.Color3(1, 0, 0),
  Green: new BABYLON.Color3(0, 1, 0),
  Black: new BABYLON.Color3(0, 0, 0)
};

let MATERIALS = {};

const initializeMaterials = (scene) => {
  MATERIALS = {
    gold: new BABYLON.PBRMetallicRoughnessMaterial("gold", scene),
    silver: new BABYLON.PBRMetallicRoughnessMaterial("silver", scene),
    roseGold: new BABYLON.PBRMetallicRoughnessMaterial("roseGold", scene),
    stone: new BABYLON.PBRMaterial("stone", scene),
    pearl: new BABYLON.PBRMaterial("pearl", scene)
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
  MATERIALS.stone.subSurface.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_OPAQUE;
  MATERIALS.stone.alpha = 1;
  
  MATERIALS.pearl.albedoColor = new BABYLON.Color3(1, 1, 1);
  MATERIALS.pearl.reflectivityColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  MATERIALS.pearl.microSurface = 0.8;
  MATERIALS.pearl.indexOfRefraction = 1.0;
  MATERIALS.pearl.alpha = 1;
};

export {COLORS, MATERIALS, initializeMaterials};
