/**
 * =========================================================================
 * PATRÓN DE COMPORTAMIENTO: STRATEGY CONCRETA
 * Estrategia: EstudianteReservaStrategy
 * =========================================================================
 * Políticas institucionales para estudiantes:
 * 1. Máximo 2 horas continuas por solicitud (1 bloque estándar).
 * 2. Restricción estricta de equipamiento avanzado (laptops/cómputo GPU).
 * 3. Requiere aprobación previa de Coordinación de Infraestructura
 *    (emite estado PENDIENTE_APROBACION y toast informativo).
 */

import { ValidacionReservaStrategy } from './ValidacionReservaStrategy.js';

// Rol GoF: ConcreteStrategy
export class EstudianteReservaStrategy extends ValidacionReservaStrategy {
  validar(reserva, contexto = {}) {
    const franja = reserva.getFranjaHoraria();
    const recursos = reserva.getRecursos();
    const fecha = reserva.getFecha();

    // 1. Verificación de disponibilidad general de la fecha
    if (contexto.isDateAvailable && !contexto.isDateAvailable(fecha)) {
      return {
        valido: false,
        estado: 'RECHAZADA',
        tipoNotificacion: 'rechazada',
        titulo: 'Fecha No Disponible',
        mensaje: `El día seleccionado (${fecha}) no se encuentra habilitado para reservas estudiantiles por mantenimiento institucional.`,
        detalles: { motivo: 'Mantenimiento o saturación' }
      };
    }

    // 2. Regla de Duración: Máximo 2 horas continuas
    const duration = franja ? franja.durationHours || 2 : 2;
    if (duration > 2) {
      return {
        valido: false,
        estado: 'RECHAZADA',
        tipoNotificacion: 'rechazada',
        titulo: 'Límite de Tiempo Excedido',
        mensaje: `Los estudiantes solo pueden reservar un bloque máximo de 2 horas continuas. La franja seleccionada tiene una duración de ${duration} horas.`,
        detalles: { duracionSolicitada: duration, maximoPermitido: 2 }
      };
    }

    // 3. Regla de Equipamiento: Restricción de Kits de Cómputo Avanzado
    const tieneComputoAvanzado = recursos.some(r =>
      r.toLowerCase().includes('laptops') || r.toLowerCase().includes('gpu')
    );

    if (tieneComputoAvanzado) {
      return {
        valido: false,
        estado: 'RECHAZADA',
        tipoNotificacion: 'rechazada',
        titulo: 'Equipamiento Restringido',
        mensaje: 'El perfil de Estudiante no tiene autorización para solicitar kits informáticos de alto rendimiento de forma directa sin aval docente.',
        detalles: { restriccion: 'Kit Cómputo Avanzado' }
      };
    }

    // 4. Si supera los filtros, se radica como PENDIENTE DE APROBACIÓN
    return {
      valido: true,
      estado: 'PENDIENTE_APROBACION',
      tipoNotificacion: 'pendiente',
      titulo: 'Solicitud Enviada a Revisión',
      mensaje: `Tu solicitud para el espacio ${reserva.getEspacio().name} (${franja.label}) ha sido radicada. Por política institucional, las reservas estudiantiles requieren aprobación previa de Coordinación.`,
      detalles: {
        codigo: reserva.getId(),
        prioridad: 'Estándar',
        tipoAcceso: reserva.getTipoAcceso(),
        recursos: recursos
      }
    };
  }
}

export default EstudianteReservaStrategy;
