export const cart = [];

export function addToCart(product) {
  // Recupera il carrello attuale da localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  // Cerca se esiste già un prodotto con stessa configurazione
  const idx = storedCart.findIndex(
    (item) =>
      item.modelType === product.modelType &&
      JSON.stringify(item.settings) === JSON.stringify(product.settings)
      // && item.price === product.price
  );
  if (idx !== -1) {
    // Se esiste, aumenta il contatore quantity
    storedCart[idx].quantity = (storedCart[idx].quantity || 1) + 1;
  } else {
    product.quantity = product.quantity || 1;
    storedCart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(storedCart));
  updateCartBadge(); // Aggiorna subito il badge dopo l'aggiunta
}

// Funzione per ottenere il parametro model dall'URL
function getModelParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("model") || "error";
}

// Import dinamico del modello giusto
async function getModel() {
  const modelName = getModelParam();
  const module = await import(`../models/${modelName}.js`);
  return module.model;
}

export function calculatePrice(model) {
  let base = 99;
  const type = model.type || getModelParam();
  if (type.startsWith("r")) base = 99;
  else if (type.startsWith("b")) base = 149;
  else if (type.startsWith("n")) base = 129;
  if (model.settings) {
    const mat = model.settings;
    let material = null;
    if (type.startsWith("r") && mat.ring && mat.ring.material)
      material = mat.ring.material;
    else if (type.startsWith("b") && mat.bracelet && mat.bracelet.material)
      material = mat.bracelet.material;
    else if (type.startsWith("n") && mat.necklace && mat.necklace.material)
      material = mat.necklace.material;
    if (material === "gold") base += 70;
    else if (material === "silver") base += 10;
    else if (material === "roseGold") base += 5;
    if (mat.stone && mat.stone.color) {
      if (mat.stone.color === "Red") base += 40;
      else if (mat.stone.color === "Green") base += 35;
      else if (mat.stone.color === "White") base += 25;
      else base += 45;
    }
    if (mat.stone && mat.stone.shape) {
      if (mat.stone.shape === "brilliant") base += 20;
      else if (mat.stone.shape === "diamond") base += 30;
      else base += 40;
    }
  }
  return base;
}

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
    itemDiv.innerHTML = `
      <div class="cart-item-image-wrap d-flex align-items-center justify-content-center" style="min-width:180px;">
        <img src="${item.image}" alt="${
      item.modelType
    }" class="cart-item-image" />
      </div>
      <div class="cart-item-content d-flex flex-column flex-grow-1 justify-content-center" style="min-width:0;">
        <div class="d-flex flex-row align-items-center justify-content-between w-100 mb-2">
          <div class="d-flex flex-column">
            <h5 class="mb-1 text-primary">Modello: ${item.modelName}</h5>
            <div class="cart-settings-table mb-1">
              <table class="table table-sm table-borderless mb-0">
                <tbody>
                    ${buildItemDetails(item)}
                </tbody>
              </table>
            </div>
          </div>
          <div class="d-flex flex-column align-items-end justify-content-center ml-3" style="min-width:110px;">       
          </div>
                <div class="d-flex align-items-center mb-3">
                  <label class="mr-2 font-weight-bold mb-0">Quantità:</label>
                  <button type="button" class="btn btn-outline-secondary btn-sm quantity-decrease mx-1" data-idx="${idx}">-</button>
                  <input
                    type="number"
                    min="1"
                    value="${item.quantity}"
                    class="form-control quantity-input text-center mx-1"
                    style="width: 60px; display:inline-block;"
                    data-idx="${idx}"
                    readonly
                  />
                  <button type="button" class="btn btn-outline-secondary btn-sm quantity-increase mx-1" data-idx="${idx}">+</button>
                </div>   
          <span class="badge badge-success mb-2" style="font-size:1.15em;" data-idx="${idx}">€${
            item.price
          }</span>
        </div>
        <div class="delete-container d-flex align-items-center">
          <a href="configurator.html?model=${item.modelType}&edit=true" class="btn btn-primary btn-sm mr-2 edit-btn" data-idx="${idx}">
            <i class="fa-solid fa-pen-to-square"></i> Modifica
          </a>
          <button type="button" class="btn btn-danger btn-sm remove-btn" data-idx="${idx}">
            <i class="fa-solid fa-trash"></i> Rimuovi
          </button>
        </div>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });

  cartContainer.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = function () {
      const idx = this.dataset.idx;
      localStorage.setItem("editConfig", JSON.stringify(storedCart[idx]));
    };
  });

  cartContainer.querySelectorAll(".quantity-decrease").forEach((btn) => {
    btn.onclick = function () {
      const idx = this.dataset.idx;
      const input = cartContainer.querySelector(`.quantity-input[data-idx="${idx}"]`);
      let quantity = parseInt(input.value);
      let basePrice = storedCart[idx].price / quantity;
      if (quantity > 1) {
        quantity--;
        input.value = quantity;
        storedCart[idx].quantity = quantity;
        storedCart[idx].price = basePrice * quantity;
        localStorage.setItem("cart", JSON.stringify(storedCart));
        updateCartBadge();
        document.querySelector(`.badge.badge-success[data-idx="${idx}"]`).textContent = `€${storedCart[idx].price}`;
      }
    };
  })

  cartContainer.querySelectorAll(".quantity-increase").forEach((btn) => {
    btn.onclick = function () {
      const idx = this.dataset.idx;
      const input = cartContainer.querySelector(`.quantity-input[data-idx="${idx}"]`);
      let quantity = parseInt(input.value);
      let basePrice = storedCart[idx].price / quantity;
      quantity++;
      input.value = quantity;
      storedCart[idx].quantity = quantity;
      storedCart[idx].price = basePrice * quantity;
      localStorage.setItem("cart", JSON.stringify(storedCart));
      updateCartBadge();
      document.querySelector(`.badge.badge-success[data-idx="${idx}"]`).textContent = `€${storedCart[idx].price}`;
    };
  });

  // Listener per rimuovere elementi
  cartContainer.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.onclick = function () {
      storedCart.splice(this.dataset.idx, 1);
      localStorage.setItem("cart", JSON.stringify(storedCart));
      // Dopo la rimozione, aggiorna il carrello
      renderCart();
      updateCartBadge();
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

function buildItemDetails(model) {
  let details = ``;
    Object.keys(model.settings).forEach((key) => {
    const value = model.settings[key];
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        let customPart = model.customizableParts.find(part => part.value === key);
        let subCustomPart = customPart.customs[subKey];
        let subCustomPartOption = subCustomPart?.options ? subCustomPart.options.find(option => option.value === subValue) : null;
        if(customPart && subCustomPart && subCustomPartOption) {
          details += `<tr><td class='text-muted pr-2 text-capitalize'>${customPart.name} <span class='text-lowercase'>-</span> ${subCustomPart.name}</td><td class='text-dark'>${subCustomPartOption.name}</td></tr>`;
        }
      });
    } else {
      details += `<tr><td class='text-muted pr-2 text-capitalize'>${customPart.name}</td><td class='text-dark'>${value}</td></tr>`;
    }}
  );
  return details;
}