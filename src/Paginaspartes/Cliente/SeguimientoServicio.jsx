import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './cliente_comun.css';
import './seguimiento_servicio.css';

const COORD_ORIGEN = [4.6767, -74.0483];
const COORD_DESTINO = [4.7068, -74.0595];

const RUTA_BOGOTA = [
  [4.6767, -74.0483],
  [4.6852, -74.0480],
  [4.6860, -74.0562],
  [4.7058, -74.0545],
  [4.7068, -74.0595]
];

const HITOS_SEGUIMIENTO = [
  {
    titulo: '1. Vehículo en camino al origen',
    desc: 'Unidad despachada hacia Cra 15 # 93-40 (Chapinero)',
    coord: [4.6735, -74.0492],
    eta: '45 min'
  },
  {
    titulo: '2. Cargue e inventario en origen',
    desc: 'Verificación de muebles y embalaje en domicilio',
    coord: [4.6767, -74.0483],
    eta: '34 min'
  },
  {
    titulo: '3. En tránsito por Autopista Norte',
    desc: 'Desplazamiento hacia Calle 127 # 45-12 (Suba)',
    coord: [4.6860, -74.0562],
    eta: '16 min'
  },
  {
    titulo: '4. Entrega completada en destino',
    desc: 'Descargue finalizado y acta recibida a satisfacción',
    coord: [4.7068, -74.0595],
    eta: 'Entregado'
  }
];

const iconoOrigen = L.divIcon({
  className: 'seg-pin seg-pin-origen',
  html: 'A',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const iconoDestino = L.divIcon({
  className: 'seg-pin seg-pin-destino',
  html: 'B',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const iconoCamion = L.divIcon({
  className: 'seg-pin seg-pin-camion',
  html: '<span class="material-symbols-outlined" style="font-size:17px">local_shipping</span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

export default function SeguimientoServicio({
  setPage,
  etapaActual = 1,
  inventario = [],
  novedades = [],
  mostrarToast
}) {
  const [ultimaConsulta, setUltimaConsulta] = useState('Hace un instante');

  const hitoActual = HITOS_SEGUIMIENTO[etapaActual] || HITOS_SEGUIMIENTO[1];
  const itemsVerificados = inventario.filter((item) => item.marcado).length;
  const ultimaNovedad = novedades.length > 0 ? novedades[0] : null;

  const sincronizarUbicacion = () => {
    const hora = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    setUltimaConsulta(`Actualizado ${hora}`);
    mostrarToast('Telemetría GPS sincronizada con el vehículo XYZ-789');
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
            <p className="cli-codigo-servicio">Orden SRV-2026-00852 · Rastreo satelital</p>
            <h1 className="cli-titulo-vista">Seguimiento de mi mudanza en vivo</h1>
          </div>
        </div>

        <span className={`badge ${etapaActual === 3 ? 'badge-verde' : 'badge-terra'}`}>
          {etapaActual === 3 ? 'Servicio entregado' : 'En operación'}
        </span>
      </div>

      <div className="seg-grid">
        <section className="card seg-tarjeta-mapa">
          <div className="seg-metricas">
            <div className="seg-metrica-caja">
              <p className="seg-metrica-valor">{hitoActual.eta}</p>
              <p className="seg-metrica-label">Tiempo estimado llegada</p>
            </div>
            <div className="seg-metrica-caja">
              <p className="seg-metrica-valor">11.8 km</p>
              <p className="seg-metrica-label">Distancia del trayecto</p>
            </div>
            <div className="seg-metrica-caja">
              <p className="seg-metrica-valor">{ultimaConsulta}</p>
              <p className="seg-metrica-label">Señal GPS vehículo</p>
            </div>
          </div>

          <div className="seg-mapa-contenedor">
            <MapContainer
              center={[4.692, -74.055]}
              zoom={13}
              className="seg-leaflet-mapa"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline
                positions={RUTA_BOGOTA}
                pathOptions={{ color: '#C1622D', weight: 5, opacity: 0.9 }}
              />

              <Marker position={COORD_ORIGEN} icon={iconoOrigen}>
                <Popup>Recogida A: Cra 15 # 93-40 (Chapinero)</Popup>
              </Marker>

              <Marker position={COORD_DESTINO} icon={iconoDestino}>
                <Popup>Entrega B: Calle 127 # 45-12 (Suba)</Popup>
              </Marker>

              <Marker position={hitoActual.coord} icon={iconoCamion}>
                <Popup>
                  <strong>Javier Morales · XYZ-789</strong><br />
                  Estado: {hitoActual.titulo}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="seg-acciones-mapa">
            <button
              type="button"
              onClick={sincronizarUbicacion}
              className="btn btn-primario cli-btn-full"
            >
              <span className="material-symbols-outlined">refresh</span>
              Actualizar ubicación GPS
            </button>

            <button
              type="button"
              onClick={() =>
                mostrarToast('Llamando al conductor Javier Morales (+57 310 489 2210)...')
              }
              className="btn btn-secundario cli-btn-full"
            >
              <span className="material-symbols-outlined">call</span>
              Contactar al conductor
            </button>
          </div>
        </section>

        <aside className="seg-columna-lateral">
          <div className="card">
            <h2 className="cli-subtitulo-card">Unidad y estado del traslado</h2>

            <div className="seg-conductor-ficha">
              <div className="seg-conductor-avatar">JM</div>
              <div>
                <p className="seg-conductor-nombre">Javier Morales</p>
                <p className="seg-conductor-vehiculo">
                  Chevrolet NPR Furgón · Placa XYZ-789
                </p>
              </div>
            </div>

            <div className="seg-timeline">
              {HITOS_SEGUIMIENTO.map((hito, index) => {
                const estadoClase =
                  index < etapaActual
                    ? 'completado'
                    : index === etapaActual
                    ? 'actual'
                    : '';
                const iconoHito =
                  index < etapaActual
                    ? 'check_circle'
                    : index === etapaActual
                    ? 'local_shipping'
                    : 'radio_button_unchecked';

                return (
                  <div key={index} className={`seg-hito ${estadoClase}`}>
                    <span className="material-symbols-outlined seg-hito-icono">
                      {iconoHito}
                    </span>
                    <div>
                      <p className="seg-hito-titulo">{hito.titulo}</p>
                      <p className="seg-hito-desc">{hito.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="cli-subtitulo-card">Control de inventario y novedades</h2>

            <div className="seg-inventario-resumen">
              <span>Artículos verificados en camión</span>
              <span className="badge badge-verde">
                {itemsVerificados} / {inventario.length} cargados
              </span>
            </div>

            {ultimaNovedad && (
              <div className="seg-alerta-ruta" style={{ marginTop: '12px' }}>
                <strong>Novedad reportada ({ultimaNovedad.hora}): </strong>
                <span>{ultimaNovedad.tipo} — {ultimaNovedad.detalle}</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}