class Jugador {
    constructor(nombre, puntos = 0, apuesta = 0) {
        this.nombre = nombre;
        this.puntos = puntos;
        this.apuesta = apuesta;
    }
}

class Partida {
    constructor() {
        this.jugadores = [];
        this.cartas = 0;
        this.rondas = 0;
        this.rondaActual = 0;
        this.rondaCount = 0;
        this.isOros = false;
        this.estado = 'fin';
    }

    agregarJugador(nombre) {
        const nuevoJugador = new Jugador(nombre);
        this.jugadores.push(nuevoJugador);
    }

    siguienteJugador() {
        if (this.jugadores.length > 0) {
            const jugador = this.jugadores.shift(); // Sacar el primer elemento
            this.jugadores.push(jugador); // Insertarlo al final
            return jugador;
        }
    }

    agregarCartas(cartas) {
        this.cartas = cartas;
        this.rondas = ((this.cartas/this.jugadores.length) * 2) + (this.jugadores.length - 2)
    }

    agregarApuesta(nombre, apuesta) {
        for (let i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nombre === nombre) {
                this.jugadores[i].apuesta = apuesta;
                return;
            }
        }
    }

    agregarPuntos(nombre, puntos) {
        for (let i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nombre === nombre) {
                let puntuacion = 0;
                if (this.jugadores[i].apuesta === puntos) {
                    puntuacion = 10 + (this.isOros ? 10*puntos : 5*puntos);
                } else {
                    puntuacion = (this.isOros ? -10 : -5) * (Math.abs(this.jugadores[i].apuesta - puntos));
                }
                this.jugadores[i].puntos += puntuacion
                return;
            }
        }
    }

    avanzarEstado() {
        if (this.estado === 'jugadores') {
            this.estado = 'cartas';
        } else if (this.estado === 'cartas') {
            this.estado = 'ronda';
            this.rondaCount++;
            this.rondaActual++;
        } else if (this.estado === 'ronda' && this.rondaCount < this.rondas) {
            if (this.rondaCount < (this.cartas/this.jugadores.length)) {
                this.rondaCount++;
                this.rondaActual++;
            } else if ((this.rondaCount >= (this.cartas/this.jugadores.length)) && (this.rondaCount < ((this.cartas/this.jugadores.length) + this.jugadores.length - 1))) {
                this.rondaCount++;
            } else if (this.rondaActual > 1) {
                this.rondaCount++;
                this.rondaActual--;
            }
        } else if (this.estado === 'ronda' && this.rondaCount === this.rondas) {
            this.estado = 'fin';
        }
    }
}

export { Partida, Jugador };
