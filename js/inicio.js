(async function () {
  await montarLayout("inicio");
  const productos = await cargarProductos();

  const conteo = {};
  productos.forEach((p) => (conteo[p.categoria] = (conteo[p.categoria] || 0) + 1));
  document.getElementById("cats").innerHTML = Object.entries(CATEGORIAS)
    .filter(([k]) => conteo[k])
    .map(([k, n]) => `<a class="cat" href="catalogo.html?cat=${k}">${n}<small>${conteo[k]} productos</small></a>`)
    .join("");

  document.getElementById("destacados").innerHTML =
    productos.filter((p) => p.destacado).slice(0, 8).map(tarjeta).join("") || '<p class="vacio">Sin productos destacados.</p>';
  document.getElementById("ofertas").innerHTML =
    productos.filter((p) => p.precioOferta && p.precioOferta < p.precio).slice(0, 4).map(tarjeta).join("") ||
    '<p class="vacio">Sin ofertas por ahora.</p>';
})();
