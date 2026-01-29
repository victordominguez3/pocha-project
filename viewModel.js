import { Partida } from './model.js';

class ViewModel {
    constructor() {
        this.partida = new Partida();
    }

    setPartida(partida) {
        this.partida.id = partida.id
        this.partida.jugadores = partida.jugadores
        this.partida.cartas = partida.cartas
        this.partida.rondas = partida.rondas
        this.partida.rondaActual = partida.rondaActual
        this.partida.rondaCount = partida.rondaCount
        this.partida.isOros = partida.isOros
        this.partida.estado = partida.estado
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

    getPartida() {
        return {
            id: this.partida.id,
            jugadores: this.partida.jugadores.map(j => ({
                nombre: j.nombre,
                puntos: j.puntos,
                apuesta: j.apuesta
            })),
            cartas: this.partida.cartas,
            rondas: this.partida.rondas,
            rondaActual: this.partida.rondaActual,
            rondaCount: this.partida.rondaCount,
            isOros: this.partida.isOros,
            estado: this.partida.estado
        };
    }

    setIdPartida(id) {
        this.partida.id = id;
    }
}

export default ViewModel;
