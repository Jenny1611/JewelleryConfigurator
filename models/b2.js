import {MATERIALS, COLORS} from "../scripts/config.js";

export let model = {
  customizableParts: [
    {
      name: "Bracciale",
      value: "bracelet",
      customs: {
        material: {
          name: "Materiale",
          options: [
            {name: "Oro", value: "gold"},
            {name: "Argento", value: "silver"},
            {name: "Oro Rosa", value: "roseGold"}
          ]
        }
      }
    }
    /* {
      name: "Perla",
      value: "pearl",
      customs: {
        color: {
          name: "Colore",
          options: [
            {name: "Bianco", value: "White"},
            {name: "Rosa", value: "Red"},
            {name: "Verde", value: "Green"},
            {name: "Blu", value: "Blue"}
          ]
        },
        shape: {
          name: "Forma",
          options: [
            {name: "Perla", value: "gem"},
            {name: "Brillante", value: "brilliant"},
            {name: "Diamante", value: "diamond"}
          ]
        }
      }
    } */
  ],
  settings: {
    bracelet: {material: "silver"},
    pearl: {material: "pearl", color: "White", shape: "gem"}
  }
};

export async function loadModel(scene) {
  BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

  // Crea il bracciale come un torus
  const bracelet = BABYLON.MeshBuilder.CreateTorus(
    "bracelet",
    {
      diameter: 2.3,
      thickness: 0.15,
      tessellation: 64
    },
    scene
  );
  bracelet.position.y = 0.15;

  const ring2 = BABYLON.MeshBuilder.CreateTorus(
    "ring",
    {
      diameter: 0.3,
      thickness: 0.05,
      tessellation: 64
    },
    scene
  );

  ring2.rotation.x = Math.PI / 2;
  ring2.rotation.y = Math.PI / 2;
  ring2.position.z = -1.15;
  ring2.position.y = 0.1;
  ring2.scaling.x = 0.65;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    {diameter: 0.2},
    scene
  );
  sphere.position.y = -0.3;
  sphere.position.z = -1.15;
  sphere.rotation.x = Math.PI / 2;

  const NUM_PETALI = 15;
  const PETAL_RADIUS = 0.18; // distanza dal centro
  const PETAL_SCALE = new BABYLON.Vector3(0.15, 0.35, 0.05); // forma ellissoidale
  const PETAL_Y = 0; // stessa altezza della sfera

  for (let i = 0; i < NUM_PETALI; i++) {
    const angle = (2 * Math.PI * i) / NUM_PETALI;
    const petal = BABYLON.MeshBuilder.CreateSphere(
      "petal_" + i,
      {diameter: 0.6},
      scene
    );
    petal.scaling = PETAL_SCALE.clone();
    petal.position = new BABYLON.Vector3(
      Math.cos(angle) * PETAL_RADIUS,
      PETAL_Y,
      Math.sin(angle) * PETAL_RADIUS // allinea con la sfera centrale
    );
    // Ruota il petalo verso il centro
    petal.lookAt(new BABYLON.Vector3(0, PETAL_Y));
    // Colore/materiale opzionale:
    petal.material = bracelet.material;
    petal.rotation.x = Math.PI / 2;
    petal.parent = sphere;
  }

  applySettings(scene, {bracelet, ring2,sphere, });

  return {bracelet, ring2 , sphere};
}

export function applySettings(scene, elements) {
  const bracelet = elements.bracelet;
  const ring2 = elements.ring2;
  const sphere = elements.sphere;

  bracelet.material = MATERIALS[model.settings.bracelet.material];
  ring2.material = bracelet.material;
  if (sphere) sphere.material = bracelet.material;

  scene.meshes
    .filter((mesh) => mesh.name.startsWith("petal_"))
    .forEach((petal) => (petal.material = bracelet.material));
}
