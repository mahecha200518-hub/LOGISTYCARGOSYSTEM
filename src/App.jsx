import { useState, useEffect } from 'react';

// Listas editables solo desde código
import { ADMINISTRADORES } from './datos/administradores';
import { CONDUCTORES } from './datos/conductores';

// Módulo Autenticación
import Iniciosesion from './Paginaspartes/Iniciosecion/Iniciosesion';
import Registrocliente from './Paginaspartes/Iniciosecion/Registrocliente';
import Recuperacioncontrasena from './Paginaspartes/Iniciosecion/Recuperacioncontrasena';

// Módulo Conductor (Cabecera y 8 vistas)
import HeaderConductor from './componentes/HeaderConductor';
import PanelConductor from './Paginaspartes/Conductor/PanelConductor';
import ParadaActual from './Paginaspartes/Conductor/ParadaActual';
import ChecklistCarga from './Paginaspartes/Conductor/ChecklistCarga';
import GpsNavegacion from './Paginaspartes/Conductor/GpsNavegacion';
import MiVehiculo from './Paginaspartes/Conductor/MiVehiculo';
import ReportarNovedad from './Paginaspartes/Conductor/ReportarNovedad';
import ReportarProblemaMecanico from './Paginaspartes/Conductor/ReportarProblemaMecanico';
import HistorialConductor from './Paginaspartes/Conductor/HistorialConductor';

// Módulo Cliente (Cabecera y 7 vistas)
import HeaderCliente from './componentes/HeaderCliente';
import PanelCliente from './Paginaspartes/Cliente/PanelCliente';
import Cotizacion from './Paginaspartes/Cliente/Cotizacion';
import SolicitarServicio from './Paginaspartes/Cliente/SolicitarServicio';
import SeguimientoServicio from './Paginaspartes/Cliente/SeguimientoServicio';
import MisServicios from './Paginaspartes/Cliente/MisServicios';
import Pagos from './Paginaspartes/Cliente/Pagos';
import Soporte from './Paginaspartes/Cliente/Soporte';

const INVENTARIO_INICIAL = [
  { id: 1, nombre: 'Sofá modular 3 puestos', categoria: 'Sala / Comedor', marcado: true },
  { id: 2, nombre: 'Nevera Nevecón Samsung', categoria: 'Electrodoméstico', marcado: true },
  { id: 3, nombre: 'Comedor madera 6 puestos', categoria: 'Sala / Comedor', marcado: false },
  { id: 4, nombre: 'Cama Queen + Base cama', categoria: 'Alcoba', marcado: false },
  { id: 5, nombre: '14 Cajas selladas y etiquetadas', categoria: 'Cajas / Embalaje', marcado: false }
];

const FACTURAS_INICIALES = [
  {
    codigo: 'FAC-2026-0411',
    servicio: 'SRV-2026-00852',
    concepto: 'Mudanza Residencial (Chapinero → Suba)',
    fecha: '2026-11-20',
    monto: 335000,
    estado: 'Pendiente'
  },
  {
    codigo: 'FAC-2026-0389',
    servicio: 'SRV-2026-00815',
    concepto: 'Transporte de Carga Puntual — Bogotá D.C.',
    fecha: '2026-10-28',
    monto: 195000,
    estado: 'Pagado',
    metodo: 'PSE · Débito bancario'
  },
  {
    codigo: 'FAC-2026-0354',
    servicio: 'SRV-2026-00762',
    concepto: 'Mudanza Residencial (Bogotá → Chía)',
    fecha: '2026-09-14',
    monto: 340000,
    estado: 'Pagado',
    metodo: 'Tarjeta Crédito / Débito'
  }
];

const TICKETS_INICIALES = [
  {
    codigo: 'TKT-2026-0123',
    cliente: 'Ana García',
    orden: 'SRV-2026-00852',
    categoria: 'Actualización de direcciones o inventario',
    asunto: 'Autorización de parqueadero en torre destino',
    mensaje: 'Ya quedó radicado el permiso en la portería de Suba para el camión NPR.',
    fecha: '20/11/2026',
    estado: 'Resuelto'
  }
];

const PAGINAS_CONDUCTOR = [
  'dash_conductor',
  'co_parada',
  'co_checklist',
  'co_gps',
  'co_vehiculo',
  'co_novedad',
  'co_mecanico',
  'co_historial'
];

const PAGINAS_CLIENTE = [
  'dash_cliente',
  'cl_servicios',
  'cl_cotizacion',
  'cl_solicitar',
  'cl_seguimiento',
  'cl_pagos',
  'cl_soporte'
];

export default function App() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [toast, setToast] = useState('');

  // Estados operativos compartidos entre Conductor, Cliente y Admin
  const [etapaActual, setEtapaActual] = useState(1);
  const [inventario, setInventario] = useState(INVENTARIO_INICIAL);
  const [novedades, setNovedades] = useState([]);
  const [fallasMecanicas, setFallasMecanicas] = useState([]);

  // Estados propios del flujo del Cliente
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [serviciosCliente, setServiciosCliente] = useState([]);
  const [facturas, setFacturas] = useState(FACTURAS_INICIALES);
  const [ticketsSoporte, setTicketsSoporte] = useState(TICKETS_INICIALES);

  // Clientes registrados desde el formulario
  const [clientes, setClientes] = useState(() => {
    const guardados = localStorage.getItem('lc_clientes');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('lc_clientes', JSON.stringify(clientes));
  }, [clientes]);

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(''), 3000);
  };

  // Solo registra clientes
  const registrarCliente = (nuevoCliente) => {
    const correoLimpio = nuevoCliente.correo.toLowerCase();
    const existe = [...clientes, ...ADMINISTRADORES, ...CONDUCTORES].some(
      (u) => u.correo.toLowerCase() === correoLimpio
    );

    if (existe) {
      mostrarToast('Ese correo ya está registrado');
      return false;
    }

    setClientes([...clientes, { ...nuevoCliente, rol: 'cliente' }]);
    setRole('cliente');
    mostrarToast('Cliente registrado. Ahora inicia sesión');
    return true;
  };

  // Valida según el rol seleccionado
  const doLogin = (correoIngresado, passwordIngresada) => {
    if (!role) {
      mostrarToast('Selecciona primero un rol');
      return;
    }

    let listaDelRol = [];
    if (role === 'cliente') listaDelRol = clientes;
    else if (role === 'conductor') listaDelRol = CONDUCTORES;
    else if (role === 'admin') listaDelRol = ADMINISTRADORES;

    const encontrado = listaDelRol.find(
      (u) =>
        u.correo.toLowerCase() === correoIngresado.trim().toLowerCase() &&
        u.password === passwordIngresada
    );

    if (!encontrado) {
      mostrarToast(`Usuario no encontrado o contraseña incorrecta para ${role}`);
      return;
    }

    setUsuarioActual(encontrado);

    if (encontrado.rol === 'conductor') {
      setPage('dash_conductor');
    } else if (encontrado.rol === 'cliente') {
      setPage('dash_cliente');
    } else {
      setPage('panel');
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    setRole('');
    setPage('login');
  };

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 999,
          background: 'var(--madera)', color: 'var(--blanco)',
          padding: '12px 18px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--ocre)' }}>info</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Módulo Autenticación */}
      {page === 'login' && (
        <Iniciosesion
          role={role}
          setRole={setRole}
          setPage={setPage}
          doLogin={doLogin}
        />
      )}

      {page === 'register' && (
        <Registrocliente
          setPage={setPage}
          registrarCliente={registrarCliente}
          mostrarToast={mostrarToast}
        />
      )}

      {page === 'recover' && (
        <Recuperacioncontrasena
          setPage={setPage}
          mostrarToast={mostrarToast}
        />
      )}

      {/* Módulo Completo del Conductor */}
      {PAGINAS_CONDUCTOR.includes(page) && usuarioActual && (
        <div>
          <HeaderConductor
            page={page}
            setPage={setPage}
            usuarioActual={usuarioActual}
            cerrarSesion={cerrarSesion}
            mostrarToast={mostrarToast}
          />

          {page === 'dash_conductor' && (
            <PanelConductor
              usuarioActual={usuarioActual}
              setPage={setPage}
              etapaActual={etapaActual}
              inventario={inventario}
              novedades={novedades}
              fallasMecanicas={fallasMecanicas}
            />
          )}

          {page === 'co_parada' && (
            <ParadaActual
              setPage={setPage}
              etapaActual={etapaActual}
              setEtapaActual={setEtapaActual}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_checklist' && (
            <ChecklistCarga
              setPage={setPage}
              inventario={inventario}
              setInventario={setInventario}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_gps' && (
            <GpsNavegacion
              setPage={setPage}
              usuarioActual={usuarioActual}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_vehiculo' && (
            <MiVehiculo
              setPage={setPage}
              usuarioActual={usuarioActual}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_novedad' && (
            <ReportarNovedad
              setPage={setPage}
              usuarioActual={usuarioActual}
              novedades={novedades}
              setNovedades={setNovedades}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_mecanico' && (
            <ReportarProblemaMecanico
              setPage={setPage}
              usuarioActual={usuarioActual}
              fallasMecanicas={fallasMecanicas}
              setFallasMecanicas={setFallasMecanicas}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'co_historial' && (
            <HistorialConductor
              setPage={setPage}
              usuarioActual={usuarioActual}
              etapaActual={etapaActual}
            />
          )}
        </div>
      )}

      {/* Módulo Completo del Cliente */}
      {PAGINAS_CLIENTE.includes(page) && usuarioActual && (
        <div>
          <HeaderCliente
            page={page}
            setPage={setPage}
            usuarioActual={usuarioActual}
            cerrarSesion={cerrarSesion}
          />

          {page === 'dash_cliente' && (
            <PanelCliente
              usuarioActual={usuarioActual}
              setPage={setPage}
              etapaActual={etapaActual}
              novedades={novedades}
              serviciosCliente={serviciosCliente}
              facturas={facturas}
            />
          )}

          {page === 'cl_cotizacion' && (
            <Cotizacion
              setPage={setPage}
              setCotizacionSeleccionada={setCotizacionSeleccionada}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'cl_solicitar' && (
            <SolicitarServicio
              setPage={setPage}
              usuarioActual={usuarioActual}
              cotizacionSeleccionada={cotizacionSeleccionada}
              serviciosCliente={serviciosCliente}
              setServiciosCliente={setServiciosCliente}
              facturas={facturas}
              setFacturas={setFacturas}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'cl_seguimiento' && (
            <SeguimientoServicio
              setPage={setPage}
              etapaActual={etapaActual}
              inventario={inventario}
              novedades={novedades}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'cl_servicios' && (
            <MisServicios
              setPage={setPage}
              usuarioActual={usuarioActual}
              serviciosCliente={serviciosCliente}
              etapaActual={etapaActual}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'cl_pagos' && (
            <Pagos
              setPage={setPage}
              usuarioActual={usuarioActual}
              facturas={facturas}
              setFacturas={setFacturas}
              mostrarToast={mostrarToast}
            />
          )}

          {page === 'cl_soporte' && (
            <Soporte
              setPage={setPage}
              usuarioActual={usuarioActual}
              serviciosCliente={serviciosCliente}
              ticketsSoporte={ticketsSoporte}
              setTicketsSoporte={setTicketsSoporte}
              mostrarToast={mostrarToast}
            />
          )}
        </div>
      )}

      {/* Tarjeta temporal solo para Administrador */}
      {page === 'panel' && usuarioActual && (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '60px auto' }} className="card">
          <h2>Sesión iniciada</h2>
          <p style={{ margin: '10px 0' }}><strong>Nombre:</strong> {usuarioActual.nombre}</p>
          <p style={{ margin: '10px 0' }}><strong>Correo:</strong> {usuarioActual.correo}</p>
          <p style={{ margin: '10px 0 20px' }}><strong>Rol activo:</strong> {usuarioActual.rol.toUpperCase()}</p>
          <button onClick={cerrarSesion} className="btn btn-primario">Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}