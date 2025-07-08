// test-motivacion.js

document.addEventListener("DOMContentLoaded", () => {
  const preguntas = [
    { texto: "Disfruto aprender cosas nuevas durante la práctica", categoria: "Intrínseca" },
    { texto: "Me hace sentir bien conmigo mismo", categoria: "Intrínseca" },
    { texto: "Quiero ser mejor que los demás", categoria: "Extrínseca" },
    { texto: "Me obligan a participar", categoria: "Desmotivación" },
    { texto: "Me siento bien cuando supero mis propios límites", categoria: "Intrínseca" },
    { texto: "Lo hago para ganar premios o recompensas", categoria: "Extrínseca" },
    { texto: "Me genera satisfacción personal", categoria: "Intrínseca" },
    { texto: "Lo hago para complacer a otros", categoria: "Extrínseca" },
    { texto: "Me esfuerzo porque me gusta el desafío", categoria: "Intrínseca" },
    { texto: "Participo por miedo a las consecuencias si no lo hago", categoria: "Desmotivación" },
    { texto: "Es algo que me apasiona hacer", categoria: "Intrínseca" },
    { texto: "Lo hago porque es parte de mis deberes", categoria: "Desmotivación" }
  ];

  const categorias = ["Nada", "Poco", "Moderado", "Bastante", "Muchísimo"];
  const form = document.getElementById("form-motivacion");
  const tbody = document.getElementById("motivacion-items");

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

      const saved = localStorage.getItem(`pregunta-${i}`);
      if (saved !== null && parseInt(saved) === valor) {
        input.checked = true;
      }

      input.addEventListener("change", () => {
        localStorage.setItem(`pregunta-${i}`, valor);
      });

      td.appendChild(input);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const puntajes = {
      "Intrínseca": 0,
      "Extrínseca": 0,
      "Desmotivación": 0
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

    mostrarGrafico(puntajes);
    mostrarExplicacion(puntajes);
    localStorage.setItem("motivacion-resultados", JSON.stringify(puntajes));
  });

  function mostrarGrafico(puntajes) {
    const ctx = document.getElementById("motivacionChart").getContext("2d");
    if (window.motivacionChart instanceof Chart) {
      window.motivacionChart.destroy();
    }

    window.motivacionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(puntajes),
        datasets: [
          {
            label: "Nivel de motivación",
            data: Object.values(puntajes),
            backgroundColor: [
              "rgba(99, 102, 241, 0.7)",
              "rgba(236, 72, 153, 0.7)",
              "rgba(255, 204, 0, 0.7)"
            ],
            borderColor: [
              "rgba(99, 102, 241, 1)",
              "rgba(236, 72, 153, 1)",
              "rgba(255, 204, 0, 1)"
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
          legend: {
            labels: {
              color: "#fff"
            }
          }
        }
      }
    });
  }

  function mostrarExplicacion(puntajes) {
    const explicacion = document.getElementById("motivacion-explicacion");
    const tipoMax = Object.entries(puntajes).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    let texto = "";

    switch (tipoMax) {
      case "Intrínseca":
        texto = "Tu motivación se basa principalmente en el placer, desafío y crecimiento personal que te produce la actividad. ¡Muy saludable y sostenible a largo plazo!";
        break;
      case "Extrínseca":
        texto = "Tu motivación se orienta hacia recompensas externas, reconocimiento o presión social. A veces útil, pero puede ser inestable si no se acompaña de pasión.";
        break;
      case "Desmotivación":
        texto = "Estás participando por obligación, rutina o presión. Sería importante revisar tus objetivos y reconectar con lo que te gusta realmente.";
        break;
    }

    texto += `

Importante: Los instrumentos aquí brindados no reemplazan la evaluación profesional integral y son meramente orientativos. En caso de que sospeches que tu experiencia de juego (disfrute o desempeño competitivo) esté afectada por tu motivación hacia el juego, considera orientación profesional.`;

    explicacion.textContent = texto;
  }

  const guardado = localStorage.getItem("motivacion-resultados");
  if (guardado) {
    const datos = JSON.parse(guardado);
    mostrarGrafico(datos);
    mostrarExplicacion(datos);
  }

  document.getElementById("reiniciar-btn").addEventListener("click", () => {
    document.querySelectorAll("input[type=radio]").forEach((i) => (i.checked = false));
    if (window.motivacionChart instanceof Chart) {
      window.motivacionChart.destroy();
      window.motivacionChart = null;
    }
    document.getElementById("motivacion-explicacion").textContent = "";
    const canvas = document.getElementById("motivacionChart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.clear();
  });
});
