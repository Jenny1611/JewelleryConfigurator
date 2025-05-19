let cartCount = 0;

function selezionaProdotto(tipo) {
  cartCount++;
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) cartCountElem.textContent = cartCount;
  window.location.href = `configurator.html?prodotto=${encodeURIComponent(
    tipo
  )}`;
}

// --- Configurator page logic ---
document.addEventListener("DOMContentLoaded", function () {
  // Titolo dinamico se presente
  const titoloPreview = document.getElementById("titolo-preview");
  const params = new URLSearchParams(window.location.search);
  let prodotto = params.get("prodotto") || "braccialetto";
  let design = 1; // default

  const nomi = {
    braccialetto: "Braccialetto",
    collana: "Collana",
    anello: "Anello"
  };
  if (titoloPreview) {
    titoloPreview.textContent = nomi[prodotto]
      ? `Configura il tuo ${nomi[prodotto]}`
      : "Configura il tuo gioiello";
  }

  // Funzione per mostrare solo le immagini della categoria scelta
  function aggiornaVisibilitaImmagini() {
    document.querySelectorAll(".selectable-model").forEach((img) => {
      if (img.dataset.modello === prodotto) {
        img.style.display = "";
      } else {
        img.style.display = "none";
      }
    });
  }

  // Evidenzia la selezione modello+design
  document.querySelectorAll(".selectable-model").forEach((img) => {
    if (img.dataset.modello === prodotto && img.dataset.design === "1")
      img.classList.add("selected");
    img.addEventListener("click", function () {
      document
        .querySelectorAll(".selectable-model")
        .forEach((i) => i.classList.remove("selected"));
      this.classList.add("selected");
      prodotto = this.dataset.modello;
      design = parseInt(this.dataset.design);
      aggiornaVisibilitaImmagini();
      updateBabylonModel();
    });
  });

  // Mostra solo le immagini della categoria scelta all'avvio
  aggiornaVisibilitaImmagini();

  // Babylon.js solo se presente il canvas
  const canvas = document.getElementById("babylon-canvas");
  let engine, scene, mesh, gemMesh;

  // Materiali disponibili
  const materiali = {
    Oro: new BABYLON.Color3(0.83, 0.68, 0.22),
    Argento: new BABYLON.Color3(0.8, 0.8, 0.8),
    Platino: new BABYLON.Color3(0.7, 0.8, 0.9)
  };

  // Pietre disponibili
  const pietre = {
    Nessuna: null,
    Diamante: {
      color: new BABYLON.Color3(0.85, 0.95, 1),
      name: "Diamante",
      diameter: 0.05,
      y: 0,
      x: 0,
      z: 0.15
    },
    Zaffiro: {
      color: new BABYLON.Color3(0.2, 0.3, 0.8),
      name: "Zaffiro",
      diameter: 0.05,
      y: 0,
      x: 0,
      z: 0.15
    },
    Rubino: {
      color: new BABYLON.Color3(0.8, 0.1, 0.2),
      name: "Rubino",
      diameter: 0.05,
      y: 0,
      x: 0,
      z: 0.15
    }
  };

  function createOrUpdateMesh() {
    // Rimuovi mesh precedenti
    if (mesh) {
      mesh.dispose();
      mesh = null;
    }
    if (gemMesh) {
      gemMesh.dispose();
      gemMesh = null;
    }

    // Crea mesh base
    if (prodotto === "braccialetto") {
      if (design === 1) {
        mesh = BABYLON.MeshBuilder.CreateTorus(
          "torus",
          {diameter: 2, thickness: 0.4},
          scene
        );
      } else if (design === 2) {
        mesh = BABYLON.MeshBuilder.CreateTorus(
          "torus",
          {diameter: 2, thickness: 0.25, tessellation: 96},
          scene
        );
      } else if (design === 3) {
        mesh = BABYLON.MeshBuilder.CreateCylinder(
          "cyl",
          {diameter: 2, height: 0.2, tessellation: 96},
          scene
        );
      }
    } else if (prodotto === "collana") {
      if (design === 1) {
        mesh = BABYLON.MeshBuilder.CreateTorus(
          "torus",
          {diameter: 2.5, thickness: 0.2},
          scene
        );
      } else if (design === 2) {
        mesh = BABYLON.MeshBuilder.CreateTorus(
          "torus",
          {diameter: 2.5, thickness: 0.15, tessellation: 96},
          scene
        );
      } else if (design === 3) {
        mesh = BABYLON.MeshBuilder.CreateTorusKnot(
          "knot",
          {radius: 1.2, tube: 0.08},
          scene
        );
      }
    } else if (prodotto === "anello") {
      // Scegli il file STL in base al design
      let stlFile = "";
      if (design === 1) stlFile = "./models/ring4.stl";
      else if (design === 2) stlFile = "./models/ring2.stl";
      else if (design === 3) stlFile = "./models/ring3.stl";

      // Importa il modello STL
      BABYLON.SceneLoader.ImportMesh(
        "",
        "", // se il path è incluso nel nome file sopra, lascia vuoto qui
        stlFile,
        scene,
        function (meshes) {
          // Rimuovi mesh precedente se presente
          if (mesh) {
            mesh.dispose();
            mesh = null;
          }
          mesh = meshes[0];
          mesh.position = BABYLON.Vector3.Zero();
          mesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01); // Adatta la scala se necessario

          // Applica materiale selezionato a tutti i mesh importati
          const materialeSel =
            document.getElementById("materiale")?.value || "Oro";
          const mat = new BABYLON.StandardMaterial("mat", scene);
          mat.diffuseColor = materiali[materialeSel] || materiali["Oro"];
          meshes.forEach((m) => (m.material = mat));

          // Se è selezionata una pietra, aggiungi una gemma come prima
          const pietraSel =
            document.getElementById("pietra")?.value || "Nessuna";
          if (pietraSel !== "Nessuna" && pietre[pietraSel]) {
            const gemInfo = pietre[pietraSel];
            gemMesh = BABYLON.MeshBuilder.CreateSphere(
              "gemma",
              {diameter: gemInfo.diameter},
              scene
            );
            // Posiziona la pietra sopra l'anello, leggermente "attaccata"
            gemMesh.position = new BABYLON.Vector3(
              gemInfo.x || 0,
              gemInfo.y || 0,
              gemInfo.z || 0
            );
            gemMesh.material = new BABYLON.StandardMaterial("gemMat", scene);
            gemMesh.material.diffuseColor = gemInfo.color;
            gemMesh.material.specularColor = BABYLON.Color3.White();
            gemMesh.material.emissiveColor = gemInfo.color.scale(0.7);
            gemMesh.material.alpha = 0.85;
            gemMesh.material.reflectionFresnelParameters =
              new BABYLON.FresnelParameters();
            gemMesh.material.reflectionFresnelParameters.bias = 0.3;
          }
        }
      );
      return; // ImportMesh è asincrono, esci dalla funzione qui!
    } else {
      mesh = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1.5}, scene);
    }

    // Applica materiale selezionato
    const materialeSel = document.getElementById("materiale")?.value || "Oro";
    mesh.material = new BABYLON.StandardMaterial("mat", scene);
    mesh.material.diffuseColor = materiali[materialeSel] || materiali["Oro"];

    // Se è selezionata una pietra, aggiungi una gemma
    const pietraSel = document.getElementById("pietra")?.value || "Nessuna";
    if (pietraSel !== "Nessuna" && prodotto === "anello") {
      gemMesh = BABYLON.MeshBuilder.CreateSphere(
        "gemma",
        {diameter: 0.25},
        scene
      );
      gemMesh.position = new BABYLON.Vector3(0, 0.7, 0); // più in alto sopra l'anello
      gemMesh.material = new BABYLON.StandardMaterial("gemMat", scene);
      gemMesh.material.diffuseColor = pietre[pietraSel].color;
      gemMesh.material.specularColor = BABYLON.Color3.White();
      gemMesh.material.emissiveColor = pietre[pietraSel].color.scale(0.7);
      gemMesh.material.alpha = 0.85; // leggermente trasparente
      gemMesh.material.reflectionFresnelParameters =
        new BABYLON.FresnelParameters();
      gemMesh.material.reflectionFresnelParameters.bias = 0.3;
    }
  }

  function updateBabylonModel() {
    if (!scene) return;
    createOrUpdateMesh();
    scene.render();
  }

  if (canvas && typeof BABYLON !== "undefined") {
    engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
      scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.6, 0.6, 0.6);

      // Camera
      const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 2.5,
        6,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);

      // Limiti di zoom per evitare che il modello scompaia

      // Imposta distanza default per anello
      if (prodotto === "anello") {
        camera.radius = 0.8;
        camera.lowerRadiusLimit = 0.5;
        camera.upperRadiusLimit = 1.5;
        camera.minZ = 0.01;
      } else if (prodotto === "collana") {
        camera.radius = 3;
        camera.lowerRadiusLimit = 3.5;
        camera.upperRadiusLimit = 10;
        camera.minZ = 0.01;
      } else if (prodotto === "braccialetto") {
        camera.radius = 1.5;
        camera.lowerRadiusLimit = 4;
        camera.upperRadiusLimit = 7;
        camera.minZ = 0.01;
      }

      // Luce
      new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(1, 1, 0),
        scene
      );

      createOrUpdateMesh();

      return scene;
    };

    scene = createScene();
    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });

    // Aggiorna modello quando cambia materiale o pietra
    document
      .getElementById("materiale")
      ?.addEventListener("change", updateBabylonModel);
    document
      .getElementById("pietra")
      ?.addEventListener("change", updateBabylonModel);
  }

  // LOGICA AGGIUNTA AL CARRELLO //

  //tutta logica del carrello//

  const addToCartBtn = document.getElementById("add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      // Recupera il prodotto selezionato
      const materialeSel = document.getElementById("materiale")?.value || "Oro";
      const pietraSel = document.getElementById("pietra")?.value || "Nessuna";
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({
        prodotto: prodotto,
        materiale: materialeSel,
        pietra: pietraSel,
        data: Date.now()
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      // Aggiorna il contatore nell'header
      const cartCountElem = document.getElementById("cart-count");
      if (cartCountElem) cartCountElem.textContent = cart.length;
      // Feedback all'utente
      addToCartBtn.textContent = "Aggiunto!";
      setTimeout(() => {
        addToCartBtn.textContent = "Aggiungi al carrello";
      }, 1500);
    });

    // All'apertura pagina aggiorna il contatore
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) cartCountElem.textContent = cart.length;
  }
});

// Mostra i prodotti nel carrello
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) cartCountElem.textContent = cart.length;

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="text-light">Il carrello è vuoto.</p>';
    return;
  }

  cartList.innerHTML = `
    <ul class="list-group mb-4">
      ${cart
        .map(
          (item, i) => `
          <li class="list-group-item bg-luxury text-gold d-flex justify-content-between align-items-center">
            <span>
              ${
                item.prodotto
                  ? item.prodotto.charAt(0).toUpperCase() +
                    item.prodotto.slice(1)
                  : "Gioiello"
              }
              <small class="text-secondary ms-2">${item.materiale || ""}${
            item.pietra && item.pietra !== "Nessuna" ? " - " + item.pietra : ""
          }</small>
              <small class="text-secondary ms-2">${new Date(
                item.data
              ).toLocaleString()}</small>
            </span>
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${i})"><i class="fa fa-trash"></i></button>
          </li>
        `
        )
        .join("")}
    </ul>
    <button class="btn btn-gold w-100" onclick="checkout()">Procedi all'acquisto</button>
  `;
}

// Rimuovi prodotto dal carrello
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Checkout (placeholder)
function checkout() {
  alert("Grazie per il tuo acquisto!");
  localStorage.removeItem("cart");
  renderCart();
}

// Avvia rendering al caricamento pagina
document.addEventListener("DOMContentLoaded", renderCart);
