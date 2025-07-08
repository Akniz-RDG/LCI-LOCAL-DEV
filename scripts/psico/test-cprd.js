document.addEventListener("DOMContentLoaded", () => {
  const preguntas = [
    { texto: "Mantengo la calma en situaciones de presión.", categoria: "Control del Estrés" },
    { texto: "Controlo mis emociones cuando fallo.", categoria: "Control del Estrés" },
    { texto: "Me afecta mucho que me evalúen durante el juego.", categoria: "Evaluación del Rendimiento" },
    { texto: "Me siento inseguro cuando otros observan mi desempeño.", categoria: "Evaluación del Rendimiento" },
    { texto: "Visualizo jugadas antes de ejecutarlas.", categoria: "Habilidades Mentales" },
    { texto: "Uso rutinas mentales para mantenerme concentrado.", categoria: "Habilidades Mentales" },
    { texto: "Me siento parte importante de mi equipo.", categoria: "Cohesión de Equipo" },
    { texto: "Confío en mis compañeros durante la partida.", categoria: "Cohesión de Equipo" },
    { texto: "Tengo claro por qué compito o entreno.", categoria: "Motivación" },
    { texto: "Me esfuerzo incluso cuando no tengo ganas.", categoria: "Motivación" },
  ];

  const form = document.getElementById("form-cprd");
  const tbody = document.getElementById("cprd-items");

  const escala = [1, 2, 3, 4, 5];

  preguntas.forEach((p, i) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = `${i + 1}. ${p.texto}`;
    tr.appendChild(th);

    escala.forEach((valor) => {
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const puntajes = {};

    for (let i = 0; i < preguntas.length; i++) {
      const seleccion = document.querySelector(`input[name="pregunta-${i}"]:checked`);
      if (!seleccion) {
        alert("⚠️ Por favor, responde todas las preguntas.");
        return;
      }

      const valor = parseInt(seleccion.value);
      const categoria = preguntas[i].categoria;
      if (!puntajes[categoria]) puntajes[categoria] = 0;
      puntajes[categoria] += valor;
    }

    const resultado = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      puntajes
    };

    guardarResultado(resultado);
    mostrarGrafico(puntajes);
    mostrarHistorial();
  });

  function guardarResultado(resultado) {
    const historial = JSON.parse(localStorage.getItem("historialCPRD")) || [];
    historial.push(resultado);
    localStorage.setItem("historialCPRD", JSON.stringify(historial));
  }

  function mostrarHistorial() {
    const contenedor = document.getElementById("historial-cprd");
    if (!contenedor) return;

    const historial = JSON.parse(localStorage.getItem("historialCPRD")) || [];
    contenedor.innerHTML = "";

    if (historial.length === 0) {
      contenedor.innerHTML = "<p>No hay registros aún.</p>";
      return;
    }

    historial.reverse().forEach((registro) => {
      const div = document.createElement("div");
      div.className = "smart-actividad";

      const detalle = Object.entries(registro.puntajes)
        .map(([cat, val]) => `<li>${cat}: ${val}</li>`).join("");

      div.innerHTML = `
        <p><strong>📅 Fecha:</strong> ${registro.fecha}</p>
        <ul>${detalle}</ul>
      `;

      contenedor.appendChild(div);
    });
  }

  function mostrarGrafico(puntajes) {
    const ctx = document.getElementById("cprdChart").getContext("2d");
    if (window.cprdChart instanceof Chart) {
      window.cprdChart.destroy();
    }

    window.cprdChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(puntajes),
        datasets: [{
          label: "Tu puntaje por recurso",
          data: Object.values(puntajes),
          backgroundColor: "rgba(102, 255, 204, 0.6)",
          borderColor: "rgba(102, 255, 204, 1)",
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 10,
            ticks: { stepSize: 2 }
          }
        },
        plugins: {
          legend: {
            labels: { color: "#fff" }
          }
        }
      }
    });
  }

  document.getElementById("reiniciar-btn").addEventListener("click", () => {
    document.querySelectorAll("input[type=radio]").forEach(input => input.checked = false);
    if (window.cprdChart instanceof Chart) {
      window.cprdChart.destroy();
    }
    const canvas = document.getElementById("cprdChart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  mostrarHistorial();
});
