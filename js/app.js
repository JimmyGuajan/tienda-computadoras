/* Núcleo compartido: datos, iconos, carrito, layout, paleta de búsqueda, animaciones */

const CATEGORIAS = {
  laptops: "Laptops",
  pcs: "PC de escritorio",
  componentes: "Componentes",
  almacenamiento: "Almacenamiento",
  monitores: "Monitores",
  perifericos: "Periféricos",
};
const CAT_ICON = { laptops: "laptop", pcs: "pc", componentes: "cpu", almacenamiento: "drive", monitores: "monitor", perifericos: "keyboard" };

/* ---------- Iconos SVG ---------- */
const ICONS = {
  laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>',
  pc: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 6h4M12 17h.01"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  drive: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 14h18M7 17h.01"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  truck: '<path d="M2 6h11v10H2zM13 10h4l4 3v3h-8"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="6" rx="2"/><rect x="17" y="14" width="5" height="6" rx="2"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  chat: '<path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
};
const ico = (n, s = 20) =>
  `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

/* Imagen de reemplazo por categoría (cuando aún no hay foto en /imagen) */
function ph(cat) {
  const icon = ICONS[CAT_ICON[cat]] || ICONS.laptop;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a2547"/><stop offset="1" stop-color="#0b1020"/></linearGradient>` +
    `<radialGradient id="r" cx=".5" cy=".45" r=".5"><stop offset="0" stop-color="#5b8cff" stop-opacity=".45"/><stop offset="1" stop-color="#5b8cff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="#ffffff" stroke-opacity=".05"/></pattern></defs>` +
    `<rect width="400" height="300" fill="url(#g)"/><rect width="400" height="300" fill="url(#p)"/><rect width="400" height="300" fill="url(#r)"/>` +
    `<g transform="translate(130 80) scale(6.25)" fill="none" stroke="#8fb0ff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

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
const enOferta = (p) => p.precioOferta && p.precioOferta < p.precio;
const dinero = (n) => `${AJUSTES.MONEDA}${Number(n).toFixed(2)}`;
const imgSrc = (p) => `imagen/${encodeURIComponent(p.imagen)}`;
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function imgTag(p, cls = "") {
  return `<img class="${cls}" src="${imgSrc(p)}" alt="${esc(p.nombre)}" width="400" height="300" loading="lazy" data-cat="${esc(p.categoria)}" onerror="this.onerror=null;this.src=ph(this.dataset.cat)">`;
}
const skeletons = (n = 4) => Array.from({ length: n }, () => '<div class="skel"><i></i><i></i><i style="width:55%"></i></div>').join("");

/* ---------- Carrito (localStorage) ---------- */
const Carrito = {
  clave: "technova_carrito",
  leer() {
    try { return JSON.parse(localStorage.getItem(this.clave)) || {}; } catch { return {}; }
  },
  guardar(c) {
    try { localStorage.setItem(this.clave, JSON.stringify(c)); } catch {}
    actualizarContador();
    document.dispatchEvent(new Event("carrito"));
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

function actualizarContador(animar = false) {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = Carrito.total();
    el.textContent = n;
    el.hidden = n === 0;
    if (animar) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  });
}

function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2200);
}

/* Animación: la imagen "vuela" al carrito */
function volarAlCarrito(origen) {
  const destino = document.querySelector(".cart-btn");
  const img = origen && (origen.closest(".card, .prod, .pal-item")?.querySelector("img") || origen);
  if (!destino || !img || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = img.getBoundingClientRect(), b = destino.getBoundingClientRect();
  if (!a.width) return;
  const clon = document.createElement("img");
  clon.src = img.currentSrc || img.src;
  clon.className = "fly";
  Object.assign(clon.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
  document.body.appendChild(clon);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  clon.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.6}px,${dy * 0.3 - 60}px) scale(.45)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(${dx}px,${dy}px) scale(.05)`, opacity: 0.2 },
    ],
    { duration: 750, easing: "cubic-bezier(.5,0,.75,.4)" }
  ).onfinish = () => {
    clon.remove();
    destino.classList.remove("bump"); void destino.offsetWidth; destino.classList.add("bump");
  };
}

function agregarAlCarrito(id, origen) {
  Carrito.agregar(id);
  volarAlCarrito(origen);
  actualizarContador(true);
  toast("Agregado al carrito");
}

/* ---------- Tarjeta de producto ---------- */
function tarjeta(p, opts = {}) {
  const oferta = enOferta(p);
  const chips = Object.values(p.specs || {}).slice(0, 2);
  return `
  <article class="card reveal">
    <a class="card-img" href="producto.html?id=${encodeURIComponent(p.id)}" aria-label="${esc(p.nombre)}">
      ${oferta ? `<span class="badge">-${Math.round((1 - p.precioOferta / p.precio) * 100)}%</span>` : ""}
      ${opts.match ? `<span class="match"><i></i>${opts.match}% compatible</span>` : ""}
      ${imgTag(p)}
    </a>
    <div class="card-body">
      <span class="card-cat">${esc(CATEGORIAS[p.categoria] || p.categoria)} · ${esc(p.marca)}</span>
      <h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${esc(p.nombre)}</a></h3>
      <ul class="chips">${chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      <div class="card-foot">
        <div class="price"><strong>${dinero(precioFinal(p))}</strong>${oferta ? `<s>${dinero(p.precio)}</s>` : ""}</div>
        <button class="add" aria-label="Agregar ${esc(p.nombre)} al carrito" onclick="agregarAlCarrito('${esc(p.id)}',this)">${ico("cart", 20)}</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Tema claro / oscuro ---------- */
function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("tn_theme", t); } catch {}
  const b = document.getElementById("theme-btn");
  if (b) b.innerHTML = ico(t === "dark" ? "sun" : "moon", 19);
}

/* ---------- Layout ---------- */
async function montarLayout(activa = "") {
  const cfg = await cargarConfig();
  const t = cfg.tienda;
  const links = [
    ["index.html", "Inicio", "inicio"],
    ["catalogo.html", "Catálogo", "catalogo"],
    ["asistente.html", "Asistente", "asistente"],
    ["info.html", "Información", "info"],
  ];
  const logo = `<a class="logo" href="index.html"><span class="logo-mark">${ico("cpu", 20)}</span>${esc(t.nombre)}</a>`;

  document.body.insertAdjacentHTML("afterbegin", `<div class="topbar"><span>Envíos a todo el país · Garantía del fabricante · Pedidos por WhatsApp</span></div><header class="site" id="header"></header>`);
  document.getElementById("header").innerHTML = `
  <div class="wrap nav">
    ${logo}
    <nav id="menu" aria-label="Principal">${links.map(([h, n, k]) => `<a href="${h}" class="${k === activa ? "on" : ""}">${n}</a>`).join("")}</nav>
    <div class="nav-actions">
      <button class="search-btn" id="open-search" aria-label="Buscar">${ico("search", 18)}<span>Buscar productos</span><kbd>Ctrl K</kbd></button>
      <button class="icon-btn" id="theme-btn" aria-label="Cambiar tema"></button>
      <a class="icon-btn cart-btn" href="carrito.html" aria-label="Carrito">${ico("cart", 20)}<span class="count" data-cart-count hidden>0</span></a>
      <button class="icon-btn burger" aria-label="Menú" id="burger">${ico("menu", 20)}</button>
    </div>
  </div>`;

  const foot = document.createElement("footer");
  foot.className = "site";
  foot.innerHTML = `
  <div class="wrap foot">
    <div class="brand">${logo}<p>${esc(t.eslogan)}. Asesoría real y atención directa por WhatsApp.</p>
      <a class="btn btn-wa" href="https://wa.me/${esc(t.whatsapp)}" target="_blank" rel="noopener">${ico("chat", 18)} Escríbenos</a></div>
    <div><h4>Tienda</h4><ul>
      <li><a href="catalogo.html">Catálogo</a></li><li><a href="asistente.html">Asistente</a></li>
      <li><a href="catalogo.html?oferta=1">Ofertas</a></li><li><a href="carrito.html">Mi pedido</a></li></ul></div>
    <div><h4>Ayuda</h4><ul>
      <li><a href="info.html#pagos">Métodos de pago</a></li><li><a href="info.html#faq">Preguntas frecuentes</a></li>
      <li><a href="info.html#contacto">Contacto</a></li></ul></div>
    <div><h4>Contacto</h4><ul>
      <li>${ico("chat", 15)} ${esc(t.telefono)}</li><li>${ico("mail", 15)} ${esc(t.correo)}</li><li>${ico("pin", 15)} ${esc(t.direccion)}</li></ul></div>
  </div>
  <p class="copy">© ${new Date().getFullYear()} ${esc(t.nombre)} · Sitio informativo: los pedidos se confirman por WhatsApp.</p>`;
  document.body.appendChild(foot);

  document.body.insertAdjacentHTML(
    "beforeend",
    `<a class="fab" href="https://wa.me/${esc(t.whatsapp)}?text=${encodeURIComponent("Hola, quisiera más información")}" target="_blank" rel="noopener" aria-label="WhatsApp">${ico("chat", 26)}</a>
     <div class="drawer" id="drawer" aria-hidden="true">
       <div class="drawer-bg" data-close></div>
       <aside class="drawer-panel" role="dialog" aria-label="Carrito">
         <div class="drawer-head"><h3>Tu pedido</h3><button class="icon-btn" data-close aria-label="Cerrar">${ico("x", 18)}</button></div>
         <div class="drawer-body" id="drawer-body"></div>
         <div class="drawer-foot" id="drawer-foot"></div>
       </aside>
     </div>
     <div class="palette" id="palette" role="dialog" aria-label="Buscar">
       <div class="pal-box">
         <div class="pal-in">${ico("search", 20)}<input id="pal-q" placeholder="Busca una laptop, RTX, 16 GB..." autocomplete="off"></div>
         <div class="pal-list" id="pal-list"></div>
         <div class="pal-foot"><span><kbd>↑↓</kbd>navegar</span><span><kbd>Enter</kbd>abrir</span><span><kbd>Esc</kbd>cerrar</span></div>
       </div>
     </div>`
  );

  aplicarTema(document.documentElement.dataset.theme || "dark");
  document.getElementById("theme-btn").onclick = () => aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  document.getElementById("burger").onclick = () => document.getElementById("menu").classList.toggle("open");

  iniciarDrawer();
  iniciarPaleta(t);
  iniciarEfectos();
  actualizarContador();
  return cfg;
}

/* ---------- Carrito lateral ---------- */
function iniciarDrawer() {
  const d = document.getElementById("drawer");
  const abrir = () => { pintarDrawer(); d.classList.add("on"); d.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const cerrar = () => { d.classList.remove("on"); d.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  window.abrirCarrito = abrir;
  d.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
  document.querySelector(".cart-btn").addEventListener("click", (e) => {
    if (/carrito\.html$/.test(location.pathname)) return; // ya estamos en la página del carrito
    e.preventDefault();
    abrir();
  });
  document.addEventListener("carrito", () => { if (d.classList.contains("on")) pintarDrawer(); });
  d.addEventListener("click", (e) => {
    const b = e.target.closest("[data-dm],[data-dp],[data-dr]");
    if (!b) return;
    const c = Carrito.leer();
    if (b.dataset.dr) Carrito.fijar(b.dataset.dr, 0);
    if (b.dataset.dm) Carrito.fijar(b.dataset.dm, (c[b.dataset.dm] || 1) - 1);
    if (b.dataset.dp) Carrito.fijar(b.dataset.dp, (c[b.dataset.dp] || 0) + 1);
  });
}

async function pintarDrawer() {
  const productos = await cargarProductos();
  const c = Carrito.leer();
  const lineas = Object.entries(c).map(([id, n]) => ({ p: productos.find((x) => x.id === id), n })).filter((l) => l.p);
  const body = document.getElementById("drawer-body"), foot = document.getElementById("drawer-foot");
  if (!lineas.length) {
    body.innerHTML = `<div class="d-empty">${ico("bag", 44)}<p>Tu carrito está vacío.<br>Agrega equipos para armar tu pedido.</p><a class="btn" href="catalogo.html">Ver catálogo</a></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = lineas.map(({ p, n }) => `
    <div class="d-item">
      ${imgTag(p)}
      <div><h4>${esc(p.nombre)}</h4><small>${dinero(precioFinal(p))} c/u</small><br>
        <span class="qty" style="margin-top:6px"><button data-dm="${esc(p.id)}" aria-label="Menos">${ico("minus", 14)}</button><span>${n}</span><button data-dp="${esc(p.id)}" aria-label="Más">${ico("plus", 14)}</button></span></div>
      <div style="text-align:right"><b>${dinero(precioFinal(p) * n)}</b><br><button class="rm" style="background:none;border:0;color:var(--muted);cursor:pointer;margin-top:8px" data-dr="${esc(p.id)}" aria-label="Quitar">${ico("trash", 16)}</button></div>
    </div>`).join("");
  const total = lineas.reduce((s, l) => s + precioFinal(l.p) * l.n, 0);
  foot.innerHTML = `<div class="sum-row sum-total" style="margin:0;padding:0;border:0"><span>Total</span><span>${dinero(total)}</span></div>
    <a class="btn btn-block btn-lg" href="carrito.html">Finalizar pedido ${ico("arrow", 18)}</a>`;
}

/* ---------- Paleta de búsqueda (Ctrl+K) ---------- */
function iniciarPaleta() {
  const pal = document.getElementById("palette"), q = document.getElementById("pal-q"), list = document.getElementById("pal-list");
  let items = [], sel = 0;
  const accesos = [
    ["Catálogo completo", "catalogo.html", "laptop"],
    ["Asistente: encuentra tu equipo", "asistente.html", "sparkles"],
    ["Ofertas", "catalogo.html?oferta=1", "zap"],
    ["Métodos de pago", "info.html#pagos", "card"],
    ["Mi pedido", "carrito.html", "cart"],
  ];
  async function pintar() {
    const productos = await cargarProductos();
    const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const res = words.length
      ? productos.filter((p) => {
          const t = [p.nombre, p.marca, CATEGORIAS[p.categoria], p.descripcion, ...Object.values(p.specs || {})].join(" ").toLowerCase();
          return words.every((w) => t.includes(w));
        }).slice(0, 7)
      : [];
    items = [
      ...res.map((p) => ({ href: `producto.html?id=${encodeURIComponent(p.id)}`, html: `${imgTag(p)}<div><span class="t">${esc(p.nombre)}</span><small>${esc(CATEGORIAS[p.categoria])} · ${esc(p.marca)}</small></div><span class="p">${dinero(precioFinal(p))}</span>` })),
      ...accesos.map(([t, href, ic]) => ({ href, html: `<span class="ti" style="display:grid;place-items:center;width:46px;height:36px;color:var(--brand-2)">${ico(ic, 20)}</span><div><span class="t">${t}</span></div>` })),
    ];
    sel = 0;
    list.innerHTML = (res.length ? '<div class="pal-h">Productos</div>' : words.length ? '<div class="pal-h">Sin resultados para tu búsqueda</div>' : "") +
      items.map((it, i) => (i === res.length ? '<div class="pal-h">Ir a</div>' : "") + `<a class="pal-item${i === 0 ? " sel" : ""}" href="${it.href}" data-i="${i}">${it.html}</a>`).join("");
  }
  const abrir = () => { pal.classList.add("on"); q.value = ""; pintar(); setTimeout(() => q.focus(), 30); };
  const cerrar = () => pal.classList.remove("on");
  const marcar = () => {
    list.querySelectorAll(".pal-item").forEach((el, i) => el.classList.toggle("sel", i === sel));
    list.querySelector(".pal-item.sel")?.scrollIntoView({ block: "nearest" });
  };
  document.getElementById("open-search").onclick = abrir;
  pal.addEventListener("click", (e) => { if (e.target === pal) cerrar(); });
  q.addEventListener("input", pintar);
  document.addEventListener("keydown", (e) => {
    const enCampo = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("on") ? cerrar() : abrir(); }
    else if (e.key === "/" && !enCampo) { e.preventDefault(); abrir(); }
    else if (pal.classList.contains("on")) {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); marcar(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); marcar(); }
      else if (e.key === "Enter" && items[sel]) { location.href = items[sel].href; }
    }
  });
}

/* ---------- Efectos: reveal, contadores, luz en tarjetas, tilt ---------- */
function iniciarEfectos() {
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        if (el.classList.contains("reveal")) {
          const i = [...el.parentElement.children].indexOf(el);
          el.style.transitionDelay = Math.min(i, 8) * 70 + "ms";
          el.classList.add("in");
          setTimeout(() => (el.style.transitionDelay = ""), 1200);
        }
        if (el.dataset.count) contar(el);
      }), { threshold: 0.12 })
    : null;
  const observar = (root) => {
    root.querySelectorAll?.(".reveal:not(.in), [data-count]:not([data-done])").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  };
  observar(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.matches?.(".reveal,[data-count]")) io ? io.observe(n) : n.classList.add("in"); observar(n); } }))).observe(document.body, { childList: true, subtree: true });

  // Luz que sigue al cursor + inclinación del dispositivo del hero
  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest?.(".card, .tile");
    if (c) {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }
    const dev = document.querySelector(".device .laptop");
    if (dev && e.pointerType === "mouse") {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      dev.style.setProperty("--ry", -13 + nx * 16 + "deg");
      dev.style.setProperty("--rx", 7 - ny * 12 + "deg");
    }
  });
}

function contar(el) {
  el.dataset.done = "1";
  const fin = +el.dataset.count, dur = 1400, t0 = performance.now();
  const paso = (t) => {
    const k = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))) + (el.dataset.suffix || "");
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* ---------- Confeti (al generar el pedido) ---------- */
function confeti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.id = "confetti";
  cv.width = innerWidth; cv.height = innerHeight;
  document.body.appendChild(cv);
  const cx = cv.getContext("2d");
  const cols = ["#5b8cff", "#8b5cf6", "#22d3ee", "#22c55e", "#f5a524", "#ff6b9d"];
  const ps = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.55,
    vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 18 - 6,
    w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    c: cols[(Math.random() * cols.length) | 0],
  }));
  let f = 0;
  (function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach((p) => {
      p.vy += 0.4; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      cx.globalAlpha = Math.max(0, 1 - f / 140);
      cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore();
    });
    if (++f < 150) requestAnimationFrame(tick); else cv.remove();
  })();
}
