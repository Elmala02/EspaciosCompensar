/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: SonidoDecorator
 * =========================================================================
 * Añade un sistema de audio profesional con microfonía inalámbrica dual
 * y consola de mezcla a la reserva.
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class SonidoDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.costoExtra = 35000;
    this.pesoExtra = 2;
  }

  getDescripcion() {
    return `${super.getDescripcion()} + [Kit Sonido: Microfonía Inalámbrica Dual & Consola Digital]`;
  }

  getRecursos() {
    return [
      ...super.getRecursos(),
      '2 Micrófonos Inalámbricos Shure de Solapa',
      'Consola de Mezcla Digital de 4 Canales',
      'Altavoces de Alta Fidelidad'
    ];
  }

  getPesoRecursos() {
    return super.getPesoRecursos() + this.pesoExtra;
  }

  getCosto() {
    return super.getCosto() + this.costoExtra;
  }
}

export default SonidoDecorator;
