import { Partida } from './model.js';

class ViewModel {
    constructor() {
        this.partida = new Partida();
        this.indiceJugador = 0; // Empieza con el primer jugador
    }

    // Método para agregar un jugador
    agregarJugador(nombre) {
        this.partida.agregarJugador(nombre);
    }

    // Método para avanzar a la siguiente pantalla
    avanzarPantalla() {
        this.partida.avanzarEstado();
    }

    // Método para agregar puntos a un jugador
    agregarPuntos(puntos) {
        if (this.partida.estado === 'puntos') {
            this.partida.agregarPuntos(this.indiceJugador, puntos);
            this.indiceJugador += 1;
        }
    }

    // Método que devuelve el jugador actual
    getJugadorActual() {
        return this.partida.jugadores[this.indiceJugador];
    }

    // Método para saber si ya se han ingresado todos los jugadores
    seHanIngresadoTodosLosJugadores() {
        return this.partida.jugadores.length === this.indiceJugador;
    }

    // Método para verificar el estado de la partida (jugadores, puntos, final)
    getEstado() {
        return this.partida.estado;
    }
}

export default ViewModel;
