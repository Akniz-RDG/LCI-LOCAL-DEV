let planes = JSON.parse(localStorage.getItem("planesSMART")) || [];

function guardarPlanes() {
  localStorage.setItem("planesSMART", JSON.stringify(planes));
}

function generarId() {
  return Date.now().toString();
}

class Actividad {
  constructor(nombre, frecuencia) {
    this.id = generarId();
    this.nombre = nombre;
    this.frecuencia = frecuencia;
  }
}

class Objetivo {
  constructor(s, m, a, r, t) {
    this.id = generarId();
    this.s = s;
    this.m = m;
    this.a = a;
    this.r = r;
    this.t = t;
    this.actividades = [];
  }
}

class Plan {
  constructor(meta) {
    this.id = generarId();
    this.meta = meta;
    this.objetivos = [];
  }
}

function renderizarPlanes() {
  const contenedor = document.getElementById("contenedor-planes");
  contenedor.innerHTML = "";

  if (planes.length === 0) {
    contenedor.innerHTML = "<p>No hay planes creados aún.</p>";
    return;
  }

  planes.forEach((plan, index) => {
    const planDiv = document.createElement("div");
    planDiv.classList.add("smart-section");

    planDiv.innerHTML = `
      <h3>📋 Plan #${index + 1}</h3>
      <p><strong>Meta general:</strong> ${plan.meta}</p>
      <button onclick="mostrarFormularioObjetivo('${plan.id}')">➕ Agregar Objetivo</button>
      <button onclick="editarPlan('${plan.id}')">✏️ Editar</button>
      <button onclick="eliminarPlan('${plan.id}')">🗑️ Eliminar</button>
      <div id="objetivos-${plan.id}"></div>
    `;

    contenedor.appendChild(planDiv);

    const objetivosContenedor = planDiv.querySelector(`#objetivos-${plan.id}`);
    plan.objetivos.forEach((obj, i) => {
      const objDiv = document.createElement("div");
      objDiv.classList.add("smart-actividad");
      objDiv.innerHTML = `
        <p><strong>🎯 Objetivo #${i + 1}</strong>: ${obj.s} (Medible: ${obj.m})</p>
        <p>📆 Temporal: ${obj.t} | ✅ Relevancia: ${obj.r}</p>
        <button onclick="mostrarFormularioActividad('${plan.id}', '${obj.id}')">➕ Agregar Actividad</button>
        <button onclick="editarObjetivo('${plan.id}', '${obj.id}')">✏️ Editar</button>
        <button onclick="eliminarObjetivo('${plan.id}', '${obj.id}')">🗑️ Eliminar</button>
        <ul id="actividades-${obj.id}">
          ${obj.actividades.map(a => `
            <li>
              ✅ ${a.nombre} (${a.frecuencia})
              <button onclick="editarActividad('${plan.id}', '${obj.id}', '${a.id}')">✏️</button>
              <button onclick="eliminarActividad('${plan.id}', '${obj.id}', '${a.id}')">🗑️</button>
            </li>
          `).join("")}
        </ul>
      `;
      objetivosContenedor.appendChild(objDiv);
    });
  });
}

function crearPlan() {
  const formulario = document.getElementById("formulario-plan");
  const inputMeta = document.getElementById("nueva-meta");
  const advertencia = document.getElementById("advertencia-limite");

  if (planes.length >= 3) {
    advertencia.style.display = "block";
    return;
  } else {
    advertencia.style.display = "none";
  }

  formulario.style.display = "block";

  document.getElementById("guardar-meta-btn").onclick = () => {
    const meta = inputMeta.value.trim();
    if (!meta) return alert("Por favor, escribe una meta.");

    const nuevoPlan = new Plan(meta);
    planes.push(nuevoPlan);
    guardarPlanes();
    renderizarPlanes();

    inputMeta.value = "";
    formulario.style.display = "none";
  };
}

function mostrarFormularioObjetivo(planId) {
  const plan = planes.find(p => p.id === planId);
  if (!plan) return;

  const s = prompt("Objetivo específico:");
  const m = prompt("¿Cómo lo vas a medir?");
  const a = prompt("¿Es alcanzable cómo?");
  const r = prompt("¿Por qué es relevante?");
  const t = prompt("¿Cuál es el plazo?");

  if (s && m && a && r && t) {
    const nuevoObj = new Objetivo(s, m, a, r, t);
    plan.objetivos.push(nuevoObj);
    guardarPlanes();
    renderizarPlanes();
  }
}

function mostrarFormularioActividad(planId, objId) {
  const plan = planes.find(p => p.id === planId);
  if (!plan) return;

  const obj = plan.objetivos.find(o => o.id === objId);
  if (!obj) return;

  const nombre = prompt("Nombre de la actividad:");
  const frecuencia = prompt("Frecuencia:");

  if (nombre && frecuencia) {
    const nuevaAct = new Actividad(nombre, frecuencia);
    obj.actividades.push(nuevaAct);
    guardarPlanes();
    renderizarPlanes();
  }
}

// Editar y eliminar funciones

function editarPlan(planId) {
  const plan = planes.find(p => p.id === planId);
  if (!plan) return;
  const nuevaMeta = prompt("Editar meta general:", plan.meta);
  if (nuevaMeta) {
    plan.meta = nuevaMeta;
    guardarPlanes();
    renderizarPlanes();
  }
}

function eliminarPlan(planId) {
  if (confirm("¿Estás seguro de que quieres eliminar este plan?")) {
    planes = planes.filter(p => p.id !== planId);
    guardarPlanes();
    renderizarPlanes();
  }
}

function editarObjetivo(planId, objId) {
  const plan = planes.find(p => p.id === planId);
  const obj = plan?.objetivos.find(o => o.id === objId);
  if (!obj) return;

  const s = prompt("Editar específico:", obj.s);
  const m = prompt("Editar medible:", obj.m);
  const a = prompt("Editar alcanzable:", obj.a);
  const r = prompt("Editar relevante:", obj.r);
  const t = prompt("Editar temporal:", obj.t);

  if (s && m && a && r && t) {
    Object.assign(obj, { s, m, a, r, t });
    guardarPlanes();
    renderizarPlanes();
  }
}

function eliminarObjetivo(planId, objId) {
  const plan = planes.find(p => p.id === planId);
  if (!plan) return;
  plan.objetivos = plan.objetivos.filter(o => o.id !== objId);
  guardarPlanes();
  renderizarPlanes();
}

function editarActividad(planId, objId, actId) {
  const plan = planes.find(p => p.id === planId);
  const obj = plan?.objetivos.find(o => o.id === objId);
  const act = obj?.actividades.find(a => a.id === actId);
  if (!act) return;

  const nombre = prompt("Editar nombre:", act.nombre);
  const frecuencia = prompt("Editar frecuencia:", act.frecuencia);

  if (nombre && frecuencia) {
    act.nombre = nombre;
    act.frecuencia = frecuencia;
    guardarPlanes();
    renderizarPlanes();
  }
}

function eliminarActividad(planId, objId, actId) {
  const plan = planes.find(p => p.id === planId);
  const obj = plan?.objetivos.find(o => o.id === objId);
  if (!obj) return;

  obj.actividades = obj.actividades.filter(a => a.id !== actId);
  guardarPlanes();
  renderizarPlanes();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("crearPlanBtn").addEventListener("click", crearPlan);
  renderizarPlanes();
});
