import { useState } from 'react';
import './cliente_comun.css';
import './solicitar_servicio.css';

const TARIFAS_VEHICULO = {
  'Furgón NHR (2.5 Ton)': 195000,
  'Camión NPR (3.5 Ton)': 295000,
  'Camión FVR (6.0 Ton)': 445000
};

const formatearCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export default function SolicitarServicio({
  setPage,
  usuarioActual,
  cotizacionSeleccionada,
  serviciosCliente = [],
  setServiciosCliente,
  facturas = [],
  setFacturas,
  mostrarToast
}) {
  const [tipoServicio, setTipoServicio] = useState('Mudanza Residencial');
  const [ciudadOrigen, setCiudadOrigen] = useState('Bogotá D.C.');
  const [direccionOrigen, setDireccionOrigen] = useState('');
  const [ciudadDestino, setCiudadDestino] = useState('Bogotá D.C.');
  const [direccionDestino, setDireccionDestino] = useState('');
  const [fechaServicio, setFechaServicio] = useState('2026-11-25');
  const [franjaHoraria, setFranjaHoraria] = useState('Mañana (07:00 AM - 11:00 AM)');
  const [vehiculo, setVehiculo] = useState(
    cotizacionSeleccionada?.vehiculo || 'Camión NPR (3.5 Ton)'
  );
  const [articulos, setArticulos] = useState([
    'Sala 3 puestos',
    'Nevera',
    'Comedor 4 puestos',
    '10 Cajas medianas'
  ]);
  const [nuevoArticulo, setNuevoArticulo] = useState('');
  const [notas, setNotas] = useState('');

  const valorTotal =
    cotizacionSeleccionada?.total || TARIFAS_VEHICULO[vehiculo] || 295000;

  const agregarArticulo = () => {
    const limpio = nuevoArticulo.trim();
    if (!limpio) return;
    setArticulos([...articulos, limpio]);
    setNuevoArticulo('');
  };

  const quitarArticulo = (indexEliminar) => {
    setArticulos(articulos.filter((_, idx) => idx !== indexEliminar));
  };

  const confirmarSolicitud = (e) => {
    e.preventDefault();
    if (!direccionOrigen.trim() || !direccionDestino.trim()) return;

    const numeroOrden = 853 + serviciosCliente.length;
    const codigoGenerado = `SRV-2026-00${numeroOrden}`;

    const nuevaOrden = {
      codigo: codigoGenerado,
      titulo: `${tipoServicio} — ${ciudadDestino}`,
      fecha: fechaServicio,
      franja: franjaHoraria,
      origen: `${direccionOrigen.trim()} (${ciudadOrigen})`,
      destino: `${direccionDestino.trim()} (${ciudadDestino})`,
      vehiculo,
      articulosCount: articulos.length,
      valor: valorTotal,
      estado: 'Programado',
      conductor: 'Por asignar en despacho',
      placa: 'Pendiente'
    };

    if (setServiciosCliente) {
      setServiciosCliente([nuevaOrden, ...serviciosCliente]);
    }

    if (setFacturas) {
      const nuevaFactura = {
        codigo: `FAC-2026-0${412 + facturas.length}`,
        servicio: codigoGenerado,
        concepto: `${tipoServicio} (${ciudadOrigen} → ${ciudadDestino})`,
        fecha: fechaServicio,
        monto: valorTotal,
        estado: 'Pendiente'
      };
      setFacturas([nuevaFactura, ...facturas]);
    }

    mostrarToast(`Solicitud ${codigoGenerado} agendada correctamente`);
    setPage('cl_servicios');
  };

  return (
    <main className="cli-contenedor">
      <div className="cli-subvista-header">
        <div className="cli-subvista-izq">
          <button
            type="button"
            onClick={() => setPage('dash_cliente')}
            className="cli-btn-volver"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Mi panel
          </button>
          <div>
            <p className="cli-codigo-servicio">
              Titular: {usuarioActual?.nombre || 'Ana García'}
            </p>
            <h1 className="cli-titulo-vista">Solicitar nuevo servicio</h1>
          </div>
        </div>

        <span className="badge badge-verde">Agendamiento en línea</span>
      </div>

      <form onSubmit={confirmarSolicitud} className="ss-grid">
        <section className="card ss-tarjeta-form">
          <p className="ss-seccion-titulo">1. Tipo de traslado y vehículo</p>

          <div className="ss-fila-mitad cli-campo">
            <div>
              <label className="lbl">Categoría del servicio</label>
              <select
                className="inp"
                value={tipoServicio}
                onChange={(e) => setTipoServicio(e.target.value)}
              >
                <option>Mudanza Residencial</option>
                <option>Mudanza de Oficina</option>
                <option>Transporte de Carga Puntual</option>
              </select>
            </div>

            <div>
              <label className="lbl">Vehículo requerido</label>
              <select
                className="inp"
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
              >
                {Object.keys(TARIFAS_VEHICULO).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="ss-seccion-titulo">2. Direcciones de origen y destino</p>

          <div className="ss-fila-doble cli-campo">
            <div>
              <label className="lbl">Ciudad origen</label>
              <select
                className="inp"
                value={ciudadOrigen}
                onChange={(e) => setCiudadOrigen(e.target.value)}
              >
                <option>Bogotá D.C.</option>
                <option>Medellín</option>
                <option>Chía / Sabana</option>
              </select>
            </div>

            <div>
              <label className="lbl">Dirección de recogida</label>
              <input
                className="inp"
                value={direccionOrigen}
                onChange={(e) => setDireccionOrigen(e.target.value)}
                placeholder="Ej. Cra 15 # 93-40, Apto 402"
                required
              />
            </div>
          </div>

          <div className="ss-fila-doble cli-campo">
            <div>
              <label className="lbl">Ciudad destino</label>
              <select
                className="inp"
                value={ciudadDestino}
                onChange={(e) => setCiudadDestino(e.target.value)}
              >
                <option>Bogotá D.C.</option>
                <option>Medellín</option>
                <option>Chía / Sabana</option>
              </select>
            </div>

            <div>
              <label className="lbl">Dirección de entrega</label>
              <input
                className="inp"
                value={direccionDestino}
                onChange={(e) => setDireccionDestino(e.target.value)}
                placeholder="Ej. Calle 127 # 45-12, Torre 3"
                required
              />
            </div>
          </div>

          <p className="ss-seccion-titulo">3. Fecha, horario e inventario declarado</p>

          <div className="ss-fila-mitad cli-campo">
            <div>
              <label className="lbl">Fecha programada</label>
              <input
                type="date"
                className="inp"
                value={fechaServicio}
                onChange={(e) => setFechaServicio(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="lbl">Franja horaria de llegada</label>
              <select
                className="inp"
                value={franjaHoraria}
                onChange={(e) => setFranjaHoraria(e.target.value)}
              >
                <option>Mañana (07:00 AM - 11:00 AM)</option>
                <option>Tarde (01:00 PM - 05:00 PM)</option>
                <option>Jornada completa (08:00 AM)</option>
              </select>
            </div>
          </div>

          <div className="cli-campo">
            <label className="lbl">Inventario preliminar ({articulos.length} ítems)</label>
            <div className="ss-inventario-agregar">
              <input
                className="inp"
                value={nuevoArticulo}
                onChange={(e) => setNuevoArticulo(e.target.value)}
                placeholder="Ej. Lavadora carga frontal, Escritorio..."
              />
              <button
                type="button"
                onClick={agregarArticulo}
                className="btn btn-secundario"
              >
                Añadir
              </button>
            </div>

            <div className="ss-chips-lista">
              {articulos.map((item, idx) => (
                <span key={idx} className="ss-chip">
                  {item}
                  <button
                    type="button"
                    onClick={() => quitarArticulo(idx)}
                    className="ss-chip-quitar"
                    aria-label="Quitar artículo"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="cli-campo">
            <label className="lbl">Indicaciones especiales de acceso o portería</label>
            <textarea
              className="inp ss-textarea"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. Solicitar autorización de ingreso en administración, ascensor de carga disponible..."
            />
          </div>
        </section>

        <aside className="card ss-tarjeta-resumen">
          <h2 className="cli-subtitulo-card">Resumen de la orden</h2>

          <div className="ss-resumen-bloque">
            <div className="ss-resumen-fila">
              <span className="ss-resumen-label">Servicio</span>
              <span className="ss-resumen-valor">{tipoServicio}</span>
            </div>
            <div className="ss-resumen-fila">
              <span className="ss-resumen-label">Vehículo</span>
              <span className="ss-resumen-valor">{vehiculo}</span>
            </div>
            <div className="ss-resumen-fila">
              <span className="ss-resumen-label">Fecha</span>
              <span className="ss-resumen-valor">{fechaServicio}</span>
            </div>
            <div className="ss-resumen-fila">
              <span className="ss-resumen-label">Artículos declarados</span>
              <span className="ss-resumen-valor">{articulos.length} ítems</span>
            </div>
            <div className="ss-resumen-fila">
              <span className="ss-resumen-label">Total a facturar</span>
              <span className="ss-precio-destacado">{formatearCOP(valorTotal)}</span>
            </div>
          </div>

          <div className="ss-garantias">
            <div className="ss-garantia-item">
              <span className="material-symbols-outlined ss-garantia-icono">verified_user</span>
              <span>Checklist digital firmado al cargar y descargar</span>
            </div>
            <div className="ss-garantia-item">
              <span className="material-symbols-outlined ss-garantia-icono">satellite_alt</span>
              <span>Rastreo GPS en vivo desde tu panel cliente</span>
            </div>
            <div className="ss-garantia-item">
              <span className="material-symbols-outlined ss-garantia-icono">support_agent</span>
              <span>Reprogramación sin costo hasta 24 h antes</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primario cli-btn-full">
            <span className="material-symbols-outlined">check_circle</span>
            Confirmar y agendar mudanza
          </button>
        </aside>
      </form>
    </main>
  );
}