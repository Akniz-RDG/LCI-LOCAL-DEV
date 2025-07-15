window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("descargarInforme");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // =========================
    // 🧠 ENCABEZADO DEL INFORME
    // =========================

    doc.setFontSize(18);
    doc.text("Informe Psicométrico", 105, 20, null, null, "center");

    // =========================
    // 📌 DATOS GENERALES
    // =========================

    const usuario = localStorage.getItem("usuarioActual") || "Usuario sin nombre";
    const fecha = new Date().toLocaleString();

    doc.setFontSize(12);
    doc.text(`Jugador: ${usuario}`, 15, 35);
    doc.text(`Fecha: ${fecha}`, 15, 42);

    let y = 55;

    // =========================
    // 📘 CPRD - Último resultado
    // =========================

    const cprd = JSON.parse(localStorage.getItem("historialCPRD")) || [];
    if (cprd.length > 0) {
      const ultimo = cprd[cprd.length - 1];

      doc.setFontSize(14);
      doc.text("CPRD - Recursos Psicodeportivos", 15, y);
      y += 8;

      for (const [clave, valor] of Object.entries(ultimo.puntajes)) {
        doc.setFontSize(12);
        doc.text(`${clave}: ${valor}/10`, 20, y);
        y += 6;
      }
      y += 5;
    }

    // =========================
    // 😰 CSAI - Último resultado
    // =========================

    const csai = JSON.parse(localStorage.getItem("historialAnsiedad")) || [];
    if (csai.length > 0) {
      const ultimo = csai[csai.length - 1];

      doc.setFontSize(14);
      doc.text("CSAI-2 - Ansiedad Precompetitiva", 15, y);
      y += 8;

      for (const [clave, valor] of Object.entries(ultimo.puntajes)) {
        doc.setFontSize(12);
        doc.text(`${clave}: ${valor}`, 20, y);
        y += 6;
      }

      if (ultimo.rendimiento) {
        const { kills, deaths, assists } = ultimo.rendimiento;
        doc.text(`Rendimiento: ${kills}K / ${deaths}D / ${assists}A`, 20, y);
        y += 6;
      }

      y += 5;
    }

    // =========================
    // 🎯 Motivación - Actual
    // =========================

    const motivacion = JSON.parse(localStorage.getItem("motivacion-resultados")) || {};
    if (Object.keys(motivacion).length > 0) {
      doc.setFontSize(14);
      doc.text("Motivación Deportiva", 15, y);
      y += 8;

      for (const [clave, valor] of Object.entries(motivacion)) {
        doc.setFontSize(12);
        doc.text(`${clave}: ${valor}/10`, 20, y);
        y += 6;
      }

      y += 5;
    }

    // =========================
    // ✅ Finalizar
    // =========================

    const nombreArchivo = `Informe_Psicometrico_${usuario.replace(/\s/g, "_")}.pdf`;
    doc.save(nombreArchivo);
  });
});
