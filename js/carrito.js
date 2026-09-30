(async function () {
  const cfg = await montarLayout("");
  const productos = await cargarProductos();
  const $ = (id) => document.getElementById(id);
  let ultimo = null; // { doc, nombreArchivo, texto }

  function lineasActuales() {
    const c = Carrito.leer();
    return Object.entries(c)
      .map(([id, n]) => ({ p: productos.find((x) => x.id === id), n }))
      .filter((l) => l.p);
  }

  function pintar() {
    const lineas = lineasActuales();
    $("vacio").hidden = lineas.length > 0;
    $("contenido").hidden = lineas.length === 0;
    if (!lineas.length) return;

    $("items").innerHTML = lineas
      .map(
        ({ p, n }) => `
      <div class="item">
        ${imgTag(p)}
        <div>
          <h4><a href="producto.html?id=${encodeURIComponent(p.id)}">${esc(p.nombre)}</a></h4>
          <span style="color:var(--muted)">${dinero(precioFinal(p))} c/u</span><br>
          <button class="rm" data-rm="${esc(p.id)}">Quitar</button>
        </div>
        <div style="text-align:right">
          <div class="qty"><button data-m="${esc(p.id)}" aria-label="Menos">−</button><span>${n}</span><button data-p="${esc(p.id)}" aria-label="Más">+</button></div>
          <div style="margin-top:6px;font-weight:700">${dinero(precioFinal(p) * n)}</div>
        </div>
      </div>`
      )
      .join("");
    $("nprod").textContent = lineas.reduce((s, l) => s + l.n, 0);
    $("total").textContent = dinero(lineas.reduce((s, l) => s + precioFinal(l.p) * l.n, 0));
  }

  $("items").addEventListener("click", (e) => {
    const t = e.target;
    const c = Carrito.leer();
    if (t.dataset.rm) Carrito.fijar(t.dataset.rm, 0);
    else if (t.dataset.m) Carrito.fijar(t.dataset.m, (c[t.dataset.m] || 1) - 1);
    else if (t.dataset.p) Carrito.fijar(t.dataset.p, (c[t.dataset.p] || 0) + 1);
    else return;
    pintar();
  });

  $("vaciar").onclick = () => {
    if (confirm("¿Vaciar el carrito?")) { Carrito.vaciar(); pintar(); }
  };

  function abrirModal(msg) {
    $("modal-msg").textContent = msg;
    $("btn-wa").href = `https://wa.me/${cfg.tienda.whatsapp}?text=${encodeURIComponent(ultimo.texto)}`;
    $("modal").classList.add("on");
  }

  $("btn-pdf").onclick = () => ultimo && ultimo.doc.save(ultimo.nombreArchivo);
  $("btn-cerrar").onclick = () => $("modal").classList.remove("on");

  $("finalizar").onclick = async () => {
    const nombre = $("nombre").value.trim();
    const tel = $("tel").value.trim();
    if (nombre.length < 3) { toast("Escribe tu nombre"); $("nombre").focus(); return; }
    if (tel.replace(/\D/g, "").length < 7) { toast("Escribe un teléfono válido"); $("tel").focus(); return; }

    const lineas = lineasActuales();
    if (!lineas.length) return;
    const datos = { cfg, lineas, cliente: { nombre, tel }, nota: $("nota").value.trim() };

    let pdf;
    try {
      pdf = generarPDF(datos);
    } catch (err) {
      alert(err.message);
      return;
    }
    ultimo = { doc: pdf.doc, nombreArchivo: pdf.nombreArchivo, texto: textoWhatsApp({ ...datos, numero: pdf.numero, total: pdf.total }) };

    /* OPCIÓN 1: compartir nativo (se activa en js/settings.js) */
    if (AJUSTES.COMPARTIR_PDF_NATIVO) {
      try {
        const archivo = new File([pdf.doc.output("blob")], pdf.nombreArchivo, { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
          await navigator.share({ files: [archivo], title: `Pedido ${pdf.numero}`, text: ultimo.texto });
          abrirModal("Elige WhatsApp en el menú de compartir para enviarnos el PDF. Si no lo enviaste, puedes hacerlo desde aquí.");
          return;
        }
      } catch (err) {
        if (err && err.name === "AbortError") return; // el usuario canceló
        // cualquier otro fallo: seguimos con la opción 2
      }
    }

    /* OPCIÓN 2: descargar el PDF y abrir WhatsApp con el resumen */
    pdf.doc.save(pdf.nombreArchivo);
    abrirModal("Se descargó tu PDF. Pulsa \"Abrir WhatsApp\" y adjunta el archivo descargado (" + pdf.nombreArchivo + ") junto con tu comprobante de pago.");
  };

  pintar();
})();
