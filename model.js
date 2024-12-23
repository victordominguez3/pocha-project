class Jugador {
    constructor(nombre, puntos = 0) {
        this.nombre = nombre;
        this.puntos = puntos;
    }
}

class Partida {
    constructor() {
        this.jugadores = []; // Aquí almacenaremos los jugadores
        this.estado = 'jugadores'; // El estado inicial es "jugadores"
    }

    // Método para agregar un jugador
    agregarJugador(nombre) {
        const nuevoJugador = new Jugador(nombre);
        this.jugadores.push(nuevoJugador);
    }

    // Método para agregar puntos a un jugador
    agregarPuntos(jugadorIndex, puntos) {
        this.jugadores[jugadorIndex].puntos += puntos;
    }

    // Método para cambiar de estado (de una pantalla a la siguiente)
    avanzarEstado() {
        if (this.estado === 'jugadores') {
            this.estado = 'puntos';
        } else if (this.estado === 'puntos') {
            this.estado = 'final';
        }
    }
}

export { Partida, Jugador };
