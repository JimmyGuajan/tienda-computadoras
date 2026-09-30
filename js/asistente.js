(async function () {
  await montarLayout("asistente");
  const productos = (await cargarProductos()).filter((p) => p.categoria === "laptops" || p.categoria === "pcs");

  const PREGUNTAS = [
    {
      clave: "uso",
      texto: "¿Para qué vas a usar tu equipo principalmente?",
      opciones: [
        ["gaming", "🎮 Jugar"],
        ["oficina", "💼 Oficina y trabajo diario"],
        ["estudio", "📚 Estudio y clases"],
        ["diseño", "🎨 Diseño y edición de video"],
        ["programación", "💻 Programación"],
      ],
    },
    {
      clave: "presupuesto",
      texto: "¿Cuál es tu presupuesto aproximado?",
      opciones: [
        [500, "Hasta $500"],
        [1000, "Hasta $1000"],
        [1800, "Hasta $1800"],
        [99999, "Sin límite"],
      ],
    },
    {
      clave: "tipo",
      texto: "¿Qué tipo de equipo prefieres?",
      opciones: [
        ["portatil", "Laptop (para moverme)"],
        ["escritorio", "PC de escritorio (más potencia por el precio)"],
        ["cualquiera", "Me da igual"],
      ],
    },
  ];

  const respuestas = {};
  let paso = 0;
  const quiz = document.getElementById("quiz");
  const res = document.getElementById("resultado");

  function pintar() {
    const q = PREGUNTAS[paso];
    quiz.innerHTML = `
      <div class="progress"><div style="width:${(paso / PREGUNTAS.length) * 100}%"></div></div>
      <small style="color:var(--muted)">Pregunta ${paso + 1} de ${PREGUNTAS.length}</small>
      <h2>${q.texto}</h2>
      <div class="opts">${q.opciones.map(([v, t]) => `<button class="opt" data-v="${v}">${t}</button>`).join("")}</div>
      ${paso > 0 ? '<button class="btn btn-ghost" id="atras" style="margin-top:16px">← Atrás</button>' : ""}`;
    quiz.querySelectorAll(".opt").forEach((b) =>
      b.addEventListener("click", () => {
        const v = b.dataset.v;
        respuestas[q.clave] = q.clave === "presupuesto" ? +v : v;
        paso++;
        paso < PREGUNTAS.length ? pintar() : resultado();
      })
    );
    const atras = document.getElementById("atras");
    if (atras) atras.onclick = () => { paso--; pintar(); };
  }

  function puntuar(p) {
    let s = 0;
    if ((p.uso || []).includes(respuestas.uso)) s += 3;
    if (precioFinal(p) <= respuestas.presupuesto) s += 3;
    else s -= Math.min(3, (precioFinal(p) - respuestas.presupuesto) / 300);
    if (respuestas.tipo === "portatil" && p.portatil) s += 2;
    if (respuestas.tipo === "escritorio" && !p.portatil) s += 2;
    return s;
  }

  function resultado() {
    const dentro = productos.filter((p) => precioFinal(p) <= respuestas.presupuesto);
    const base = dentro.length ? dentro : productos;
    const top = base
      .map((p) => ({ p, s: puntuar(p) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((x) => x.p);

    quiz.innerHTML = `
      <div class="progress"><div style="width:100%"></div></div>
      <h2>${top.length ? "Tus mejores opciones" : "No encontramos coincidencias exactas"}</h2>
      <p style="color:var(--muted)">${
        dentro.length || !top.length
          ? "Según tus respuestas, estos equipos encajan mejor."
          : "Nada entra exacto en tu presupuesto; estas son las opciones más cercanas."
      }</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-ghost" id="otra">Repetir el test</button>
        <a class="btn btn-ghost" href="catalogo.html">Ver todo el catálogo</a>
      </div>`;
    res.innerHTML = `<div class="grid">${top.map(tarjeta).join("")}</div>`;
    document.getElementById("otra").onclick = () => { paso = 0; res.innerHTML = ""; pintar(); };
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  pintar();
})();
