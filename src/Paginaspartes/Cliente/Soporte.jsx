import { useState } from 'react';
import './cliente_comun.css';
import './soporte.css';

const CATEGORIAS_SOPORTE = [
  'Reprogramación de fecha u horario',
  'Consulta sobre facturación o pago',
  'Actualización de direcciones o inventario',
  'Novedad con artículo transportado',
  'Felicitación o sugerencia del servicio'
];

const PREGUNTAS_FRECUENTES = [
  {
    pregunta: '¿Con cuánta anticipación puedo reprogramar mi mudanza?',
    respuesta:
      'Puedes modificar la fecha o franja horaria sin ningún recargo hasta 24 horas antes de la hora pactada de cargue en origen.'
  },
  {
    pregunta: '¿Qué cubre la póliza básica incluida en el servicio?',
    respuesta:
      'Todos los traslados incluyen protección contra daños durante la manipulación, cargue y transporte terrestre siempre que los artículos estén declarados en el inventario inicial.'
  },
  {
    pregunta: '¿Cómo verifico que el conductor cargado sea el asignado?',
    respuesta:
      'En tu panel principal y en la vista de Seguimiento GPS puedes validar el nombre completo del conductor, la placa del vehículo y el código único de orden.'
  }
];

export default function Soporte({
  setPage,
  usuarioActual,
  serviciosCliente = [],
  ticketsSoporte = [],
  setTicketsSoporte,
  mostrarToast
}) {
  const ordenesDisponibles = [
    'SRV-2026-00852 (En curso)',
    ...serviciosCliente.map((s) => `${s.codigo} (${s.estado})`),
    'SRV-2026-00815 (Completado)',
    'Consulta general (Sin orden asociada)'
  ];

  const [ordenAsociada, setOrdenAsociada] = useState(ordenesDisponibles[0]);
  const [categoria, setCategoria] = useState(CATEGORIAS_SOPORTE[0]);
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [faqAbierta, setFaqAbierta] = useState(0);

  const enviarTicket = (e) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) return;

    const nuevoTicket = {
      codigo: `TKT-2026-0${124 + ticketsSoporte.length}`,
      cliente: usuarioActual?.nombre || 'Ana García',
      orden: ordenAsociada.split(' ')[0],
      categoria,
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
      fecha: '20/11/2026',
      estado: 'Abierto'
    };

    if (setTicketsSoporte) {
      setTicketsSoporte([nuevoTicket, ...ticketsSoporte]);
    }

    setAsunto('');
    setMensaje('');
    mostrarToast(`Solicitud ${nuevoTicket.codigo} enviada a mesa de ayuda`);
  };

  const alternarFaq = (index) => {
    setFaqAbierta(faqAbierta === index ? null : index);
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
              Centro de atención · {usuarioActual?.nombre || 'Ana García'}
            </p>
            <h1 className="cli-titulo-vista">Soporte y ayuda al cliente</h1>
          </div>
        </div>

        <span className="badge badge-verde">Respuesta promedio &lt; 15 min</span>
      </div>

      <div className="sop-grid">
        <div className="sop-columna-principal">
          <section className="card sop-tarjeta-form">
            <h2 className="cli-subtitulo-card">Radicar nueva solicitud o PQRS</h2>

            <form onSubmit={enviarTicket}>
              <div className="sop-fila-doble cli-campo">
                <div>
                  <label className="lbl">Servicio relacionado</label>
                  <select
                    className="inp"
                    value={ordenAsociada}
                    onChange={(e) => setOrdenAsociada(e.target.value)}
                  >
                    {ordenesDisponibles.map((item, idx) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="lbl">Motivo de contacto</label>
                  <select
                    className="inp"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {CATEGORIAS_SOPORTE.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cli-campo">
                <label className="lbl">Asunto breve</label>
                <input
                  className="inp"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej. Autorización ingreso camión en portería"
                  required
                />
              </div>

              <div className="cli-campo">
                <label className="lbl">Descripción de tu solicitud</label>
                <textarea
                  className="inp sop-textarea"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos los detalles para que un asesor de operaciones te ayude de inmediato..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primario cli-btn-full">
                <span className="material-symbols-outlined">send</span>
                Enviar solicitud a soporte
              </button>
            </form>
          </section>

          <section className="card">
            <h2 className="cli-subtitulo-card">Preguntas frecuentes</h2>

            <div className="sop-faq-lista">
              {PREGUNTAS_FRECUENTES.map((item, index) => {
                const abierto = faqAbierta === index;
                return (
                  <div key={index} className="sop-faq-item">
                    <button
                      type="button"
                      onClick={() => alternarFaq(index)}
                      className="sop-faq-btn"
                    >
                      <span>{item.pregunta}</span>
                      <span className="material-symbols-outlined">
                        {abierto ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {abierto && (
                      <p className="sop-faq-respuesta">{item.respuesta}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="sop-columna-lateral">
          <div className="card sop-tarjeta-tickets">
            <div className="sop-tickets-header">
              <h2 className="sop-titulo-sin-margen">Mis tickets registrados</h2>
              <span className="badge badge-ocre">{ticketsSoporte.length} caso(s)</span>
            </div>

            <div className="sop-lista-tickets">
              {ticketsSoporte.map((ticket) => {
                const esResuelto = ticket.estado === 'Resuelto';
                return (
                  <article
                    key={ticket.codigo}
                    className={`sop-ticket-card ${esResuelto ? 'resuelto' : ''}`}
                  >
                    <div className="sop-ticket-top">
                      <span className="sop-ticket-codigo">
                        {ticket.codigo} · {ticket.orden}
                      </span>
                      <span
                        className={`badge ${esResuelto ? 'badge-verde' : 'badge-ocre'}`}
                      >
                        {ticket.estado}
                      </span>
                    </div>
                    <p className="sop-ticket-asunto">{ticket.asunto}</p>
                    <p className="sop-ticket-desc">{ticket.mensaje}</p>
                    <div className="sop-ticket-meta">
                      <span>{ticket.categoria}</span>
                      <span>{ticket.fecha}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="cli-subtitulo-card">Canales directos Bogotá</h2>

            <div className="sop-canales-lista">
              <div className="sop-canal-item">
                <div className="sop-canal-icono">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="sop-canal-titulo">Línea de atención operativa</p>
                  <p className="sop-canal-dato">(601) 745 8820 · Ext. 102</p>
                </div>
              </div>

              <div className="sop-canal-item">
                <div className="sop-canal-icono">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <p className="sop-canal-titulo">WhatsApp Mesa de Ayuda</p>
                  <p className="sop-canal-dato">+57 318 440 9912</p>
                </div>
              </div>

              <div className="sop-canal-item">
                <div className="sop-canal-icono">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="sop-canal-titulo">Horario de despacho</p>
                  <p className="sop-canal-dato">Lunes a Domingo · 06:00 AM – 09:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}