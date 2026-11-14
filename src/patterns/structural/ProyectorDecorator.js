/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: ProyectorDecorator
 * =========================================================================
 * Añade un proyector interactivo 4K y conectividad HDMI/USB-C a la reserva.
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class ProyectorDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.costoExtra = 25000;
    this.pesoExtra = 1;
  }

  getDescripcion() {
    return `${super.getDescripcion()} + [Kit Proyección: Proyector Láser 4K & Conectividad HDMI/USB-C]`;
  }

  getRecursos() {
    return [
      ...super.getRecursos(),
      'Proyector Láser Interactivo 4K',
      'Cableado y Adaptadores HDMI/USB-C'
    ];
  }

  getPesoRecursos() {
    return super.getPesoRecursos() + this.pesoExtra;
  }

  getCosto() {
    return super.getCosto() + this.costoExtra;
  }
}

export default ProyectorDecorator;
