(async function () {
  await montarLayout("asistente");
  const productos = (await cargarProductos()).filter((p) => p.categoria === "laptops" || p.categoria === "pcs");

  const PREGUNTAS = [
    {
      clave: "uso",
      texto: "¿Para qué vas a usar tu equipo principalmente?",
      opciones: [
        ["gaming", "🎮", "Jugar", "Fluidez y gráficos"],
        ["oficina", "💼", "Oficina", "Trabajo diario"],
        ["estudio", "📚", "Estudio", "Clases y tareas"],
        ["diseño", "🎨", "Diseño y video", "Edición y render"],
        ["programación", "💻", "Programación", "Compilar y multitarea"],
      ],
    },
    {
      clave: "presupuesto",
      texto: "¿Cuál es tu presupuesto aproximado?",
      opciones: [
        [500, "💵", "Hasta $500", "Lo esencial"],
        [1000, "💰", "Hasta $1000", "Equilibrio"],
        [1800, "💎", "Hasta $1800", "Alto rendimiento"],
        [99999, "🚀", "Sin límite", "Lo mejor disponible"],
      ],
    },
    {
      clave: "tipo",
      texto: "¿Qué tipo de equipo prefieres?",
      opciones: [
        ["portatil", "🎒", "Laptop", "Para moverme"],
        ["escritorio", "🖥️", "PC de escritorio", "Más potencia por el precio"],
        ["cualquiera", "🤷", "Me da igual", "Muéstrame lo mejor"],
      ],
    },
  ];

  const respuestas = {};
  let paso = 0;
  const quiz = document.getElementById("quiz");
  const res = document.getElementById("resultado");
  const MAX = 8;

  function pintar() {
    const q = PREGUNTAS[paso];
    quiz.innerHTML = `
      <div class="step-anim">
        <div class="progress"><div style="width:${(paso / PREGUNTAS.length) * 100}%"></div></div>
        <span class="eyebrow">Pregunta ${paso + 1} de ${PREGUNTAS.length}</span>
        <h2>${q.texto}</h2>
        <div class="opts">${q.opciones.map(([v, em, t, d]) => `<button class="opt" data-v="${v}"><span class="em">${em}</span><span>${t}<small>${d}</small></span></button>`).join("")}</div>
        ${paso > 0 ? '<button class="btn btn-ghost" id="atras" style="margin-top:20px">← Atrás</button>' : ""}
      </div>`;
    requestAnimationFrame(() => { const b = quiz.querySelector(".progress div"); if (b) b.style.width = ((paso + 0.4) / PREGUNTAS.length) * 100 + "%"; });
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
    if (respuestas.tipo === "cualquiera") s += 2;
    return s;
  }

  function resultado() {
    const dentro = productos.filter((p) => precioFinal(p) <= respuestas.presupuesto);
    const base = dentro.length ? dentro : productos;
    const top = base
      .map((p) => ({ p, s: puntuar(p) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4);

    quiz.innerHTML = `
      <div class="step-anim">
        <div class="progress"><div style="width:100%"></div></div>
        <span class="eyebrow">Resultado</span>
        <h2>${top.length ? "Tus mejores opciones" : "No encontramos coincidencias exactas"}</h2>
        <p class="sub" style="margin:-8px 0 20px">${
          dentro.length || !top.length
            ? "Según tus respuestas, estos equipos encajan mejor. El porcentaje indica qué tan bien coinciden."
            : "Nada entra exacto en tu presupuesto; estas son las opciones más cercanas."
        }</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-ghost" id="otra">Repetir el test</button>
          <a class="btn btn-ghost" href="catalogo.html">Ver todo el catálogo</a>
        </div>
      </div>`;
    res.innerHTML = `<div class="grid">${top.map((x) => tarjeta(x.p, { match: Math.max(40, Math.min(99, Math.round((x.s / MAX) * 100))) })).join("")}</div>`;
    document.getElementById("otra").onclick = () => { paso = 0; res.innerHTML = ""; pintar(); };
    confeti();
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  pintar();
})();
