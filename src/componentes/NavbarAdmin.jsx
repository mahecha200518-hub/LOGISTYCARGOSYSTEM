import './NavbarAdmin.css';  //importamos el css par que funcione conforme el diseño

// esto lo extraemos del App.jsx
export default function NavbarAdmin({ page, setPage, usuarioActual, cerrarSesion }) {
  const iniciales = (usuarioActual?.nombre || 'AD') //Con esta cadena transformamos el nombre el usuario a uno mas simple 
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(); 

  const menu = [
    { id: 'dash_admin', icono: 'home', texto: 'Dashboard' },
    { id: 'ad_servicios', icono: 'receipt_long', texto: 'Servicios' },
    { id: 'ad_asignaciones', icono: 'assignment_ind', texto: 'Asignaciones' },
    { id: 'ad_vehiculos', icono: 'local_shipping', texto: 'Vehículos' },
    { id: 'ad_conductores', icono: 'badge', texto: 'Conductores' },
    { id: 'ad_clientes', icono: 'group', texto: 'Clientes' }
  ];// arreglo del menu y mejora de la eficiencia guardando los daros de navegacion en un solo lugar 


  //renderizado 
  return (
    <header className="nav-admin">
      <div className="nav-admin-marca">
        <img src="/imagenes/LOGO.jpg" alt="Logo" />
        <div>
          <p className="nav-admin-titulo">Logisty Cargo</p>
          <p className="nav-admin-sub">Panel de Oficina</p>
        </div>
      </div>

      <nav className="nav-admin-links">
        {menu.map((item) => (// recorre cada objeto y fabrica un enlace por cada uno
          <a
            key={item.id} // permite a react identificar cada enlace 
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              setPage(item.id);// frena la carga nativa del navegador y le avisa App.jsx que subseccion abrir
            }}
            className={`nav-admin-link ${page === item.id ? 'activo' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icono}</span>
            {item.texto}
          </a>
        ))}
      </nav>

            
      <div className="nav-admin-usuario">
        <div className="nav-admin-avatar">{iniciales}</div>
        <div>
          <p className="nav-admin-nombre">{usuarioActual?.nombre}</p>
          <p className="nav-admin-rol">Administrador</p>
        </div>
        <button onClick={cerrarSesion} className="nav-admin-salir" title="Cerrar sesión">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
        </button>
      </div>
    </header>
  );
}//perfil y cierre de sesion 
//<div className="nav-admin-avatar">{iniciales}</div> muestra el nombre y lo conecta con el <button onClick={cerrarSesion} className="nav-admin-salir" title="Cerrar sesión">