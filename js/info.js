(async function () {
  const cfg = await montarLayout("info");
  const t = cfg.tienda;

  const cajas = [
    ["chat", "WhatsApp", `<a href="https://wa.me/${esc(t.whatsapp)}" target="_blank" rel="noopener">${esc(t.telefono)}</a>`],
    ["mail", "Correo", `<a href="mailto:${esc(t.correo)}">${esc(t.correo)}</a>`],
    ["pin", "Dirección", esc(t.direccion)],
    ["clock", "Horario", esc(t.horario)],
  ];
  const redes = Object.entries(t.redes || {}).filter(([, url]) => url);
  if (redes.length) {
    cajas.push(["sparkles", "Redes", redes.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" style="text-transform:capitalize;margin-right:12px">${esc(n)}</a>`).join("")]);
  }
  document.getElementById("contactos").innerHTML = cajas
    .map(([i, h, c]) => `<div class="info-box reveal"><div class="ti">${ico(i, 20)}</div><h3>${h}</h3><p>${c}</p></div>`)
    .join("");

  if (t.mapa) document.getElementById("mapa").innerHTML = `<iframe class="map" src="${esc(t.mapa)}" loading="lazy" title="Mapa"></iframe>`;

  const slug = (n) => (/pichincha/i.test(n) ? "pichincha" : /guayaquil/i.test(n) ? "guayaquil" : /produbanco/i.test(n) ? "produbanco" : "otro");
  document.getElementById("bancos").innerHTML = cfg.bancos
    .map(
      (b) => `
    <div class="bank reveal" data-bank="${slug(b.banco)}">
      <div class="bank-top"><h3>${esc(b.banco)}</h3><span class="chip-card"></span></div>
      <div class="bank-num"><small>${esc(b.tipoCuenta)} · N.º de cuenta</small>${esc(b.numeroCuenta)}</div>
      <dl>
        <dt>Titular</dt><dd>${esc(b.titular)}</dd>
        <dt>CI / RUC</dt><dd>${esc(b.identificacion)}</dd>
        <dt>Correo</dt><dd>${esc(b.correo)}</dd>
      </dl>
      <button class="btn btn-ghost" data-copiar="${esc(b.numeroCuenta)}">${ico("copy", 17)} Copiar n.º de cuenta</button>
      <div class="qr"><img src="${esc(b.qr)}" alt="QR ${esc(b.banco)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'QR pendiente: sube ${esc(b.qr)}'}))"></div>
    </div>`
    )
    .join("");

  document.getElementById("bancos").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copiar]");
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copiar);
      toast("Número de cuenta copiado");
    } catch {
      toast("No se pudo copiar: " + btn.dataset.copiar);
    }
  });

  document.getElementById("faqs").innerHTML = cfg.faq
    .map((f) => `<details class="reveal"><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`)
    .join("");

  // Si llegan con #pagos o #faq, desplazar tras renderizar
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
})();
