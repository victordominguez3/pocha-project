import { Partida } from './model.js';

class ViewModel {
    constructor() {
        this.partida = new Partida();
    }

    agregarJugador(nombre) {
        this.partida.agregarJugador(nombre);
    }

    siguienteJugador() {
        return this.partida.siguienteJugador();
    }

    avanzarPantalla() {
        this.partida.avanzarEstado();
    }

    agregarCartas(cartas) {
        this.partida.agregarCartas(cartas);
    }

    agregarApuesta(nombre, apuesta) {
        this.partida.agregarApuesta(nombre, apuesta);
    }

    agregarPuntos(nombre, puntos) {
        this.partida.agregarPuntos(nombre, puntos);
    }

    getEstado() {
        return this.partida.estado;
    }

    setOros(bool) {
        this.partida.isOros = bool;
    }

    getJugadores() {
        return this.partida.jugadores;
    }

    getRondaActual() {
        return this.partida.rondaActual;
    }
}

export default ViewModel;
