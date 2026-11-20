import { useState } from 'react';
import './conductor_comun.css';
import './mi_vehiculo.css';

const PUNTOS_INSPECCION = [
  { clave: 'frenos', texto: 'Sistema de frenos y nivel de líquido hidráulico' },
  { clave: 'luces', texto: 'Luces frontales, direccionales, reversa y freno' },
  { clave: 'llantas', texto: 'Presión de aire, labrado y pernos de llantas' },
  { clave: 'correas', texto: 'Correas de amarre, lazos y mantas acolchadas' },
  { clave: 'combustible', texto: 'Nivel de combustible superior al 50%' }
];

export default function MiVehiculo({ setPage, usuarioActual, mostrarToast }) {
  const [chequeos, setChequeos] = useState({
    frenos: true,
    luces: true,
    llantas: true,
    correas: true,
    combustible: false
  });
  const [revisionGuardada, setRevisionGuardada] = useState(false);

  const alternarChequeo = (clave) => {
    setChequeos({
      ...chequeos,
      [clave]: !chequeos[clave]
    });
    setRevisionGuardada(false);
  };

  const registrarRevision = (e) => {
    e.preventDefault();
    setRevisionGuardada(true);
    mostrarToast('Inspección preoperacional registrada correctamente');
  };

  const totalAprobados = Object.values(chequeos).filter(Boolean).length;

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
              Placa {usuarioActual?.placa || 'ABC-123'} · Flota Logisty Cargo
            </p>
            <h1 className="cond-titulo-vista">Mi vehículo e inspección diaria</h1>
          </div>
        </div>

        <span className="badge badge-verde">Vehículo operativo</span>
      </div>

      <div className="mv-grid">
        {/* Columna Izquierda: Ficha técnica y documentación */}
        <section className="card mv-tarjeta-ficha">
          <div className="mv-ficha-header">
            <h2 className="mv-titulo-card">Ficha técnica y documentos</h2>
            <span className="badge badge-ocre">{usuarioActual?.placa || 'ABC-123'}</span>
          </div>

          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Modelo / Carrocería</span>
            <span className="mv-dato-valor">{usuarioActual?.vehiculo || 'Ford F-350 Estacas'}</span>
          </div>
          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Placa registrada</span>
            <span className="mv-dato-valor">{usuarioActual?.placa || 'ABC-123'}</span>
          </div>
          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Capacidad autorizada</span>
            <span className="mv-dato-valor">{usuarioActual?.capacidad || '3.5 Toneladas / 18 m³'}</span>
          </div>
          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Licencia del conductor</span>
            <span className="mv-dato-valor">{usuarioActual?.licencia || 'C2 · Vigente'}</span>
          </div>
          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Seguro SOAT</span>
            <span className="mv-dato-valor">{usuarioActual?.soat || 'Vigente'}</span>
          </div>
          <div className="mv-dato-fila">
            <span className="mv-dato-etiqueta">Revisión Tecnomecánica</span>
            <span className="mv-dato-valor">{usuarioActual?.tecnomecanica || 'Vigente'}</span>
          </div>

          <div className="mv-alerta-mecanica">
            <span>¿Detectaste alguna falla en el camión?</span>
            <button
              type="button"
              onClick={() => setPage('co_mecanico')}
              className="btn btn-peligro"
            >
              <span className="material-symbols-outlined">build</span>
              Reportar falla
            </button>
          </div>
        </section>

        {/* Columna Derecha: Inspección preoperacional */}
        <section className="card mv-tarjeta-inspeccion">
          <div className="mv-ficha-header">
            <h2 className="mv-titulo-card">Inspección preoperacional</h2>
            <span className="badge badge-verde">
              {totalAprobados} / {PUNTOS_INSPECCION.length} OK
            </span>
          </div>
          <p className="mv-subtitulo">
            Verifica los puntos obligatorios de seguridad vial antes de iniciar desplazamiento.
          </p>

          <form onSubmit={registrarRevision}>
            <div className="mv-lista-chequeo">
              {PUNTOS_INSPECCION.map((item) => {
                const estaMarcado = chequeos[item.clave];
                return (
                  <label
                    key={item.clave}
                    className={`mv-check-item ${estaMarcado ? 'marcado' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="mv-checkbox"
                      checked={estaMarcado}
                      onChange={() => alternarChequeo(item.clave)}
                    />
                    <span>{item.texto}</span>
                  </label>
                );
              })}
            </div>

            <button type="submit" className="btn btn-primario cond-btn-full">
              <span className="material-symbols-outlined">verified</span>
              {revisionGuardada ? 'Revisión diaria registrada ✓' : 'Guardar revisión preoperacional'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}