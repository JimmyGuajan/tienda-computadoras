(async function () {
  const $ = (id) => document.getElementById(id);
  $("destacados").innerHTML = skeletons(4);
  $("ofertas").innerHTML = skeletons(4);

  await montarLayout("inicio");
  const productos = await cargarProductos();

  // Confianza + estadísticas reales a partir de los datos
  $("t1").innerHTML = ico("shield", 18) + "Garantía del fabricante";
  $("t2").innerHTML = ico("truck", 18) + "Envíos a todo el país";
  $("t3").innerHTML = ico("card", 18) + "Pago por transferencia";
  const cats = new Set(productos.map((p) => p.categoria)), marcas = new Set(productos.map((p) => p.marca));
  [["s-prod", productos.length, "+"], ["s-cat", cats.size, ""], ["s-mar", marcas.size, ""]].forEach(([id, n, suf]) => {
    const el = $(id); el.dataset.count = n; el.dataset.suffix = suf; contar(el);
  });

  // Marquee con tecnologías y marcas del catálogo
  const tags = ["Intel Core", "AMD Ryzen", "NVIDIA RTX", "DDR5", "NVMe Gen4", "OLED", "Wi-Fi 6E", "Thunderbolt", ...marcas];
  const fila = tags.map((t) => `<span>${esc(t)}</span>`).join("");
  $("marquee").innerHTML = fila + fila;

  // Bento de categorías
  const conteo = {};
  productos.forEach((p) => (conteo[p.categoria] = (conteo[p.categoria] || 0) + 1));
  const orden = Object.keys(CATEGORIAS).filter((k) => conteo[k]);
  $("cats").innerHTML = orden.map((k, i) => `
    <a class="tile reveal ${i === 0 ? "big" : orden.length === 6 && i <= 3 ? "wide" : ""}" href="catalogo.html?cat=${k}">
      <span class="ti">${ico(CAT_ICON[k], i === 0 ? 30 : 24)}</span>
      <span class="go">${ico("arrow", 20)}</span>
      <div><h3>${CATEGORIAS[k]}</h3><small>${conteo[k]} producto${conteo[k] === 1 ? "" : "s"}</small></div>
    </a>`).join("");

  $("destacados").innerHTML = productos.filter((p) => p.destacado).slice(0, 8).map((p) => tarjeta(p)).join("") || '<p class="vacio">Sin productos destacados.</p>';
  $("ofertas").innerHTML = productos.filter(enOferta).slice(0, 4).map((p) => tarjeta(p)).join("") || '<p class="vacio">Sin ofertas por ahora.</p>';

  const pasos = [
    ["search", "Explora", "Usa el catálogo, los filtros o el asistente para encontrar tu equipo."],
    ["cart", "Arma tu pedido", "Agrega productos al carrito y ajusta las cantidades."],
    ["file", "Descarga tu PDF", "Ingresa tu nombre y teléfono; generamos el resumen al instante."],
    ["chat", "Envíalo por WhatsApp", "Confirmamos disponibilidad y te pasamos los datos para el pago."],
  ];
  $("steps").innerHTML = pasos.map(([i, t, d]) => `<div class="step reveal"><div class="ti">${ico(i, 24)}</div><h3>${t}</h3><p>${d}</p></div>`).join("");

  const perks = [
    ["shield", "Garantía", "Respaldo del fabricante en todos los equipos."],
    ["truck", "Envíos", "A todo el país, coordinados contigo."],
    ["headset", "Asesoría", "Te ayudamos a elegir por WhatsApp."],
    ["card", "Pago simple", "Transferencia o depósito con QR."],
  ];
  $("perks").innerHTML = perks.map(([i, t, d]) => `<div class="perk reveal"><div class="ti">${ico(i, 22)}</div><div><h4>${t}</h4><p>${d}</p></div></div>`).join("");
})();
