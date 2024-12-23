import ViewModel from './viewModel.js';

const viewModel = new ViewModel();
const contenido = document.getElementById('contenido');
const siguienteBtn = document.getElementById('siguienteBtn');

// Función para mostrar la pantalla actual
function mostrarPantalla() {
    const estado = viewModel.getEstado();
    contenido.innerHTML = '';

    if (estado === 'jugadores') {
        if (viewModel.seHanIngresadoTodosLosJugadores()) {
            viewModel.avanzarPantalla();  // Pasar a la pantalla de puntos
        } else {
            contenido.innerHTML = `
                <h2>Jugador ${viewModel.indiceJugador + 1}</h2>
                <input type="text" id="nombre" placeholder="Nombre del jugador" />
            `;
            document.getElementById('nombre').focus();

            siguienteBtn.onclick = () => {
                const nombre = document.getElementById('nombre').value;
                if (nombre) {
                    viewModel.agregarJugador(nombre);
                    viewModel.avanzarPantalla(); // Avanzar a la siguiente pantalla de jugador
                    mostrarPantalla();
                }
            };
        }
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
