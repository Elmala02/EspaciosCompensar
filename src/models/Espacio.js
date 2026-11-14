/**
 * =========================================================================
 * MODELO DE DOMINIO: Espacio
 * =========================================================================
 * Representa un espacio físico del campus institucional UCompensar.
 */

export class Espacio {
  /**
   * @param {Object} data
   * @param {string} data.id - Identificador único (ej. 'LAB-301')
   * @param {string} data.name - Nombre descriptivo del espacio
   * @param {string} data.buildingId - Edificio ('A', 'B', 'C')
   * @param {number} data.capacity - Aforo máximo de personas
   * @param {string} data.type - Tipo de espacio ('Laboratorio', 'Auditorio', 'Aula Magistral')
   */
  constructor({ id, name, buildingId, capacity, type }) {
    this.id = id;
    this.name = name;
    this.buildingId = buildingId;
    this.capacity = capacity;
    this.type = type || 'Aula Estándar';
  }

  toString() {
    return `[${this.id}] ${this.name} (Capacidad: ${this.capacity} personas)`;
  }
}

export default Espacio;
