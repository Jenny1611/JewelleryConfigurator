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
  settings: {
    ring: { material: "silver" },
    stone: { material: "stone", color: "White", shape: "brilliant" },
  },
};

export async function loadModel(scene) {
  let ring;

  const ringShape = [
      new BABYLON.Vector3(10, 5, -2),
      new BABYLON.Vector3(10, 6.6, 0),
      new BABYLON.Vector3(8, 6.6, -1),
      new BABYLON.Vector3(8, 6.6, -1),
      new BABYLON.Vector3(8, 0, -1),
      new BABYLON.Vector3(10, 0, -1),
      new BABYLON.Vector3(10, 2, 0),
      new BABYLON.Vector3(9, 2, 2),
      new BABYLON.Vector3(9, 5, -2),
      new BABYLON.Vector3(10, 5, -2),
    ];
    ring = BABYLON.MeshBuilder.CreateLathe(
      "ring",
      { shape: ringShape },
      scene
    );

    ring.position = new BABYLON.Vector3(0, 0, 0);
    //ring.rotation.x = Math.PI / 3;
    ring.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);

    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "assets/",
      "box.glb",
      scene
    );

    const box = result.meshes[0];
    box.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
    box.position = new BABYLON.Vector3(1.2, -2.3, -1.2);

    applySettings(scene, {ring});
    
  return { ring };
}

function loadStones(scene, ring) {
  scene.meshes
    .filter(mesh => mesh.name.startsWith("stone"))
    .forEach(mesh => mesh.dispose());

  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `${model.settings.stone.shape}.stl`,
    scene,
    function (meshes) {
      const stone = meshes[0];
      stone.name = "stone";
      stone.setEnabled(false);

      const material = MATERIALS[model.settings.stone.material];
      const color = COLORS[model.settings.stone.color];

      material.subSurface.tintColor = color;
      material.albedoColor = color;
      stone.material = material;

      const count = 20;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;

        const inst = stone.createInstance(`stone_${i}`);
        const size = 1.6;
        const dist = 10.0;

        const posX = Math.cos(angle) * dist;
        const posZ = Math.sin(angle) * dist;

        inst.position.set(posX, 3.4, posZ);
        inst.scaling.set(size, size, size);
        inst.parent = ring;

        const direction = BABYLON.Vector3.Zero().subtract(inst.position).normalize();
        inst.rotation.y = Math.atan2(direction.x, direction.z);
        inst.rotation.x = -Math.PI / 2;

        inst.material = material;
      }
    }
  );
}

export function applySettings(scene, elements) {
  console.log(elements)
  const ring = elements.ring;
  ring.material = MATERIALS[model.settings.ring.material];
  loadStones(scene, ring);
}