(async function () {
  const cfg = await montarLayout("catalogo");
  const productos = await cargarProductos();
  const id = new URLSearchParams(location.search).get("id");
  const p = productos.find((x) => x.id === id);
  const cont = document.getElementById("detalle");

  if (!p) {
    cont.innerHTML = `<div class="panel" style="text-align:center;padding:60px 20px;display:grid;gap:14px;justify-items:center">
      <div style="color:var(--brand-2)">${ico("search", 44)}</div><h2>Producto no encontrado</h2>
      <p class="sub">Puede que ya no esté disponible.</p><a class="btn" href="catalogo.html">Volver al catálogo</a></div>`;
    return;
  }

  document.title = `${p.nombre} | ${cfg.tienda.nombre}`;
  const oferta = enOferta(p);
  let cantidad = 1;

  cont.innerHTML = `
    <div class="crumbs"><a href="index.html">Inicio</a> / <a href="catalogo.html">Catálogo</a> / <a href="catalogo.html?cat=${esc(p.categoria)}">${esc(CATEGORIAS[p.categoria] || p.categoria)}</a></div>
    <div class="prod">
      <div class="prod-img">${oferta ? `<span class="badge">-${Math.round((1 - p.precioOferta / p.precio) * 100)}%</span>` : ""}${imgTag(p)}</div>
      <div>
        <span class="card-cat">${esc(p.marca)} · ${esc(CATEGORIAS[p.categoria] || "")}</span>
        <h1>${esc(p.nombre)}</h1>
        <p style="color:var(--muted);font-size:1.02rem">${esc(p.descripcion)}</p>
        <div class="price" style="margin:18px 0 4px">
          <strong>${dinero(precioFinal(p))}</strong>${oferta ? `<s>${dinero(p.precio)}</s><span class="save">Ahorras ${dinero(p.precio - p.precioOferta)}</span>` : ""}
        </div>
        <table class="specs">${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>
        <div class="buy">
          <div class="qty"><button id="menos" aria-label="Menos">${ico("minus", 16)}</button><span id="cant">1</span><button id="mas" aria-label="Más">${ico("plus", 16)}</button></div>
          <button class="btn btn-lg" id="add">${ico("cart", 20)} Agregar al carrito</button>
          <a class="btn btn-lg btn-wa" target="_blank" rel="noopener"
             href="https://wa.me/${esc(cfg.tienda.whatsapp)}?text=${encodeURIComponent(`Hola, me interesa: ${p.nombre} (${dinero(precioFinal(p))})`)}">${ico("chat", 20)} Consultar</a>
        </div>
        <div class="mini-perks">
          <div>${ico("shield", 18)} Garantía del fabricante</div>
          <div>${ico("truck", 18)} Envíos a todo el país</div>
          <div>${ico("card", 18)} Pago por transferencia</div>
        </div>
      </div>
    </div>`;

  const c = document.getElementById("cant");
  document.getElementById("menos").onclick = () => { cantidad = Math.max(1, cantidad - 1); c.textContent = cantidad; };
  document.getElementById("mas").onclick = () => { cantidad = Math.min(99, cantidad + 1); c.textContent = cantidad; };
  document.getElementById("add").onclick = (e) => {
    Carrito.agregar(p.id, cantidad);
    volarAlCarrito(document.querySelector(".prod-img img"));
    actualizarContador(true);
    toast("Agregado al carrito");
  };

  // Relacionados: misma categoría primero
  const rel = productos
    .filter((x) => x.id !== p.id)
    .sort((a, b) => (b.categoria === p.categoria) - (a.categoria === p.categoria) || Math.abs(precioFinal(a) - precioFinal(p)) - Math.abs(precioFinal(b) - precioFinal(p)))
    .slice(0, 4);
  document.getElementById("relacionados").innerHTML = rel.length
    ? `<div class="sec-head"><div><span class="eyebrow">Te puede interesar</span><h2>Productos relacionados</h2></div></div><div class="grid">${rel.map((x) => tarjeta(x)).join("")}</div>`
    : "";
})();
