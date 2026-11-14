/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: ComputadoresExtraDecorator
 * =========================================================================
 * Añade un kit de cómputo avanzado (laptops de alto rendimiento para
 * ingeniería y talleres de desarrollo/ciberseguridad).
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class ComputadoresExtraDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.costoExtra = 60000;
    this.pesoExtra = 3;
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

  getCosto() {
    return super.getCosto() + this.costoExtra;
  }
}

export default ComputadoresExtraDecorator;
