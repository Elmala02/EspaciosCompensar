import React from 'react';

export default function Calendario({
  calendarDays = [],
  selectedDay = null,
  onDaySelect,
  monthName = 'Noviembre 2026'
}) {
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Franja superior naranja de 3px */}
      <div className="border-t-[3px] border-orange-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
              Disponibilidad Física en Campus
            </span>
            <h3 className="text-base font-extrabold tracking-tight text-gray-900 mt-0.5">
              {monthName}
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            30 Días Habilitados
          </span>
        </div>

        {/* Encabezado de Días de la Semana */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
          {weekDays.map((wd) => (
            <span
              key={wd}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1"
            >
              {wd}
            </span>
          ))}
        </div>

        {/* Grilla de Días con Corrección de Antipatrón Heurístico */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((item) => {
            const isSelected = selectedDay === item.day;
            const isAvailable = item.available;

            let buttonClasses = "py-2.5 px-1 text-center text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none flex flex-col items-center justify-center ";

            if (isSelected) {
              // Día seleccionado por el usuario
              buttonClasses += "bg-orange-500 text-white font-extrabold border border-orange-500 shadow-sm";
            } else if (isAvailable) {
              // Día disponible: Interactivo, con hover naranja y cursor pointer
              buttonClasses += "bg-white text-gray-800 border border-gray-200 hover:border-orange-500 hover:text-orange-500 shadow-sm cursor-pointer";
            } else {
              // Día NO disponible: Deshabilitado visualmente, gris carbón apagado, cursor not-allowed (sin usar rojo)
              buttonClasses += "bg-gray-100 text-gray-400 border border-gray-200/80 cursor-not-allowed opacity-60 line-through decoration-gray-400";
            }

            return (
              <button
                key={item.day}
                type="button"
                disabled={!isAvailable}
                onClick={() => onDaySelect(item.day)}
                title={
                  isAvailable
                    ? `Día ${item.day} disponible para reserva`
                    : `Día ${item.day} no disponible (mantenimiento o saturación)`
                }
                className={buttonClasses}
              >
                <span>{item.day}</span>
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected
                      ? 'bg-white'
                      : isAvailable
                      ? 'bg-orange-500'
                      : 'bg-gray-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Leyenda Accesible en Paleta Estricta */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-white border border-gray-300"></span>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-gray-100 border border-gray-300 opacity-70"></span>
            <span className="line-through decoration-gray-400">Ocupado / Mant.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-orange-500"></span>
            <span className="font-semibold text-gray-800">Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
