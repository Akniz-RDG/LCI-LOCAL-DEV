// test-ansiedad.js actualizado con separación entre CSAI y desempeño

document.addEventListener("DOMContentLoaded", () => {
  const preguntas = [
    // Ansiedad Cognitiva (9 ítems)
    { texto: "Estoy preocupado por no rendir bien", categoria: "Ansiedad Cognitiva" },
    { texto: "Estoy preocupado por cometer errores", categoria: "Ansiedad Cognitiva" },
    { texto: "Me preocupa lo que otros piensen de mí", categoria: "Ansiedad Cognitiva" },
    { texto: "Estoy pensando en fallar", categoria: "Ansiedad Cognitiva" },
    { texto: "Estoy preocupado", categoria: "Ansiedad Cognitiva" },
    { texto: "Me siento inseguro sobre mis habilidades", categoria: "Ansiedad Cognitiva" },
    { texto: "Me siento mentalmente confundido", categoria: "Ansiedad Cognitiva" },
    { texto: "Me resulta difícil concentrarme", categoria: "Ansiedad Cognitiva" },
    { texto: "Me preocupo por cómo lo estoy haciendo", categoria: "Ansiedad Cognitiva" },

    // Ansiedad Somática (9 ítems)
    { texto: "Tengo mariposas en el estómago", categoria: "Ansiedad Somática" },
    { texto: "Me siento tenso", categoria: "Ansiedad Somática" },
    { texto: "Mi cuerpo se siente incómodo", categoria: "Ansiedad Somática" },
    { texto: "Me tiemblan las manos", categoria: "Ansiedad Somática" },
    { texto: "Me siento inquieto", categoria: "Ansiedad Somática" },
    { texto: "Tengo la boca seca", categoria: "Ansiedad Somática" },
    { texto: "Mi respiración se siente agitada", categoria: "Ansiedad Somática" },
    { texto: "Tengo latidos rápidos del corazón", categoria: "Ansiedad Somática" },
    { texto: "Me siento físicamente agitado", categoria: "Ansiedad Somática" },

    // Auto-confianza (9 ítems)
    { texto: "Tengo confianza en que puedo rendir bien", categoria: "Auto-confianza" },
    { texto: "Me siento en control", categoria: "Auto-confianza" },
    { texto: "Me siento seguro de mí mismo", categoria: "Auto-confianza" },
    { texto: "Me siento mentalmente preparado", categoria: "Auto-confianza" },
    { texto: "Me siento bien conmigo mismo", categoria: "Auto-confianza" },
    { texto: "Me siento relajado y concentrado", categoria: "Auto-confianza" },
    { texto: "Estoy motivado para competir", categoria: "Auto-confianza" },
    { texto: "Me concentro fácilmente en lo que tengo que hacer", categoria: "Auto-confianza" },
    { texto: "Siento que puedo manejar la situación", categoria: "Auto-confianza" }
  ];

  const opciones = ["Nada", "Poco", "Moderado", "Bastante", "Muchísimo"];
  const form = document.getElementById("form-ansiedad");
  const tbody = document.getElementById("ansiedad-items");

  preguntas.forEach((p, i) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = `${i + 1}. ${p.texto}`;
    tr.appendChild(th);

    opciones.forEach((_, valor) => {
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

    const puntajes = {
      "Ansiedad Cognitiva": 0,
      "Ansiedad Somática": 0,
      "Auto-confianza": 0
    };

    for (let i = 0; i < preguntas.length; i++) {
      const seleccion = document.querySelector(`input[name="pregunta-${i}"]:checked`);
      if (!seleccion) {
        alert("⚠️ Debes completar todas las preguntas.");
        return;
      }
      const valor = parseInt(seleccion.value);
      puntajes[preguntas[i].categoria] += valor;
    }

    const resultado = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      puntajes,
      rendimiento: null // rendimiento se agregará luego
    };

    guardarResultado(resultado);
    mostrarGrafico(puntajes);
    mostrarExplicacion(puntajes);
    mostrarHistorial();
  });

  function guardarResultado(resultado) {
    const historial = JSON.parse(localStorage.getItem("historialAnsiedad")) || [];
    historial.push(resultado);
    localStorage.setItem("historialAnsiedad", JSON.stringify(historial));
  }

  function actualizarRendimiento(id, datos) {
    const historial = JSON.parse(localStorage.getItem("historialAnsiedad")) || [];
    const index = historial.findIndex((r) => r.id === id);
    if (index !== -1) {
      historial[index].rendimiento = datos;
      localStorage.setItem("historialAnsiedad", JSON.stringify(historial));
      mostrarHistorial();
    }
  }

  function mostrarGrafico(puntajes) {
    const ctx = document.getElementById("ansiedadChart").getContext("2d");
    if (window.ansiedadChart instanceof Chart) {
      window.ansiedadChart.destroy();
    }
    window.ansiedadChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(puntajes),
        datasets: [
          {
            label: "Puntaje",
            data: Object.values(puntajes),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 205, 86, 0.6)",
              "rgba(54, 162, 235, 0.6)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(54, 162, 235, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        },
        plugins: {
          legend: { labels: { color: "#fff" } }
        }
      }
    });
  }

  function mostrarExplicacion(puntajes) {
    const explicacion = document.getElementById("ansiedad-explicacion");
    let texto = "";

    if (puntajes["Ansiedad Cognitiva"] > puntajes["Ansiedad Somática"] && puntajes["Ansiedad Cognitiva"] > puntajes["Auto-confianza"]) {
      texto = "Tu ansiedad está centrada en pensamientos negativos, preocupación y miedo al fracaso.";
    } else if (puntajes["Ansiedad Somática"] > puntajes["Ansiedad Cognitiva"] && puntajes["Ansiedad Somática"] > puntajes["Auto-confianza"]) {
      texto = "Tu ansiedad se manifiesta físicamente (tensión, temblores, molestias físicas).";
    } else if (puntajes["Auto-confianza"] >= puntajes["Ansiedad Somática"] && puntajes["Auto-confianza"] >= puntajes["Ansiedad Cognitiva"]) {
      texto = "Tu confianza es superior a tu ansiedad, lo que indica buena preparación psicológica.";
    }

    texto += "\n\n📌 Importante: Este test no reemplaza una evaluación profesional. Si sientes que tu ansiedad afecta negativamente tu juego o bienestar, considera buscar orientación profesional.";

    explicacion.textContent = texto;
  }

  function mostrarHistorial() {
    const contenedor = document.getElementById("historial-tests");
    contenedor.innerHTML = "";
    const historial = JSON.parse(localStorage.getItem("historialAnsiedad")) || [];

    if (historial.length === 0) {
      contenedor.innerHTML = "<p>No hay registros aún.</p>";
      return;
    }

    historial.reverse().forEach((registro) => {
      const div = document.createElement("div");
      div.className = "smart-actividad";

      div.innerHTML = `
        <p><strong>📅 Fecha:</strong> ${registro.fecha}</p>
        <p><strong>Resultados:</strong> Cognitiva: ${registro.puntajes["Ansiedad Cognitiva"]}, Somática: ${registro.puntajes["Ansiedad Somática"]}, Confianza: ${registro.puntajes["Auto-confianza"]}</p>
        ${registro.rendimiento ?
          `<p><strong>🎮 Rendimiento:</strong> Kills: ${registro.rendimiento.kills}, Deaths: ${registro.rendimiento.deaths}, Assists: ${registro.rendimiento.assists}</p>` :
          `<form onsubmit="guardarRendimiento(event, ${registro.id})">
            <label>Kills: <input type='number' name='kills' required></label>
            <label>Deaths: <input type='number' name='deaths' required></label>
            <label>Assists: <input type='number' name='assists' required></label>
            <button type='submit'>Guardar rendimiento</button>
          </form>`}
      `;

      contenedor.appendChild(div);
    });
  }

  window.guardarRendimiento = (event, id) => {
    event.preventDefault();
    const form = event.target;
    const datos = {
      kills: parseInt(form.kills.value),
      deaths: parseInt(form.deaths.value),
      assists: parseInt(form.assists.value)
    };
    actualizarRendimiento(id, datos);
  };

  document.getElementById("reiniciar-btn").addEventListener("click", () => {
    document.querySelectorAll("input[type=radio]").forEach((i) => (i.checked = false));
    document.getElementById("ansiedad-explicacion").textContent = "";
    if (window.ansiedadChart instanceof Chart) {
      window.ansiedadChart.destroy();
      window.ansiedadChart = null;
    }
    const canvas = document.getElementById("ansiedadChart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  mostrarHistorial();
});

document.getElementById("borrar-historial-btn").addEventListener("click", () => {
  if (confirm("¿Estás seguro de que quieres borrar todo el historial de ansiedad?")) {
    localStorage.removeItem("historialAnsiedad");
    alert("Historial eliminado con éxito.");
    mostrarHistorial(); // para actualizar la vista
  }
});
