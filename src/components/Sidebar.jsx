import React from 'react';

export default function Sidebar({ activeView, onViewChange, currentUser }) {
  const menuItems = [
    {
      id: 'reservar',
      label: 'Reservar Espacio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'mis-reservas',
      label: 'Historial de Reservas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'arquitectura-gof',
      label: 'Arquitectura GoF',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-orange-500 flex flex-col justify-between py-6 flex-shrink-0 text-white select-none">
      <div>
        <div className="px-6 mb-6">
          <span className="text-[11px] font-semibold text-orange-200 uppercase tracking-wider block">
            Módulo Institucional
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            Gestión de Recursos
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3.5 text-xs font-semibold transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-orange-600 border-l-4 border-white text-white font-bold shadow-inner'
                    : 'text-orange-50 hover:bg-orange-600 hover:border-l-4 hover:border-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pie del Sidebar: Resumen del Usuario */}
      <div className="px-6 pt-6 border-t border-orange-400/40 text-[11px] text-orange-100">
        <p className="font-semibold text-white">Campus Calle 42</p>
        <p className="text-[10px] text-orange-200 mt-0.5">
          Rol Activo: <strong className="text-white">{currentUser?.role || 'Visitante'}</strong>
        </p>
        <div className="mt-3 bg-orange-600/60 rounded-lg p-2.5 text-[10px] text-orange-100 border border-orange-400/30">
          <span className="font-bold block text-white">Estrategia Activa:</span>
          {currentUser?.role === 'Docente' ? 'DocenteReservaStrategy' : 'EstudianteReservaStrategy'}
        </div>
      </div>
    </aside>
  );
}
