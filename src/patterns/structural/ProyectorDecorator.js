/**
 * =========================================================================
 * PATRÓN ESTRUCTURAL: DECORATOR CONCRETO
 * Decorador: ProyectorDecorator
 * =========================================================================
 * Añade un proyector interactivo 4K y conectividad HDMI/USB-C a la reserva.
 * Recurso académico institucional gratuito.
 */

import { ReservaDecorator } from './ReservaDecorator.js';

// Rol GoF: ConcreteDecorator
export class ProyectorDecorator extends ReservaDecorator {
  constructor(reserva) {
    super(reserva);
    this.pesoExtra = 1; // Incrementa el nivel de dotación técnica requerida
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
}

export default ProyectorDecorator;
