import { Partida } from './model.js';

class ViewModel {
    constructor() {
        this.partida = new Partida();
    }

    agregarJugador(nombre) {
        this.partida.agregarJugador(nombre);
    }

    avanzarPantalla() {
        this.partida.avanzarEstado();
    }

    agregarPuntos(puntos) {
        if (this.partida.estado === 'puntos') {
            this.partida.agregarPuntos(nombre, puntos);
        }
    }

    getEstado() {
        return this.partida.estado;
    }

    getJugadores() {
        return this.partida.jugadores;
    }
}

export default ViewModel;
