/**
 * =========================================================================
 * PATRÓN DE COMPORTAMIENTO: STRATEGY (GoF)
 * Interfaz / Clase Base Abstracta de Estrategias de Validación de Reserva
 * =========================================================================
 * Define el contrato de validación y aprobación de reservas según
 * el perfil institucional del usuario solicitante.
 */

// Rol GoF: Strategy
export class ValidacionReservaStrategy {
  /**
   * Ejecuta la validación y determina el estado de aprobación de la reserva
   * @param {Object} reserva - Instancia de ReservaBase o ReservaDecorator
   * @param {Object} [contexto] - Parámetros adicionales (catálogos, disponibilidad de fechas)
   * @returns {{
   *   valido: boolean,
   *   estado: 'APROBADA' | 'PENDIENTE_APROBACION' | 'RECHAZADA',
   *   tipoNotificacion: 'aprobada' | 'pendiente' | 'rechazada',
   *   titulo: string,
   *   mensaje: string,
   *   detalles: Object
   * }}
   */
  validar(reserva, contexto = {}) {
    throw new Error("ValidacionReservaStrategy: El método validar() debe ser implementado por la estrategia concreta.");
  }
}

export default ValidacionReservaStrategy;
