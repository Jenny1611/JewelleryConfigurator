import { MATERIALS, COLORS } from "../scripts/config.js";

const diameter = 20;

export let model = {
  customizableParts: [
    {
      name: "Perle",
      value: "pearl",
      customs: {
        color: {
          name: "Colore",
          options: [
            {
              name: "Bianca",
              value: "White",
            },
            {
              name: "Rossa",
              value: "Red",
            },
            {
              name: "Verde",
              value: "Green",
            },
            {
              name: "Blu",
              value: "Blue",
            },
            {
              name: "Nera",
              value: "Black",
            },
          ],
        },
        size: {
          name: "Dimensione",
          options: [
            {
              name: "Piccola",
              value: "1.0",
            },
            {
              name: "Media",
              value: "1.4",
            },
            {
              name: "Grande",
              value: "1.8",
            },
          ],
        },
        count: {
          name: "Quantità",
          slider: {
            min: 1,
            max: 10
          }
        },
      },
    },
  ],
  scene: {
    cameraZoom: 30
  },
  settings: {
    pearl: { material: "pearl", color: "White", size: "1.6", count: 0 },
  },
};

export async function loadModel(scene) {
  let bracelet;

  bracelet = BABYLON.MeshBuilder.CreateTorus(
    "bracelet",
    {
      diameter: diameter,
      thickness: 0.05,
      tessellation: 32
    },
    scene
  );

  bracelet.position = new BABYLON.Vector3(0, 0, 0);
  bracelet.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);

  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "assets/",
    "box.glb",
    scene
  );

  const box = result.meshes[0];
  box.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
  box.position = new BABYLON.Vector3(0, 0, 0);

  applySettings(scene, {bracelet, box});

  return { bracelet, box };
}

function loadpearls(scene, bracelet) {
  scene.meshes
    .filter(mesh => mesh.name.startsWith("pearl"))
    .forEach(mesh => mesh.dispose());

    const material = MATERIALS[model.settings.pearl.material];
    const color = COLORS[model.settings.pearl.color];

    let pearl;
    let maxCount = Math.floor((diameter/2*Math.PI)/parseFloat(model.settings.pearl.size));
    model.customizableParts.find(custom => custom.value == 'pearl').customs.count.max = maxCount;
    let count = model.settings.pearl.count > 0 ? model.settings.pearl.count : maxCount;
    model.settings.pearl.count = count;

    for (let i = 0; i < count; i++) {
      pearl = BABYLON.MeshBuilder.CreateSphere("pearl", {diameter: 2}, scene);
      material.subSurface.tintColor = color;
      material.albedoColor = color;
      pearl.material = material;
      pearl.setEnabled(false);
      const angle = (Math.PI * 2 * i) / count;

      const inst = pearl.createInstance(`pearl_${i}`);
      const size = parseFloat(model.settings.pearl.size);
      const dist = 10.0;

      const posX = Math.cos(angle) * dist;
      const posZ = Math.sin(angle) * dist;

      inst.position = new BABYLON.Vector3(posX, 0, posZ);
      inst.scaling = new BABYLON.Vector3(size, size, size);
      inst.parent = bracelet;

      inst.material = material;
    }
}

export function applySettings(scene, elements) {
  loadpearls(scene, elements.bracelet, elements.box);
  const height = (parseFloat(model.settings.pearl.size) / 4);
  elements.box.position.y = 0 - height;
}