/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR (GoF)
 * Clase Base Abstracta Decoradora de Reservas
 * =========================================================================
 * Envuelve una reserva (base o ya decorada) cumpliendo el mismo contrato,
 * permitiendo añadir equipamiento técnico y recursos adicionales dinámicamente
 * para el uso académico gratuito de docentes y estudiantes.
 */

// Rol GoF: Decorator
export class ReservaDecorator {
  /**
   * @param {Object} reserva - Instancia de ReservaBase o de otro ReservaDecorator
   */
  constructor(reserva) {
    if (!reserva || typeof reserva.getPesoRecursos !== 'function') {
      throw new TypeError("ReservaDecorator: Se requiere una instancia válida que implemente la interfaz de reserva.");
    }
    this.reserva = reserva;
  }

  getId() {
    return this.reserva.getId();
  }

  getEspacio() {
    return this.reserva.getEspacio();
  }

  getFecha() {
    return this.reserva.getFecha();
  }

  getFranjaHoraria() {
    return this.reserva.getFranjaHoraria();
  }

  getSolicitante() {
    return this.reserva.getSolicitante();
  }

  getMotivo() {
    return this.reserva.getMotivo();
  }

  getDescripcion() {
    return this.reserva.getDescripcion();
  }

  getRecursos() {
    return this.reserva.getRecursos();
  }

  getPesoRecursos() {
    return this.reserva.getPesoRecursos();
  }

  getTipoAcceso() {
    return this.reserva.getTipoAcceso();
  }
}

export default ReservaDecorator;
