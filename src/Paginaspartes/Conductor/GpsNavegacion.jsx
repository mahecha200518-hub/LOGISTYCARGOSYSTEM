import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './conductor_comun.css';
import './gps_navegacion.css';

// Coordenadas reales en Bogotá (Chapinero -> Suba)
const COORD_ORIGEN = [4.6767, -74.0483];
const COORD_DESTINO = [4.7068, -74.0595];

const RUTAS_DISPONIBLES = {
  optima: {
    tiempo: '34 min',
    distancia: '11.8 km',
    trafico: 'Fluido',
    puntos: [
      [4.6767, -74.0483], // Origen: Cra 15 # 93-40
      [4.6852, -74.0480], // Cra 15 con Calle 100
      [4.6860, -74.0562], // Autopista Norte con Calle 100
      [4.7058, -74.0545], // Autopista Norte con Calle 127
      [4.7068, -74.0595]  // Destino: Calle 127 # 45-12
    ],
    pasos: [
      { icono: 'north_east', instruccion: 'Salir por Cra 15 hacia el norte hasta Calle 100', tramo: '1.4 km' },
      { icono: 'turn_left', instruccion: 'Incorporarse a la Autopista Norte sentido sur-norte', tramo: '5.2 km' },
      { icono: 'turn_left', instruccion: 'Tomar salida occidental por la Calle 127', tramo: '3.9 km' },
      { icono: 'flag', instruccion: 'Llegada a Calle 127 # 45-12, Torre 3 (Suba)', tramo: '1.3 km' }
    ]
  },
  alterna: {
    tiempo: '43 min',
    distancia: '13.4 km',
    trafico: 'Moderado',
    puntos: [
      [4.6767, -74.0483], // Origen: Cra 15 # 93-40
      [4.6795, -74.0582], // Calle 92 con Av. NQS
      [4.6885, -74.0635], // Av. Suba con Calle 100
      [4.7115, -74.0715], // Av. Suba con Calle 127
      [4.7068, -74.0595]  // Destino: Calle 127 # 45-12
    ],
    pasos: [
      { icono: 'west', instruccion: 'Tomar Calle 92 al occidente hacia Av. NQS', tramo: '2.1 km' },
      { icono: 'straight', instruccion: 'Continuar por Av. Suba pasando glorieta Calle 100', tramo: '6.8 km' },
      { icono: 'turn_right', instruccion: 'Girar a la derecha en Calle 127 hacia el oriente', tramo: '3.2 km' },
      { icono: 'flag', instruccion: 'Llegada a Calle 127 # 45-12, Torre 3 (Suba)', tramo: '1.3 km' }
    ]
  }
};

// Iconos personalizados usando HTML/CSS para evitar fallos de imágenes en Vite
const iconoOrigen = L.divIcon({
  className: 'gps-pin gps-pin-origen',
  html: 'A',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const iconoDestino = L.divIcon({
  className: 'gps-pin gps-pin-destino',
  html: 'B',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const iconoCamion = L.divIcon({
  className: 'gps-pin gps-pin-camion',
  html: '<span class="material-symbols-outlined" style="font-size:17px">local_shipping</span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

export default function GpsNavegacion({ setPage, usuarioActual, mostrarToast }) {
  const [rutaActiva, setRutaActiva] = useState('optima');
  const [indiceCamion, setIndiceCamion] = useState(2);
  const [pasoSeleccionado, setPasoSeleccionado] = useState(1);

  const ruta = RUTAS_DISPONIBLES[rutaActiva];
  const posicionCamion = ruta.puntos[indiceCamion] || ruta.puntos[0];

  const simularMovimiento = () => {
    const siguientePunto = (indiceCamion + 1) % ruta.puntos.length;
    setIndiceCamion(siguientePunto);
    setPasoSeleccionado(Math.min(siguientePunto, ruta.pasos.length - 1));
    mostrarToast('Coordenada GPS actualizada en ruta');
  };

  const abrirGoogleMaps = () => {
    const url =
      'https://www.google.com/maps/dir/?api=1&origin=Carrera+15+93-40+Bogota&destination=Calle+127+45-12+Bogota&travelmode=driving';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="cond-contenedor">
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
              Vehículo {usuarioActual?.placa || 'ABC-123'} · SRV-2026-00852
            </p>
            <h1 className="cond-titulo-vista">Navegación satelital en tiempo real</h1>
          </div>
        </div>

        <span className="badge badge-verde">OpenStreetMap · En línea</span>
      </div>

      <div className="gps-grid">
        {/* Columna Izquierda: Mapa interactivo */}
        <section className="card gps-tarjeta-mapa">
          <div className="gps-rutas-tabs">
            <button
              type="button"
              onClick={() => { setRutaActiva('optima'); setIndiceCamion(1); setPasoSeleccionado(0); }}
              className={`gps-ruta-btn ${rutaActiva === 'optima' ? 'activa' : ''}`}
            >
              <p className="gps-ruta-nombre">Autopista Norte · Calle 127</p>
              <p className="gps-ruta-meta">34 min · 11.8 km (Más rápida)</p>
            </button>

            <button
              type="button"
              onClick={() => { setRutaActiva('alterna'); setIndiceCamion(1); setPasoSeleccionado(0); }}
              className={`gps-ruta-btn ${rutaActiva === 'alterna' ? 'activa' : ''}`}
            >
              <p className="gps-ruta-nombre">Av. NQS · Av. Suba</p>
              <p className="gps-ruta-meta">43 min · 13.4 km (Alterna)</p>
            </button>
          </div>

          <div className="gps-mapa-contenedor">
            <MapContainer
              center={[4.692, -74.055]}
              zoom={13}
              className="gps-leaflet-mapa"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline
                positions={ruta.puntos}
                pathOptions={{ color: '#C1622D', weight: 5, opacity: 0.9 }}
              />

              <Marker position={COORD_ORIGEN} icon={iconoOrigen}>
                <Popup>Origen A: Cra 15 # 93-40 (Chapinero)</Popup>
              </Marker>

              <Marker position={COORD_DESTINO} icon={iconoDestino}>
                <Popup>Destino B: Calle 127 # 45-12 (Suba)</Popup>
              </Marker>

              <Marker position={posicionCamion} icon={iconoCamion}>
                <Popup>
                  <strong>{usuarioActual?.nombre || 'Conductor'}</strong><br />
                  Placa: {usuarioActual?.placa || 'ABC-123'}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="gps-metricas">
            <div className="gps-metrica-caja">
              <p className="gps-metrica-valor">{ruta.tiempo}</p>
              <p className="gps-metrica-label">Tiempo estimado</p>
            </div>
            <div className="gps-metrica-caja">
              <p className="gps-metrica-valor">{ruta.distancia}</p>
              <p className="gps-metrica-label">Distancia total</p>
            </div>
            <div className="gps-metrica-caja">
              <p className="gps-metrica-valor">{ruta.trafico}</p>
              <p className="gps-metrica-label">Estado del tráfico</p>
            </div>
          </div>

          <div className="gps-acciones-externas">
            <button
              type="button"
              onClick={simularMovimiento}
              className="btn btn-primario"
              style={{ justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined">my_location</span>
              Simular avance GPS
            </button>

            <button
              type="button"
              onClick={abrirGoogleMaps}
              className="btn btn-secundario"
              style={{ justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Abrir en Google Maps
            </button>
          </div>
        </section>

        {/* Columna Derecha: Indicaciones giro a giro */}
        <aside className="card">
          <h2 className="cond-subtitulo-card">Indicaciones giro a giro</h2>
          <div className="gps-pasos-lista">
            {ruta.pasos.map((paso, index) => (
              <div
                key={index}
                onClick={() => { setPasoSeleccionado(index); setIndiceCamion(index); }}
                className={`gps-paso-item ${pasoSeleccionado === index ? 'seleccionado' : ''}`}
              >
                <div className="gps-paso-icono">
                  <span className="material-symbols-outlined">{paso.icono}</span>
                </div>
                <div>
                  <p className="gps-paso-texto">{paso.instruccion}</p>
                  <p className="gps-paso-distancia">Tramo aproximado: {paso.tramo}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}