"use strict";

// ---- Product data (replace with your own or fetch from an API) ----
const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2499, emoji: "🎧" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 3999, emoji: "⌚" },
  { id: 3, name: "Bluetooth Speaker", category: "Electronics", price: 1799, emoji: "🔊" },
  { id: 4, name: "Cotton T-Shirt", category: "Fashion", price: 599, emoji: "👕" },
  { id: 5, name: "Running Shoes", category: "Fashion", price: 2199, emoji: "👟" },
  { id: 6, name: "Backpack", category: "Fashion", price: 1299, emoji: "🎒" },
  { id: 7, name: "Coffee Mug", category: "Home", price: 299, emoji: "☕" },
  { id: 8, name: "Table Lamp", category: "Home", price: 899, emoji: "💡" },
  { id: 9, name: "Notebook Set", category: "Stationery", price: 249, emoji: "📓" },
  { id: 10, name: "Gel Pen Pack", category: "Stationery", price: 149, emoji: "🖊️" },
];

const CART_KEY = "shopeasy_cart_v1";

// ---- State ----
let cart = loadCart(); // { [productId]: quantity }

// ---- Elements ----
const $ = (id) => document.getElementById(id);
const productsEl = $("products");
const emptyEl = $("empty");
const searchEl = $("search");
const categoryEl = $("category");
const sortEl = $("sort");
const cartEl = $("cart");
const overlayEl = $("overlay");
const cartItemsEl = $("cart-items");
const cartCountEl = $("cart-count");
const cartTotalEl = $("cart-total");

// ---- Helpers ----
const money = (n) => "₹" + n.toLocaleString("en-IN");

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable: cart still works for this session */
  }
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  children.forEach((c) => node.append(c));
  return node;
}

// ---- Products ----
function fillCategories() {
  [...new Set(PRODUCTS.map((p) => p.category))].forEach((c) => {
    categoryEl.append(el("option", { value: c, textContent: c }));
  });
}

function visibleProducts() {
  const q = searchEl.value.trim().toLowerCase();
  const cat = categoryEl.value;
  let list = PRODUCTS.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );
  switch (sortEl.value) {
    case "low": list = [...list].sort((a, b) => a.price - b.price); break;
    case "high": list = [...list].sort((a, b) => b.price - a.price); break;
    case "name": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderProducts() {
  const list = visibleProducts();
  productsEl.replaceChildren();
  emptyEl.hidden = list.length > 0;

  list.forEach((p) => {
    const addBtn = el("button", { className: "primary", textContent: "Add to cart" });
    addBtn.addEventListener("click", () => addToCart(p.id));
    productsEl.append(
      el("article", { className: "card" }, [
        el("div", { className: "emoji", textContent: p.emoji }),
        el("h3", { textContent: p.name }),
        el("div", { className: "cat", textContent: p.category }),
        el("div", { className: "price", textContent: money(p.price) }),
        addBtn,
      ])
    );
  });
}

// ---- Cart ----
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  saveCart();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  // Ignore products that no longer exist
  const lines = Object.keys(cart)
    .map((id) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty: cart[id] }))
    .filter((l) => l.product);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = money(total);
  cartItemsEl.replaceChildren();

  if (lines.length === 0) {
    cartItemsEl.append(el("p", { className: "cart-empty", textContent: "Your cart is empty." }));
    return;
  }

  lines.forEach(({ product: p, qty }) => {
    const minus = el("button", { textContent: "−", ariaLabel: "Decrease quantity" });
    const plus = el("button", { textContent: "+", ariaLabel: "Increase quantity" });
    const remove = el("button", { className: "remove", textContent: "Remove" });
    minus.addEventListener("click", () => changeQty(p.id, -1));
    plus.addEventListener("click", () => changeQty(p.id, 1));
    remove.addEventListener("click", () => removeItem(p.id));

    cartItemsEl.append(
      el("div", { className: "line" }, [
        el("div", { className: "emoji", textContent: p.emoji }),
        el("div", {}, [
          el("div", { className: "name", textContent: p.name }),
          el("div", { className: "unit", textContent: money(p.price) + " each" }),
          el("div", { className: "qty" }, [minus, el("span", { textContent: qty }), plus]),
        ]),
        el("div", {}, [
          el("strong", { textContent: money(p.price * qty) }),
          el("div", {}, [remove]),
        ]),
      ])
    );
  });
}

function openCart() { cartEl.hidden = false; overlayEl.hidden = false; }
function closeCart() { cartEl.hidden = true; overlayEl.hidden = true; }

// ---- Events ----
searchEl.addEventListener("input", renderProducts);
categoryEl.addEventListener("change", renderProducts);
sortEl.addEventListener("change", renderProducts);
$("cart-toggle").addEventListener("click", openCart);
$("cart-close").addEventListener("click", closeCart);
overlayEl.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

$("clear-cart").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
});

$("checkout").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert("Demo checkout: order placed! (No real payment is processed.)");
  cart = {};
  saveCart();
  renderCart();
  closeCart();
});

// ---- Init ----
fillCategories();
renderProducts();
renderCart();
