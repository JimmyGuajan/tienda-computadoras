(async function () {
  const cfg = await montarLayout("info");
  const t = cfg.tienda;

  const cajas = [
    ["WhatsApp", `<a href="https://wa.me/${esc(t.whatsapp)}" target="_blank" rel="noopener">${esc(t.telefono)}</a>`],
    ["Correo", `<a href="mailto:${esc(t.correo)}">${esc(t.correo)}</a>`],
    ["Dirección", esc(t.direccion)],
    ["Horario", esc(t.horario)],
  ];
  const redes = Object.entries(t.redes || {}).filter(([, url]) => url);
  if (redes.length) {
    cajas.push(["Redes", redes.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" style="text-transform:capitalize;margin-right:10px">${esc(n)}</a>`).join("")]);
  }
  document.getElementById("contactos").innerHTML = cajas
    .map(([h, c]) => `<div class="info-box"><h3>${h}</h3><p>${c}</p></div>`)
    .join("");

  if (t.mapa) document.getElementById("mapa").innerHTML = `<iframe class="map" src="${esc(t.mapa)}" loading="lazy" title="Mapa"></iframe>`;

  document.getElementById("bancos").innerHTML = cfg.bancos
    .map(
      (b, i) => `
    <div class="bank">
      <h3>${esc(b.banco)}</h3>
      <dl>
        <dt>Tipo de cuenta</dt><dd>${esc(b.tipoCuenta)}</dd>
        <dt>N.º de cuenta</dt><dd><b>${esc(b.numeroCuenta)}</b></dd>
        <dt>Titular</dt><dd>${esc(b.titular)}</dd>
        <dt>CI / RUC</dt><dd>${esc(b.identificacion)}</dd>
        <dt>Correo</dt><dd>${esc(b.correo)}</dd>
      </dl>
      <button class="btn btn-ghost" data-copiar="${esc(b.numeroCuenta)}">Copiar n.º de cuenta</button>
      <div class="qr"><img src="${esc(b.qr)}" alt="QR ${esc(b.banco)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'QR pendiente: sube ${esc(b.qr)}'}))"></div>
    </div>`
    )
    .join("");

  document.getElementById("bancos").addEventListener("click", async (e) => {
    const n = e.target.dataset.copiar;
    if (!n) return;
    try {
      await navigator.clipboard.writeText(n);
      toast("Número de cuenta copiado");
    } catch {
      toast("No se pudo copiar: " + n);
    }
  });

  document.getElementById("faqs").innerHTML = cfg.faq
    .map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`)
    .join("");
})();
