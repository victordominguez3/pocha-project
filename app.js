import { Jugador } from './model.js';
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

        function agregarJugador() {
            const nombre = nombreInput.value.charAt(0).toUpperCase() + nombreInput.value.slice(1);
            if (viewModel.getJugadores().some(jugador => jugador.nombre === nombre)) {
                error.style.display = 'block';
            } else if (nombre) {
                viewModel.agregarJugador(nombre);
                error.style.display = 'none';
                nombreInput.value = ''; // Limpiar el input
                actualizarTablaJugadores(); // Actualizar la tabla con el nuevo jugador
            }
        }

        // Escuchar el evento "keydown" en el campo de entrada
        nombreInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                agregarJugador();
            }
        });

        agregarBtn.onclick = () => {
            agregarJugador();
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
            
            siguienteBtn.onclick = () => {

                const apuestas = {}

                renderApuestas(apuestas, rondaActual);

                siguienteBtn.onclick = () => {

                    const jugadores = viewModel.getJugadores()

                    jugadores.forEach((jugador, index) => {
                        viewModel.agregarApuesta(jugador.nombre, apuestas[index])
                    });

                    let html = `
                        <h3>¡A jugar!</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 0 auto;">
                            <thead>
                                <tr>
                                    <th>Jugador</th>
                                    <th>Apuesta</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    jugadores.forEach(j => {
                        html += `
                            <tr>
                                <td>${j.nombre}</td>
                                <td>${j.apuesta}</td>
                            </tr>
                        `;
                    });

                    html += `
                            </tbody>
                        </table>
                    `; // Mostrar mensaje "¡A jugar!" cuando todos hayan apostado

                    contenido.innerHTML = html;

                    siguienteBtn.onclick = () => {

                        siguienteBtn.disabled = true;

                        const puntuaciones = {}

                        renderPuntuaciones(puntuaciones, rondaActual)

                        siguienteBtn.onclick = () => {

                            const jugadores = viewModel.getJugadores()

                            jugadores.forEach((jugador, index) => {
                                viewModel.agregarPuntos(jugador.nombre, puntuaciones[index])
                            });

                            contenido.innerHTML = `
                                <h3>Puntuación</h3>
                                <table id="tablaPuntuacion" style="width: 100%; border-collapse: collapse; margin: 0 auto;">
                                    <tbody id="tablaCuerpo">
                                        
                                    </tbody>
                                </table>
                            `;

                            const tablaCuerpo = document.getElementById('tablaCuerpo');
                            const jugadoresCopia = [...viewModel.getJugadores()];
                            
                            // Ordena los jugadores según su puntuación (de mayor a menor)
                            jugadoresCopia.sort((a, b) => b.puntos - a.puntos);

                            // Agregar las filas a la tabla
                            jugadoresCopia.forEach((jugador, index) => {
                                const fila = document.createElement('tr'); // Crea una nueva fila para cada jugador
                                
                                // Crea la celda de ranking
                                const celdaRanking = document.createElement('td');
                                celdaRanking.textContent = index + 1; // Numeración del ranking (1, 2, 3, ...)
                                fila.appendChild(celdaRanking);
                                
                                // Crea la celda de nombre
                                const celdaNombre = document.createElement('td');
                                celdaNombre.textContent = jugador.nombre;
                                fila.appendChild(celdaNombre);
                                
                                // Crea la celda de puntuación
                                const celdaPuntuacion = document.createElement('td');
                                celdaPuntuacion.textContent = jugador.puntos;
                                fila.appendChild(celdaPuntuacion);
                                
                                // Agregar la fila a la tabla
                                tablaCuerpo.appendChild(fila);

                                siguienteBtn.onclick = () => {
                                    viewModel.avanzarPantalla();
                                    mostrarPantalla();
                                }
                            });
                        }
                    };
                }
            };

        };
    } else if (estado === 'fin') {
        
        const jugadores = viewModel.getJugadores();

        // Ordena los jugadores según su puntuación (de mayor a menor)
        jugadores.sort((a, b) => b.puntos - a.puntos);

        // Determina la puntuación más alta
        const maxPuntuacion = jugadores[0]?.puntos;

        // Filtra los jugadores con la puntuación más alta
        const ganadores = jugadores.filter(jugador => jugador.puntos === maxPuntuacion);

        // Genera el mensaje de GANADOR o GANADORES
        const titulo = ganadores.length > 1 ? "GANADORES" : "GANADOR";
        const nombresGanadores = ganadores
            .map(jugador => jugador.nombre)
            .reduce((acc, nombre, index, array) => {
                if (index === 0) return nombre; // Primer elemento
                if (index === array.length - 1) return `${acc} y ${nombre}`; // Último elemento
                return `${acc}, ${nombre}`; // Elementos intermedios
            }, "");

        // Actualiza el contenido
        contenido.innerHTML = `
            <div class="card">
                <h3>&#x2b50; ${titulo} &#x2b50;</h3>
                <p>${nombresGanadores}</p>
            </div>
        `;

        siguienteBtn.style.display = 'none';
    }
}

function renderApuestas(apuestas, rondaActual) {
    const jugadores = viewModel.getJugadores();
    contenido.innerHTML = '';

    jugadores.forEach((jugador, index) => {

        const div = document.createElement('div');
        div.classList.add('bloque-jugador');
        div.innerHTML = `
            <label for="numero_${index}">
                ¿Cuánto apuesta <b>${jugador.nombre}</b>?
            </label>
            <select id="numero_${index}" data-index="${index}"></select>
        `;

        contenido.appendChild(div);
    });

    configurarSelects(apuestas, rondaActual);
}

function configurarSelects(apuestas, rondaActual) {
    const jugadores = viewModel.getJugadores();
    const totalJugadores = jugadores.length;

    const indexUltimo = totalJugadores - 1;

    const totalApostado = Object.values(apuestas).reduce((a, b) => a + b, 0);
    const jugadoresApostados = Object.keys(apuestas).length;

    const sumaOtros = totalApostado - (apuestas[indexUltimo] || 0);
    const numeroProhibido = rondaActual - sumaOtros;

    // 🧹 Si el último tenía una apuesta ahora inválida → se borra
    if (apuestas[indexUltimo] !== undefined && apuestas[indexUltimo] === numeroProhibido) {
        delete apuestas[indexUltimo];
    }

    jugadores.forEach((jugador, index) => {
        const select = document.getElementById(`numero_${index}`);
        select.innerHTML = '';
        select.disabled = false;

        const esUltimo = index === indexUltimo;

        if (esUltimo && jugadoresApostados < totalJugadores - 1) {
            select.disabled = true;
            select.selectedIndex = -1;
            return;
        }

        for (let i = 0; i <= rondaActual; i++) {
            if (esUltimo && i === numeroProhibido) continue;

            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }

        if (apuestas[index] !== undefined) {
            select.value = apuestas[index];
        } else {
            select.selectedIndex = -1;
        }

        select.onchange = () => {
            apuestas[index] = parseInt(select.value);
            configurarSelects(apuestas, rondaActual);
        };
    });

    siguienteBtn.disabled = Object.keys(apuestas).length !== totalJugadores;
}

function renderPuntuaciones(puntuaciones, rondaActual) {
    const jugadores = viewModel.getJugadores();
    contenido.innerHTML = '';

    jugadores.forEach((jugador, index) => {
        const div = document.createElement('div');
        div.classList.add('bloque-jugador');

        div.innerHTML = `
            <label for="puntos_${index}">
                ¿Cuántas rondas ha conseguido <b>${jugador.nombre}</b>?
            </label>
            <select id="puntos_${index}" data-index="${index}"></select>
        `;

        contenido.appendChild(div);
    });

    configurarSelectsPuntuacion(puntuaciones, rondaActual);
}

function configurarSelectsPuntuacion(puntuaciones, rondaActual) {
    const jugadores = viewModel.getJugadores();
    const totalJugadores = jugadores.length;

    jugadores.forEach((jugador, index) => {
        const select = document.getElementById(`puntos_${index}`);
        select.innerHTML = '';

        for (let i = 0; i <= rondaActual; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }

        if (puntuaciones[index] !== undefined) {
            select.value = puntuaciones[index];
        } else {
            select.selectedIndex = -1;
        }

        select.onchange = () => {
            puntuaciones[index] = parseInt(select.value);
            configurarSelectsPuntuacion(puntuaciones, rondaActual);
        };
    });

    const valoresSeleccionados = Object.values(puntuaciones);
    const todosSeleccionaron = valoresSeleccionados.length === totalJugadores;
    const sumaActual = valoresSeleccionados.reduce((a, b) => a + b, 0);

    // ✅ El botón solo se habilita si todos han votado y la suma coincide con la ronda
    siguienteBtn.disabled = !(todosSeleccionaron && sumaActual === rondaActual);
}

// Inicializar la primera pantalla
mostrarPantalla();
