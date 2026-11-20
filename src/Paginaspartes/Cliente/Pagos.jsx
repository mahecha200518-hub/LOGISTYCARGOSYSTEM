import { useState } from 'react';
import './cliente_comun.css';
import './pagos.css';

const METODOS_PAGO = [
  { id: 'pse', nombre: 'PSE · Débito bancario', icono: 'account_balance' },
  { id: 'tarjeta', nombre: 'Tarjeta Crédito / Débito', icono: 'credit_card' },
  { id: 'nequi', nombre: 'Nequi / Daviplata', icono: 'smartphone' },
  { id: 'efectivo', nombre: 'Pago contra entrega', icono: 'payments' }
];

const formatearCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export default function Pagos({
  setPage,
  usuarioActual,
  facturas = [],
  setFacturas,
  mostrarToast
}) {
  const pendientes = facturas.filter((f) => f.estado === 'Pendiente');
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(
    pendientes[0]?.codigo || ''
  );
  const [metodoPago, setMetodoPago] = useState('pse');
  const [referenciaTitular, setReferenciaTitular] = useState(
    usuarioActual?.nombre || 'Ana García'
  );

  const facturaActiva =
    pendientes.find((f) => f.codigo === codigoSeleccionado) || pendientes[0] || null;

  const totalPagado = facturas
    .filter((f) => f.estado === 'Pagado')
    .reduce((acc, f) => acc + f.monto, 0);

  const totalPendiente = pendientes.reduce((acc, f) => acc + f.monto, 0);

  const procesarPago = (e) => {
    e.preventDefault();
    if (!facturaActiva || !setFacturas) return;

    const metodoObj = METODOS_PAGO.find((m) => m.id === metodoPago);

    const actualizadas = facturas.map((fac) =>
      fac.codigo === facturaActiva.codigo
        ? {
            ...fac,
            estado: 'Pagado',
            metodo: metodoObj?.nombre || 'PSE'
          }
        : fac
    );

    setFacturas(actualizadas);
    setCodigoSeleccionado('');
    mostrarToast(`Pago aprobado para ${facturaActiva.codigo}`);
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
              Cuenta de {usuarioActual?.nombre || 'Ana García'} · Facturación COP
            </p>
            <h1 className="cli-titulo-vista">Pagos y comprobantes</h1>
          </div>
        </div>

        <span className={`badge ${pendientes.length > 0 ? 'badge-terra' : 'badge-verde'}`}>
          {pendientes.length > 0
            ? `${pendientes.length} factura(s) pendiente(s)`
            : 'Cuenta al día'}
        </span>
      </div>

      <div className="pag-resumen-grid">
        <div className="pag-kpi-card">
          <p className="pag-kpi-etiqueta">Saldo pendiente</p>
          <p className="pag-kpi-valor terra">{formatearCOP(totalPendiente)}</p>
        </div>

        <div className="pag-kpi-card">
          <p className="pag-kpi-etiqueta">Total pagado histórico</p>
          <p className="pag-kpi-valor verde">{formatearCOP(totalPagado)}</p>
        </div>

        <div className="pag-kpi-card">
          <p className="pag-kpi-etiqueta">Facturas emitidas</p>
          <p className="pag-kpi-valor">{facturas.length}</p>
        </div>
      </div>

      <div className="pag-grid">
        <section className="card pag-tarjeta-lista">
          <h2 className="cli-subtitulo-card">Historial de facturación</h2>

          <div className="pag-lista-facturas">
            {facturas.map((fac) => {
              const esPendiente = fac.estado === 'Pendiente';
              const estaSeleccionada = facturaActiva?.codigo === fac.codigo;

              return (
                <article
                  key={fac.codigo}
                  className={`pag-factura-item ${estaSeleccionada ? 'seleccionada' : ''}`}
                >
                  <div className="pag-factura-top">
                    <div>
                      <p className="pag-factura-codigo">
                        {fac.codigo} · Orden {fac.servicio}
                      </p>
                      <h3 className="pag-factura-concepto">{fac.concepto}</h3>
                    </div>

                    <span className={`badge ${esPendiente ? 'badge-terra' : 'badge-verde'}`}>
                      {fac.estado}
                    </span>
                  </div>

                  <div className="pag-factura-meta">
                    <span>
                      Fecha: {fac.fecha} {fac.metodo ? `· ${fac.metodo}` : ''}
                    </span>
                    <span className="pag-factura-monto">{formatearCOP(fac.monto)}</span>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    {esPendiente ? (
                      <button
                        type="button"
                        onClick={() => setCodigoSeleccionado(fac.codigo)}
                        className="btn btn-primario"
                      >
                        <span className="material-symbols-outlined">payments</span>
                        Seleccionar para pagar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          mostrarToast(`Comprobante PDF ${fac.codigo} descargado`)
                        }
                        className="btn btn-secundario"
                      >
                        <span className="material-symbols-outlined">download</span>
                        Descargar recibo PDF
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="card pag-tarjeta-checkout">
          <h2 className="cli-subtitulo-card">Pasarela de pago en línea</h2>

          {!facturaActiva ? (
            <div className="pag-al-dia">
              <span className="material-symbols-outlined pag-al-dia-icono">
                verified
              </span>
              <p>
                <strong>No tienes pagos pendientes.</strong>
              </p>
              <p style={{ marginTop: '4px' }}>
                Todas tus mudanzas agendadas se encuentran al día.
              </p>
            </div>
          ) : (
            <form onSubmit={procesarPago}>
              <div className="pag-detalle-pago">
                <div className="pag-detalle-fila">
                  <span>Factura seleccionada:</span>
                  <strong>{facturaActiva.codigo}</strong>
                </div>
                <div className="pag-detalle-fila">
                  <span>Orden asociada:</span>
                  <span>{facturaActiva.servicio}</span>
                </div>
                <div className="pag-detalle-fila">
                  <span>Total a pagar:</span>
                  <span className="pag-detalle-total">
                    {formatearCOP(facturaActiva.monto)}
                  </span>
                </div>
              </div>

              <div className="cli-campo">
                <label className="lbl">Método de pago</label>
                <div className="pag-metodos-grid">
                  {METODOS_PAGO.map((metodo) => (
                    <button
                      key={metodo.id}
                      type="button"
                      onClick={() => setMetodoPago(metodo.id)}
                      className={`pag-metodo-btn ${
                        metodoPago === metodo.id ? 'activo' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined">{metodo.icono}</span>
                      <span>{metodo.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="cli-campo">
                <label className="lbl">Nombre del titular del pago</label>
                <input
                  className="inp"
                  value={referenciaTitular}
                  onChange={(e) => setReferenciaTitular(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primario cli-btn-full">
                <span className="material-symbols-outlined">lock</span>
                Confirmar pago por {formatearCOP(facturaActiva.monto)}
              </button>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}