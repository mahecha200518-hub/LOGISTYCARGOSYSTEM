
import { useState } from "react";
import "./Recuperacioncontraseña.css";

function Recuperacioncontraseña() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [paso, setPaso] = useState(1);

  function solicitarCodigo(e) {
    e.preventDefault();

    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000);

    setCodigoGenerado(nuevoCodigo.toString());
    setPaso(2);
  }

  function verificarCodigo(e) {
    e.preventDefault();

    if (codigo === codigoGenerado) {
      setPaso(3);
    } else {
      alert("El código ingresado es incorrecto.");
    }
  }

  function cambiarContrasena(e) {
    e.preventDefault();

    alert("Contraseña recuperada correctamente.");
    setPaso(1);
    setCorreo("");
    setCodigo("");
    setCodigoGenerado("");
    setNuevaContrasena("");
  }

  return (
    <div className="recuperacion">
      <div className="recuperacion-formulario">

        {paso === 1 && (
          <form onSubmit={solicitarCodigo}>
            <h2>Recuperar contraseña</h2>
            <p>Ingresa tu correo electrónico para continuar.</p>

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <button type="submit">Enviar código</button>
          </form>
        )}

        {paso === 2 && (
          <form onSubmit={verificarCodigo}>
            <h2>Verificar código</h2>
            <p>Ingresa el código de recuperación.</p>

            <p> Código de demostración: <strong>{codigoGenerado}</strong></p>

            <label>Código de recuperación</label>
            <input
              type="text"
              maxLength="6"
              placeholder="Ingresa los 6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />

            <button type="submit">Verificar código</button>
          </form>
        )}

        {paso === 3 && (
          <form onSubmit={cambiarContrasena}>
            <h2>Nueva contraseña</h2>
            <p>Ingresa tu nueva contraseña.</p>

            <label>Nueva contraseña</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
              minLength="6"
            />

            <button type="submit">Cambiar contraseña</button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Recuperacioncontraseña;
