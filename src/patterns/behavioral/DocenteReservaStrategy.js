/**
 * =========================================================================
 * PATRÓN DE COMPORTAMIENTO: STRATEGY CONCRETA
 * Estrategia: DocenteReservaStrategy
 * =========================================================================
 * Políticas institucionales para docentes:
 * 1. Permite reservar bloques extendidos (> 2 horas).
 * 2. Prioridad institucional sobre equipamiento avanzado (laptops, audio, proyector).
 * 3. Aprobación inmediata automática (emite estado APROBADA y toast de confirmación).
 */

import { ValidacionReservaStrategy } from './ValidacionReservaStrategy.js';

// Rol GoF: ConcreteStrategy
export class DocenteReservaStrategy extends ValidacionReservaStrategy {
  validar(reserva, contexto = {}) {
    const franja = reserva.getFranjaHoraria();
    const recursos = reserva.getRecursos();
    const fecha = reserva.getFecha();

    // 1. Verificación de disponibilidad física en calendario institucional
    if (contexto.isDateAvailable && !contexto.isDateAvailable(fecha)) {
      return {
        valido: false,
        estado: 'RECHAZADA',
        tipoNotificacion: 'rechazada',
        titulo: 'Espacio No Disponible',
        mensaje: `La fecha seleccionada (${fecha}) se encuentra reservada o en mantenimiento institucional para el Campus Calle 42.`,
        detalles: { motivo: 'Mantenimiento o saturación' }
      };
    }

    // 2. Aprobación Automática con Privilegios Docentes Plenos
    return {
      valido: true,
      estado: 'APROBADA',
      tipoNotificacion: 'aprobada',
      titulo: 'Reserva Confirmada',
      mensaje: `Profesor(a) ${reserva.getSolicitante().name}, su reserva para '${reserva.getEspacio().name}' en la franja ${franja.label} ha sido confirmada con éxito.`,
      detalles: {
        codigo: reserva.getId(),
        prioridad: 'Alta Institucional',
        pesoRecursos: reserva.getPesoRecursos(),
        costoCOP: reserva.getCosto(),
        equipamientoAsignado: recursos
      }
    };
  }
}

export default DocenteReservaStrategy;
