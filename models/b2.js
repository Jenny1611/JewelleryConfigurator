import {MATERIALS, COLORS} from "../scripts/config.js";

export let model = {
  customizableParts: [
    {
      name: "Braccialetto",
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
  BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

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

  applySettings(scene, {ring});

  return {ring};
}

function loadStones(scene, ring) {}

export function applySettings(scene, elements) {
  const ring = elements.ring;
  ring.material = MATERIALS[model.settings.ring.material];
  loadStones(scene, ring);
}
