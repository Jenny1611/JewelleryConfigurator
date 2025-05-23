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
    cameraZoom: 30
  },
  settings: {
    necklace: { material: "gold" },
  },
};

export async function loadModel(scene) {
  let necklace;

    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "assets/",
      "stand.stl",
      scene
    );
    const stand = result.meshes[0];
    stand.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    stand.position = new BABYLON.Vector3(0, 0, 0);

    const result1= await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "assets/",
      "chain.stl",
      scene
    );
    necklace = result1.meshes[0];

    necklace.position = new BABYLON.Vector3(0, 0, 0);
    necklace.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
    ground.position.y = -3.5;
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial');
    groundMaterial.specularPower = 0;
    groundMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    ground.material = groundMaterial;

    applySettings(scene, {necklace});
    
  return { necklace };
}

export function applySettings(scene, elements) {
  const necklace = elements.necklace;
  necklace.material = MATERIALS[model.settings.necklace.material];
}