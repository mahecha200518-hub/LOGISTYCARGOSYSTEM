import { useState } from 'react';
import './VehiculoConductor.css';

export default function VehiculoConductor({ usuarioActual, mostrarToast }) {
  const [chequeos, setChequeos] = useState({
    frenos: true,
    luces: true,
    llantas: true,
    correas: true,
    combustible: false
  });

  const cambiarChequeo = (campo) => {
    setChequeos({ ...chequeos, [campo]: !chequeos[campo] });
  };

  const guardarInspeccion = (e) => {
    e.preventDefault();
    mostrarToast('Inspección preoperacional del vehículo registrada');
  };

  const puntosInspeccion = [
    { key: 'frenos', texto: 'Sistema de frenos y líquido hidráulico' },
    { key: 'luces', texto: 'Luces frontales, direccionales y freno' },
    { key: 'llantas', texto: 'Presión y labrado de llantas' },
    { key: 'correas', texto: 'Correas de amarre y mantas protectoras' },
    { key: 'combustible', texto: 'Tanque de combustible superior al 50%' }
  ];

  return (
    <main className="veh-contenedor">
      <div className="veh-grid">
        {/* Ficha técnica del camión asignado */}
        <section className="card">
          <div className="veh-header">
            <h1 className="veh-titulo">Ficha del vehículo</h1>
            <span className="badge badge-verde">Operativo</span>
          </div>

          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">Vehículo</span>
            <span className="veh-dato-valor">{usuarioActual?.vehiculo || 'Ford F-350 Estacas'}</span>
          </div>
          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">Placa</span>
            <span className="veh-dato-valor">{usuarioActual?.placa || 'ABC-123'}</span>
          </div>
          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">Capacidad de carga</span>
            <span className="veh-dato-valor">{usuarioActual?.capacidad || '3.5 Toneladas'}</span>
          </div>
          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">Licencia del conductor</span>
            <span className="veh-dato-valor">{usuarioActual?.licencia || 'C2 Vigente'}</span>
          </div>
          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">SOAT</span>
            <span className="veh-dato-valor">{usuarioActual?.soat || 'Vigente'}</span>
          </div>
          <div className="veh-dato-fila">
            <span className="veh-dato-etiqueta">Tecnomecánica</span>
            <span className="veh-dato-valor">{usuarioActual?.tecnomecanica || 'Vigente'}</span>
          </div>
        </section>

        {/* Inspección preoperacional */}
        <section className="card">
          <h2 className="veh-titulo">Inspección preoperacional</h2>
          <p className="veh-subtitulo">
            Verifica el estado de seguridad antes de iniciar ruta
          </p>

          <form onSubmit={guardarInspeccion}>
            {puntosInspeccion.map((item) => (
              <label
                key={item.key}
                className={`veh-check-item ${chequeos[item.key] ? 'marcado' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={chequeos[item.key]}
                  onChange={() => cambiarChequeo(item.key)}
                />
                <span>{item.texto}</span>
              </label>
            ))}

            <button type="submit" className="btn btn-primario veh-btn-full">
              <span className="material-symbols-outlined">verified</span>
              Registrar revisión diaria
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}