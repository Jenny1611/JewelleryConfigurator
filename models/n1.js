import { MATERIALS, COLORS } from "../scripts/config.js";

export let model = {
  info: {
    name: "Collana Delicata",
    description: "Collana delicata e personalizzabile nel materiale. Un gioiello semplice ma elegante, adatto a ogni giorno.",
    price: 34.99,
    id: "n1",
    img: "./image/collana1.png"
},
  customizableParts: [
    {
      name: "Collana",
      value: "necklace",
      customs: {
        material: {
          name: "Materiale",
          options: [
            {
              name: "Oro",
              value: "gold",
            },
            {
              name: "Argento",
              value: "silver",
            },
            {
              name: "Oro Rosa",
              value: "roseGold",
            },
          ],
        },
      },
    }
  ],
  scene: {
    cameraZoom: 40,
    lowerRadiusLimit: 18,
    upperRadiusLimit: 50
  },
  settings: {
    necklace: { material: "gold" },
  },
};

export async function loadModel(scene) {
    let necklace;
    let importedModel;
    let stand;

    const result= await BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "assets/",
        "necklace.glb",
        scene
    );
    importedModel = result.meshes[0];
    necklace = importedModel.getChildren().find(mesh => mesh.name == 'necklace');
    stand = importedModel.getChildren().find(mesh => mesh.name == 'stand');

    importedModel.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    importedModel.position.y = 6;

    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 25, height: 25}, scene);
    ground.position.y = -20;
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial');
    groundMaterial.specularPower = 0;
    groundMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    ground.material = groundMaterial;

    applySettings(scene, {necklace, stand});

    importedModel.material = MATERIALS.gold;
    
    return { necklace, stand };
}

export function applySettings(scene, elements) {
  const necklace = elements.necklace;
  const stand = elements.stand;
  necklace.material = MATERIALS[model.settings.necklace.material];
  stand.material = MATERIALS.standMaterial;
}