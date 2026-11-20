import './conductor_comun.css';
import './panel_conductor.css';

const ETAPAS_SERVICIO = [
  '1. Camino al origen',
  '2. Cargando inventario',
  '3. En ruta al destino',
  '4. Entrega completada'
];

export default function PanelConductor({
  usuarioActual,
  setPage,
  etapaActual = 2,
  inventario = [],
  novedades = [],
  fallasMecanicas = []
}) {
  const totalMarcados = inventario.filter((item) => item.marcado).length;

  return (
    <main className="cond-contenedor">
      <div className="pc-grid-principal">
        {/* Columna Izquierda: Resumen del servicio asignado */}
        <section className="card pc-tarjeta-ruta">
          <div className="pc-ruta-encabezado">
            <div>
              <p className="cond-codigo-servicio">Orden asignada · SRV-2026-00852</p>
              <h1 className="pc-ruta-titulo">Mudanza Residencial — Bogotá</h1>
            </div>
            <span className={`badge ${etapaActual === 3 ? 'badge-verde' : 'badge-terra'}`}>
              {ETAPAS_SERVICIO[etapaActual]}
            </span>
          </div>

          <div className="pc-datos-cliente">
            <div>
              <span className="pc-etiqueta-suave">Cliente: </span>
              <strong>Ana García</strong>
            </div>
            <div>
              <span className="pc-etiqueta-suave">Teléfono: </span>
              <strong>+57 315 234 8890</strong>
            </div>
            <div>
              <span className="pc-etiqueta-suave">Conductor: </span>
              <strong>{usuarioActual?.nombre}</strong>
            </div>
          </div>

          <div className="pc-trayecto">
            <div className="pc-punto-fila">
              <div className="pc-circulo">A</div>
              <div>
                <p className="pc-punto-tipo">Origen · Chapinero</p>
                <p className="pc-punto-direccion">Cra 15 # 93-40, Apto 402 (Con ascensor)</p>
              </div>
            </div>

            <div className="pc-punto-fila">
              <div className="pc-circulo destino">B</div>
              <div>
                <p className="pc-punto-tipo">Destino · Suba</p>
                <p className="pc-punto-direccion">Calle 127 # 45-12, Torre 3 Apto 801</p>
              </div>
            </div>
          </div>

          <p className="lbl">Progreso actual de la mudanza</p>
          <div className="pc-etapas">
            {ETAPAS_SERVICIO.map((etapa, index) => (
              <div
                key={index}
                className={`pc-etapa-item ${
                  index < etapaActual ? 'completada' : index === etapaActual ? 'actual' : ''
                }`}
              >
                {etapa}
              </div>
            ))}
          </div>

          <div className="pc-acciones-ruta">
            <button
              type="button"
              onClick={() => setPage('co_parada')}
              className="btn btn-primario"
            >
              <span className="material-symbols-outlined">pin_drop</span>
              Gestionar parada actual
            </button>

            <button
              type="button"
              onClick={() => setPage('co_gps')}
              className="btn btn-secundario"
            >
              <span className="material-symbols-outlined">navigation</span>
              Abrir navegación GPS
            </button>
          </div>
        </section>

        {/* Columna Derecha: Navegación hacia cada vista del conductor */}
        <aside className="pc-columna-herramientas">
          <div className="card">
            <h2 className="cond-subtitulo-card">Herramientas de ruta</h2>

            <div className="pc-lista-accesos">
              <button
                type="button"
                onClick={() => setPage('co_checklist')}
                className="pc-acceso-btn"
              >
                <div className="pc-acceso-izq">
                  <div className="pc-acceso-icono verde">
                    <span className="material-symbols-outlined">fact_check</span>
                  </div>
                  <div>
                    <p className="pc-acceso-titulo">Checklist de carga</p>
                    <p className="pc-acceso-desc">
                      {inventario.length > 0
                        ? `${totalMarcados} de ${inventario.length} artículos verificados`
                        : 'Verificar inventario cargado'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pc-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('co_vehiculo')}
                className="pc-acceso-btn"
              >
                <div className="pc-acceso-izq">
                  <div className="pc-acceso-icono">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <div>
                    <p className="pc-acceso-titulo">Mi vehículo</p>
                    <p className="pc-acceso-desc">
                      Placa {usuarioActual?.placa || 'ABC-123'} · Revisión diaria
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pc-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('co_novedad')}
                className="pc-acceso-btn"
              >
                <div className="pc-acceso-izq">
                  <div className="pc-acceso-icono rojo">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <p className="pc-acceso-titulo">Reportar novedad</p>
                    <p className="pc-acceso-desc">
                      {novedades.length > 0
                        ? `${novedades.length} novedad(es) enviada(s)`
                        : 'Tráfico, acceso o novedad con cliente'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pc-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('co_mecanico')}
                className="pc-acceso-btn"
              >
                <div className="pc-acceso-izq">
                  <div className="pc-acceso-icono rojo">
                    <span className="material-symbols-outlined">build</span>
                  </div>
                  <div>
                    <p className="pc-acceso-titulo">Reportar problema mecánico</p>
                    <p className="pc-acceso-desc">
                      {fallasMecanicas.length > 0
                        ? `${fallasMecanicas.length} alerta(s) técnica(s)`
                        : 'Fallas de motor, llantas o frenos'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pc-acceso-flecha">chevron_right</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}