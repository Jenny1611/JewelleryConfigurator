import { MATERIALS, COLORS } from "../scripts/config.js";

export let model = {
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
    lowerRadiusLimit: 10,
    upperRadiusLimit: 50
  },
  settings: {
    necklace: { material: "gold" },
  },
};

export async function loadModel(scene) {
    let necklace;
    let stand;

    const result= await BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "assets/",
        "necklace2.glb",
        scene
    );
    stand = result.meshes[0];
    necklace = stand.getChildren().find(mesh => mesh.name == 'necklace');

    stand.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    stand.position.y = 6;

    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 25, height: 25}, scene);
    ground.position.y = -20;
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial');
    groundMaterial.specularPower = 0;
    groundMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    ground.material = groundMaterial;

    applySettings(scene, {necklace});

    stand.material = MATERIALS.gold;
    
    return { necklace };
}

export function applySettings(scene, elements) {
  const necklace = elements.necklace;
  necklace.material = MATERIALS[model.settings.necklace.material];
}