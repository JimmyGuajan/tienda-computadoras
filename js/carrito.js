(async function () {
  const cfg = await montarLayout("");
  const productos = await cargarProductos();
  const $ = (id) => document.getElementById(id);
  let ultimo = null; // { doc, nombreArchivo, texto }

  $("vacio-ico").innerHTML = ico("bag", 54);
  $("modal-check").innerHTML = ico("check", 34);

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
          <span style="color:var(--muted);font-size:.88rem">${dinero(precioFinal(p))} c/u</span><br>
          <button class="rm" data-rm="${esc(p.id)}">${ico("trash", 15)} Quitar</button>
        </div>
        <div style="text-align:right">
          <div class="qty"><button data-m="${esc(p.id)}" aria-label="Menos">${ico("minus", 16)}</button><span>${n}</span><button data-p="${esc(p.id)}" aria-label="Más">${ico("plus", 16)}</button></div>
          <div style="margin-top:8px;font:700 1.1rem var(--font-d)">${dinero(precioFinal(p) * n)}</div>
        </div>
      </div>`
      )
      .join("");
    $("nprod").textContent = lineas.reduce((s, l) => s + l.n, 0);
    $("total").textContent = dinero(lineas.reduce((s, l) => s + precioFinal(l.p) * l.n, 0));
  }

  $("items").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const c = Carrito.leer();
    if (b.dataset.rm) Carrito.fijar(b.dataset.rm, 0);
    else if (b.dataset.m) Carrito.fijar(b.dataset.m, (c[b.dataset.m] || 1) - 1);
    else if (b.dataset.p) Carrito.fijar(b.dataset.p, (c[b.dataset.p] || 0) + 1);
    else return;
    pintar();
  });

  $("vaciar").onclick = () => {
    if (confirm("¿Vaciar el carrito?")) { Carrito.vaciar(); pintar(); }
  };

  let descargado = false;

  function marcarDescargado() {
    descargado = true;
    $("step1").classList.add("done");
    $("btn-pdf").textContent = "Descargar de nuevo";
  }

  function descargar() {
    if (!ultimo) return;
    ultimo.doc.save(ultimo.nombreArchivo);
    marcarDescargado();
  }

  // Muestra "Pedido generado" con los dos pasos: descargar PDF y enviar al WhatsApp de la tienda
  function abrirModal() {
    descargado = false;
    $("step1").classList.remove("done");
    $("btn-pdf").textContent = "Descargar PDF";
    $("modal-msg").textContent = `${ultimo.numero} · Total ${dinero(ultimo.total)}`;
    $("pdf-name").textContent = ultimo.nombreArchivo;
    $("wa-num").textContent = `Chat con ${cfg.tienda.nombre}: ${cfg.tienda.telefono}`;
    $("btn-wa").href = `https://wa.me/${cfg.tienda.whatsapp}?text=${encodeURIComponent(ultimo.texto)}`;
    // Compartir nativo: solo si se activó en js/settings.js y el dispositivo lo soporta
    const share = $("btn-share");
    share.hidden = true;
    if (AJUSTES.BOTON_COMPARTIR_PDF && navigator.canShare) {
      try {
        const archivo = new File([ultimo.doc.output("blob")], ultimo.nombreArchivo, { type: "application/pdf" });
        if (navigator.canShare({ files: [archivo] })) {
          share.hidden = false;
          share.onclick = () => navigator.share({ files: [archivo], title: `Pedido ${ultimo.numero}`, text: ultimo.texto }).then(marcarDescargado).catch(() => {});
        }
      } catch {}
    }
    $("modal").classList.add("on");
    confeti();
  }

  $("btn-pdf").onclick = descargar;
  // Si van a WhatsApp sin haber descargado el PDF, lo descargamos para que lo puedan adjuntar
  $("btn-wa").addEventListener("click", () => { if (!descargado) descargar(); });
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
    ultimo = {
      doc: pdf.doc,
      nombreArchivo: pdf.nombreArchivo,
      numero: pdf.numero,
      total: pdf.total,
      texto: textoWhatsApp({ ...datos, numero: pdf.numero, total: pdf.total }),
    };
    // Solo genera el PDF y muestra "Pedido generado"; el cliente decide descargar y enviar desde ahí
    abrirModal();
  };

  pintar();
})();
