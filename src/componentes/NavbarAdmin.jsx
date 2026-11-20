import './NavbarAdmin.css';//importamos el css

export default function NavbarAdmin({ page, setPage, usuarioActual, cerrarSesion }) {
  // 1. Extraemos las iniciales del nombre del administrador
  const iniciales = (usuarioActual?.nombre || 'AD')
    .split(' ')
    .map((palabra) => palabra[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // 2. Definimos las opciones del menú en un arreglo para no repetir código HTML
  const menu = [
    { id: 'dash_admin', icono: 'home', texto: 'Dashboard' },
    { id: 'ad_servicios', icono: 'receipt_long', texto: 'Servicios' },
    { id: 'ad_vehiculos', icono: 'local_shipping', texto: 'Vehículos' },
    { id: 'ad_conductores', icono: 'badge', texto: 'Conductores' },
    { id: 'ad_clientes', icono: 'group', texto: 'Clientes' }
  ];

        // Izquierda Logo y nombre del panel
  return (
    <header className="nav-admin">

      <div className="nav-admin-marca">
        <img src="/imagenes/LOGO.jpg" alt="Logo" />
        <div>
          <p className="nav-admin-titulo">Logisty Cargo</p>
          <p className="nav-admin-sub">Panel de Oficina</p>
        </div>
      </div>

     //genracion de enlaces dinamoicos 
      <nav className="nav-admin-links">
        {menu.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              setPage(item.id);
            }}
            className={`nav-admin-link ${page === item.id ? 'activo' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icono}</span>
            {item.texto}
          </a>
        ))}
      </nav>

      //boton de usuario y cierre de sesion
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
}