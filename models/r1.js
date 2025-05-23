import { MATERIALS, COLORS } from "../scripts/config.js";

export let model = {
  customizableParts: [
    {
      name: "Anello",
      value: "ring",
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
    },
    {
      name: "Gemma",
      value: "stone",
      customs: {
        color: {
          name: "Colore",
          options: [
            {
              name: "Diamante",
              value: "White",
            },
            {
              name: "Rubino",
              value: "Red",
            },
            {
              name: "Smeraldo",
              value: "Green",
            },
            {
              name: "Zaffiro",
              value: "Blue",
            },
          ],
        },
        shape: {
          name: "Forma",
          options: [
            {
              name: "Brillante",
              value: "brilliant",
            },
            {
              name: "Diamante",
              value: "diamond",
            },
            {
              name: "Gemma",
              value: "gem",
            },
          ],
        },
      },
    },
  ],
  scene: {
    cameraZoom: 16,
    lowerRadiusLimit: 5,
    upperRadiusLimit: 20
  },
  settings: {
    ring: { material: "gold" },
    stone: { material: "stone", color: "White", shape: "brilliant" },
  },
};

export async function loadModel(scene) {
  let stone, ring;
  ring = BABYLON.MeshBuilder.CreateTorus(
    "ring",
    { diameter: 4, tessellation: 64, thickness: 0.4 },
    scene
  );
  ring.position = new BABYLON.Vector3(0, 0.33, 0);
  ring.rotation.x = -6.22;

  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `${model.settings.stone.shape}.stl`,
    scene,
    function (meshes) {
      stone = meshes[0];
      stone.name = "stone";
      stone.position = new BABYLON.Vector3(0, 0, -2.5);
      stone.rotation.x = -Math.PI / 2;
      stone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
      stone.parent = ring;
      applySettings(scene, { ring, stone });
    }
  );

  const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "assets/",
      "box.glb",
      scene
    );

  const box = result.meshes[0];
    box.scaling = new BABYLON.Vector3(0.56, 0.56, 0.56);
    box.position = new BABYLON.Vector3(0, 0, 0);

  return { ring, stone };
}

export function applySettings(scene, elements) {
  elements.ring.material = MATERIALS[model.settings.ring.material];

  const oldStone = scene.getMeshByName("stone");
  if (oldStone) oldStone.dispose();

  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `${model.settings.stone.shape}.stl`,
    scene,
    function (meshes) {
      const importedStone = meshes[0];
      importedStone.name = "stone";
      importedStone.position = new BABYLON.Vector3(0, 0, -2.5);
      importedStone.rotation.x = -Math.PI / 2;
      importedStone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
      importedStone.setEnabled(true);
      importedStone.parent = elements.ring;

      MATERIALS[model.settings.stone.material].subSurface.tintColor =
        COLORS[model.settings.stone.color];
      MATERIALS[model.settings.stone.material].albedoColor =
        COLORS[model.settings.stone.color];
      importedStone.material = MATERIALS[model.settings.stone.material];
    }
  );
}
