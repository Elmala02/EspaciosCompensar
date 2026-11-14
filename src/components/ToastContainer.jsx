import React from 'react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-container"
      className="fixed top-20 right-6 flex flex-col gap-3 z-50 pointer-events-none"
    >
      {toasts.map((toast) => {
        const styles = toast.getStyles ? toast.getStyles() : {
          borderClass: 'border-orange-500',
          titleClass: 'text-orange-500',
          iconClass: 'text-orange-500'
        };
        const iconType = toast.getIconType ? toast.getIconType() : 'check';

        return (
          <div
            key={toast.id}
            className={`bg-white w-88 max-w-sm p-4 rounded-xl shadow-xl border-l-8 ${styles.borderClass} flex items-start gap-3 transform transition-all duration-300 pointer-events-auto select-none`}
          >
            {/* Ícono institucional según variante */}
            <div className={`${styles.iconClass} mt-0.5 flex-shrink-0`}>
              {iconType === 'check' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>

            {/* Contenido del Toast */}
            <div className="flex-1 pr-2">
              <h4 className={`text-xs font-extrabold ${styles.titleClass} tracking-tight leading-tight`}>
                {toast.title}
              </h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed font-normal">
                {toast.message}
              </p>
            </div>

            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="text-gray-400 hover:text-gray-700 transition-all duration-200 p-1 -mr-1 -mt-1 rounded"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
