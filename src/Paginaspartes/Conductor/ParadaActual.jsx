import { useState } from 'react';
import './conductor_comun.css';
import './parada_actual.css';

const ETAPAS_DETALLE = [
  {
    titulo: '1. Camino al origen',
    descripcion: 'Desplazamiento hacia Cra 15 # 93-40, Chapinero'
  },
  {
    titulo: '2. Cargando inventario',
    descripcion: 'Verificación de muebles y embalaje en el camión'
  },
  {
    titulo: '3. En ruta al destino',
    descripcion: 'Traslado hacia Calle 127 # 45-12, Suba'
  },
  {
    titulo: '4. Entrega completada',
    descripcion: 'Descargue finalizado y conformidad del cliente'
  }
];

export default function ParadaActual({
  setPage,
  etapaActual = 2,
  setEtapaActual,
  mostrarToast
}) {
  const [receptorNombre, setReceptorNombre] = useState('Ana García');
  const [observacionEntrega, setObservacionEntrega] = useState('');

  const avanzarEtapa = () => {
    if (etapaActual < ETAPAS_DETALLE.length - 1) {
      const siguiente = etapaActual + 1;
      setEtapaActual(siguiente);
      mostrarToast(`Etapa actualizada: ${ETAPAS_DETALLE[siguiente].titulo}`);
    }
  };

  const copiarDireccion = () => {
    const direccionActiva =
      etapaActual <= 1
        ? 'Cra 15 # 93-40, Apto 402, Chapinero, Bogotá'
        : 'Calle 127 # 45-12, Torre 3 Apto 801, Suba, Bogotá';

    navigator.clipboard?.writeText(direccionActiva);
    mostrarToast('Dirección copiada al portapapeles');
  };

  const confirmarRecepcion = (e) => {
    e.preventDefault();
    if (!receptorNombre.trim()) return;
    setEtapaActual(3);
    mostrarToast(`Entrega firmada por ${receptorNombre.trim()}`);
  };

  const esDestino = etapaActual >= 2;

  return (
    <main className="cond-contenedor">
      {/* Encabezado común con botón para volver al panel */}
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
            <p className="cond-codigo-servicio">Servicio SRV-2026-00852</p>
            <h1 className="cond-titulo-vista">Gestión de parada actual</h1>
          </div>
        </div>

        <span className={`badge ${etapaActual === 3 ? 'badge-verde' : 'badge-terra'}`}>
          {ETAPAS_DETALLE[etapaActual].titulo}
        </span>
      </div>

      <div className="pa-grid">
        {/* Columna Izquierda: Control de etapas */}
        <section className="card pa-tarjeta-principal">
          <div className="pa-encabezado-parada">
            <h2 className="cond-subtitulo-card" style={{ marginBottom: 0 }}>
              Secuencia operativa de la mudanza
            </h2>
            <span className="badge badge-ocre">
              {esDestino ? 'Punto B · Destino' : 'Punto A · Origen'}
            </span>
          </div>

          <div className="pa-timeline">
            {ETAPAS_DETALLE.map((etapa, index) => {
              const completado = index < etapaActual;
              const activo = index === etapaActual;

              return (
                <div
                  key={index}
                  className={`pa-paso ${completado ? 'completado' : activo ? 'activo' : ''}`}
                >
                  <div className="pa-paso-numero">
                    {completado ? '✓' : index + 1}
                  </div>
                  <div className="pa-paso-info">
                    <p className="pa-paso-titulo">{etapa.titulo}</p>
                    <p className="pa-paso-desc">{etapa.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {etapaActual < ETAPAS_DETALLE.length - 1 ? (
            <button
              type="button"
              onClick={avanzarEtapa}
              className="btn btn-primario cond-btn-full"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Confirmar y pasar a: {ETAPAS_DETALLE[etapaActual + 1].titulo}
            </button>
          ) : (
            <div className="pa-confirmacion-exito">
              <span className="material-symbols-outlined">task_alt</span>
              <span>Servicio completado y cerrado correctamente.</span>
            </div>
          )}
        </section>

        {/* Columna Derecha: Datos del punto activo y cierre de entrega */}
        <aside className="pa-columna-lateral">
          <div className="card">
            <h2 className="cond-subtitulo-card">
              {esDestino ? 'Datos de entrega (Destino)' : 'Datos de recogida (Origen)'}
            </h2>

            <div className="pa-dato-bloque">
              <p className="pa-dato-label">Dirección exacta</p>
              <p className="pa-dato-texto">
                {esDestino
                  ? 'Calle 127 # 45-12, Torre 3 Apto 801 · Suba'
                  : 'Cra 15 # 93-40, Apto 402 · Chapinero'}
              </p>
            </div>

            <div className="pa-dato-bloque">
              <p className="pa-dato-label">Cliente responsable</p>
              <p className="pa-dato-texto">Ana García · +57 315 234 8890</p>
            </div>

            <div className="pa-dato-bloque">
              <p className="pa-dato-label">Instrucciones de acceso</p>
              <p className="pa-dato-texto">
                {esDestino
                  ? 'Anunciarse en portería vehicular torre 3'
                  : 'Ascensor de carga habilitado hasta las 5:00 PM'}
              </p>
            </div>

            <div className="pa-botones-contacto">
              <button
                type="button"
                onClick={() => mostrarToast('Llamando a Ana García (+57 315 234 8890)...')}
                className="btn btn-secundario"
              >
                <span className="material-symbols-outlined">call</span>
                Llamar
              </button>

              <button
                type="button"
                onClick={copiarDireccion}
                className="btn btn-secundario"
              >
                <span className="material-symbols-outlined">content_copy</span>
                Copiar dir.
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="cond-subtitulo-card">Acta rápida de entrega</h2>
            <form onSubmit={confirmarRecepcion}>
              <div className="cond-campo">
                <label className="lbl">Nombre de quien recibe</label>
                <input
                  className="inp"
                  value={receptorNombre}
                  onChange={(e) => setReceptorNombre(e.target.value)}
                  required
                />
              </div>

              <div className="cond-campo">
                <label className="lbl">Observación final (opcional)</label>
                <input
                  className="inp"
                  value={observacionEntrega}
                  onChange={(e) => setObservacionEntrega(e.target.value)}
                  placeholder="Ej. Todo entregado sin novedad"
                />
              </div>

              <button type="submit" className="btn btn-primario cond-btn-full">
                <span className="material-symbols-outlined">draw</span>
                Registrar entrega final
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}