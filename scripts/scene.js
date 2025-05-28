import {initializeMaterials} from "./config.js";
import {addToCart, calculatePrice} from "./cart.js";

let scene, elements, selectedModel, sceneCamera;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
selectedModel = urlParams.get("model");

let editConfig = null;
if (urlParams.has('edit') && urlParams.get('edit') === 'true') {
  try {
    editConfig = JSON.parse(localStorage.getItem("editConfig"));
    //localStorage.removeItem("editConfig");
    document.getElementById("addToCartText").innerHTML = "Aggiorna il carrello";
  } catch {}
}

const {loadModel, model} = await import(`../models/${selectedModel}.js`);

  const price = document.getElementById("product-price");
  let qty = parseInt(document.getElementById("quantity").value) || 1;
  price.innerHTML = `€${calculatePrice(model) * qty}`;

function createScene(engine, canvas) {
if (editConfig && editConfig.settings) {
  model.settings = JSON.parse(JSON.stringify(editConfig.settings));
  let qty = editConfig.quantity || 1;
  const quantityInput = document.getElementById("quantity");
  quantityInput.value = qty;
  const productPrice = document.getElementById("product-price");
  productPrice.innerHTML = `€${calculatePrice(model) * qty}`;
}
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  //scene.createDefaultSkybox(scene.environmentTexture, true);
  scene.environmentTexture = new BABYLON.HDRCubeTexture(
    "assets/environment.hdr",
    scene,
    256,
    false,
    true,
    false,
    true
  );
  scene.createDefaultSkybox(scene.environmentTexture);

  initializeMaterials(scene);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    4.2,
    Math.PI / 3,
    model?.scene?.cameraZoom || 20,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.wheelPrecision = 30;
  camera.panningSensibility = 0;
  camera.lowerRadiusLimit = model?.scene?.lowerRadiusLimit || 5;
  camera.upperRadiusLimit = model?.scene?.upperRadiusLimit || 40;
  camera.attachControl(canvas, true);
  sceneCamera = camera;

  const light = new BABYLON.SpotLight(
    "light",
    new BABYLON.Vector3(0, 15, 0),
    new BABYLON.Vector3(0, -1, 0),
    Math.PI / 1,
    1,
    scene
  );
  light.intensity = 1;

  let defaultPipeline = new BABYLON.DefaultRenderingPipeline(
    "default",
    true,
    scene,
    [camera]
  );
  defaultPipeline.bloomEnabled = true;
  defaultPipeline.bloomKernel = 50;
  defaultPipeline.bloomWeight = 0.4;
  defaultPipeline.bloomThreshold = 1;

  elements = importModel();

  return scene;
}

document.getElementById('quantity').addEventListener('input', async () => {
  const price = document.getElementById("product-price");
  let qty = parseInt(document.getElementById("quantity").value) || 1;
  price.innerHTML = `€${calculatePrice(model) * qty}`;
});

document.getElementById('addToCartButton').addEventListener('click', async () => {
  let qty = 1;
  const quantityInput = document.getElementById("quantity");
  qty = parseInt(quantityInput.value) || 1;
  BABYLON.Tools.CreateScreenshot(
    engine,
    sceneCamera,
    { width: 400, height: 300 },
    (dataUrl) => {
      if(editConfig) {
        let oldConfig = JSON.parse(localStorage.getItem("editConfig"));
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let itemIndex = cart.findIndex(i => i.modelType === selectedModel && i.modelName === model.info.name && JSON.stringify(i.settings) === JSON.stringify(oldConfig.settings));
        if(itemIndex !== -1) {
          cart.splice(itemIndex, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      }
      addToCart({
        modelType: selectedModel,
        modelName: model.info.name,
        settings: model.settings,
        quantity: qty,
        image: dataUrl,
        price: calculatePrice(model) * qty,
        customizableParts: model.customizableParts,
      });
    }
  );
});

async function importModel() {
  let model = loadModel(scene);
  loadConfig();
  return model;
}

function loadConfig() {
  let columnConfig = document.querySelector(".column-config");
  model.customizableParts.forEach((customObject) => {
    for (const custom in customObject.customs) {
      let confDiv = document.createElement("div");
      confDiv.className = "column-config";
      let h3 = document.createElement("h3");
      confDiv.appendChild(h3);
      columnConfig.appendChild(confDiv);
      h3.innerHTML = `${customObject.name} - ${customObject.customs[custom].name}`;
      let rowDiv = document.createElement("div");
      rowDiv.className = "row-config";
      if (customObject.customs[custom].options) {
        customObject.customs[custom].options.forEach((option) => {
          let cardButton = document.createElement("div");
          cardButton.className = "card settingsButton";
          cardButton.setAttribute(
            "property",
            `${customObject.value}.${custom}`
          );
          cardButton.setAttribute("value", `${option.value}`);
          let p = document.createElement("p");
          p.innerHTML = `${option.name}`;
          cardButton.appendChild(p);
          cardButton.addEventListener("click", () => {
            changeSettings(
              cardButton.getAttribute("property"),
              cardButton.getAttribute("value")
            );
          });
          rowDiv.appendChild(cardButton);
        });
      } else if (customObject.customs[custom].slider) {
        let slider = document.createElement("input");
        slider.id = `slider-${customObject.value}-${custom}`;
        slider.setAttribute("type", "range");
        slider.setAttribute(
          "min",
          parseInt(customObject.customs[custom].slider.min)
        );
        slider.setAttribute(
          "max",
          parseInt(customObject.customs[custom].slider.max)
        );
        let property = `${customObject.value}.${custom}`;
        slider.setAttribute(
          "value",
          parseInt(model.settings[customObject.value][custom])
        );
        slider.addEventListener("input", () => {
          changeSettings(property, slider.value);
        });
        rowDiv.appendChild(slider);
      }
      confDiv.appendChild(rowDiv);
      const firstBtn = rowDiv.querySelector('.settingsButton');
      if (firstBtn) firstBtn.classList.add('selected');
    }
  });
  
  document.querySelectorAll('.settingsButton').forEach(btn => {
  btn.addEventListener('click', function() {
    btn.parentElement.querySelectorAll('.settingsButton').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
}

const changeSettings = async (path, value) => {
  const {applySettings} = await import(`../models/${selectedModel}.js`);
  const keys = path.split(".");
  let obj = model.settings;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys.at(-1)] = value;
  applySettings(scene, await elements);
};

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const renderScene = createScene(engine, canvas);
engine.runRenderLoop(() => renderScene.render());
addEventListener("resize", () => engine.resize());

export {changeSettings};
