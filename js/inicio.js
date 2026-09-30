(async function () {
  const $ = (id) => document.getElementById(id);
  $("destacados").innerHTML = skeletons(4);
  $("ofertas").innerHTML = skeletons(4);

  await montarLayout("inicio");
  const productos = await cargarProductos();

  // Iconos de las promociones
  $("ic-a1").innerHTML = ico("arrow", 16);
  $("ic-a2").innerHTML = ico("arrow", 16);
  $("ic-p1").innerHTML = ico("zap", 130);
  $("ic-p2").innerHTML = ico("sparkles", 130);

  // Promo de ofertas con el mayor descuento real
  const ofertas = productos.filter(enOferta);
  if (ofertas.length) {
    const max = Math.max(...ofertas.map((p) => Math.round((1 - p.precioOferta / p.precio) * 100)));
    $("promo-of").textContent = `Hasta -${max}% de descuento`;
  }

  // Beneficios
  const perks = [
    ["shield", "Garantía", "Respaldo del fabricante en todos los equipos."],
    ["truck", "Envíos", "A todo el país, coordinados contigo."],
    ["headset", "Asesoría", "Te ayudamos a elegir por WhatsApp."],
    ["card", "Pago simple", "Transferencia o depósito con QR."],
  ];
  $("perks").innerHTML = perks.map(([i, t, d]) => `<div class="perk reveal"><div class="ti">${ico(i, 22)}</div><div><h4>${t}</h4><p>${d}</p></div></div>`).join("");

  // Categorías
  const conteo = {};
  productos.forEach((p) => (conteo[p.categoria] = (conteo[p.categoria] || 0) + 1));
  $("cats").innerHTML = Object.keys(CATEGORIAS).filter((k) => conteo[k]).map((k) => `
    <a class="catcard reveal" href="catalogo.html?cat=${k}">
      <span class="ti">${ico(CAT_ICON[k], 28)}</span>
      <b>${CATEGORIAS[k]}</b>
      <small>${conteo[k]} producto${conteo[k] === 1 ? "" : "s"}</small>
    </a>`).join("");

  $("ofertas").innerHTML = ofertas.slice(0, 4).map((p) => tarjeta(p)).join("") || '<p class="vacio">Sin ofertas por ahora.</p>';
  $("destacados").innerHTML = productos.filter((p) => p.destacado).slice(0, 8).map((p) => tarjeta(p)).join("") || '<p class="vacio">Sin productos destacados.</p>';

  // Tecnologías y marcas
  const marcas = new Set(productos.map((p) => p.marca));
  const tags = ["Intel Core", "AMD Ryzen", "NVIDIA RTX", "DDR5", "NVMe Gen4", "OLED", "Wi-Fi 6E", "Thunderbolt", ...marcas];
  const fila = tags.map((t) => `<span>${esc(t)}</span>`).join("");
  $("marquee").innerHTML = fila + fila;

  const pasos = [
    ["search", "Explora", "Usa el catálogo, los filtros o el asistente para encontrar tu equipo."],
    ["cart", "Arma tu pedido", "Agrega productos al carrito y ajusta las cantidades."],
    ["file", "Genera tu PDF", "Ingresa tu nombre y teléfono; creamos el resumen al instante."],
    ["chat", "Envíalo por WhatsApp", "Confirmamos disponibilidad y te pasamos los datos para el pago."],
  ];
  $("steps").innerHTML = pasos.map(([i, t, d]) => `<div class="step reveal"><div class="ti">${ico(i, 24)}</div><h3>${t}</h3><p>${d}</p></div>`).join("");
})();
