import { MATERIALS, COLORS } from "../scripts/config.js";

export let model = {
  customizableParts: [
    {
      name: "Bracciale",
      value: "bracelet",
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
      name: "Perla",
      value: "pearl",
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
              name: "Perla",
              value: "gem",
            },
          ],
        },
      },
    },
  ],
  scene: {
    cameraZoom: 30
  },
  settings: {
    bracelet: { material: "gold" },
    pearl: { material: "pearl", color: "White", shape: "brilliant" },
  },
};

export async function loadModel(scene) {
  let bracelet;

  const braceletShape = [
      new BABYLON.Vector3(10, 2, 0),
    ];
    bracelet = BABYLON.MeshBuilder.CreateLathe(
      "bracelet",
      { shape: braceletShape },
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
    box.position = new BABYLON.Vector3(1.2, -2.6, -1.2);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
    ground.position.y = -3.5;
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial');
    groundMaterial.specularPower = 0;
    groundMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    ground.material = groundMaterial;

    applySettings(scene, {bracelet});
    
  return { bracelet };
}

function loadpearls(scene, bracelet) {
  scene.meshes
    .filter(mesh => mesh.name.startsWith("pearl"))
    .forEach(mesh => mesh.dispose());

    const material = MATERIALS[model.settings.pearl.material];
    const color = COLORS[model.settings.pearl.color];

    let pearl
    const count = 20;

    for (let i = 0; i < count; i++) {
      pearl = BABYLON.MeshBuilder.CreateSphere("pearl", {diameter: 2}, scene);
      material.subSurface.tintColor = color;
      material.albedoColor = color;
      pearl.material = material;
      pearl.setEnabled(false);
      const angle = (Math.PI * 2 * i) / count;

      const inst = pearl.createInstance(`pearl_${i}`);
      const size = 1.6;
      const dist = 10.0;

      const posX = Math.cos(angle) * dist;
      const posZ = Math.sin(angle) * dist;

      inst.position.set(posX, 3.4, posZ);
      inst.scaling.set(size, size, size);
      inst.parent = bracelet;

      const direction = BABYLON.Vector3.Zero().subtract(inst.position).normalize();
      inst.rotation.y = Math.atan2(direction.x, direction.z);
      inst.rotation.x = -Math.PI / 2;

      inst.material = material;
    }
}

export function applySettings(scene, elements) {
  const bracelet = elements.bracelet;
  bracelet.material = MATERIALS[model.settings.bracelet.material];
  loadpearls(scene, bracelet);
}