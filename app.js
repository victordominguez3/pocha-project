import ViewModel from './viewModel.js';

const viewModel = new ViewModel();
const contenido = document.getElementById('contenido');
const siguienteBtn = document.getElementById('siguienteBtn');

// Función para mostrar la pantalla actual
function mostrarPantalla() {
    const estado = viewModel.getEstado();
    const rondaActual = viewModel.getRondaActual();
    contenido.innerHTML = '';

    if (estado === 'jugadores') {

        siguienteBtn.disabled = true;

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
        
    } else if (estado === 'cartas') {

        const numJugadores = viewModel.getJugadores().length;

        contenido.innerHTML = `
            <label for="numero">¿Con cuántas cartas vais a jugar?</label>
            <input type="number" id="numero" name="numero" min="20" max="52" step="1">
            <p id="error" class="error">El número de cartas no es válido para ${numJugadores} jugadores</p>
        `;

        const inputNumero = document.getElementById('numero');
        const error = document.getElementById('error');

        siguienteBtn.onclick = () => {
            const numeroCartas = parseInt(inputNumero.value);

            if (numeroCartas >= 20 && numeroCartas <= 52 && numeroCartas % numJugadores === 0) {
                error.style.display = 'none';
                viewModel.agregarCartas(numeroCartas);
                viewModel.avanzarPantalla();
                mostrarPantalla();
            } else {
                error.style.display = 'block';
            }
        };

    } else if (estado === 'ronda') {
        const jugador = viewModel.siguienteJugador();
        
        contenido.innerHTML = `
            <p><b>${jugador.nombre}, te toca repartir ${rondaActual} ${rondaActual === 1 ? "carta" : "cartas"} a cada jugador</p>
        `;

        siguienteBtn.onclick = () => {
            contenido.innerHTML = `
                <p>¿En qué pinta?</p>
                <div style="display: inline-grid; grid-template-columns: repeat(2, 1fr); gap: 10px; justify-items: center; align-items: center; width: auto;">
                    <button id="oro" class="btnpng" style="aspect-ratio: 1 / 1; width: 100px; padding: 0; display: flex; align-items: center; justify-content: center;">
                        <img src="oro.png" alt="Oro" style="width: 80%; height: 80%; object-fit: cover;">
                    </button>
                    <button id="copa" class="btnpng" style="aspect-ratio: 1 / 1; width: 100px; padding: 0; display: flex; align-items: center; justify-content: center;">
                        <img src="copa.png" alt="Copa" style="width: 80%; height: 80%; object-fit: cover;">
                    </button>
                    <button id="espada" class="btnpng" style="aspect-ratio: 1 / 1; width: 100px; padding: 0; display: flex; align-items: center; justify-content: center;">
                        <img src="espada.png" alt="Espada" style="width: 80%; height: 80%; object-fit: cover;">
                    </button>
                    <button id="basto" class="btnpng" style="aspect-ratio: 1 / 1; width: 100px; padding: 0; display: flex; align-items: center; justify-content: center;">
                        <img src="basto.png" alt="Basto" style="width: 80%; height: 80%; object-fit: cover;">
                    </button>
                </div>
            `;

            const oroBtn = document.getElementById('oro');
            const copaBtn = document.getElementById('copa');
            const espadaBtn = document.getElementById('espada');
            const bastoBtn = document.getElementById('basto');

            function seleccionarBoton(btn) {
                // Eliminar la clase 'selected' de todos los botones
                oroBtn.classList.remove('selected');
                copaBtn.classList.remove('selected');
                espadaBtn.classList.remove('selected');
                bastoBtn.classList.remove('selected');
                
                // Añadir la clase 'selected' al botón que fue clickeado
                btn.classList.add('selected');

                viewModel.setOros(oroBtn.classList.contains('selected'));
            }
            
            // Añadir los eventos de clic a los botones
            oroBtn.addEventListener('click', () => seleccionarBoton(oroBtn));
            copaBtn.addEventListener('click', () => seleccionarBoton(copaBtn));
            espadaBtn.addEventListener('click', () => seleccionarBoton(espadaBtn));
            bastoBtn.addEventListener('click', () => seleccionarBoton(bastoBtn));

            let jugadoresApostados = 0; // Contador de jugadores que han apostado
            let apuestas = 0; // Array para almacenar las apuestas de cada jugador
            let selectedNumber = 0;
            let apostado = false;
            let nombre = '';
            
            siguienteBtn.onclick = () => {
                if (jugadoresApostados === viewModel.getJugadores().length) {
                    contenido.innerHTML = `<p>¡A jugar!</p>`; // Mostrar mensaje "¡A jugar!" cuando todos hayan apostado
                    siguienteBtn.onclick = () => {
                        viewModel.avanzarPantalla();
                        mostrarPantalla();
                    };

                } else {

                    if (apostado) {
                        apuestas += selectedNumber;
                        viewModel.agregarApuesta(nombre, selectedNumber);
                    }

                    siguienteBtn.disabled = true; // Deshabilitar el botón mientras se hace la apuesta

                    // Obtener el siguiente jugador y actualizar la interfaz
                    let jugador = viewModel.siguienteJugador();

                    contenido.innerHTML = `
                        <label for="numero">¿Cuánto apuesta <b>${jugador.nombre}</b>?</label>
                        <select id="numero" name="numero">
                            <!-- Las opciones se generarán dinámicamente con JavaScript -->
                        </select>
                    `;

                    const selectElement = document.getElementById('numero');

                    // Generar las opciones de apuesta según la ronda
                    for (let i = 0; i <= rondaActual; i++) {
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = i;
                        selectElement.appendChild(option);
                    }

                    // Escuchar el cambio en la selección del número de apuestas
                    selectElement.addEventListener('change', function() {
                        const selectedIndex = selectElement.selectedIndex;  // Obtiene el índice de la opción seleccionada
                        const selectedOption = selectElement.options[selectedIndex];  // Obtiene la opción seleccionada
                        const selectedText = selectedOption.textContent;  // El texto (contenido) de la opción seleccionada
                        selectedNumber = parseInt(selectedText, 10);
                        apostado = true;
                        nombre = jugador.nombre;
                        siguienteBtn.disabled = false; // Habilitar el botón para el siguiente jugador
                        jugadoresApostados++;
                    });
                }
            };

        };
    } else if (estado === 'fin') {
        contenido.innerHTML = '<h2>Partida Finalizada</h2>';
        siguienteBtn.style.display = 'none'; // Ocultar el botón
    }
}

// Inicializar la primera pantalla
mostrarPantalla();
