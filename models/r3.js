import {MATERIALS, COLORS} from "../scripts/config.js";

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
              value: "gold"
            },
            {
              name: "Argento",
              value: "silver"
            },
            {
              name: "Oro Rosa",
              value: "roseGold"
            }
          ]
        }
      }
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
              value: "White"
            },
            {
              name: "Rubino",
              value: "Red"
            },
            {
              name: "Smeraldo",
              value: "Green"
            },
            {
              name: "Zaffiro",
              value: "Blue"
            }
          ]
        },
        shape: {
          name: "Forma",
          options: [
            {
              name: "Brillante",
              value: "brilliant"
            },
            {
              name: "Diamante",
              value: "diamond"
            },
            {
              name: "Gemma",
              value: "gem"
            }
          ]
        }
      }
    }
  ],
  scene: {
    cameraZoom: 10,
    lowerRadiusLimit: 3.5,
    upperRadiusLimit: 15
  },
  settings: {
    ring: {material: "gold"},
    stone: {material: "stone", color: "White", shape: "brilliant"}
  }
};

export async function loadModel(scene) {
  /*   BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
   */
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "assets/",
    "crown_ring.stl",
    scene
  );

  const ring = result.meshes[0];
  ring.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.8;

  const result1 = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    "assets/",
    "box.glb",
    scene
  );

  const box = result1.meshes[0];
  box.scaling = new BABYLON.Vector3(0.45, 0.45, 0.45);
  box.position = new BABYLON.Vector3(0, -1.68, 0);

  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
  ground.position.y = -2.6;
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial');
  groundMaterial.specularPower = 0;
  groundMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
  ground.material = groundMaterial;

  applySettings(scene, {ring});

  return {ring};
}

function loadStones(scene, ring) {
  scene.meshes
    .filter((mesh) => mesh.name.startsWith("stone"))
    .forEach((mesh) => mesh.dispose());

  // Carica la gemma e crea la corona + le gemme singole
  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `${model.settings.stone.shape}.stl`,
    scene,
    function (meshes) {
      const masterStone = meshes[0];
      masterStone.isVisible = false; // Nascondi la mesh master

      const material = MATERIALS[model.settings.stone.material];
      const color = COLORS[model.settings.stone.color];

      material.subSurface.tintColor = color;
      material.albedoColor = color;
      masterStone.material = material;

      // --- Corona di gemme ---
      const NUM_GEMME = 37;
      const RAGGIO = 1.22;
      const Y = 0.15;
      const OFFSET_ANGLE = -0.045;

      for (let i = 0; i < NUM_GEMME; i++) {
        const angle = (2 * Math.PI * i) / NUM_GEMME + OFFSET_ANGLE;
        const clone = masterStone.clone("stone_" + i);
        clone.isVisible = true;
        clone.scaling = new BABYLON.Vector3(0.08, 0.08, 0.08);
        clone.position = new BABYLON.Vector3(
          Math.cos(angle) * RAGGIO,
          Y,
          Math.sin(angle) * RAGGIO
        );
        // Orienta la gemma verso il centro della corona
        clone.lookAt(new BABYLON.Vector3(0, Y, 0));
        // Ruota di -90° sull'asse X per allineare la punta verso il centro
        clone.rotation.x += -Math.PI / 2;
        clone.material = material;
      }

      // --- Gemme singole ---
      const singlePositions = [
        {
          x: 0,
          y: 1.25,
          z: -1.25,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.15, y: 0.15, z: 0.15}
        },
        {
          x: 0,
          y: 0.58,
          z: -1.25,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.2, y: 0.2, z: 0.2}
        },
        {
          x: 1.0,
          y: 0.73,
          z: -0.79,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -1.01,
          y: 0.73,
          z: -0.8,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -0.53,
          y: 0.73,
          z: -1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 0.53,
          y: 0.73,
          z: -1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 1.25,
          y: 0.73,
          z: -0.27,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 1.23,
          y: 0.73,
          z: 0.27,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -1.25,
          y: 0.73,
          z: -0.27,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -1.23,
          y: 0.73,
          z: 0.27,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 0.45,
          y: 1.05,
          z: -1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: -0.45,
          y: 1.05,
          z: -1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: -1,
          y: 0.73,
          z: 0.79,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 1,
          y: 0.73,
          z: 0.79,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -0.53,
          y: 0.73,
          z: 1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 0.51,
          y: 0.73,
          z: 1.15,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: 0,
          y: 0.73,
          z: 1.28,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.13, y: 0.13, z: 0.13}
        },
        {
          x: -0.96,
          y: 1.075,
          z: -0.76,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: -1.1,
          y: 0.89,
          z: -0.51,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: -0.765,
          y: 0.89,
          z: -0.97,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: 0.96,
          y: 1.075,
          z: -0.76,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: 1.1,
          y: 0.89,
          z: -0.51,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        },
        {
          x: 0.765,
          y: 0.89,
          z: -0.97,
          rot: {x: 0, y: 0, z: 0},
          scale: {x: 0.1, y: 0.1, z: 0.1}
        }

        // aggiungi altre posizioni/rotazioni se vuoi
      ];

      singlePositions.forEach((pos, idx) => {
        const singleClone = masterStone.clone("stone_single_" + idx);
        singleClone.isVisible = true;
        // Usa la scala personalizzata se presente, altrimenti default
        if (pos.scale) {
          singleClone.scaling = new BABYLON.Vector3(
            pos.scale.x,
            pos.scale.y,
            pos.scale.z
          );
        } else {
          singleClone.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
        }
        singleClone.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
        // Punta la gemma verso il centro della corona (ad esempio centro anello a (0, Y, 0))
        singleClone.lookAt(new BABYLON.Vector3(0, singleClone.position.y, 0));
        singleClone.rotation.x += -Math.PI / 2;
        if (pos.rot) {
          singleClone.rotation.x += pos.rot.x;
          singleClone.rotation.y += pos.rot.y;
          singleClone.rotation.z += pos.rot.z;
        }
        //singleClone.parent = ring;
      });

      let stone;
      // Se vuoi che la variabile "stone" sia il master, puoi assegnarla qui
      stone = masterStone;
    }
  );
}

export function applySettings(scene, elements) {
  const ring = elements.ring;
  ring.material = MATERIALS[model.settings.ring.material];
  loadStones(scene, ring);
}
