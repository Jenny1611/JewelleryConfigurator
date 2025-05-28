export const cart = [];
console.log(cart);

export function addToCart(product) {
  // Recupera il carrello attuale da localStorage
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  // Cerca se esiste già un prodotto con stessa configurazione
  const idx = storedCart.findIndex(
    (item) =>
      item.modelType === product.modelType &&
      JSON.stringify(item.settings) === JSON.stringify(product.settings) &&
      item.price === product.price
  );
  if (idx !== -1) {
    // Se esiste, aumenta il contatore quantity
    storedCart[idx].quantity = (storedCart[idx].quantity || 1) + 1;
  } else {
    product.quantity = 1;
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

window.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const quantityInput = document.getElementById("quantity");
  const priceSpan = document.getElementById("product-price");
  let currentPrice = 99;

  // Funzione per calcolare il prezzo in base alla configurazione
  function calculatePrice(model) {
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

  document.body.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("settingsButton")) {
      setTimeout(updatePrice, 10);
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
                  ${Object.entries(item.settings)
                    .map(([k, v]) => {
                      if (typeof v === "object" && v !== null) {
                        return Object.entries(v)
                          .map(
                            ([subk, subv]) =>
                              `<tr><td class='text-muted pr-2 text-capitalize'>${k} <span class='text-lowercase'>/</span> ${subk}</td><td class='text-dark'>${subv}</td></tr>`
                          )
                          .join("");
                      } else {
                        return `<tr><td class='text-muted pr-2 text-capitalize'>${k}</td><td class='text-dark'>${v}</td></tr>`;
                      }
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="d-flex flex-column align-items-end justify-content-center ml-3" style="min-width:110px;">       
          </div>     
          <span>Quantità: ${item.quantity || 1}</span>      
          <span class="badge badge-success mb-2" style="font-size:1.15em;">€${
            item.price
          }</span>
        </div>
        <div class="delete-container">
         <button type="button" class="btn btn-danger btn-sm remove-btn mt-1" data-idx="${idx}"><i class="fa-solid fa-trash"></i> Rimuovi</button>
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
