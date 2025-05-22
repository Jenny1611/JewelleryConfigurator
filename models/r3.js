import {applySettings} from "../scripts/config.js";

let r3 = {
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
  settings: {
    ring: {material: "gold"},
    stone: {material: "stone", color: "White", shape: "brilliant"}
  }
};

export async function loadModel(scene) {
  let ring, stone;

  // Crea il terreno
  BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

  // Carica l'anello
  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `crown_ring.stl`,
    scene,
    function (meshes) {
      ring = meshes[0];
      ring.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.8;
     /*  ring.rotation.y = -0.045; */
      applySettings(scene, {ring});
    }
  );

  // Carica la gemma e crea la corona + le gemme singole
  BABYLON.SceneLoader.ImportMesh(
    null,
    "assets/",
    `brilliant.stl`,
    scene,
    function (meshes) {
      const masterStone = meshes[0];
      masterStone.isVisible = false; // Nascondi la mesh master

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
        // Ruota la pietra verso il centro
        clone.lookAt(new BABYLON.Vector3(0, Y, 0));
        // Ruota di 90° sull'asse X
        clone.rotation.x += -Math.PI / 2;
        clone.parent = ring;
        
        
      }

      // --- Gemme singole posizionate manualmente ---
      const singlePositions = [
        {x: 0, y: 1.25, z: -1.25}
        // aggiungi altre posizioni se vuoi
      ];

      singlePositions.forEach((pos, idx) => {
        const singleClone = masterStone.clone("single_stone_" + idx);
        singleClone.isVisible = true;
        singleClone.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);
        singleClone.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
        singleClone.rotation.x = -Math.PI / 2;
        // singleClone.parent = ring;
      });

      // Se vuoi che la variabile "stone" sia il master, puoi assegnarla qui
      stone = masterStone;
    }
  );

  return {ring, stone};
}
