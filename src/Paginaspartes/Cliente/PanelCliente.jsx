import './cliente_comun.css';
import './panel_cliente.css';

const ETAPAS_CLIENTE = [
  '1. Conductor en camino',
  '2. Cargando en origen',
  '3. En ruta al destino',
  '4. Entrega completada'
];

export default function PanelCliente({
  usuarioActual,
  setPage,
  etapaActual = 1,
  novedades = [],
  serviciosCliente = [],
  facturas = []
}) {
  const ultimaNovedad = novedades.length > 0 ? novedades[0] : null;
  const facturasPendientes = facturas.filter((f) => f.estado === 'Pendiente').length;

  return (
    <main className="cli-contenedor">
      <div className="pcl-grid-principal">
        {/* Columna Izquierda: Estado en vivo de la mudanza activa */}
        <section className="card pcl-tarjeta-activa">
          <div className="pcl-encabezado">
            <div>
              <p className="cli-codigo-servicio">Servicio activo · SRV-2026-00852</p>
              <h1 className="pcl-titulo-servicio">Mudanza Residencial — Bogotá</h1>
            </div>
            <span className={`badge ${etapaActual === 3 ? 'badge-verde' : 'badge-terra'}`}>
              {ETAPAS_CLIENTE[etapaActual]}
            </span>
          </div>

          <div className="pcl-datos-conductor">
            <div>
              <span className="pcl-etiqueta-suave">Conductor asignado: </span>
              <strong>Javier Morales</strong>
            </div>
            <div>
              <span className="pcl-etiqueta-suave">Vehículo: </span>
              <strong>Chevrolet NPR · XYZ-789</strong>
            </div>
            <div>
              <span className="pcl-etiqueta-suave">Titular: </span>
              <strong>{usuarioActual?.nombre || 'Ana García'}</strong>
            </div>
          </div>

          <div className="pcl-trayecto">
            <div className="pcl-punto-fila">
              <div className="pcl-circulo">A</div>
              <div>
                <p className="pcl-punto-tipo">Punto de recogida · Chapinero</p>
                <p className="pcl-punto-direccion">Cra 15 # 93-40, Apto 402</p>
              </div>
            </div>

            <div className="pcl-punto-fila">
              <div className="pcl-circulo destino">B</div>
              <div>
                <p className="pcl-punto-tipo">Punto de entrega · Suba</p>
                <p className="pcl-punto-direccion">Calle 127 # 45-12, Torre 3 Apto 801</p>
              </div>
            </div>
          </div>

          <p className="lbl">Seguimiento en tiempo real</p>
          <div className="pcl-etapas">
            {ETAPAS_CLIENTE.map((etapa, index) => (
              <div
                key={index}
                className={`pcl-etapa-item ${
                  index < etapaActual ? 'completada' : index === etapaActual ? 'actual' : ''
                }`}
              >
                {etapa}
              </div>
            ))}
          </div>

          {ultimaNovedad && (
            <div className="pcl-alerta-novedad">
              <span className="material-symbols-outlined pcl-alerta-icono">campaign</span>
              <div>
                <strong>Reporte del conductor ({ultimaNovedad.hora}): </strong>
                <span>{ultimaNovedad.tipo} — {ultimaNovedad.detalle}</span>
              </div>
            </div>
          )}

          <div className="pcl-acciones-principales">
            <button
              type="button"
              onClick={() => setPage('cl_seguimiento')}
              className="btn btn-primario"
            >
              <span className="material-symbols-outlined">location_on</span>
              Seguir camión en mapa
            </button>

            <button
              type="button"
              onClick={() => setPage('cl_servicios')}
              className="btn btn-secundario"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              Ver mis servicios ({serviciosCliente.length || 3})
            </button>
          </div>
        </section>

        {/* Columna Derecha: Accesos directos a las vistas del Cliente */}
        <aside className="pcl-columna-lateral">
          <div className="card">
            <h2 className="cli-subtitulo-card">Gestión de mudanzas</h2>

            <div className="pcl-lista-accesos">
              <button
                type="button"
                onClick={() => setPage('cl_cotizacion')}
                className="pcl-acceso-btn"
              >
                <div className="pcl-acceso-izq">
                  <div className="pcl-acceso-icono ocre">
                    <span className="material-symbols-outlined">calculate</span>
                  </div>
                  <div>
                    <p className="pcl-acceso-titulo">Cotizar mudanza</p>
                    <p className="pcl-acceso-desc">
                      Calcula tarifa estimada por tamaño y ruta
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pcl-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('cl_solicitar')}
                className="pcl-acceso-btn"
              >
                <div className="pcl-acceso-izq">
                  <div className="pcl-acceso-icono verde">
                    <span className="material-symbols-outlined">add_box</span>
                  </div>
                  <div>
                    <p className="pcl-acceso-titulo">Solicitar nuevo servicio</p>
                    <p className="pcl-acceso-desc">
                      Agenda fecha, direcciones e inventario
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pcl-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('cl_pagos')}
                className="pcl-acceso-btn"
              >
                <div className="pcl-acceso-izq">
                  <div className="pcl-acceso-icono">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="pcl-acceso-titulo">Pagos y facturación</p>
                    <p className="pcl-acceso-desc">
                      {facturasPendientes > 0
                        ? `${facturasPendientes} factura(s) pendiente(s) de pago`
                        : 'Historial de pagos y comprobantes'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pcl-acceso-flecha">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={() => setPage('cl_soporte')}
                className="pcl-acceso-btn"
              >
                <div className="pcl-acceso-izq">
                  <div className="pcl-acceso-icono">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p className="pcl-acceso-titulo">Soporte y ayuda</p>
                    <p className="pcl-acceso-desc">
                      Canal directo con atención al cliente
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined pcl-acceso-flecha">chevron_right</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}