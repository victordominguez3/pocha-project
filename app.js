import ViewModel from './viewModel.js';

const viewModel = new ViewModel();
const contenido = document.getElementById('contenido');
const siguienteBtn = document.getElementById('siguienteBtn');

// Función para mostrar la pantalla actual
function mostrarPantalla() {
    const estado = viewModel.getEstado();
    contenido.innerHTML = '';

    if (estado === 'jugadores') {
        contenido.innerHTML = `
            <input type="text" id="nombre" placeholder="Nombre del jugador" />
            <button id="agregarBtn" class="btn">Aceptar</button>
            <p id="error" class="error">No puede haber dos jugadores con el mismo nombre</p>
            <h3>Jugadores ingresados:</h3>
            <table id="tablaJugadores" style="width: 100%; border-collapse: collapse; margin: 0 auto;">
                <tbody id="tablaCuerpo">
                    
                </tbody>
            </table>
        `;

        const nombreInput = document.getElementById('nombre');
        const agregarBtn = document.getElementById('agregarBtn');
        const tablaCuerpo = document.getElementById('tablaCuerpo');
        const error = document.getElementById('error');

        function actualizarTablaJugadores() {
            tablaCuerpo.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos jugadores
            viewModel.getJugadores().forEach(jugador => {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = jugador.nombre;
                tr.appendChild(td);
                tablaCuerpo.appendChild(tr);
            });
            if (viewModel.getJugadores().length > 1) {
                siguienteBtn.disabled = false;
            }
        }

        agregarBtn.onclick = () => {
            const nombre = nombreInput.value.charAt(0).toUpperCase() + nombreInput.value.slice(1);
            if (viewModel.getJugadores().some(jugador => jugador.nombre === nombre)) {
                error.style.display = 'block';
            } else if (nombre) {
                viewModel.agregarJugador(nombre);
                error.style.display = 'none';
                nombreInput.value = ''; // Limpiar el input
                actualizarTablaJugadores(); // Actualizar la tabla con el nuevo jugador
            }
        };

        siguienteBtn.onclick = () => {
            viewModel.avanzarPantalla();
            mostrarPantalla();
        };
        
    } else if (estado === 'puntos') {
        const jugador = viewModel.getJugadorActual();
        contenido.innerHTML = `
            <h2>${jugador.nombre}</h2>
            <p>Introduce los puntos</p>
            <input type="number" id="puntos" placeholder="Puntos" />
        `;

        siguienteBtn.onclick = () => {
            const puntos = parseInt(document.getElementById('puntos').value);
            if (!isNaN(puntos)) {
                viewModel.agregarPuntos(puntos);
                if (viewModel.indiceJugador < viewModel.partida.jugadores.length) {
                    mostrarPantalla();
                } else {
                    viewModel.avanzarPantalla(); // Finalizar la partida
                    mostrarPantalla();
                }
            }
        };
    } else if (estado === 'final') {
        contenido.innerHTML = '<h2>Partida Finalizada</h2>';
        siguienteBtn.style.display = 'none'; // Ocultar el botón
    }
}

// Inicializar la primera pantalla
mostrarPantalla();
