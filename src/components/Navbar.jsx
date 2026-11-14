import React from 'react';

export default function Navbar({ currentUser, onLogout, academicPeriod = '2026-I' }) {
  return (
    <header className="h-16 w-full bg-white border-b-4 border-orange-500 flex items-center justify-between px-8 z-30 flex-shrink-0">
      {/* Logo institucional UCompensar */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-extrabold text-lg tracking-tight">U</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">
            UCompensar <span className="text-orange-500 font-bold">Espacios</span>
          </span>
          <span className="text-[10px] text-gray-500 font-normal tracking-wide uppercase mt-0.5">
            Campus Virtual & Físico
          </span>
        </div>
      </div>

      {/* Métricas / Indicador de Periodo y Perfil */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>
            Periodo Activo: <strong className="text-gray-900">{academicPeriod}</strong>
          </span>
        </div>

        {currentUser && (
          <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-gray-500 font-normal">
                {currentUser.role} — {currentUser.department}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-500 flex items-center justify-center text-orange-500 font-bold text-sm shadow-sm transition-all duration-200">
              <span>{currentUser.initials}</span>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="text-xs text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-500 py-1.5 px-3 rounded-lg transition-all duration-200 ease-in-out bg-white shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
