/**
 * =========================================================================
 * PATRÓN CREACIONAL: FACTORY METHOD (GoF)
 * Notificaciones Toast Institucionales UCompensar Espacios
 * =========================================================================
 * Regla de Paleta Estricta Institucional:
 * - Aprobada / Éxito: border-orange-500, texto naranja (#FF6600)
 * - Rechazada / Cancelada: border-gray-800, texto gris carbón (#1F2937) (prohibido rojo)
 * - Pendiente / En Revisión: border-gray-800 con acento gris corporativo
 */

// Rol GoF: Product
export class NotificationToast {
  /**
   * @param {string} id
   * @param {string} title
   * @param {string} message
   * @param {Object} [options]
   */
  constructor(id, title, message, options = {}) {
    if (new.target === NotificationToast) {
      throw new TypeError("No se puede instanciar NotificationToast de manera directa (Producto Abstracto).");
    }
    this.id = id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.title = title;
    this.message = message;
    this.options = options;
  }

  getStyles() {
    throw new Error("getStyles() debe ser implementado por la variante concreta.");
  }

  getIconType() {
    throw new Error("getIconType() debe ser implementado por la variante concreta.");
  }
}

// Rol GoF: ConcreteProduct
export class ApprovedNotificationToast extends NotificationToast {
  getStyles() {
    return {
      borderClass: "border-orange-500",
      titleClass: "text-orange-500",
      iconClass: "text-orange-500"
    };
  }

  getIconType() {
    return "check";
  }
}

// Rol GoF: ConcreteProduct
export class RejectedNotificationToast extends NotificationToast {
  getStyles() {
    return {
      borderClass: "border-gray-800",
      titleClass: "text-gray-800",
      iconClass: "text-gray-800"
    };
  }

  getIconType() {
    return "error";
  }
}

// Rol GoF: ConcreteProduct
export class PendingNotificationToast extends NotificationToast {
  getStyles() {
    return {
      borderClass: "border-gray-800",
      titleClass: "text-gray-900",
      iconClass: "text-gray-700"
    };
  }

  getIconType() {
    return "pending";
  }
}

// Rol GoF: Creator
export class NotificationFactory {
  /**
   * Factory Method para instanciar notificaciones según el tipo
   * @param {'aprobada' | 'rechazada' | 'pendiente'} type
   * @param {string} title
   * @param {string} message
   * @param {Object} [options]
   * @returns {NotificationToast}
   */
  static create(type, title, message, options = {}) {
    const normalizedType = String(type).trim().toLowerCase();
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    switch (normalizedType) {
      case 'aprobada':
      case 'approved':
      case 'success':
        return new ApprovedNotificationToast(id, title, message, options);

      case 'rechazada':
      case 'rejected':
      case 'error':
        return new RejectedNotificationToast(id, title, message, options);

      case 'pendiente':
      case 'pending':
      case 'warning':
      default:
        return new PendingNotificationToast(id, title, message, options);
    }
  }
}

export default NotificationFactory;
