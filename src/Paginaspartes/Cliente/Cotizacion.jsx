import { useState } from 'react';
import './cliente_comun.css';
import './cotizacion.css';

const COBERTURAS = [
  { id: 'urbana', nombre: 'Urbana · Dentro de Bogotá D.C.', recargo: 0 },
  { id: 'sabana', nombre: 'Sabana · Chía, Cota, Soacha o Funza', recargo: 65000 },
  { id: 'nacional', nombre: 'Intermunicipal · Bogotá ↔ Medellín', recargo: 680000 }
];

const TAMANOS_MUDANZA = [
  {
    id: 'pequena',
    titulo: 'Apartaestudio',
    vehiculo: 'Furgón NHR (2.5 Ton)',
    desc: 'Hasta 15 cajas y 4 muebles',
    base: 160000
  },
  {
    id: 'mediana',
    titulo: 'Apartamento',
    vehiculo: 'Camión NPR (3.5 Ton)',
    desc: '2 a 3 habitaciones completas',
    base: 260000
  },
  {
    id: 'grande',
    titulo: 'Casa / Oficina',
    vehiculo: 'Camión FVR (6.0 Ton)',
    desc: 'Carga amplia y electrodomésticos',
    base: 410000
  }
];

const EXTRAS_DISPONIBLES = [
  {
    id: 'embalaje',
    nombre: 'Embalaje profesional',
    detalle: 'Cajas, vinipel, mantas acolchadas y cinta',
    precio: 75000
  },
  {
    id: 'armado',
    nombre: 'Desarme y armado de camas',
    detalle: 'Herramienta especializada por auxiliares',
    precio: 45000
  },
  {
    id: 'seguro',
    nombre: 'Póliza contra todo riesgo',
    detalle: 'Cobertura ampliada hasta $15.000.000 COP',
    precio: 35000
  }
];

const formatearCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export default function Cotizacion({
  setPage,
  setCotizacionSeleccionada,
  mostrarToast
}) {
  const [coberturaId, setCoberturaId] = useState('urbana');
  const [tamanoId, setTamanoId] = useState('mediana');
  const [accesoPisos, setAccesoPisos] = useState('ascensor');
  const [auxiliares, setAuxiliares] = useState(2);
  const [extrasActivos, setExtrasActivos] = useState(['embalaje']);

  const alternarExtra = (id) => {
    if (extrasActivos.includes(id)) {
      setExtrasActivos(extrasActivos.filter((item) => item !== id));
    } else {
      setExtrasActivos([...extrasActivos, id]);
    }
  };

  const coberturaObj =
    COBERTURAS.find((c) => c.id === coberturaId) || COBERTURAS[0];
  const tamanoObj =
    TAMANOS_MUDANZA.find((t) => t.id === tamanoId) || TAMANOS_MUDANZA[1];

  const costoEscaleras = accesoPisos === 'escaleras' ? 40000 : 0;
  const costoAuxiliares = auxiliares * 35000;
  const costoExtras = EXTRAS_DISPONIBLES.filter((e) =>
    extrasActivos.includes(e.id)
  ).reduce((acumulado, item) => acumulado + item.precio, 0);

  const totalEstimado =
    tamanoObj.base +
    coberturaObj.recargo +
    costoEscaleras +
    costoAuxiliares +
    costoExtras;

  const agendarConEstaTarifa = () => {
    if (setCotizacionSeleccionada) {
      setCotizacionSeleccionada({
        cobertura: coberturaObj.nombre,
        tamano: tamanoObj.titulo,
        vehiculo: tamanoObj.vehiculo,
        auxiliares,
        total: totalEstimado
      });
    }
    mostrarToast('Cotización cargada en el formulario de solicitud');
    setPage('cl_solicitar');
  };

  return (
    <main className="cli-contenedor">
      {/* Encabezado común */}
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
            <p className="cli-codigo-servicio">Simulador de tarifas · Logisty Cargo</p>
            <h1 className="cli-titulo-vista">Cotizar servicio de mudanza</h1>
          </div>
        </div>

        <span className="badge badge-ocre">Tarifa transparente COP</span>
      </div>

      <div className="cot-grid">
        {/* Columna Izquierda: Configuración de la mudanza */}
        <section className="card cot-tarjeta-form">
          <h2 className="cli-subtitulo-card">1. Configura tu traslado</h2>

          <div className="cli-campo">
            <label className="lbl">Cobertura y ruta del servicio</label>
            <select
              className="inp"
              value={coberturaId}
              onChange={(e) => setCoberturaId(e.target.value)}
            >
              {COBERTURAS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="cli-campo">
            <label className="lbl">Tamaño estimado y vehículo sugerido</label>
            <div className="cot-tamanos-grid">
              {TAMANOS_MUDANZA.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTamanoId(item.id)}
                  className={`cot-tamano-btn ${tamanoId === item.id ? 'activo' : ''}`}
                >
                  <p className="cot-tamano-titulo">{item.titulo}</p>
                  <p className="cot-tamano-vehiculo">{item.vehiculo}</p>
                  <p className="cot-tamano-desc">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="cot-fila-doble cli-campo">
            <div>
              <label className="lbl">Acceso en edificios</label>
              <select
                className="inp"
                value={accesoPisos}
                onChange={(e) => setAccesoPisos(e.target.value)}
              >
                <option value="ascensor">Con ascensor o primer piso</option>
                <option value="escaleras">Por escaleras (Piso 2 o superior)</option>
              </select>
            </div>

            <div>
              <label className="lbl">Auxiliares de cargue</label>
              <select
                className="inp"
                value={auxiliares}
                onChange={(e) => setAuxiliares(Number(e.target.value))}
              >
                <option value={1}>1 Auxiliar (+$35.000)</option>
                <option value={2}>2 Auxiliares (+$70.000)</option>
                <option value={3}>3 Auxiliares (+$105.000)</option>
              </select>
            </div>
          </div>

          <div className="cli-campo">
            <label className="lbl">Servicios adicionales opcionales</label>
            <div className="cot-extras-lista">
              {EXTRAS_DISPONIBLES.map((extra) => {
                const marcado = extrasActivos.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    className={`cot-extra-item ${marcado ? 'marcado' : ''}`}
                  >
                    <div className="cot-extra-izq">
                      <input
                        type="checkbox"
                        className="cot-checkbox"
                        checked={marcado}
                        onChange={() => alternarExtra(extra.id)}
                      />
                      <div>
                        <p className="cot-extra-nombre">{extra.nombre}</p>
                        <p className="cot-extra-detalle">{extra.detalle}</p>
                      </div>
                    </div>
                    <span className="cot-extra-precio">+{formatearCOP(extra.precio)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* Columna Derecha: Resumen y desglose en vivo */}
        <aside className="card cot-tarjeta-resumen">
          <h2 className="cli-subtitulo-card">Resumen de cotización</h2>

          <div className="cot-desglose-lista">
            <div className="cot-desglose-fila">
              <span className="cot-desglose-etiqueta">
                Base ({tamanoObj.vehiculo})
              </span>
              <span className="cot-desglose-valor">{formatearCOP(tamanoObj.base)}</span>
            </div>

            <div className="cot-desglose-fila">
              <span className="cot-desglose-etiqueta">Recargo por trayecto</span>
              <span className="cot-desglose-valor">{formatearCOP(coberturaObj.recargo)}</span>
            </div>

            <div className="cot-desglose-fila">
              <span className="cot-desglose-etiqueta">
                Personal ({auxiliares} auxiliar{auxiliares > 1 ? 'es' : ''})
              </span>
              <span className="cot-desglose-valor">{formatearCOP(costoAuxiliares)}</span>
            </div>

            <div className="cot-desglose-fila">
              <span className="cot-desglose-etiqueta">Maniobra por escaleras</span>
              <span className="cot-desglose-valor">{formatearCOP(costoEscaleras)}</span>
            </div>

            <div className="cot-desglose-fila">
              <span className="cot-desglose-etiqueta">Servicios adicionales</span>
              <span className="cot-desglose-valor">{formatearCOP(costoExtras)}</span>
            </div>
          </div>

          <div className="cot-total-bloque">
            <p className="cot-total-etiqueta">Total estimado del servicio</p>
            <p className="cot-total-monto">{formatearCOP(totalEstimado)}</p>
            <p className="cot-total-nota">
              Incluye combustible, peajes urbanos y acompañamiento
            </p>
          </div>

          <div className="cot-acciones-resumen">
            <button
              type="button"
              onClick={agendarConEstaTarifa}
              className="btn btn-primario cli-btn-full"
            >
              <span className="material-symbols-outlined">event_available</span>
              Agendar mudanza con esta tarifa
            </button>

            <button
              type="button"
              onClick={() => mostrarToast('Cotización guardada en tu historial de consultas')}
              className="btn btn-secundario cli-btn-full"
            >
              <span className="material-symbols-outlined">bookmark_add</span>
              Guardar cotización
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}