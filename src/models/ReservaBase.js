/**
 * =========================================================================
 * MODELO DE DOMINIO Y COMPONENTE BASE DEL PATRÓN DECORATOR
 * =========================================================================
 */

// Rol GoF: Component / ConcreteComponent
export class ReservaBase {
  /**
   * @param {Object} params
   * @param {string} params.id - Código único de reserva
   * @param {import('./Espacio.js').Espacio} params.espacio - Espacio reservado
   * @param {string} params.fecha - Fecha en formato YYYY-MM-DD
   * @param {Object} params.franjaHoraria - { id: string, label: string, durationHours: number }
   * @param {Object} params.solicitante - { name: string, email: string, role: string, department: string }
   * @param {string} params.motivo - Justificación pedagógica / institucional
   * @param {number} [params.costoBase=30000] - Costo base administrativo en COP
   */
  constructor({
    id,
    espacio,
    fecha,
    franjaHoraria,
    solicitante,
    motivo,
    costoBase = 30000
  }) {
    this.id = id || `RES-${Date.now().toString(36).toUpperCase()}`;
    this.espacio = espacio;
    this.fecha = fecha;
    this.franjaHoraria = franjaHoraria;
    this.solicitante = solicitante;
    this.motivo = motivo;
    this.costoBase = costoBase;
    this.createdAt = new Date();
  }

  getId() {
    return this.id;
  }

  getEspacio() {
    return this.espacio;
  }

  getFecha() {
    return this.fecha;
  }

  getFranjaHoraria() {
    return this.franjaHoraria;
  }

  getSolicitante() {
    return this.solicitante;
  }

  getMotivo() {
    return this.motivo;
  }

  /**
   * Descripción base de la reserva de espacio
   * @returns {string}
   */
  getDescripcion() {
    return `Reserva estándar de espacio: ${this.espacio ? this.espacio.name : 'Espacio asignado'}`;
  }

  /**
   * Lista de recursos incluidos en la reserva básica
   * @returns {string[]}
   */
  getRecursos() {
    return ['Espacio Físico Académico', 'Mobiliario Ergonómico', 'Tablero Acrílico'];
  }

  /**
   * Peso / prioridad de consumo de recursos (Base = 1)
   * Escala acumulativa usada por los decoradores
   * @returns {number}
   */
  getPesoRecursos() {
    return 1;
  }

  /**
   * Cálculo de costo total de la reserva base
   * @returns {number}
   */
  getCosto() {
    return this.costoBase;
  }
}

export default ReservaBase;
