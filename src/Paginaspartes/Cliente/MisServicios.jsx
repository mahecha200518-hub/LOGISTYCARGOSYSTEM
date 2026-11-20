import { useState } from 'react';
import './cliente_comun.css';
import './mis_servicios.css';

const SERVICIOS_HISTORICOS = [
  {
    codigo: 'SRV-2026-00815',
    titulo: 'Transporte de Carga Puntual — Bogotá D.C.',
    fecha: '2026-10-28',
    franja: 'Tarde (01:00 PM - 05:00 PM)',
    origen: 'Av. El Dorado # 68C-61 (Bogotá D.C.)',
    destino: 'Cra 7 # 116-50 (Bogotá D.C.)',
    vehiculo: 'Furgón NHR (2.5 Ton)',
    articulosCount: 6,
    valor: 195000,
    estado: 'Completado',
    conductor: 'Carlos Méndez',
    placa: 'KLM-456'
  },
  {
    codigo: 'SRV-2026-00762',
    titulo: 'Mudanza Residencial — Chía / Sabana',
    fecha: '2026-09-14',
    franja: 'Mañana (07:00 AM - 11:00 AM)',
    origen: 'Calle 80 # 102-15 (Bogotá D.C.)',
    destino: 'Conjunto Robledal Casa 14 (Chía)',
    vehiculo: 'Camión NPR (3.5 Ton)',
    articulosCount: 18,
    valor: 340000,
    estado: 'Completado',
    conductor: 'Javier Morales',
    placa: 'XYZ-789'
  }
];

const formatearCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export default function MisServicios({
  setPage,
  usuarioActual,
  serviciosCliente = [],
  etapaActual = 1,
  mostrarToast
}) {
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [calificaciones, setCalificaciones] = useState({
    'SRV-2026-00815': 5,
    'SRV-2026-00762': 5
  });

  // Servicio principal en operación sincronizado con la etapa del conductor
  const servicioEnCurso = {
    codigo: 'SRV-2026-00852',
    titulo: 'Mudanza Residencial — Bogotá D.C.',
    fecha: '2026-11-20',
    franja: 'Mañana (07:00 AM - 11:00 AM)',
    origen: 'Cra 15 # 93-40, Apto 402 (Chapinero)',
    destino: 'Calle 127 # 45-12, Torre 3 (Suba)',
    vehiculo: 'Camión NPR (3.5 Ton)',
    articulosCount: 5,
    valor: 335000,
    estado: etapaActual === 3 ? 'Completado' : 'En curso',
    conductor: 'Javier Morales',
    placa: 'XYZ-789'
  };

  const todosLosServicios = [
    ...serviciosCliente,
    servicioEnCurso,
    ...SERVICIOS_HISTORICOS
  ];

  const serviciosFiltrados =
    filtroEstado === 'Todos'
      ? todosLosServicios
      : todosLosServicios.filter((srv) => srv.estado === filtroEstado);

  const calificarServicio = (codigo, estrellas) => {
    setCalificaciones({
      ...calificaciones,
      [codigo]: estrellas
    });
    mostrarToast(`Calificación de ${estrellas} ★ registrada para ${codigo}`);
  };

  const obtenerBadgeEstado = (estado) => {
    if (estado === 'En curso') return 'badge-terra';
    if (estado === 'Programado') return 'badge-ocre';
    return 'badge-verde';
  };

  const obtenerClaseBorde = (estado) => {
    if (estado === 'En curso') return 'en-curso';
    if (estado === 'Completado') return 'completado';
    return '';
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
              Cliente {usuarioActual?.nombre || 'Ana García'} · {todosLosServicios.length} órdenes
            </p>
            <h1 className="cli-titulo-vista">Mis servicios y mudanzas</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPage('cl_solicitar')}
          className="btn btn-primario"
        >
          <span className="material-symbols-outlined">add</span>
          Agendar nueva mudanza
        </button>
      </div>

      <div className="ms-barra-controles">
        <div className="ms-filtros">
          {['Todos', 'En curso', 'Programado', 'Completado'].map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setFiltroEstado(estado)}
              className={`ms-filtro-btn ${filtroEstado === estado ? 'activo' : ''}`}
            >
              {estado}
            </button>
          ))}
        </div>

        <span className="badge badge-ocre">
          Mostrando {serviciosFiltrados.length} de {todosLosServicios.length}
        </span>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="ms-vacio">
          No tienes servicios registrados bajo el filtro <strong>{filtroEstado}</strong>.
        </div>
      ) : (
        <div className="ms-lista">
          {serviciosFiltrados.map((srv) => {
            const puntaje = calificaciones[srv.codigo] || 0;

            return (
              <article
                key={srv.codigo}
                className={`card ms-card ${obtenerClaseBorde(srv.estado)}`}
              >
                <div className="ms-card-top">
                  <div>
                    <p className="ms-codigo">{srv.codigo}</p>
                    <h2 className="ms-titulo">{srv.titulo}</h2>
                    <p className="ms-fecha">
                      Fecha: {srv.fecha} · {srv.franja}
                    </p>
                  </div>

                  <span className={`badge ${obtenerBadgeEstado(srv.estado)}`}>
                    {srv.estado}
                  </span>
                </div>

                <div className="ms-trayecto-grid">
                  <div>
                    <p className="ms-punto-label">Origen</p>
                    <p className="ms-punto-texto">{srv.origen}</p>
                  </div>
                  <div>
                    <p className="ms-punto-label">Destino</p>
                    <p className="ms-punto-texto">{srv.destino}</p>
                  </div>
                </div>

                <div className="ms-meta-grid">
                  <div>
                    <p className="ms-meta-etiqueta">Vehículo</p>
                    <p className="ms-meta-valor">{srv.vehiculo}</p>
                  </div>
                  <div>
                    <p className="ms-meta-etiqueta">Conductor / Placa</p>
                    <p className="ms-meta-valor">
                      {srv.conductor} ({srv.placa})
                    </p>
                  </div>
                  <div>
                    <p className="ms-meta-etiqueta">Inventario</p>
                    <p className="ms-meta-valor">{srv.articulosCount} artículos</p>
                  </div>
                  <div>
                    <p className="ms-meta-etiqueta">Tarifa acordada</p>
                    <p className="ms-meta-precio">{formatearCOP(srv.valor)}</p>
                  </div>
                </div>

                <div className="ms-card-footer">
                  {srv.estado === 'En curso' && (
                    <>
                      <span className="cli-caja-info">
                        Unidad en operación activa hacia el destino
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage('cl_seguimiento')}
                        className="btn btn-primario"
                      >
                        <span className="material-symbols-outlined">location_on</span>
                        Rastrear en mapa vivo
                      </button>
                    </>
                  )}

                  {srv.estado === 'Programado' && (
                    <>
                      <span className="cli-caja-info">
                        Orden confirmada · Asignación de flota 24 h antes
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage('cl_pagos')}
                        className="btn btn-secundario"
                      >
                        <span className="material-symbols-outlined">payments</span>
                        Ir a pagos
                      </button>
                    </>
                  )}

                  {srv.estado === 'Completado' && (
                    <>
                      <div className="ms-calificacion-bloque">
                        <span>Tu calificación del servicio:</span>
                        <div className="ms-estrellas">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => calificarServicio(srv.codigo, num)}
                              className={`ms-estrella-btn ${
                                num <= puntaje ? 'iluminada' : ''
                              }`}
                              aria-label={`Calificar con ${num} estrellas`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPage('cl_cotizacion')}
                        className="btn btn-secundario"
                      >
                        <span className="material-symbols-outlined">refresh</span>
                        Cotizar traslado similar
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}