import './header_cliente.css';

const PESTAÑAS_CLIENTE = [
  { id: 'dash_cliente', icono: 'dashboard', texto: 'Mi panel' },
  { id: 'cl_servicios', icono: 'inventory_2', texto: 'Mis servicios' },
  { id: 'cl_cotizacion', icono: 'calculate', texto: 'Cotizar' },
  { id: 'cl_pagos', icono: 'payments', texto: 'Pagos' },
  { id: 'cl_soporte', icono: 'support_agent', texto: 'Soporte' }
];

export default function HeaderCliente({
  page,
  setPage,
  usuarioActual,
  cerrarSesion
}) {
  const obtenerIniciales = (nombre = 'CL') => {
    return nombre
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() || '')
      .join('');
  };

  // Mantiene iluminada "Mi panel" si el usuario entra a Solicitar o Seguimiento
  const pestañaActiva =
    page === 'cl_solicitar' || page === 'cl_seguimiento' ? 'dash_cliente' : page;

  return (
    <header className="hcl-header">
      <div className="hcl-superior">
        <div className="hcl-usuario-bloque">
          <div className="hcl-avatar">
            {obtenerIniciales(usuarioActual?.nombre || 'Ana García')}
          </div>
          <div>
            <p className="hcl-nombre">{usuarioActual?.nombre || 'Ana García'}</p>
            <p className="hcl-subtitulo">
              Portal Cliente · {usuarioActual?.ciudad || 'Bogotá D.C.'}
            </p>
          </div>
        </div>

        <div className="hcl-acciones">
          <span className="hcl-estado-pill">
            <span className="hcl-punto-activo" />
            Cuenta verificada
          </span>

          <button
            type="button"
            onClick={cerrarSesion}
            className="hcl-btn-salir"
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>
      </div>

      <nav className="hcl-nav-barra">
        <div className="hcl-nav-contenedor">
          {PESTAÑAS_CLIENTE.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPage(tab.id)}
              className={`hcl-tab ${pestañaActiva === tab.id ? 'activa' : ''}`}
            >
              <span className="material-symbols-outlined">{tab.icono}</span>
              <span>{tab.texto}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}