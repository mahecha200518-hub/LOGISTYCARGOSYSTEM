import { useState } from 'react';
import './conductor_comun.css';
import './reportar_problema_mecanico.css';

const SISTEMAS_VEHICULO = [
  'Llantas / Pinchazo o pérdida de presión',
  'Sistema de frenos / Pastillas o líquido',
  'Motor / Temperatura o testigo en tablero',
  'Sistema eléctrico / Batería o alternador',
  'Transmisión / Embrague o caja de cambios',
  'Suspensión / Dirección'
];

const ESTADOS_OPERATIVOS = [
  { id: 'leve', etiqueta: 'Leve (Continúa ruta)', badge: 'badge-verde' },
  { id: 'precaucion', etiqueta: 'Precaución (Taller)', badge: 'badge-ocre' },
  { id: 'inmovilizado', etiqueta: 'Inmovilizado (Grúa)', badge: 'badge-rojo' }
];

export default function ReportarProblemaMecanico({
  setPage,
  usuarioActual,
  fallasMecanicas = [],
  setFallasMecanicas,
  mostrarToast
}) {
  const [sistema, setSistema] = useState(SISTEMAS_VEHICULO[0]);
  const [severidad, setSeveridad] = useState('precaucion');
  const [kilometraje, setKilometraje] = useState('84520');
  const [descripcion, setDescripcion] = useState('');

  const enviarReporteMecanico = (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const horaActual = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const estadoObj =
      ESTADOS_OPERATIVOS.find((item) => item.id === severidad) || ESTADOS_OPERATIVOS[1];

    const nuevaFalla = {
      id: Date.now(),
      sistema,
      severidadId: estadoObj.id,
      severidadTexto: estadoObj.etiqueta,
      badgeClase: estadoObj.badge,
      kilometraje: kilometraje || 'No registrado',
      descripcion: descripcion.trim(),
      hora: horaActual,
      placa: usuarioActual?.placa || 'ABC-123'
    };

    if (setFallasMecanicas) {
      setFallasMecanicas([nuevaFalla, ...fallasMecanicas]);
    }

    setDescripcion('');
    mostrarToast(
      severidad === 'inmovilizado'
        ? 'Alerta crítica enviada: Solicitud de grúa y relevo activada'
        : 'Reporte mecánico enviado al área de mantenimiento'
    );
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
            <p className="cond-codigo-servicio">
              Placa {usuarioActual?.placa || 'ABC-123'} · Mantenimiento de flota
            </p>
            <h1 className="cond-titulo-vista">Reportar problema mecánico</h1>
          </div>
        </div>

        <span className="badge badge-rojo">Soporte técnico flota</span>
      </div>

      <div className="rpm-grid">
        {/* Columna Izquierda: Formulario de falla técnica */}
        <section className="card rpm-tarjeta-form">
          <h2 className="cond-subtitulo-card">Diagnóstico preliminar del vehículo</h2>

          <div className="rpm-vehiculo-banner">
            <div>
              <span className="rpm-etiqueta-suave">Vehículo: </span>
              <strong>{usuarioActual?.vehiculo || 'Ford F-350 Estacas'}</strong>
            </div>
            <div>
              <span className="rpm-etiqueta-suave">Placa: </span>
              <strong>{usuarioActual?.placa || 'ABC-123'}</strong>
            </div>
          </div>

          <form onSubmit={enviarReporteMecanico}>
            <div className="rpm-fila-doble cond-campo">
              <div>
                <label className="lbl">Sistema afectado</label>
                <select
                  className="inp"
                  value={sistema}
                  onChange={(e) => setSistema(e.target.value)}
                >
                  {SISTEMAS_VEHICULO.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="lbl">Kilometraje actual (km)</label>
                <input
                  type="number"
                  min="0"
                  className="inp"
                  value={kilometraje}
                  onChange={(e) => setKilometraje(e.target.value)}
                  placeholder="Ej. 84520"
                  required
                />
              </div>
            </div>

            <div className="cond-campo">
              <label className="lbl">Estado operativo del camión</label>
              <div className="rpm-severidad-grid">
                {ESTADOS_OPERATIVOS.map((opcion) => (
                  <button
                    key={opcion.id}
                    type="button"
                    onClick={() => setSeveridad(opcion.id)}
                    className={`rpm-severidad-btn ${
                      severidad === opcion.id ? `activo-${opcion.id}` : ''
                    }`}
                  >
                    {opcion.etiqueta}
                  </button>
                ))}
              </div>
            </div>

            <div className="cond-campo">
              <label className="lbl">Síntomas o descripción de la falla</label>
              <textarea
                className="inp rpm-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe ruidos, testigos encendidos en el tablero, fugas o pérdida de potencia..."
                required
              />
            </div>

            <button type="submit" className="btn btn-peligro cond-btn-full">
              <span className="material-symbols-outlined">build_circle</span>
              Enviar alerta al taller de flota
            </button>
          </form>
        </section>

        {/* Columna Derecha: Historial de reportes mecánicos y línea de auxilio */}
        <aside className="rpm-columna-lateral">
          <div className="card rpm-tarjeta-historial">
            <div className="rpm-lista-header">
              <h2 className="rpm-titulo-sin-margen">Reportes técnicos enviados</h2>
              <span className="badge badge-ocre">{fallasMecanicas.length} activo(s)</span>
            </div>

            {fallasMecanicas.length === 0 ? (
              <div className="rpm-vacio">
                Sin fallas mecánicas reportadas en este turno. El vehículo figura en condiciones normales de operación.
              </div>
            ) : (
              <div className="rpm-lista-fallas">
                {fallasMecanicas.map((falla) => (
                  <article key={falla.id} className="rpm-falla-item">
                    <div className="rpm-falla-top">
                      <span className="rpm-falla-sistema">{falla.sistema}</span>
                      <span className="rpm-falla-hora">{falla.hora}</span>
                    </div>
                    <p className="rpm-falla-desc">{falla.descripcion}</p>
                    <div className="rpm-falla-meta">
                      <span>Odómetro: {falla.kilometraje} km</span>
                      <span className={`badge ${falla.badgeClase}`}>
                        {falla.severidadTexto}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="cond-subtitulo-card">Asistencia vial y grúa 24/7</h2>
            <p className="rpm-auxilio-texto">
              Si el camión quedó detenido en vía principal, enciende luces estacionarias, ubica los conos reflejantes y solicita vehículo de transbordo.
            </p>
            <button
              type="button"
              onClick={() => mostrarToast('Conectando con línea de asistencia vial Logisty Cargo...')}
              className="btn btn-secundario cond-btn-full"
            >
              <span className="material-symbols-outlined">sos</span>
              Llamar a asistencia en carretera
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}