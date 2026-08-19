const products = [
  { id: 1, name: "Vintage Utility Jacket", category: "jackets", categoryLabel: "Jackets", price: 4800, originalPrice: 6200, condition: "Excellent", stock: 3, description: "A structured utility jacket with plenty of everyday character.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", tag: "New Drop", soldOut: false },
  { id: 2, name: "Oversized Denim Jacket", category: "denim", categoryLabel: "Denim", price: 4200, originalPrice: 5600, condition: "Very Good", stock: 2, description: "A relaxed vintage wash made for easy layering.", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85", tag: "One of One", soldOut: false },
  { id: 3, name: "Retro Corduroy Shirt", category: "shirts", categoryLabel: "Shirts", price: 3200, originalPrice: 4100, condition: "Excellent", stock: 4, description: "Soft corduroy texture with a timeless relaxed fit.", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85", tag: "Trending", soldOut: false },
  { id: 4, name: "Classic Knit Sweater", category: "knitwear", categoryLabel: "Knitwear", price: 3600, originalPrice: 4700, condition: "Good", stock: 1, description: "A warm, easy knit with a classic shape and soft handle.", image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=85", tag: "Vintage", soldOut: false },
  { id: 5, name: "90s Cargo Trousers", category: "bottoms", categoryLabel: "Bottoms", price: 3800, originalPrice: 5200, condition: "Excellent", stock: 2, description: "Roomy cargo trousers with a practical 90s silhouette.", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85", tag: "", soldOut: false },
  { id: 6, name: "Vintage Graphic Shirt", category: "shirts", categoryLabel: "Tees", price: 2600, originalPrice: 3400, condition: "Very Good", stock: 3, description: "A graphic pre-loved tee with a comfortable everyday fit.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", tag: "", soldOut: false },
  { id: 7, name: "Casual Utility Jacket", category: "jackets", categoryLabel: "Jackets", price: 5500, originalPrice: 7200, condition: "Excellent", stock: 1, description: "A rare, lightly worn jacket with a clean utilitarian finish.", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85", tag: "Rare Find", soldOut: false },
  { id: 8, name: "Classic Oxford Shirt", category: "shirts", categoryLabel: "Shirts", price: 2900, originalPrice: 3900, condition: "Very Good", stock: 2, description: "An easy Oxford shirt that works from weekday to weekend.", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85", tag: "", soldOut: false },
  { id: 9, name: "Vintage Straight Jeans", category: "denim", categoryLabel: "Denim", price: 4400, originalPrice: 5800, condition: "Excellent", stock: 0, description: "A straight-leg vintage fit with a broken-in feel.", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85", tag: "90s Fit", soldOut: true }
];

const productList = document.getElementById("productList");
const productSearch = document.getElementById("productSearch");
const clearSearch = document.getElementById("clearSearch");
const resetFilters = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");
const categoryButtons = document.querySelectorAll(".category-button");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartFooter = document.getElementById("cartFooter");
const productModal = document.getElementById("productModal");
const toast = document.getElementById("cartToast");

let activeCategory = "all";
let activeProductId = null;
let toastTimer;

const formatCurrency = value => `PKR ${Number(value).toLocaleString("en-PK")}`;

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("urbanThriftCart")) || [];
    return saved
      .map(item => ({ id: Number(item.id), qty: Math.max(1, Number(item.qty) || 1) }))
      .filter(item => products.some(product => product.id === item.id));
  } catch (error) {
    return [];
  }
}

let cart = readCart();

function saveCart() {
  localStorage.setItem("urbanThriftCart", JSON.stringify(cart));
  renderCart();
}

function filteredProducts() {
  const query = productSearch.value.trim().toLowerCase();
  return products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const searchableText = `${product.name} ${product.categoryLabel} ${product.condition} ${product.description}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });
}

function productCard(product) {
  const unavailable = product.soldOut || product.stock < 1;
  return `
    <article class="shop-product-card ${unavailable ? "is-sold-out" : ""}">
      <button class="product-photo view-details" type="button" data-id="${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        ${unavailable ? '<span class="sold-label">SOLD OUT</span>' : '<span class="quick-view">QUICK VIEW →</span>'}
      </button>
      <div class="shop-product-info">
        <div class="product-meta-row">
          <span>${product.categoryLabel}</span>
          <span>${product.condition}</span>
        </div>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="price-row">
          <strong>${formatCurrency(product.price)}</strong>
          <del>${formatCurrency(product.originalPrice)}</del>
        </div>
        <button class="add-cart-button" type="button" data-add-id="${product.id}" ${unavailable ? "disabled" : ""}>
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          ${unavailable ? "SOLD OUT" : "ADD TO CART"}
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  const hasFilters = activeCategory !== "all" || productSearch.value.trim() !== "";
  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"} found`;
  resetFilters.hidden = !hasFilters;
  clearSearch.hidden = productSearch.value.length === 0;

  if (!visibleProducts.length) {
    productList.innerHTML = `
      <div class="no-results">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <h2>NO FINDS YET</h2>
        <p>Try another keyword or reset your filters.</p>
      </div>`;
    return;
  }

  productList.innerHTML = visibleProducts.map(productCard).join("");
}

function setCategory(category) {
  activeCategory = category;
  categoryButtons.forEach(button => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);
  if (!product || product.soldOut || product.stock < 1) return;

  const requestedQty = Math.max(1, Number(quantity) || 1);
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty = Math.min(existingItem.qty + requestedQty, product.stock);
  } else {
    cart.push({ id: productId, qty: Math.min(requestedQty, product.stock) });
  }

  saveCart();
  showToast(`${product.name} added to your cart`);
}

function renderCart() {
  cart = cart.filter(item => {
    const product = products.find(candidate => candidate.id === item.id);
    if (!product || product.soldOut || product.stock < 1) return false;
    item.qty = Math.min(Math.max(item.qty, 1), product.stock);
    return true;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  cartCount.setAttribute("aria-label", `${totalItems} ${totalItems === 1 ? "item" : "items"} in cart`);
  cartCount.classList.toggle("has-items", totalItems > 0);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        <h3>YOUR CART IS EMPTY</h3>
        <p>Your next one-of-a-kind find is waiting.</p>
        <button class="primary-button" id="emptyCartShop" type="button">START SHOPPING</button>
      </div>`;
    cartFooter.hidden = true;
    cartSubtotal.textContent = formatCurrency(0);
    return;
  }

  cartFooter.hidden = false;
  cartItems.innerHTML = cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id);
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-item-info">
          <span>${product.categoryLabel}</span>
          <h3>${product.name}</h3>
          <strong>${formatCurrency(product.price)}</strong>
          <div class="cart-item-actions">
            <div class="quantity-control" aria-label="Quantity for ${product.name}">
              <button type="button" data-cart-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-action="increase" data-id="${product.id}" aria-label="Increase quantity" ${item.qty >= product.stock ? "disabled" : ""}>+</button>
            </div>
            <button class="remove-item" type="button" data-cart-action="remove" data-id="${product.id}">REMOVE</button>
          </div>
        </div>
      </article>`;
  }).join("");

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(candidate => candidate.id === item.id);
    return sum + product.price * item.qty;
  }, 0);
  cartSubtotal.textContent = formatCurrency(subtotal);
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartOverlay.hidden = false;
  document.body.classList.add("no-scroll");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
  document.body.classList.remove("no-scroll");
}

function openModal(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  activeProductId = productId;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.name;
  document.getElementById("modalCategory").textContent = product.categoryLabel;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalDescription").textContent = product.description;
  document.getElementById("modalPrice").textContent = formatCurrency(product.price);
  document.getElementById("modalCondition").textContent = product.condition;
  document.getElementById("modalStock").textContent = product.stock > 0 ? `${product.stock} available` : "Sold out";
  const quantityInput = document.getElementById("modalQuantity");
  quantityInput.value = 1;
  quantityInput.max = Math.max(product.stock, 1);
  const addButton = document.getElementById("modalAddCart");
  addButton.disabled = product.soldOut || product.stock < 1;
  addButton.innerHTML = product.soldOut || product.stock < 1
    ? "SOLD OUT"
    : '<i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> ADD TO CART';
  productModal.hidden = false;
  document.body.classList.add("no-scroll");
  document.getElementById("closeModal").focus();
}

function closeModal() {
  productModal.hidden = true;
  activeProductId = null;
  if (!cartDrawer.classList.contains("open")) document.body.classList.remove("no-scroll");
}

categoryButtons.forEach(button => {
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

productSearch.addEventListener("input", renderProducts);
clearSearch.addEventListener("click", () => {
  productSearch.value = "";
  productSearch.focus();
  renderProducts();
});
resetFilters.addEventListener("click", () => {
  productSearch.value = "";
  setCategory("all");
  productSearch.focus();
});

productList.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-id]");
  const viewButton = event.target.closest(".view-details");
  if (addButton) addToCart(Number(addButton.dataset.addId));
  if (viewButton) openModal(Number(viewButton.dataset.id));
});

document.getElementById("searchToggle").addEventListener("click", () => {
  productSearch.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => productSearch.focus(), 350);
});
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("closeModal").addEventListener("click", closeModal);
productModal.addEventListener("click", event => {
  if (event.target === productModal) closeModal();
});
document.getElementById("modalAddCart").addEventListener("click", () => {
  addToCart(activeProductId, document.getElementById("modalQuantity").value);
  closeModal();
  openCart();
});

cartItems.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-cart-action]");
  if (!actionButton) {
    if (event.target.closest("#emptyCartShop")) closeCart();
    return;
  }
  const productId = Number(actionButton.dataset.id);
  const action = actionButton.dataset.cartAction;
  const cartItem = cart.find(item => item.id === productId);
  const product = products.find(item => item.id === productId);
  if (!cartItem || !product) return;

  if (action === "increase") cartItem.qty = Math.min(cartItem.qty + 1, product.stock);
  if (action === "decrease") cartItem.qty -= 1;
  if (action === "remove" || cartItem.qty < 1) cart = cart.filter(item => item.id !== productId);
  saveCart();
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  saveCart();
  showToast("Your cart has been cleared");
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (!productModal.hidden) closeModal();
  else if (cartDrawer.classList.contains("open")) closeCart();
});

setCategory("all");
renderCart();

if (window.location.hash === "#search") {
  setTimeout(() => productSearch.focus(), 100);
}
if (window.location.hash === "#cart") {
  setTimeout(openCart, 100);
}
