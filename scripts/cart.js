// Cart logic using localStorage

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-container");
  if(container) {
    container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<div class="alert alert-info">Il carrello è vuoto.</div>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-bordered table-hover";
  table.innerHTML = `
    <thead class="thead-light">
      <tr>
        <th>Modello</th>
        <th>Personalizzazione</th>
        <th>Quantità</th>
        <th>Azioni</th>
      </tr>
    </thead>
    <tbody>
      ${cart.map((item, idx) => `
        <tr>
          <td>
            <a href="#" class="cart-edit" data-idx="${idx}">
            <strong>${item.modelName || item.model}</strong>
            </a>
            </td>
          <td>
            <img src="${item.image ? item.image : 'default.jpg'}" alt="preview" style="width:150px;height:150px;object-fit:cover;border-radius:6px;">
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input type="number" min="1" class="form-control cart-qty" data-idx="${idx}" value="${item.qty || 1}" style="width:60px;">
            </div>
          </td>
          <td>
            <button class="btn btn-danger btn-sm cart-delete" data-idx="${idx}">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join("")}
    </tbody>
  `;
  container.appendChild(table);

  // Edit (go to configurator)
  container.querySelectorAll(".cart-edit").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      const idx = el.getAttribute("data-idx");
      const item = cart[idx];
      // Pass config via localStorage and query param
      localStorage.setItem("editConfig", JSON.stringify(item));
      window.location.href = `./configurator.html?model=${item.model}&edit=${idx}`;
    });
  });

  // Quantity change
  container.querySelectorAll(".cart-qty").forEach(el => {
    el.addEventListener("change", e => {
      const idx = el.getAttribute("data-idx");
      let val = parseInt(el.value);
      if (isNaN(val) || val < 1) val = 1;
      cart[idx].qty = val;
      setCart(cart);
      renderCart();
    });
  });

  // Delete
  container.querySelectorAll(".cart-delete").forEach(el => {
    el.addEventListener("click", e => {
      const idx = el.getAttribute("data-idx");
      cart.splice(idx, 1);
      setCart(cart);
      renderCart();
    });
  });
  }
}

// Call on load
document.addEventListener("DOMContentLoaded", renderCart);

// Export for configurator
const addToCart = (item) => {
  const cart = getCart();
  cart.push(item);
  setCart(cart);
};

export {addToCart};