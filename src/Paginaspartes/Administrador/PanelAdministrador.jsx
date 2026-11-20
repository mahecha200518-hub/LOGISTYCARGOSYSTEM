import './PanelAdministrador.css';

export default function PanelAdministrador({ usuarioActual, clientes, conductores, administradores, setPage }) {
  const totalUsuarios = administradores.length + conductores.length + clientes.length;

  return (
    <main className="panel-admin-wrapper">
      
      <div className="panel-admin-header">
        <div>
          <h1 className="panel-admin-titulo">Centro de Control — Oficina</h1>
          <p className="panel-admin-subtitulo">
            Sesión activa: <strong>{usuarioActual?.nombre}</strong> ({usuarioActual?.correo})
          </p>
        </div>

        <button onClick={() => setPage('ad_servicios')} className="btn btn-primario">
          <span className="material-symbols-outlined">add</span>
          Gestionar servicios
        </button>
      </div>

      {/* Tarjetas de métricas en tiempo real */}
      <section className="panel-admin-kpis">
        <div className="card kpi-admin-card">
          <p className="kpi-admin-titulo">Clientes registrados</p>
          <p className="kpi-admin-valor">{clientes.length}</p>
          <p className="kpi-admin-sub">Guardados en localStorage</p>
        </div>

        <div className="card kpi-admin-card verde">
          <p className="kpi-admin-titulo">Conductores activos</p>
          <p className="kpi-admin-valor">{conductores.length}</p>
          <p className="kpi-admin-sub">Definidos en conductores.js</p>
        </div>

        <div className="card kpi-admin-card ocre">
          <p className="kpi-admin-titulo">Administradores</p>
          <p className="kpi-admin-valor">{administradores.length}</p>
          <p className="kpi-admin-sub">Definidos en administradores.js</p>
        </div>

        <div className="card kpi-admin-card madera">
          <p className="kpi-admin-titulo">Total cuentas sistema</p>
          <p className="kpi-admin-valor">{totalUsuarios}</p>
          <p className="kpi-admin-sub">Accesos habilitados por rol</p>
        </div>
      </section>

      {/* Sección inferior: Tabla de usuarios + Accesos rápidos */}
      <section className="panel-admin-grid">
        <div className="card">
          <h2 style={{ fontSize: '17px' }}>Directorio de usuarios por rol</h2>
          <p style={{ fontSize: '12px', color: 'var(--topo)', marginTop: '2px' }}>
            Aquí puedes verificar los clientes creados desde el registro y el personal interno
          </p>

          <div className="tabla-admin-wrapper">
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {[...administradores, ...conductores, ...clientes].map((u, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.telefono || 'Sin registrar'}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.rol === 'admin'
                            ? 'badge-rojo'
                            : u.rol === 'conductor'
                            ? 'badge-ocre'
                            : 'badge-verde'
                        }`}
                      >
                        {u.rol.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna derecha: Accesos rápidos de gestión */}
        <div className="card">
          <h2 style={{ fontSize: '17px' }}>Módulos de gestión</h2>
          <p style={{ fontSize: '12px', color: 'var(--topo)', marginTop: '2px' }}>
            Navegación directa a cada área operativa
          </p>

          <div className="panel-admin-accesos">
            <button onClick={() => setPage('ad_servicios')} className="btn btn-secundario btn-acceso-admin">
              <span className="material-symbols-outlined">receipt_long</span>
              Control de servicios
            </button>

            <button onClick={() => setPage('ad_vehiculos')} className="btn btn-secundario btn-acceso-admin">
              <span className="material-symbols-outlined">local_shipping</span>
              Flota de vehículos
            </button>

            <button onClick={() => setPage('ad_conductores')} className="btn btn-secundario btn-acceso-admin">
              <span className="material-symbols-outlined">badge</span>
              Equipo de conductores
            </button>

            <button onClick={() => setPage('ad_clientes')} className="btn btn-secundario btn-acceso-admin">
              <span className="material-symbols-outlined">group</span>
              Base de clientes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}