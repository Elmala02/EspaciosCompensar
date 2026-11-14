/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: SonidoDecorator
 * =========================================================================
 * Añade un sistema de audio profesional con microfonía inalámbrica dual
 * y consola de mezcla a la reserva.
 * Recurso académico institucional gratuito.
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class SonidoDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.pesoExtra = 2; // Nivel de dotación técnica para eventos o conferencias
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
}

export default SonidoDecorator;
