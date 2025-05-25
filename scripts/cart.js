export const cart = [];

export function addToCart(product) {
  // Recupera il carrello attuale da localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  storedCart.push(product);
  localStorage.setItem("cart", JSON.stringify(storedCart));
  updateCartBadge(); // Aggiorna subito il badge dopo l'aggiunta
}

// Funzione per ottenere il parametro model dall'URL
function getModelParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("model") || "b2"; // default b2
}

// Import dinamico del modello giusto
async function getModel() {
  const modelName = getModelParam();
  const module = await import(`../models/${modelName}.js`);
  return module.model;
}

window.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const quantityInput = document.getElementById("quantity");
  const priceSpan = document.getElementById("product-price");
  let currentPrice = 99;

  // Funzione per calcolare il prezzo in base alla configurazione
  function calculatePrice(model) {
    // Esempio: prezzo base per tipo modello
    let base = 99;
    const type = model.type || getModelParam();
    if (type.startsWith("r")) base = 99;
    else if (type.startsWith("b")) base = 149;
    else if (type.startsWith("n")) base = 129;
    // Sovrapprezzo per materiali
    if (model.settings) {
      // Cerca materiali oro rosa o oro
      const mat = JSON.stringify(model.settings).toLowerCase();
      if (mat.includes("rosegold")) base += 20;
      else if (mat.includes("gold")) base += 10;
      // Sovrapprezzo per pietre colorate
      if (mat.includes("red") || mat.includes("green") || mat.includes("blue"))
        base += 15;
    }
    return base;
  }

  async function updatePrice() {
    const model = await getModel();
    currentPrice = calculatePrice(model);
    const qty =
      quantityInput && !isNaN(parseInt(quantityInput.value))
        ? parseInt(quantityInput.value)
        : 1;
    if (priceSpan) priceSpan.textContent = `€${currentPrice * qty}`;
  }

  if (quantityInput) {
    quantityInput.addEventListener("input", updatePrice);
  }

  // Aggiorna prezzo anche quando cambia configurazione
  // Inietta un trigger dopo ogni click sulle opzioni di configurazione
  document.body.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("settingsButton")) {
      setTimeout(updatePrice, 10); // attende che la configurazione sia aggiornata
    }
  });

  if (addToCartBtn) {
    addToCartBtn.onclick = async () => {
      const model = await getModel();
      const qty =
        quantityInput && !isNaN(parseInt(quantityInput.value))
          ? parseInt(quantityInput.value)
          : 1;
      const price = calculatePrice(model);
      for (let i = 0; i < qty; i++) {
        const product = {
          id: Date.now() + i,
          name: "Gioiello personalizzato",
          modelType: model.type || getModelParam(),
          settings: JSON.parse(JSON.stringify(model.settings)),
          price: price
        };
        addToCart(product);
      }
      alert("Aggiunto al carrello!");
      updatePrice();
    };
    updatePrice();
  }
});

// Aggiorna il badge del carrello nell'header
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  badge.textContent = storedCart.length > 0 ? storedCart.length : "";
  badge.style.display = storedCart.length > 0 ? "inline-block" : "none";
}

// Aggiorna badge anche quando si torna su index.html
window.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  window.addEventListener("storage", () => {
    updateCartBadge();
  });
  // Aggiorna anche quando la pagina torna in focus (es. dopo aggiunta da un'altra tab)
  window.addEventListener("focus", updateCartBadge);
});

// Funzione per renderizzare il carrello nella pagina cart.html
export function renderCart() {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = "";
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  if (storedCart.length === 0) {
    cartContainer.innerHTML = `<div class="alert alert-info text-center mt-4">Il carrello è vuoto.</div>`;
    return;
  }
  storedCart.forEach((item, idx) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item card shadow-sm mb-4 p-3 border-primary";
    // Scegli un'immagine in base al modelType (puoi personalizzare le immagini per ogni modello)
    let imgSrc = "";
    switch (item.modelType) {
      case "r1":
        imgSrc =
          "https://www.romanodiamonds.com/686-zoom_default/anello-solitario-castel-100-ct.jpg";
        break;
      case "r2":
        imgSrc =
          "https://www.romanodiamonds.com/686-zoom_default/anello-solitario-castel-100-ct.jpg";
        break;
      case "r3":
        imgSrc =
          "https://www.romanodiamonds.com/686-zoom_default/anello-solitario-castel-100-ct.jpg";
        break;
      case "b1":
        imgSrc =
          "https://espositogioielli.it/124229-large_default/bracciale-tennis-oro-750-18kt-donna-413brx92704.jpg";
        break;
      case "b2":
        imgSrc =
          "https://espositogioielli.it/124229-large_default/bracciale-tennis-oro-750-18kt-donna-413brx92704.jpg";
        break;
      case "b3":
        imgSrc =
          "https://espositogioielli.it/124229-large_default/bracciale-tennis-oro-750-18kt-donna-413brx92704.jpg";
        break;
      case "n1":
        imgSrc =
          "https://chiarajewels.com/cdn/shop/products/colgante-estrellas-ororosadoplata-487595.jpg?v=1629907889&width=2048";
        break;
      case "n2":
        imgSrc =
          "https://chiarajewels.com/cdn/shop/products/colgante-estrellas-ororosadoplata-487595.jpg?v=1629907889&width=2048";
        break;
      case "n3":
        imgSrc =
          "https://chiarajewels.com/cdn/shop/products/colgante-estrellas-ororosadoplata-487595.jpg?v=1629907889&width=2048";
        break;
      default:
        imgSrc = "https://via.placeholder.com/180x180?text=Gioiello";
    }
    itemDiv.innerHTML = `
      <img src="${imgSrc}" alt="${item.modelType}" class="cart-item-image" />
      <div class="cart-item-content">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0 text-primary">${item.name}</h5>
          <span class="badge badge-success ml-2" style="font-size:1.1em;">€${
            item.price
          }</span>
          <button type="button" class="btn btn-danger btn-sm remove-btn" data-idx="${idx}"><i class="fa-solid fa-trash"></i> Rimuovi</button>
        </div>
        <p class="mb-1"><span class="badge bg-secondary">Modello: ${
          item.modelType
        }</span></p>
        <div class="mb-2">
          ${Object.entries(item.settings)
            .map(([k, v]) => {
              if (typeof v === "object" && v !== null) {
                return `
                  <div class="mb-2">
                    <div class="fw-bold text-capitalize">${k}</div>
                    <table class="table table-sm table-borderless ms-2 mb-0">
                      <tbody>
                        ${Object.entries(v)
                          .map(
                            ([subk, subv]) =>
                              `<tr><td class="ps-2 text-muted">${subk}</td><td class="text-dark">${subv}</td></tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>
                  </div>
                `;
              } else {
                return `<div class="mb-2"><span class="fw-bold text-capitalize">${k}:</span> <span class="text-dark">${v}</span></div>`;
              }
            })
            .join("")}
        </div>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });

  // Listener per rimuovere elementi
  cartContainer.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.onclick = function () {
      storedCart.splice(this.dataset.idx, 1);
      localStorage.setItem("cart", JSON.stringify(storedCart));
      // Dopo la rimozione, aggiorna il carrello
      renderCart();
      updateCartBadge(); // <-- AGGIUNGI QUESTA CHIAMATA per forzare l'aggiornamento del badge
    };
  });

  updateCartBadge();
}

// Se siamo su cart.html, renderizza il carrello
if (window.location.pathname.endsWith("cart.html")) {
  window.addEventListener("DOMContentLoaded", renderCart);
}

// Aggiorna badge su ogni modifica
window.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  window.addEventListener("storage", updateCartBadge);
});
