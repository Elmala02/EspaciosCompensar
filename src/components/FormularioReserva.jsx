import React, { useState, useMemo } from 'react';
import { SpaceConfig } from '../config/SpaceConfig.js';
import { ReservaBase } from '../models/ReservaBase.js';
import { ProyectorDecorator } from '../patterns/structural/ProyectorDecorator.js';
import { SonidoDecorator } from '../patterns/structural/SonidoDecorator.js';
import { ComputadoresExtraDecorator } from '../patterns/structural/ComputadoresExtraDecorator.js';
import { EstudianteReservaStrategy } from '../patterns/behavioral/EstudianteReservaStrategy.js';
import { DocenteReservaStrategy } from '../patterns/behavioral/DocenteReservaStrategy.js';
import { NotificationFactory } from '../patterns/creational/NotificationFactory.js';

export default function FormularioReserva({
  selectedDay,
  currentUser,
  onReservationComplete,
  onNotify
}) {
  const [selectedBuilding, setSelectedBuilding] = useState('A');
  const [selectedRoomId, setSelectedRoomId] = useState('LAB-301');
  const [selectedSlotId, setSelectedSlotId] = useState('09:00 - 11:00');
  const [purpose, setPurpose] = useState('Taller práctico de ingeniería y ciberseguridad');
  const [attendees, setAttendees] = useState(30);

  // Estados de los Decoradores (Patrón Estructural)
  const [withProyector, setWithProyector] = useState(false);
  const [withSonido, setWithSonido] = useState(false);
  const [withComputadores, setWithComputadores] = useState(false);

  // Filtrar salones por edificio seleccionado
  const availableRooms = useMemo(() => {
    return SpaceConfig.rooms.filter((r) => r.buildingId === selectedBuilding);
  }, [selectedBuilding]);

  // Salón actual seleccionado
  const currentRoom = useMemo(() => {
    return SpaceConfig.rooms.find((r) => r.id === selectedRoomId) || SpaceConfig.rooms[0];
  }, [selectedRoomId]);

  // Franja horaria actual seleccionada
  const currentSlot = useMemo(() => {
    return SpaceConfig.timeSlots.find((s) => s.id === selectedSlotId) || SpaceConfig.timeSlots[0];
  }, [selectedSlotId]);

  // Construcción dinámica de la Reserva Decorada (Patrón Estructural: Decorator)
  const decoratedReservation = useMemo(() => {
    const formattedDate = `2026-11-${String(selectedDay || 14).padStart(2, '0')}`;

    // 1. Componente Base
    let res = new ReservaBase({
      espacio: currentRoom,
      fecha: formattedDate,
      franjaHoraria: currentSlot,
      solicitante: currentUser,
      motivo: purpose,
      costoBase: 35000
    });

    // 2. Aplicación acumulativa de Decoradores Concretos
    if (withProyector) {
      res = new ProyectorDecorator(res);
    }
    if (withSonido) {
      res = new SonidoDecorator(res);
    }
    if (withComputadores) {
      res = new ComputadoresExtraDecorator(res);
    }

    return res;
  }, [currentRoom, selectedDay, currentSlot, currentUser, purpose, withProyector, withSonido, withComputadores]);

  // Manejador del envío de la reserva aplicando el Patrón Strategy
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDay) {
      const toast = NotificationFactory.create(
        'rechazada',
        'Fecha Requerida',
        'Debe seleccionar un día disponible en el calendario del campus antes de radicar la reserva.'
      );
      onNotify(toast);
      return;
    }

    // Instanciación polimórfica de la Estrategia según el rol del usuario (Patrón Strategy)
    const strategy = currentUser.role === 'Docente'
      ? new DocenteReservaStrategy()
      : new EstudianteReservaStrategy();

    // Contexto de validación (comprobación de disponibilidad de calendario)
    const context = {
      isDateAvailable: (dateString) => {
        const dayNum = parseInt(dateString.split('-')[2], 10);
        const dayRecord = SpaceConfig.calendarDays.find((d) => d.day === dayNum);
        return dayRecord ? dayRecord.available : true;
      }
    };

    // Ejecución de la Strategy
    const result = strategy.validar(decoratedReservation, context);

    // Instanciación de notificación mediante el Factory Method
    const toast = NotificationFactory.create(
      result.tipoNotificacion,
      result.titulo,
      result.mensaje
    );
    onNotify(toast);

    if (result.valido) {
      onReservationComplete({
        reserva: decoratedReservation,
        estado: result.estado,
        detalles: result.detalles,
        fechaCreacion: new Date().toLocaleTimeString()
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Franja superior naranja de 3px */}
      <div className="border-t-[3px] border-orange-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
              Módulo de Solicitud & Dotación
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900 mt-0.5">
              Radicar Reserva de Espacio Académico
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg border border-orange-500 text-[11px] font-bold text-orange-500 bg-orange-50">
            {currentUser.role}: {currentUser.name}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fila 1: Edificio y Salón */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Edificio Institucional
              </label>
              <select
                value={selectedBuilding}
                onChange={(e) => {
                  setSelectedBuilding(e.target.value);
                  const firstRoom = SpaceConfig.rooms.find((r) => r.buildingId === e.target.value);
                  if (firstRoom) setSelectedRoomId(firstRoom.id);
                }}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:border-orange-500 transition-all duration-200"
              >
                {SpaceConfig.buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Salón / Laboratorio
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:border-orange-500 transition-all duration-200"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Franja Horaria con Corrección de Antipatrón */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Franja Horaria Académica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SpaceConfig.timeSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isExtended = slot.durationHours > 2;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`py-2.5 px-3 text-left rounded-lg border text-xs transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-gray-900 font-bold shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-500'
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isExtended
                          ? 'bg-gray-100 text-gray-700 border border-gray-300'
                          : 'bg-white text-orange-500 border border-orange-200'
                      }`}
                    >
                      {slot.durationHours}h
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila 3: Motivo y Asistentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Propósito de la Actividad Académica
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ej. Cátedra de Ciberseguridad, Taller de IA, Sustentación"
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:border-orange-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Aforo Estimado (Máx {currentRoom.capacity})
              </label>
              <input
                type="number"
                min="1"
                max={currentRoom.capacity}
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* SECCIÓN DEL PATRÓN DECORATOR: Dotación de Recursos Extra */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider block">
                  Patrón Estructural (Decorator)
                </span>
                <span className="text-xs font-bold text-gray-900">
                  Aditamentos de Equipamiento Especializado
                </span>
              </div>
              <span className="text-[11px] text-gray-500 italic">
                Enriquecimiento dinámico sin modificar la ReservaBase
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Decorador 1: Proyector */}
              <label
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-2.5 ${
                  withProyector
                    ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={withProyector}
                  onChange={(e) => setWithProyector(e.target.checked)}
                  className="mt-0.5 accent-orange-500 rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">ProyectorDecorator</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Láser 4K + HDMI/USB-C
                  </p>
                  <span className="text-[10px] font-semibold text-orange-600 block mt-1">
                    +$25.000 COP (Peso +1)
                  </span>
                </div>
              </label>

              {/* Decorador 2: Sonido */}
              <label
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-2.5 ${
                  withSonido
                    ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={withSonido}
                  onChange={(e) => setWithSonido(e.target.checked)}
                  className="mt-0.5 accent-orange-500 rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">SonidoDecorator</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    2 Micrófonos Shure + Consola
                  </p>
                  <span className="text-[10px] font-semibold text-orange-600 block mt-1">
                    +$35.000 COP (Peso +2)
                  </span>
                </div>
              </label>

              {/* Decorador 3: Computadores Extra */}
              <label
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-2.5 ${
                  withComputadores
                    ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={withComputadores}
                  onChange={(e) => setWithComputadores(e.target.checked)}
                  className="mt-0.5 accent-orange-500 rounded"
                />
                <div className="text-xs">
                  <p className="font-bold text-gray-900">ComputadoresExtra</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    20 Laptops GPU RTX + Switch
                  </p>
                  <span className="text-[10px] font-semibold text-orange-600 block mt-1">
                    +$60.000 COP (Peso +3)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* FICHA TÉCNICA DINÁMICA: Demostración en Vivo del Decorador */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 uppercase tracking-wide text-[11px]">
                Ficha Técnica Consolidada (Objeto Decorado):
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                ID: {decoratedReservation.getId()}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed font-mono bg-white p-2 rounded border border-gray-200">
              {decoratedReservation.getDescripcion()}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-gray-500">Recursos Totales: </span>
                <strong className="text-gray-800">
                  {decoratedReservation.getRecursos().length} ítems
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Índice de Carga: </span>
                <strong className="text-orange-500">
                  {decoratedReservation.getPesoRecursos()} pts
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Inversión Total: </span>
                <strong className="text-gray-900">
                  ${decoratedReservation.getCosto().toLocaleString('es-CO')} COP
                </strong>
              </div>
            </div>
          </div>

          {/* BOTÓN DE RADICACIÓN */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-orange-600 py-3.5 px-4 text-sm flex items-center justify-center gap-2"
          >
            <span>Radicar Solicitud con Validación Strategy</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
