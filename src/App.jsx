import React, { useState } from 'react';
import { SpaceConfig } from './config/SpaceConfig.js';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Calendario from './components/Calendario.jsx';
import FormularioReserva from './components/FormularioReserva.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { NotificationFactory } from './patterns/creational/NotificationFactory.js';

export default function App() {
  // Estado de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Formulario de Login
  const [loginRole, setLoginRole] = useState('Docente');
  const [loginEmail, setLoginEmail] = useState('carlos.mendoza@ucompensar.edu.co');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Vista activa de la app: 'reservar' | 'mis-reservas' | 'arquitectura-gof'
  const [activeView, setActiveView] = useState('reservar');

  // Día seleccionado en el calendario (Noviembre 2026)
  const [selectedDay, setSelectedDay] = useState(14); // 14 está habilitado por defecto

  // Historial de Reservas radicadas
  const [reservationHistory, setReservationHistory] = useState([]);

  // Notificaciones Toasts (Patrón Creacional: Factory Method)
  const [toasts, setToasts] = useState([]);

  const addNotification = (toastInstance) => {
    setToasts((prev) => [...prev, toastInstance]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== toastInstance.id));
    }, 4500);
  };

  const removeNotification = (id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  // Sincronización al cambiar rol en el selector de login
  const handleRoleChange = (roleId) => {
    setLoginRole(roleId);
    setLoginError(null);
    const cred = SpaceConfig.demoCredentials.find((c) => c.role === roleId);
    if (cred) {
      setLoginEmail(cred.email);
      setLoginPassword(cred.password);
    }
  };

  // Acceso directo con botones rápidos de demo
  const handleShortcutClick = (cred) => {
    setLoginError(null);
    setLoginRole(cred.role);
    setLoginEmail(cred.email);
    setLoginPassword(cred.password);
  };

  // Manejador estricto de inicio de sesión
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = (loginEmail || '').trim().toLowerCase();
    const passTrimmed = (loginPassword || '').trim();

    // 1. Validación de campos obligatorios
    if (!emailTrimmed || !passTrimmed) {
      const err = {
        title: 'Campos Requeridos',
        message: 'Por favor ingrese tanto el correo institucional como la contraseña de red.'
      };
      setLoginError(err);
      addNotification(NotificationFactory.create('rechazada', err.title, err.message));
      return;
    }

    // 2. Comprobar existencia en directorio activo institucional
    const foundUser = SpaceConfig.demoCredentials.find(
      (c) => c.email.toLowerCase() === emailTrimmed
    );

    if (!foundUser) {
      const err = {
        title: 'Usuario No Registrado',
        message: `El correo "${emailTrimmed}" no se encuentra en el directorio institucional UCompensar.`
      };
      setLoginError(err);
      addNotification(NotificationFactory.create('rechazada', err.title, err.message));
      return;
    }

    // 3. Validación de coincidencia de rol
    if (foundUser.role.toLowerCase() !== loginRole.toLowerCase()) {
      const err = {
        title: 'Conflicto de Perfil Institucional',
        message: `El usuario ${foundUser.email} está registrado con el perfil "${foundUser.role}", pero intentó ingresar seleccionando el rol "${loginRole}".`
      };
      setLoginError(err);
      addNotification(NotificationFactory.create('rechazada', err.title, err.message));
      return;
    }

    // 4. Validación de contraseña
    if (passTrimmed !== foundUser.password) {
      const err = {
        title: 'Contraseña Incorrecta',
        message: `La contraseña ingresada no es válida para ${foundUser.name}. Verifique sus credenciales.`
      };
      setLoginError(err);
      addNotification(NotificationFactory.create('rechazada', err.title, err.message));
      return;
    }

    // 5. Credenciales válidas: Acceso exitoso
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      const user = {
        name: foundUser.name,
        role: foundUser.role,
        department: foundUser.department,
        initials: foundUser.initials,
        email: foundUser.email
      };

      setCurrentUser(user);
      setIsAuthenticated(true);

      // Emisión de Toast con Factory Method
      addNotification(
        NotificationFactory.create(
          'aprobada',
          'Sesión Autorizada',
          `Bienvenido(a) a UCompensar Espacios, ${user.name}.`
        )
      );
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginError(null);
    handleRoleChange('Docente');
  };

  const handleReservationComplete = (newItem) => {
    setReservationHistory((prev) => [newItem, ...prev]);
  };

  // =========================================================================
  // VISTA 1: PANTALLA DE LOGIN OBLIGATORIO (GATEKEEPER)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <ToastContainer toasts={toasts} onDismiss={removeNotification} />

        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden my-auto">
          {/* Franja superior naranja de 3px */}
          <div className="border-t-[3px] border-orange-500 p-8 pb-4 text-center">
            <div className="w-14 h-14 bg-orange-500 rounded-xl mx-auto flex items-center justify-center shadow-md mb-4">
              <span className="text-white font-extrabold text-2xl tracking-tight">U</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              UCompensar <span className="text-orange-500 font-bold">Espacios</span>
            </h1>
            <p className="text-xs font-normal text-gray-500 mt-1">
              Acceso Institucional Obligatorio — Campus Calle 42
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 pt-2 space-y-5">
            {/* Selector de Rol */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Rol Institucional
              </label>
              <select
                value={loginRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              >
                {SpaceConfig.roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Correo Institucional (@ucompensar.edu.co)
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setLoginError(null);
                }}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Contraseña de Red
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginError(null);
                }}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              />
            </div>

            {/* Alerta de Error en Paleta Estricta (Gris Carbón / border-gray-800) */}
            {loginError && (
              <div className="p-3.5 rounded-lg border-l-4 border-gray-800 bg-gray-100 text-gray-900 shadow-sm transition-all duration-200">
                <div className="flex items-start gap-2.5">
                  <div className="text-gray-800 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 pr-1">
                    <h4 className="text-xs font-bold tracking-tight text-gray-900 uppercase">
                      {loginError.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                      {loginError.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginError(null)}
                    aria-label="Cerrar alerta"
                    className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 -mt-1 rounded"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-orange-600 py-3.5 px-4 text-sm flex items-center justify-center gap-2"
            >
              {loginLoading ? <span>Verificando...</span> : <span>Iniciar Sesión</span>}
            </button>

            {/* Botones de Acceso Rápido para Auditoría y QA */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Credenciales Demo Institucionales (Click para auto-completar):
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SpaceConfig.demoCredentials.map((c) => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => handleShortcutClick(c)}
                    className="py-2 px-2 text-xs font-semibold rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 bg-gray-50 transition-all duration-200 text-center"
                  >
                    {c.role}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-2 italic leading-relaxed">
                Selecciona un rol para probar las estrategias <code className="text-gray-800 font-mono">DocenteReservaStrategy</code> y <code className="text-gray-800 font-mono">EstudianteReservaStrategy</code>.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: APLICACIÓN PRINCIPAL (DESBLOQUEADA TRAS LOGIN)
  // =========================================================================
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-50 font-sans antialiased text-gray-900">
      <ToastContainer toasts={toasts} onDismiss={removeNotification} />

      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        academicPeriod={SpaceConfig.metadata.academicPeriod}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          currentUser={currentUser}
        />

        <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          {/* VISTA A: RESERVAR ESPACIO */}
          {activeView === 'reservar' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Sistema de Asignación de Recursos Académicos
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona un día habilitado en el calendario y personaliza los recursos del espacio.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Campus Institucional
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    {SpaceConfig.metadata.campusName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda: Calendario Accesible */}
                <div className="lg:col-span-1">
                  <Calendario
                    calendarDays={SpaceConfig.calendarDays}
                    selectedDay={selectedDay}
                    onDaySelect={setSelectedDay}
                    monthName={SpaceConfig.metadata.monthName}
                  />
                </div>

                {/* Columna Derecha: Formulario con Decorator y Strategy */}
                <div className="lg:col-span-2">
                  <FormularioReserva
                    selectedDay={selectedDay}
                    currentUser={currentUser}
                    onReservationComplete={handleReservationComplete}
                    onNotify={addNotification}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VISTA B: HISTORIAL DE RESERVAS */}
          {activeView === 'mis-reservas' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Historial de Reservas Radicadas
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Registro de reservas procesadas bajo las estrategias institucionales de validación.
                  </p>
                </div>
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                  {reservationHistory.length} Registros en Sesión
                </span>
              </div>

              {reservationHistory.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-gray-400 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Aún no hay reservas en esta sesión</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Ve a la pestaña "Reservar Espacio" y radica tu primera solicitud.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservationHistory.map((item, index) => {
                    const isApproved = item.estado === 'APROBADA';
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-gray-500">
                              {item.reserva.getId()}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                isApproved
                                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {item.estado}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              Radicada a las {item.fechaCreacion}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-gray-900">
                            {item.reserva.getEspacio().name} — {item.reserva.getFecha()} ({item.reserva.getFranjaHoraria().label})
                          </h3>

                          <p className="text-xs text-gray-600 font-mono">
                            {item.reserva.getDescripcion()}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-1">
                            <span>
                              Solicitante: <strong className="text-gray-800">{item.reserva.getSolicitante().name} ({item.reserva.getSolicitante().role})</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Carga: <strong className="text-orange-500">{item.reserva.getPesoRecursos()} pts</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Costo: <strong className="text-gray-900">${item.reserva.getCosto().toLocaleString('es-CO')} COP</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VISTA C: ARQUITECTURA GOF Y SUSTENTACIÓN UML */}
          {activeView === 'arquitectura-gof' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  Arquitectura de Software y Patrones GoF
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Documentación interactiva de los 3 patrones de diseño integrados en UCompensar Espacios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta 1: Creacional */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-t-[3px] border-orange-500 p-6">
                    <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider block">
                      Patrón Creacional
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      Factory Method
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Encapsula la creación polimórfica de notificaciones Toast institucionales sin acoplar la UI a clases concretas.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-[11px] font-mono text-gray-700 space-y-1">
                      <p><strong>Creator:</strong> NotificationFactory</p>
                      <p><strong>Product:</strong> NotificationToast</p>
                      <p><strong>ConcreteProduct:</strong> ApprovedNotificationToast</p>
                      <p><strong>ConcreteProduct:</strong> RejectedNotificationToast</p>
                    </div>
                  </div>
                </div>

                {/* Tarjeta 2: Estructural */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-t-[3px] border-orange-500 p-6">
                    <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider block">
                      Patrón Estructural
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      Decorator
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Enriquece la reserva básica con kits de equipamiento (proyector, sonido, computadores) acumulando dinámicamente recursos y costos sin alterar la clase base.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-[11px] font-mono text-gray-700 space-y-1">
                      <p><strong>Component:</strong> ReservaBase</p>
                      <p><strong>Decorator:</strong> ReservaDecorator</p>
                      <p><strong>ConcreteDecorator:</strong> ProyectorDecorator</p>
                      <p><strong>ConcreteDecorator:</strong> SonidoDecorator</p>
                      <p><strong>ConcreteDecorator:</strong> ComputadoresExtra</p>
                    </div>
                  </div>
                </div>

                {/* Tarjeta 3: Comportamiento */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="border-t-[3px] border-orange-500 p-6">
                    <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider block">
                      Patrón de Comportamiento
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      Strategy
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Encapsula las reglas y políticas de validación según el rol institucional (Docente vs. Estudiante), permitiendo alternarlas en tiempo de ejecución.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-[11px] font-mono text-gray-700 space-y-1">
                      <p><strong>Strategy:</strong> ValidacionReservaStrategy</p>
                      <p><strong>ConcreteStrategy:</strong> EstudianteReservaStrategy</p>
                      <p><strong>ConcreteStrategy:</strong> DocenteReservaStrategy</p>
                      <p><strong>Context:</strong> FormularioReserva</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
