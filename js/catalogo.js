(async function () {
  await montarLayout("catalogo");
  const productos = await cargarProductos();
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  const unicos = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "es"));
  const opciones = (vals, todos) =>
    `<option value="">${todos}</option>` + vals.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join("");

  $("cat").innerHTML = opciones(
    Object.entries(CATEGORIAS).filter(([k]) => productos.some((p) => p.categoria === k)),
    "Todas"
  );
  $("marca").innerHTML = opciones(unicos(productos.map((p) => p.marca)).map((m) => [m, m]), "Todas");
  $("uso").innerHTML = opciones(unicos(productos.flatMap((p) => p.uso || [])).map((u) => [u, u[0].toUpperCase() + u.slice(1)]), "Todos");

  const tope = Math.ceil(Math.max(...productos.map(precioFinal)) / 10) * 10;
  $("max").min = 0;
  $("max").max = tope;
  $("max").value = tope;

  if (params.get("cat")) $("cat").value = params.get("cat");
  if (params.get("oferta")) $("oferta").checked = true;
  if (params.get("q")) $("q").value = params.get("q");

  function aplicar() {
    const q = $("q").value.trim().toLowerCase();
    const max = +$("max").value;
    $("maxv").textContent = dinero(max);
    let lista = productos.filter((p) => {
      if ($("cat").value && p.categoria !== $("cat").value) return false;
      if ($("marca").value && p.marca !== $("marca").value) return false;
      if ($("uso").value && !(p.uso || []).includes($("uso").value)) return false;
      if ($("oferta").checked && !(p.precioOferta && p.precioOferta < p.precio)) return false;
      if (precioFinal(p) > max) return false;
      if (q) {
        const texto = [p.nombre, p.marca, p.descripcion, ...Object.values(p.specs || {})].join(" ").toLowerCase();
        if (!q.split(/\s+/).every((w) => texto.includes(w))) return false;
      }
      return true;
    });
    const o = $("orden").value;
    if (o === "asc") lista.sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (o === "desc") lista.sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (o === "az") lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    $("n").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    $("lista").innerHTML = lista.length ? lista.map(tarjeta).join("") : '<p class="vacio">No hay productos con esos filtros.</p>';
  }

  ["q", "cat", "marca", "uso", "max", "oferta", "orden"].forEach((id) => $(id).addEventListener("input", aplicar));
  $("limpiar").onclick = () => {
    $("q").value = "";
    ["cat", "marca", "uso", "orden"].forEach((id) => ($(id).value = ""));
    $("max").value = tope;
    $("oferta").checked = false;
    aplicar();
  };
  aplicar();
})();
