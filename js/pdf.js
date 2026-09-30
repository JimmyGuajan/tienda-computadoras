/* Generación del PDF del pedido (jsPDF) y del texto para WhatsApp */

function numeroPedido() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `PED-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

function generarPDF({ cfg, lineas, cliente, nota }) {
  if (!window.jspdf) throw new Error("No se pudo cargar la librería de PDF. Revisa tu conexión.");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 15;
  const numero = numeroPedido();
  const total = lineas.reduce((s, l) => s + precioFinal(l.p) * l.n, 0);
  let y = 0;

  const nuevaPagina = () => { doc.addPage(); y = 20; };
  const asegurar = (alto) => { if (y + alto > 280) nuevaPagina(); };

  // Encabezado
  doc.setFillColor(28, 21, 0);
  doc.rect(0, 0, W, 34, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold").setFontSize(20).text(cfg.tienda.nombre, M, 16);
  doc.setFont("helvetica", "normal").setFontSize(10).text(cfg.tienda.eslogan, M, 23);
  doc.setFontSize(10).text(`Pedido ${numero}`, W - M, 16, { align: "right" });
  doc.text(new Date().toLocaleDateString("es-EC"), W - M, 23, { align: "right" });
  y = 46;

  // Cliente
  doc.setTextColor(30).setFont("helvetica", "bold").setFontSize(12).text("Datos del cliente", M, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(10.5);
  doc.text(`Nombre: ${cliente.nombre}`, M, y); y += 6;
  doc.text(`Telefono: ${cliente.tel}`, M, y); y += 6;
  if (nota) {
    const nl = doc.splitTextToSize(`Nota: ${nota}`, W - 2 * M);
    doc.text(nl, M, y); y += nl.length * 5.5;
  }
  y += 6;

  // Tabla
  const col = { prod: M + 2, cant: 128, unit: 155, sub: W - M - 2 };
  const cabecera = () => {
    doc.setFillColor(255, 196, 0).rect(M, y - 5, W - 2 * M, 8, "F");
    doc.setTextColor(28, 21, 0).setFont("helvetica", "bold").setFontSize(10);
    doc.text("Producto", col.prod, y);
    doc.text("Cant.", col.cant, y, { align: "center" });
    doc.text("P. unit.", col.unit, y, { align: "right" });
    doc.text("Subtotal", col.sub, y, { align: "right" });
    y += 8;
  };
  cabecera();
  doc.setTextColor(30).setFont("helvetica", "normal").setFontSize(10);
  lineas.forEach(({ p, n }, i) => {
    const nombre = doc.splitTextToSize(p.nombre, 100);
    const alto = Math.max(nombre.length * 5, 6) + 2;
    if (y + alto > 275) { nuevaPagina(); cabecera(); doc.setTextColor(30).setFont("helvetica", "normal").setFontSize(10); }
    if (i % 2 === 0) { doc.setFillColor(255, 248, 222).rect(M, y - 4.5, W - 2 * M, alto, "F"); }
    doc.text(nombre, col.prod, y);
    doc.text(String(n), col.cant, y, { align: "center" });
    doc.text(dinero(precioFinal(p)), col.unit, y, { align: "right" });
    doc.text(dinero(precioFinal(p) * n), col.sub, y, { align: "right" });
    y += alto;
  });

  asegurar(16);
  doc.setDrawColor(200).line(M, y, W - M, y);
  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text("TOTAL", col.unit - 25, y);
  doc.text(dinero(total), col.sub, y, { align: "right" });
  y += 14;

  // Cuentas
  asegurar(20 + cfg.bancos.length * 26);
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(30).text("Datos para transferencia o deposito", M, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(10);
  cfg.bancos.forEach((b) => {
    asegurar(26);
    doc.setFont("helvetica", "bold").text(b.banco, M, y); y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`${b.tipoCuenta} - Cuenta: ${b.numeroCuenta}`, M, y); y += 5;
    doc.text(`Titular: ${b.titular} - CI/RUC: ${b.identificacion}`, M, y); y += 8;
  });

  asegurar(18);
  doc.setFontSize(9).setTextColor(110);
  const pie = doc.splitTextToSize(
    `Envia este PDF junto con tu comprobante de pago por WhatsApp (${cfg.tienda.telefono}). El pedido se confirma al validar el pago. Precios y disponibilidad sujetos a confirmacion.`,
    W - 2 * M
  );
  doc.text(pie, M, y + 2);

  return { doc, numero, total, nombreArchivo: `${numero}.pdf` };
}

function textoWhatsApp({ cfg, lineas, cliente, nota, numero, total }) {
  const items = lineas.map(({ p, n }) => `- ${n} x ${p.nombre} (${dinero(precioFinal(p) * n)})`).join("\n");
  return (
    `Hola ${cfg.tienda.nombre}, quiero hacer este pedido (${numero}):\n\n${items}\n\n` +
    `Total: ${dinero(total)}\nNombre: ${cliente.nombre}\nTelefono: ${cliente.tel}` +
    (nota ? `\nNota: ${nota}` : "") +
    `\n\nAdjunto el PDF del pedido.`
  );
}
