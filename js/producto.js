(async function () {
  const cfg = await montarLayout("catalogo");
  const productos = await cargarProductos();
  const id = new URLSearchParams(location.search).get("id");
  const p = productos.find((x) => x.id === id);
  const cont = document.getElementById("detalle");

  if (!p) {
    cont.innerHTML = '<p class="vacio">Producto no encontrado o no disponible. <a href="catalogo.html" style="color:var(--brand)">Volver al catálogo</a></p>';
    return;
  }

  document.title = `${p.nombre} | ${cfg.tienda.nombre}`;
  const oferta = p.precioOferta && p.precioOferta < p.precio;
  let cantidad = 1;

  cont.innerHTML = `
    <div class="crumbs"><a href="catalogo.html">Catálogo</a> / <a href="catalogo.html?cat=${esc(p.categoria)}">${esc(CATEGORIAS[p.categoria] || p.categoria)}</a></div>
    <div class="prod">
      <div class="prod-img">${imgTag(p)}</div>
      <div>
        <span class="card-cat">${esc(p.marca)}</span>
        <h1>${esc(p.nombre)}</h1>
        <p style="color:var(--muted)">${esc(p.descripcion)}</p>
        <div class="price" style="margin:14px 0">
          <strong>${dinero(precioFinal(p))}</strong>${oferta ? `<s>${dinero(p.precio)}</s>` : ""}
        </div>
        <table class="specs">${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <div class="qty"><button id="menos" aria-label="Menos">−</button><span id="cant">1</span><button id="mas" aria-label="Más">+</button></div>
          <button class="btn" id="add">Agregar al carrito</button>
          <a class="btn btn-wa" target="_blank" rel="noopener"
             href="https://wa.me/${esc(cfg.tienda.whatsapp)}?text=${encodeURIComponent(`Hola, me interesa: ${p.nombre} (${dinero(precioFinal(p))})`)}">Consultar por WhatsApp</a>
        </div>
      </div>
    </div>`;

  const c = document.getElementById("cant");
  document.getElementById("menos").onclick = () => { cantidad = Math.max(1, cantidad - 1); c.textContent = cantidad; };
  document.getElementById("mas").onclick = () => { cantidad = Math.min(99, cantidad + 1); c.textContent = cantidad; };
  document.getElementById("add").onclick = () => { Carrito.agregar(p.id, cantidad); toast("Producto agregado al carrito"); };
})();
