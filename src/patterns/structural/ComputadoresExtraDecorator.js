/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: ComputadoresExtraDecorator
 * =========================================================================
 * Añade un kit de cómputo avanzado (20 laptops de alto rendimiento para
 * ingeniería y talleres de desarrollo/ciberseguridad).
 * Recurso académico institucional gratuito.
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class ComputadoresExtraDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.pesoExtra = 3; // Nivel de dotación alta: requiere alistamiento técnico
  }

  getDescripcion() {
    return `${super.getDescripcion()} + [Kit Cómputo: 20 Laptops de Alto Rendimiento GPU RTX]`;
  }

  getRecursos() {
    return [
      ...super.getRecursos(),
      '20 Laptops de Ingeniería con GPU Dedicada',
      'Switch Administrable de Red Gigabit',
      'Acceso a Entornos Virtuales UCompensar'
    ];
  }

  getPesoRecursos() {
    return super.getPesoRecursos() + this.pesoExtra;
  }
}

export default ComputadoresExtraDecorator;
