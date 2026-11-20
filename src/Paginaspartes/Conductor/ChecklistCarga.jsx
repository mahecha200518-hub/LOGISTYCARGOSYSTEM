import { useState } from 'react';
import './conductor_comun.css';
import './checklist_carga.css';

export default function ChecklistCarga({
  setPage,
  inventario = [],
  setInventario,
  mostrarToast
}) {
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [categoriaNuevo, setCategoriaNuevo] = useState('Cajas / Embalaje');

  const alternarArticulo = (id) => {
    if (!setInventario) return;
    const actualizado = inventario.map((item) =>
      item.id === id ? { ...item, marcado: !item.marcado } : item
    );
    setInventario(actualizado);
  };

  const agregarArticuloExtra = (e) => {
    e.preventDefault();
    if (!nombreNuevo.trim() || !setInventario) return;

    const nuevoObjeto = {
      id: Date.now(),
      nombre: nombreNuevo.trim(),
      categoria: categoriaNuevo,
      marcado: true
    };

    setInventario([...inventario, nuevoObjeto]);
    setNombreNuevo('');
    mostrarToast('Artículo adicional agregado al inventario');
  };

  const confirmarCarga = () => {
    const pendientes = inventario.filter((item) => !item.marcado).length;
    if (pendientes > 0) {
      mostrarToast(`Aún faltan ${pendientes} artículo(s) por verificar`);
      return;
    }
    mostrarToast('Inventario completo verificado y asegurado en el vehículo');
  };

  const totalMarcados = inventario.filter((item) => item.marcado).length;
  const porcentaje =
    inventario.length > 0 ? Math.round((totalMarcados / inventario.length) * 100) : 0;

  return (
    <main className="cond-contenedor">
      {/* Encabezado común con regreso a Mi ruta */}
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
            <h1 className="cond-titulo-vista">Checklist de carga e inventario</h1>
          </div>
        </div>

        <span className="badge badge-verde">
          {totalMarcados} / {inventario.length} verificados
        </span>
      </div>

      <div className="cc-grid">
        {/* Columna Izquierda: Lista de verificación */}
        <section className="card cc-tarjeta-lista">
          <div className="cc-progreso-bloque">
            <div className="cc-progreso-superior">
              <span>Progreso de carga en camión</span>
              <span className="cc-progreso-porcentaje">{porcentaje}%</span>
            </div>
            <div className="cc-barra-fondo">
              <div
                className="cc-barra-relleno"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          <div className="cc-lista-items">
            {inventario.map((item) => (
              <label
                key={item.id}
                className={`cc-item ${item.marcado ? 'marcado' : ''}`}
              >
                <div className="cc-item-izq">
                  <input
                    type="checkbox"
                    className="cc-checkbox"
                    checked={item.marcado}
                    onChange={() => alternarArticulo(item.id)}
                  />
                  <div>
                    <p className="cc-item-nombre">{item.nombre}</p>
                    <p className="cc-item-categoria">{item.categoria || 'General'}</p>
                  </div>
                </div>

                <span className={`badge ${item.marcado ? 'badge-verde' : 'badge-ocre'}`}>
                  {item.marcado ? 'Cargado' : 'Pendiente'}
                </span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={confirmarCarga}
            className="btn btn-primario cond-btn-full"
          >
            <span className="material-symbols-outlined">verified</span>
            Confirmar inventario cargado
          </button>
        </section>

        {/* Columna Derecha: Agregar artículo extra y protocolo */}
        <aside className="cc-columna-lateral">
          <div className="card">
            <h2 className="cond-subtitulo-card">Registrar artículo adicional</h2>
            <form onSubmit={agregarArticuloExtra}>
              <div className="cond-campo">
                <label className="lbl">Descripción del objeto</label>
                <input
                  className="inp"
                  value={nombreNuevo}
                  onChange={(e) => setNombreNuevo(e.target.value)}
                  placeholder="Ej. Espejo de cuerpo entero"
                  required
                />
              </div>

              <div className="cond-campo">
                <label className="lbl">Categoría</label>
                <select
                  className="inp"
                  value={categoriaNuevo}
                  onChange={(e) => setCategoriaNuevo(e.target.value)}
                >
                  <option>Cajas / Embalaje</option>
                  <option>Sala / Comedor</option>
                  <option>Alcoba</option>
                  <option>Electrodoméstico</option>
                  <option>Artículo frágil</option>
                </select>
              </div>

              <button type="submit" className="btn btn-secundario cond-btn-full">
                <span className="material-symbols-outlined">add_circle</span>
                Añadir a la lista
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="cond-subtitulo-card">Protocolo de estiba</h2>
            <div className="cc-nota-embalaje">
              Asegura primero los electrodomésticos y muebles pesados contra la cabina con correas de trinquete, cubre con mantas acolchadas y ubica las cajas frágiles en el nivel superior.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}