import './Recuperacioncontrasena.css';

export default function Recuperacioncontraseña({ setPage, mostrarToast }) {
  const manejarRecuperacion = (e) => {
    e.preventDefault();
    mostrarToast('Código enviado a tu correo electrónico');
  };

  return (
    <div className="recuperar-contenedor">
      <form onSubmit={manejarRecuperacion} className="card recuperar-card">
        <div className="recuperar-icono">
          <span className="material-symbols-outlined">lock_reset</span>
        </div>

        <h2 className="recuperar-titulo">Recuperar contraseña</h2>
        <p className="recuperar-texto">Ingresa tu correo y te enviaremos un código.</p>

        <div className="recuperar-campo">
          <label className="lbl">Correo electrónico</label>
          <input className="inp" type="email" placeholder="usuario@logisticargo.com" required />
        </div>

        <button type="submit" className="btn btn-primario recuperar-btn">
          Enviar código
        </button>

        <a
          href="#login"
          onClick={(e) => {
            e.preventDefault();
            setPage?.('login');
          }}
          className="recuperar-volver"
        >
          ← Volver al inicio de sesión
        </a>
      </div>
    </div>
  );
}