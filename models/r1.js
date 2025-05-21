import { settings } from "../scripts/state.js";
import { initializeMaterials, MATERIALS, COLORS, applySettings } from "../scripts/config.js";

export async function loadR1(scene) {
    let stone, ring;
    ring = BABYLON.MeshBuilder.CreateTorus("ring", {diameter: 4, tessellation: 64, thickness: 0.4}, scene);
    ring.position = new BABYLON.Vector3(0, 2, 0);
    ring.rotation.x = Math.PI/3;
    
    BABYLON.SceneLoader.ImportMesh(
        null,
        "assets/",
        `${settings.stone.shape}.stl`,
        scene,
        function (meshes) {
        stone = meshes[0];
        stone.name = "stone";
        stone.position = new BABYLON.Vector3(0, 0, -2.5);
        stone.rotation.x = -Math.PI/2;
        stone.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        stone.parent = ring;
        applySettings(scene, ring, stone);
        }
    );

    return { ring, stone };
}