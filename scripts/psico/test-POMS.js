document.addEventListener("DOMContentLoaded", () => {
  const preguntas = [
  { texto: "Tenso(a)", categoria: "Tensión" },
  { texto: "Inestable", categoria: "Tensión" },
  { texto: "Con los pelos de punta", categoria: "Tensión" },
  { texto: "Asustado(a)", categoria: "Tensión" },
  { texto: "Intranquilo(a)", categoria: "Tensión" },
  { texto: "Inquieto(a)", categoria: "Tensión" },
  { texto: "Nervioso(a)", categoria: "Tensión" },

  { texto: "Desesperado(a)", categoria: "Depresión" },
  { texto: "Miserable", categoria: "Depresión" },
  { texto: "Triste", categoria: "Depresión" },
  { texto: "Melancólico(a)", categoria: "Depresión" },
  { texto: "Infeliz", categoria: "Depresión" },
  { texto: "Solo(a)", categoria: "Depresión" },
  { texto: "Inútil", categoria: "Depresión" },

  { texto: "Animado(a)", categoria: "Vigor" },
  { texto: "Activo(a)", categoria: "Vigor" },
  { texto: "Energético(a)", categoria: "Vigor" },
  { texto: "Lleno(a) de dinamismo", categoria: "Vigor" },
  { texto: "Vigoroso(a)", categoria: "Vigor" },
  { texto: "Con buena disposición", categoria: "Vigor" },
  { texto: "De buen humor", categoria: "Vigor" },
  { texto: "Alerta", categoria: "Vigor" },

  { texto: "Fatigado(a)", categoria: "Fatiga" },
  { texto: "Exhausto(a)", categoria: "Fatiga" },
  { texto: "Perezoso(a)", categoria: "Fatiga" },
  { texto: "Abatido(a)", categoria: "Fatiga" },
];


  const categorias = ["Nada", "Poco", "Moderado", "Bastante", "Muchísimo"];
  const form = document.getElementById("form-poms");
  const tbody = document.getElementById("poms-items");

  // Renderizar preguntas
  preguntas.forEach((p, i) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = `${i + 1}. ${p.texto}`;
    tr.appendChild(th);

    categorias.forEach((opcion, valor) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `pregunta-${i}`;
      input.value = valor;
      td.appendChild(input);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // version mobile de la tabla
    // Detectar si es mobile
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    const mobileContainer = document.createElement("div");
    mobileContainer.id = "poms-items-mobile";

    preguntas.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "poms-card";

      const title = document.createElement("h4");
      title.textContent = `${i + 1}. ${p.texto}`;
      card.appendChild(title);

      const options = document.createElement("div");
      options.className = "poms-options";

      categorias.forEach((cat, val) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `pregunta-${i}`;
        input.value = val;
        label.appendChild(input);
        label.appendChild(document.createTextNode(cat));
        options.appendChild(label);
      });

      card.appendChild(options);
      mobileContainer.appendChild(card);
    });

    // Insertar antes del <br> si existe
    const br = form.querySelector("br");
    form.insertBefore(mobileContainer, br);
  }


  // Evento de envío
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const puntajes = {
      Tensión: 0,
      Depresión: 0,
      Vigor: 0,
      Fatiga: 0,
    };

    for (let i = 0; i < preguntas.length; i++) {
      const seleccion = document.querySelector(`input[name="pregunta-${i}"]:checked`);
      if (!seleccion) {
        alert("⚠️ Debes completar todas las preguntas.");
        return;
      }
      const valor = parseInt(seleccion.value);
      const categoria = preguntas[i].categoria;
      puntajes[categoria] += valor;
    }

    mostrarGrafico(puntajes);
  });

  // Mostrar gráfico de barras
  function mostrarGrafico(puntajes) {
    const ctx = document.getElementById("pomsChart").getContext("2d");

    const ideal = {
      Tensión: 4,
      Depresión: 4,
      Vigor: 32,
      Fatiga: 4,
    };

    if (window.pomsChart instanceof Chart) {
      window.pomsChart.destroy();
    }

    window.pomsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(puntajes),
        datasets: [
          {
            label: "Tu estado actual",
            data: Object.values(puntajes),
            backgroundColor: "rgba(99, 102, 241, 0.7)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
          {
            label: "Estado ideal",
            data: Object.keys(ideal).map((k) => ideal[k]),
            backgroundColor: "rgba(236, 72, 153, 0.6)",
            borderColor: "rgba(236, 72, 153, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            ticks: { stepSize: 5 },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }

  // Reiniciar el formulario
  document.getElementById("reiniciar-btn").addEventListener("click", () => {
    document.querySelectorAll("input[type=radio]").forEach(input => {
      input.checked = false;
    });

    if (window.pomsChart instanceof Chart) {
      window.pomsChart.destroy();
      window.pomsChart = null;
    }

    const canvas = document.getElementById("pomsChart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});

