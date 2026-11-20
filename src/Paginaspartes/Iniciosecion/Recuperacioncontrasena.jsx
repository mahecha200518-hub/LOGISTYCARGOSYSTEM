import { useState } from 'react';
import './Recuperacioncontrasena.css';

export default function Recuperacioncontrasena({ setPage, mostrarToast }) {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [paso, setPaso] = useState(1);

  const solicitarCodigo = (e) => {
    e.preventDefault();
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setCodigo('');
    setPaso(2);
    mostrarToast?.(`Código enviado a ${correo}`);
  };

  const verificarCodigo = (e) => {
    e.preventDefault();
    if (codigo.trim() === codigoGenerado) {
      setPaso(3);
      mostrarToast?.('Código verificado correctamente');
    } else {
      mostrarToast?.('El código ingresado es incorrecto');
    }
  };

  const cambiarContrasena = (e) => {
    e.preventDefault();
    mostrarToast?.('Contraseña recuperada correctamente');
    setPaso(1);
    setCorreo('');
    setCodigo('');
    setCodigoGenerado('');
    setNuevaContrasena('');
    setPage?.('login');
  };

  return (
    <div className="recuperar-contenedor">
      <div className="card recuperar-card">
        <div className="recuperar-icono">
          <span className="material-symbols-outlined">lock_reset</span>
        </div>

        {paso === 1 && (
          <form onSubmit={solicitarCodigo}>
            <h2 className="recuperar-titulo">Recuperar contraseña</h2>
            <p className="recuperar-texto">
              Ingresa tu correo y te enviaremos un código.
            </p>

            <div className="recuperar-campo">
              <label className="lbl">Correo electrónico</label>
              <input
                className="inp"
                type="email"
                placeholder="usuario@logisticargo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primario recuperar-btn">
              Enviar código
            </button>
          </form>
        )}

        {paso === 2 && (
          <form onSubmit={verificarCodigo}>
            <h2 className="recuperar-titulo">Verificar código</h2>
            <p className="recuperar-texto">
              Ingresa el código de 6 dígitos enviado a <strong>{correo}</strong>.
            </p>
            <p className="recuperar-texto">
              Código de demostración: <strong>{codigoGenerado}</strong>
            </p>

            <div className="recuperar-campo">
              <label className="lbl">Código de recuperación</label>
              <input
                className="inp"
                type="text"
                maxLength={6}
                placeholder="Ingresa los 6 dígitos"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primario recuperar-btn">
              Verificar código
            </button>
          </form>
        )}

        {paso === 3 && (
          <form onSubmit={cambiarContrasena}>
            <h2 className="recuperar-titulo">Nueva contraseña</h2>
            <p className="recuperar-texto">
              Ingresa tu nueva contraseña para completar la recuperación.
            </p>

            <div className="recuperar-campo">
              <label className="lbl">Nueva contraseña</label>
              <input
                className="inp"
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primario recuperar-btn">
              Cambiar contraseña
            </button>
          </form>
        )}

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