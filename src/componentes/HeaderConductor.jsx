import { useState } from 'react';
import './HeaderConductor.css';

export default function HeaderConductor({ page, setPage, usuarioActual, cerrarSesion, mostrarToast }) {
  const [enTurno, setEnTurno] = useState(true);

  const iniciales = (usuarioActual?.nombre || 'CM')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const alternarTurno = () => {
    const nuevoEstado = !enTurno;
    setEnTurno(nuevoEstado);
    mostrarToast(nuevoEstado ? 'Estado cambiado a: En turno activo' : 'Estado cambiado a: En pausa');
  };

  return (
    <header className="hdr-cond">
      <div className="hdr-cond-superior">
        <div className="hdr-cond-perfil">
          <div className="hdr-cond-avatar">{iniciales}</div>
          <div>
            <p className="hdr-cond-nombre">{usuarioActual?.nombre}</p>
            <p className="hdr-cond-sub">
              {usuarioActual?.vehiculo || 'Vehículo asignado'} · Placa <strong>{usuarioActual?.placa || 'ABC-123'}</strong>
            </p>
          </div>
        </div>

        <div className="hdr-cond-acciones">
          <button
            type="button"
            onClick={alternarTurno}
            className={`hdr-cond-turno ${enTurno ? '' : 'pausa'}`}
          >
            <span>●</span>
            <span>{enTurno ? 'En turno' : 'En pausa'}</span>
          </button>

          <button type="button" onClick={cerrarSesion} className="hdr-cond-salir">
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>logout</span>
            Cerrar sesión
          </button>
        </div>
      </div>

      <nav className="hdr-cond-tabs">
        <a
          href="#ruta"
          onClick={(e) => { e.preventDefault(); setPage('dash_conductor'); }}
          className={`hdr-cond-tab ${page === 'dash_conductor' ? 'activo' : ''}`}
        >
          <span className="material-symbols-outlined">route</span>
          Mi ruta
        </a>
        <a
          href="#vehiculo"
          onClick={(e) => { e.preventDefault(); setPage('co_vehiculo'); }}
          className={`hdr-cond-tab ${page === 'co_vehiculo' ? 'activo' : ''}`}
        >
          <span className="material-symbols-outlined">local_shipping</span>
          Mi vehículo
        </a>
        <a
          href="#historial"
          onClick={(e) => { e.preventDefault(); setPage('co_historial'); }}
          className={`hdr-cond-tab ${page === 'co_historial' ? 'activo' : ''}`}
        >
          <span className="material-symbols-outlined">history</span>
          Historial
        </a>
      </nav>
    </header>
  );
}