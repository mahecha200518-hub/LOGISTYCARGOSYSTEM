import { useState } from 'react';
import './conductor_comun.css';
import './reportar_novedad.css';

const TIPOS_NOVEDAD = [
  'Tráfico pesado / Cierre vial',
  'Restricción de horario en portería',
  'Demora en entrega o recepción por cliente',
  'Condición climática adversa (Lluvia fuerte)',
  'Objeto frágil o de gran volumen no declarado'
];

export default function ReportarNovedad({
  setPage,
  usuarioActual,
  novedades = [],
  setNovedades,
  mostrarToast
}) {
  const [tipo, setTipo] = useState(TIPOS_NOVEDAD[0]);
  const [impacto, setImpacto] = useState('Media');
  const [tramo, setTramo] = useState('Autopista Norte con Calle 116');
  const [detalle, setDetalle] = useState('');

  const enviarReporte = (e) => {
    e.preventDefault();
    if (!detalle.trim()) return;

    const horaActual = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const nuevaNovedad = {
      id: Date.now(),
      tipo,
      impacto,
      tramo: tramo.trim() || 'En ruta asignada',
      detalle: detalle.trim(),
      hora: horaActual,
      conductor: usuarioActual?.nombre || 'Conductor'
    };

    if (setNovedades) {
      setNovedades([nuevaNovedad, ...novedades]);
    }

    setDetalle('');
    mostrarToast('Novedad enviada a la central de operaciones');
  };

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
            <p className="cond-codigo-servicio">Servicio SRV-2026-00852 · Bogotá</p>
            <h1 className="cond-titulo-vista">Reportar novedad operativa</h1>
          </div>
        </div>

        <span className="badge badge-terra">Canal directo oficina</span>
      </div>

      <div className="rn-grid">
        {/* Columna Izquierda: Formulario de reporte */}
        <section className="card rn-tarjeta-form">
          <h2 className="cond-subtitulo-card">Registrar nueva incidencia en ruta</h2>

          <form onSubmit={enviarReporte}>
            <div className="cond-campo">
              <label className="lbl">Motivo de la novedad</label>
              <select
                className="inp"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {TIPOS_NOVEDAD.map((motivo, idx) => (
                  <option key={idx} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>

            <div className="cond-campo">
              <label className="lbl">Impacto en el tiempo de entrega</label>
              <div className="rn-niveles">
                {['Baja', 'Media', 'Alta'].map((nivel) => {
                  const claseActiva =
                    impacto === nivel ? `activo-${nivel.toLowerCase()}` : '';
                  return (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setImpacto(nivel)}
                      className={`rn-nivel-btn ${claseActiva}`}
                    >
                      {nivel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="cond-campo">
              <label className="lbl">Ubicación o tramo actual</label>
              <input
                className="inp"
                value={tramo}
                onChange={(e) => setTramo(e.target.value)}
                placeholder="Ej. Calle 127 con Av. Suba"
              />
            </div>

            <div className="cond-campo">
              <label className="lbl">Descripción detallada</label>
              <textarea
                className="inp rn-textarea"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                placeholder="Explica qué ocurrió y cuánto tiempo adicional estimas..."
                required
              />
            </div>

            <button type="submit" className="btn btn-peligro cond-btn-full">
              <span className="material-symbols-outlined">send</span>
              Enviar novedad a oficina
            </button>
          </form>
        </section>

        {/* Columna Derecha: Historial de novedades del servicio */}
        <aside className="card rn-tarjeta-bitacora">
          <div className="rn-bitacora-header">
            <h2 className="rn-titulo-sin-margen">Bitácora de novedades</h2>
            <span className="badge badge-ocre">{novedades.length} registrada(s)</span>
          </div>

          {novedades.length === 0 ? (
            <div className="rn-vacio">
              Aún no has reportado novedades en este servicio. Si surge algún imprevisto en vía o con el cliente, regístralo aquí.
            </div>
          ) : (
            <div className="rn-lista-reportes">
              {novedades.map((item) => (
                <article key={item.id} className="rn-reporte-card">
                  <div className="rn-reporte-top">
                    <span className="rn-reporte-tipo">{item.tipo}</span>
                    <span className="rn-reporte-hora">{item.hora}</span>
                  </div>
                  <p className="rn-reporte-desc">{item.detalle}</p>
                  <div className="rn-reporte-footer">
                    <span>Ubicación: {item.tramo}</span>
                    <span className="badge badge-terra">Prioridad {item.impacto}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}