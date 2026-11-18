const LOW_STOCK = 5;
const KEY = "stockcontrol-items";

const $ = (id) => document.getElementById(id);
const form = $("form"), list = $("list"), empty = $("empty"), search = $("search"), sortSel = $("sort");

let items = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* almacenamiento no disponible */ }
  return [
    { id: 1, name: "Laptop", qty: 12 },
    { id: 2, name: "Mouse inalámbrico", qty: 3 },
    { id: 3, name: "Teclado mecánico", qty: 8 },
    { id: 4, name: "Monitor 24\"", qty: 2 },
  ];
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* ignorar */ }
}

function render() {
  const q = search.value.trim().toLowerCase();
  const visible = items.filter((i) => i.name.toLowerCase().includes(q));
  const sorters = {
    added: (a, b) => 0,
    name: (a, b) => a.name.localeCompare(b.name, "es"),
    "qty-asc": (a, b) => a.qty - b.qty,
    "qty-desc": (a, b) => b.qty - a.qty,
  };
  visible.sort(sorters[sortSel.value] || sorters.added);

  list.innerHTML = "";
  for (const item of visible) {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;
    li.appendChild(name);

    if (item.qty <= LOW_STOCK) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Stock bajo";
      li.appendChild(badge);
    }

    li.appendChild(makeBtn("−", () => change(item.id, -1), "Disminuir"));
    const qty = document.createElement("span");
    qty.className = "qty";
    qty.textContent = item.qty;
    li.appendChild(qty);
    li.appendChild(makeBtn("+", () => change(item.id, 1), "Aumentar"));

    const del = makeBtn("✕", () => remove(item.id), "Eliminar");
    del.classList.add("del");
    li.appendChild(del);

    list.appendChild(li);
  }

  empty.hidden = visible.length > 0;
  $("stat-total").textContent = items.length;
  $("stat-units").textContent = items.reduce((s, i) => s + i.qty, 0);
  $("stat-low").textContent = items.filter((i) => i.qty <= LOW_STOCK).length;
}

function makeBtn(text, handler, label) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = text;
  b.setAttribute("aria-label", label);
  b.addEventListener("click", handler);
  return b;
}

function change(id, delta) {
  const item = items.find((i) => i.id === id);
  if (item) item.qty = Math.max(0, item.qty + delta);
  save(); render();
}

function remove(id) {
  items = items.filter((i) => i.id !== id);
  save(); render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const qty = Math.max(0, parseInt($("qty").value, 10) || 0);
  if (!name) return;
  items.push({ id: Date.now(), name, qty });
  form.reset();
  $("qty").value = 1;
  save(); render();
});

search.addEventListener("input", render);
sortSel.addEventListener("change", render);

// Modo oscuro
const THEME_KEY = "stockcontrol-theme";
const themeBtn = $("theme-toggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

let theme = "light";
try {
  theme = localStorage.getItem(THEME_KEY) ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch (e) { /* usar tema claro */ }
applyTheme(theme);

themeBtn.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignorar */ }
});

render();
