import { useState } from 'react';
import './conductor_comun.css';
import './HistorialConductor.css';

const HISTORIAL_BASE = [
  {
    codigo: 'SRV-2026-00841',
    fecha: '18/11/2026',
    ruta: 'Usaquén → Cedritos (Bogotá)',
    tipo: 'Urbana',
    cliente: 'Laura Gómez',
    calificacion: '5.0 ★'
  },
  {
    codigo: 'SRV-2026-00829',
    fecha: '15/11/2026',
    ruta: 'Teusaquillo → Salitre (Bogotá)',
    tipo: 'Urbana',
    cliente: 'Andrés Pardo',
    calificacion: '4.9 ★'
  },
  {
    codigo: 'SRV-2026-00810',
    fecha: '11/11/2026',
    ruta: 'Bogotá → Chía (Cundinamarca)',
    tipo: 'Intermunicipal',
    cliente: 'Camila Ruiz',
    calificacion: '5.0 ★'
  },
  {
    codigo: 'SRV-2026-00794',
    fecha: '06/11/2026',
    ruta: 'Kennedy → Modelia (Bogotá)',
    tipo: 'Urbana',
    cliente: 'Diego Navarro',
    calificacion: '4.8 ★'
  }
];

export default function HistorialConductor({
  setPage,
  usuarioActual,
  etapaActual = 2
}) {
  const [filtroTipo, setFiltroTipo] = useState('Todas');

  // Si el conductor completó la mudanza activa (etapa 3), se suma al historial
  const servicioRecienCompletado =
    etapaActual === 3
      ? [
          {
            codigo: 'SRV-2026-00852',
            fecha: '20/11/2026',
            ruta: 'Chapinero → Suba (Bogotá)',
            tipo: 'Urbana',
            cliente: 'Ana García',
            calificacion: '5.0 ★'
          }
        ]
      : [];

  const listaCompleta = [...servicioRecienCompletado, ...HISTORIAL_BASE];

  const serviciosFiltrados =
    filtroTipo === 'Todas'
      ? listaCompleta
      : listaCompleta.filter((srv) => srv.tipo === filtroTipo);

  return (
    <main className="cond-contenedor">
      {/* Encabezado común */}
      <div className="cond-subvista-header">
        <div className="cond-subvista-izq">
          <button
            type="button"
            onClick={() => setPage('dash_conductor')}
            className="cond-btn-volver"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Mi ruta
          </button>
          <div>
            <p className="cond-codigo-servicio">
              Conductor {usuarioActual?.nombre} · Placa {usuarioActual?.placa || 'ABC-123'}
            </p>
            <h1 className="cond-titulo-vista">Historial de servicios realizados</h1>
          </div>
        </div>

        <span className="badge badge-verde">{listaCompleta.length} entregados</span>
      </div>

      {/* Tarjetas métricas superiores */}
      <div className="hc-resumen-grid">
        <div className="hc-kpi-card">
          <p className="hc-kpi-etiqueta">Mudanzas completadas</p>
          <p className="hc-kpi-valor verde">{listaCompleta.length}</p>
        </div>

        <div className="hc-kpi-card">
          <p className="hc-kpi-etiqueta">Calificación promedio</p>
          <p className="hc-kpi-valor ocre">4.95 ★</p>
        </div>

        <div className="hc-kpi-card">
          <p className="hc-kpi-etiqueta">Cumplimiento a tiempo</p>
          <p className="hc-kpi-valor">100%</p>
        </div>
      </div>

      {/* Tabla con filtros */}
      <section className="card hc-tarjeta-tabla">
        <div className="hc-tabla-top">
          <div>
            <h2 className="cond-subtitulo-card" style={{ marginBottom: 0 }}>
              Registro de entregas verificadas
            </h2>
            <p className="hc-subtitulo">
              Filtra tus recorridos por cobertura urbana o intermunicipal
            </p>
          </div>

          <div className="hc-filtros">
            {['Todas', 'Urbana', 'Intermunicipal'].map((categoria) => (
              <button
                key={categoria}
                type="button"
                onClick={() => setFiltroTipo(categoria)}
                className={`hc-filtro-btn ${filtroTipo === categoria ? 'activo' : ''}`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        <div className="hc-tabla-scroll">
          <table className="hc-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Trayecto</th>
                <th>Cobertura</th>
                <th>Cliente</th>
                <th>Calificación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.map((srv) => (
                <tr key={srv.codigo}>
                  <td className="hc-codigo">{srv.codigo}</td>
                  <td>{srv.fecha}</td>
                  <td>{srv.ruta}</td>
                  <td>{srv.tipo}</td>
                  <td>{srv.cliente}</td>
                  <td className="hc-calificacion">{srv.calificacion}</td>
                  <td>
                    <span className="badge badge-verde">Entregado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}