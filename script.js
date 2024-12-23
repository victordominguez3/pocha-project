function guardarDato() {
    const dato = document.getElementById('input').value;
    localStorage.setItem('dato', dato); // Guarda el dato en LocalStorage
    mostrarDato();
  }
  
  function mostrarDato() {
    const datoGuardado = localStorage.getItem('dato') || "Nada guardado aún";
    document.getElementById('datoGuardado').textContent = datoGuardado;
  }
  
  // Mostrar el dato guardado al cargar la página
  document.addEventListener('DOMContentLoaded', mostrarDato);
  