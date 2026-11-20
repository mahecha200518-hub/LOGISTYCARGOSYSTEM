import { useState } from 'react';
import '../../Css general/iniciosesion.css';

export default function Iniciosesion({ role, setRole, setPage, doLogin }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const manejarSubmit = (e) => {
    e.preventDefault();
    doLogin(correo, password);
  };

  return (
    <div className="login-contenedor">
      {/* Banner Izquierdo */}
      <div className="login-banner">
        <div className="login-marca">
          <img src="/imagenes/LOGO.jpg" alt="Logo" className="login-logo" />
          <div>
            <p className="login-marca-titulo">LOGISTY <span>CARGO</span></p>
            <p className="login-marca-sub">GESTIÓN INTELIGENTE DE MUDANZAS</p>
          </div>
        </div>

        <div className="login-hero">
          <h1>Cada mudanza,<br /><span>acompañada de<br />principio a fin.</span></h1>
          <p>Solicita, cotiza y sigue tu mudanza. El equipo en ruta y la oficina trabajan sobre la misma información, en tiempo real.</p>
        </div>

        <div className="login-metricas">
          <div className="login-metrica-caja">
            <p className="login-metrica-valor">xxx</p>
            <p className="login-metrica-texto">Mudanzas completadas</p>
          </div>
          <div className="login-metrica-caja">
            <p className="login-metrica-valor">xxx ★</p>
            <p className="login-metrica-texto">Calificación promedio</p>
          </div>
          <div className="login-metrica-caja">
            <p className="login-metrica-valor">xx</p>
            <p className="login-metrica-texto">Camiones en flota</p>
          </div>
        </div>
      </div>

      {/* Formulario Derecho */}
      <div className="login-panel-form">
        <form onSubmit={manejarSubmit} className="login-caja-form">
          <h2 className="login-titulo">Bienvenido de vuelta</h2>
          <p className="login-subtitulo">Selecciona tu rol e ingresa tus credenciales</p>

          <p className="lbl">Tu rol en el sistema</p>
          <div className="login-roles">
            <div
              onClick={() => setRole('cliente')}
              className={`login-rol-card ${role === 'cliente' ? 'activo' : ''}`}
            >
              <span className="material-symbols-outlined">home</span>
              <p>Cliente</p>
            </div>

            <div
              onClick={() => setRole('conductor')}
              className={`login-rol-card ${role === 'conductor' ? 'activo' : ''}`}
            >
              <span className="material-symbols-outlined">local_shipping</span>
              <p>Conductor</p>
            </div>

            <div
              onClick={() => setRole('admin')}
              className={`login-rol-card ${role === 'admin' ? 'activo' : ''}`}
            >
              <span className="material-symbols-outlined">domain</span>
              <p>Oficina</p>
            </div>
          </div>

          <div className="login-campo">
            <label className="lbl">Correo electrónico</label>
            <input
              className="inp"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@logisticargo.com"
              required
            />
          </div>

          <div className="login-campo">
            <label className="lbl">Contraseña</label>
            <input
              className="inp"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="login-olvido">
            <a href="#recover" onClick={(e) => { e.preventDefault(); setPage('recover'); }} className="login-enlace">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="btn btn-primario login-btn-full">
            <span className="material-symbols-outlined">login</span>
            Iniciar sesión
          </button>

          <p className="login-registro-texto">
            ¿Eres cliente y no tienes cuenta?{' '}
            <a href="#register" onClick={(e) => { e.preventDefault(); setPage('register'); }} className="login-enlace">
              Regístrate aquí
            </a>
          </p>

          {!role && (
            <div className="login-aviso-rol">
              <span className="material-symbols-outlined">info</span>
              <span>Selecciona un rol para continuar</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}