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
    },
    {
      name: "Petali",
      value: "pendent",
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
    },
    {
      name: "Disco floreale",
      value: "sphere",
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
  ],
  settings: {
    bracelet: {material: "silver"},
    pendent: {material: "silver"},
    sphere: {material: "silver"}
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

  //first PENDENT
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
  sphere.position.x = 0.025;
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
  // second pendant
  const ring3 = BABYLON.MeshBuilder.CreateTorus(
    "ring",
    {
      diameter: 0.3,
      thickness: 0.05,
      tessellation: 64
    },
    scene
  );

  ring3.rotation.x = Math.PI / 2;
  ring3.rotation.y = Math.PI / 2;
  ring3.position.x = 0.8;
  ring3.position.y = 0.1;
  ring3.position.z = -0.85;
  ring3.scaling.x = 0.65;
  ring3.rotation.y = 0.8;

  const pendent = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "assets/",
    "react.stl",
    scene
  );

  const pendent2 = pendent.meshes[0];
  pendent2.parent = ring3;
  pendent2.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
  pendent2.position.x = -0.005;
  pendent2.position.y = -0.42;
  pendent2.position.z = 0.68;
  pendent2.rotation.z = Math.PI/2;
  pendent2.rotation.x = Math.PI/2;


  // third pendant
  const ring4 = BABYLON.MeshBuilder.CreateTorus(
    "ring",
    {
      diameter: 0.3,
      thickness: 0.05,
      tessellation: 64
    },
    scene
  );

  ring4.rotation.x = Math.PI / 2;
  ring4.rotation.y = Math.PI / 2;
  ring4.position.x = -0.8;
  ring4.position.y = 0.1;
  ring4.position.z = -0.85;
  ring4.scaling.x = 0.65;
  ring4.rotation.y = -0.8;

  const result2 = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "assets/",
    "heart.stl",
    scene
  );

  const pendent3 = result2.meshes[0];
  pendent3.parent = ring3;
  pendent3.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
  pendent3.position.x = -0.005;
  pendent3.position.y = -0.42;
  pendent3.position.z = 6;
  pendent3.rotation.z = Math.PI/2;
  pendent3.rotation.x = Math.PI;


  applySettings(scene, {bracelet, ring2, sphere});

  return {bracelet, ring2, sphere};
}

export function applySettings(scene, elements) {
  const bracelet = elements.bracelet;
  const ring2 = elements.ring2;
  const sphere = elements.sphere;

  bracelet.material = MATERIALS[model.settings.bracelet.material];
  ring2.material = MATERIALS[model.settings.pendent.material];
  if (sphere) sphere.material = MATERIALS[model.settings.sphere.material];

  scene.meshes
    .filter((mesh) => mesh.name.startsWith("petal_"))
    .forEach(
      (petal) => (petal.material = MATERIALS[model.settings.pendent.material])
    );
}
