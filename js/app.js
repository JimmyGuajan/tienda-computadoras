/* Utilidades compartidas: datos, carrito, cabecera/pie y tarjetas de producto */

const CATEGORIAS = {
  laptops: "Laptops",
  pcs: "PC de escritorio",
  componentes: "Componentes",
  almacenamiento: "Almacenamiento",
  monitores: "Monitores",
  perifericos: "Periféricos",
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#16213a"/><g fill="none" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><rect x="110" y="85" width="180" height="115" rx="10"/><path d="M80 225h240"/></g><text x="200" y="262" fill="#7c8db5" font-family="sans-serif" font-size="16" text-anchor="middle">Imagen no disponible</text></svg>'
  );

/* ---------- Datos ---------- */
let _cache = {};
async function cargarJSON(ruta) {
  if (!_cache[ruta]) _cache[ruta] = fetch(ruta).then((r) => r.json());
  return _cache[ruta];
}
const cargarConfig = () => cargarJSON("data/config.json");
async function cargarProductos() {
  const todos = await cargarJSON("data/productos.json");
  return todos.filter((p) => p.activo !== false);
}

/* ---------- Helpers ---------- */
const precioFinal = (p) => (p.precioOferta ? p.precioOferta : p.precio);
const dinero = (n) => `${AJUSTES.MONEDA}${Number(n).toFixed(2)}`;
const imgSrc = (p) => `imagen/${encodeURIComponent(p.imagen)}`;
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function imgTag(p, cls = "") {
  return `<img class="${cls}" src="${imgSrc(p)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.onerror=null;this.src=PLACEHOLDER">`;
}

/* ---------- Carrito (localStorage) ---------- */
const Carrito = {
  clave: "technova_carrito",
  leer() {
    try { return JSON.parse(localStorage.getItem(this.clave)) || {}; } catch { return {}; }
  },
  guardar(c) {
    try { localStorage.setItem(this.clave, JSON.stringify(c)); } catch {}
    actualizarContador();
  },
  agregar(id, n = 1) {
    const c = this.leer();
    c[id] = Math.min((c[id] || 0) + n, 99);
    this.guardar(c);
  },
  fijar(id, n) {
    const c = this.leer();
    if (n <= 0) delete c[id]; else c[id] = Math.min(n, 99);
    this.guardar(c);
  },
  vaciar() { this.guardar({}); },
  total() { return Object.values(this.leer()).reduce((a, b) => a + b, 0); },
};

function actualizarContador() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = Carrito.total();
    el.textContent = n;
    el.hidden = n === 0;
  });
}

function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function agregarAlCarrito(id) {
  Carrito.agregar(id);
  toast("Producto agregado al carrito");
}

/* ---------- Tarjeta de producto ---------- */
function tarjeta(p) {
  const oferta = p.precioOferta && p.precioOferta < p.precio;
  return `
  <article class="card">
    <a class="card-img" href="producto.html?id=${encodeURIComponent(p.id)}">
      ${oferta ? `<span class="badge">-${Math.round((1 - p.precioOferta / p.precio) * 100)}%</span>` : ""}
      ${imgTag(p)}
    </a>
    <div class="card-body">
      <span class="card-cat">${esc(CATEGORIAS[p.categoria] || p.categoria)} · ${esc(p.marca)}</span>
      <h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${esc(p.nombre)}</a></h3>
      <div class="price">
        <strong>${dinero(precioFinal(p))}</strong>
        ${oferta ? `<s>${dinero(p.precio)}</s>` : ""}
      </div>
      <button class="btn btn-block" onclick="agregarAlCarrito('${esc(p.id)}')">Agregar al carrito</button>
    </div>
  </article>`;
}

/* ---------- Cabecera y pie ---------- */
async function montarLayout(activa = "") {
  const cfg = await cargarConfig();
  const t = cfg.tienda;
  const links = [
    ["index.html", "Inicio", "inicio"],
    ["catalogo.html", "Catálogo", "catalogo"],
    ["asistente.html", "Asistente", "asistente"],
    ["info.html", "Información", "info"],
  ];
  document.getElementById("header").innerHTML = `
  <div class="wrap nav">
    <a class="logo" href="index.html"><span>▣</span> ${esc(t.nombre)}</a>
    <nav id="menu">
      ${links.map(([h, n, k]) => `<a href="${h}" class="${k === activa ? "on" : ""}">${n}</a>`).join("")}
    </nav>
    <a class="cart-link" href="carrito.html" aria-label="Carrito">
      🛒 <span class="count" data-cart-count hidden>0</span>
    </a>
    <button class="burger" aria-label="Menú" onclick="document.getElementById('menu').classList.toggle('open')">☰</button>
  </div>`;
  document.getElementById("footer").innerHTML = `
  <div class="wrap foot">
    <div><strong>${esc(t.nombre)}</strong><p>${esc(t.eslogan)}</p></div>
    <div><strong>Contacto</strong>
      <p>WhatsApp: <a href="https://wa.me/${esc(t.whatsapp)}" target="_blank" rel="noopener">${esc(t.telefono)}</a></p>
      <p>${esc(t.correo)}</p></div>
    <div><strong>Enlaces</strong>
      <p><a href="info.html#pagos">Métodos de pago</a></p>
      <p><a href="info.html#faq">Preguntas frecuentes</a></p></div>
  </div>
  <p class="copy">© ${new Date().getFullYear()} ${esc(t.nombre)}. Sitio informativo: los pedidos se confirman por WhatsApp.</p>`;
  actualizarContador();
  return cfg;
}
