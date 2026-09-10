/* ==========================================================
   ENRUTADOR
   Este archivo es el "cartero" del prototipo: cada vez que
   cambia $store.app.page (por ejemplo, al hacer clic en un
   botón del menú), este archivo va a buscar el archivo HTML
   correcto dentro de la carpeta paginas/, lo descarga con
   fetch() y lo coloca dentro del "hueco" que le corresponde
   en index.html.

   ¿Por qué es necesario?
   Antes, todas las pantallas estaban siempre presentes en el
   HTML y solo se mostraban u ocultaban con x-show. Ahora cada
   pantalla vive en su propio archivo, así que hay que TRAERLA
   cuando se necesita.

   Después de insertar el HTML nuevo, se llama a
   Alpine.initTree(...) para que Alpine.js "active" los
   x-show, @click, x-text, etc. que acaban de llegar. Sin este
   paso, Alpine no se daría cuenta de que hay contenido nuevo
   para procesar.

   ADEMÁS, este archivo administra el CSS PROPIO de cada página
   (ver CSS_DE_PAGINAS más abajo). index.html tiene un único
   <link id="css-pagina-activa"> vacío en el <head>; cada vez que
   cambia $store.app.page, actualizarCssDePagina() cambia el
   "href" de ese único <link> por el archivo CSS que corresponde
   a la pantalla activa. Así:
     1. El CSS global y el de componentes se cargan UNA sola vez.
     2. El CSS específico de página se intercambia en un único
        <link>, sin acumular hojas de estilo viejas ni generar
        conflictos entre páginas.
   ========================================================== */

// ── MAPA DE RUTAS ──
// Qué archivo corresponde a cada valor de $store.app.page.
const RUTAS_DE_PAGINAS = {
  // Autenticación
  login: 'paginas/inicio_sesion.html',
  recover: 'paginas/recuperar_contrasena.html',
  register: 'paginas/registro_cliente.html',

  // Administrador
  dash_admin: 'paginas/administrador/panel_administrador.html',
  ad_servicios: 'paginas/administrador/servicios.html',
  ad_asignaciones: 'paginas/administrador/asignaciones.html',
  ad_vehiculos: 'paginas/administrador/vehiculos.html',
  ad_conductores: 'paginas/administrador/conductores.html',
  ad_clientes: 'paginas/administrador/clientes.html',
  ad_reportes: 'paginas/administrador/reportes.html',
  ad_config: 'paginas/administrador/configuracion.html',

  // Cliente
  dash_cliente: 'paginas/cliente/panel_cliente.html',
  cl_solicitud: 'paginas/cliente/solicitar_servicio.html',
  cl_cotizacion: 'paginas/cliente/cotizacion.html',
  cl_seguimiento: 'paginas/cliente/seguimiento_servicio.html',
  cl_historial: 'paginas/cliente/mis_servicios.html',
  cl_pagos: 'paginas/cliente/pagos.html',
  cl_soporte: 'paginas/cliente/soporte.html',

  // Conductor
  dash_conductor: 'paginas/conductor/panel_conductor.html',
  co_parada: 'paginas/conductor/parada_actual.html',
  co_checklist: 'paginas/conductor/checklist_carga.html',
  co_incidente: 'paginas/conductor/reportar_novedad.html',
  co_vehiculo: 'paginas/conductor/mi_vehiculo.html',
  co_historial: 'paginas/conductor/historial_servicios.html',
  co_gps: 'paginas/conductor/gps_navegacion.html',
  co_mecanico: 'paginas/conductor/reportar_problema_mecanico.html',

  // 'welcome' no tiene ruta: es la pantalla de carga y vive
  // directamente en index.html (no se recarga desde un archivo).
};

// ── CSS ESPECÍFICO DE CADA PÁGINA ──
// Cada pantalla tiene, como máximo, UN archivo CSS propio con los
// estilos que le pertenecen únicamente a ella (ver css/administrador/,
// css/cliente/, css/conductor/ y css/autenticacion/). El CSS global y
// el de componentes reutilizables NO están aquí: esos se cargan una
// única vez, siempre, desde el <head> de index.html.
//
// Este mapa le dice al enrutador qué hoja de estilos debe activar
// cada vez que cambia $store.app.page, para que en el navegador
// SOLO exista cargado el CSS de la página realmente visible.
const CSS_DE_PAGINAS = {
  // Autenticación
  login: 'css/autenticacion/inicio_sesion.css',
  recover: 'css/autenticacion/recuperar_contrasena.css',
  register: 'css/autenticacion/registro_cliente.css',

  // Administrador
  dash_admin: 'css/administrador/panel_administrador.css',
  ad_servicios: 'css/administrador/servicios.css',
  ad_asignaciones: 'css/administrador/asignaciones.css',
  ad_vehiculos: 'css/administrador/vehiculos.css',
  ad_conductores: 'css/administrador/conductores.css',
  ad_clientes: 'css/administrador/clientes.css',
  ad_reportes: 'css/administrador/reportes.css',
  ad_config: 'css/administrador/configuracion.css',

  // Cliente
  dash_cliente: 'css/cliente/panel_cliente.css',
  cl_solicitud: 'css/cliente/solicitar_servicio.css',
  cl_cotizacion: 'css/cliente/cotizacion.css',
  cl_seguimiento: 'css/cliente/seguimiento_servicio.css',
  cl_historial: 'css/cliente/mis_servicios.css',
  cl_pagos: 'css/cliente/pagos.css',
  cl_soporte: 'css/cliente/soporte.css',

  // Conductor
  dash_conductor: 'css/conductor/panel_conductor.css',
  co_parada: 'css/conductor/parada_actual.css',
  co_checklist: 'css/conductor/checklist_carga.css',
  co_incidente: 'css/conductor/reportar_novedad.css',
  co_vehiculo: 'css/conductor/mi_vehiculo.css',
  co_historial: 'css/conductor/historial_servicios.css',
  co_gps: 'css/conductor/gps_navegacion.css',
  co_mecanico: 'css/conductor/reportar_problema_mecanico.css',

  // 'welcome' no tiene CSS propio: usa solo el CSS global/estructura.
};

// Recordamos qué hoja de estilos de página está activa en este
// momento, para no tocar el <link> si no hace falta (evita
// parpadeos y peticiones repetidas).
let hojaDePaginaActiva = null;

function actualizarCssDePagina(nombrePagina) {
  const enlace = document.getElementById('css-pagina-activa');
  if (!enlace) return;

  const rutaCss = CSS_DE_PAGINAS[nombrePagina];

  // Si la pantalla nueva no tiene CSS propio (ej. 'welcome'),
  // dejamos el <link> vacío: así no queda "pegado" el CSS de una
  // página anterior que ya no corresponde.
  if (!rutaCss) {
    if (hojaDePaginaActiva !== null) {
      enlace.setAttribute('href', '');
      hojaDePaginaActiva = null;
    }
    return;
  }

  // Si ya es la hoja activa, no hacemos nada (evita recargas).
  if (rutaCss === hojaDePaginaActiva) return;

  enlace.setAttribute('href', rutaCss);
  hojaDePaginaActiva = rutaCss;
}

// ── A QUÉ "HUECO" (contenedor) PERTENECE CADA PANTALLA ──
const CONTENEDOR_DE_PAGINA = {
  login: 'contenido-autenticacion',
  recover: 'contenido-autenticacion',
  register: 'contenido-autenticacion',

  dash_admin: 'contenido-administrador',
  ad_servicios: 'contenido-administrador',
  ad_asignaciones: 'contenido-administrador',
  ad_vehiculos: 'contenido-administrador',
  ad_conductores: 'contenido-administrador',
  ad_clientes: 'contenido-administrador',
  ad_reportes: 'contenido-administrador',
  ad_config: 'contenido-administrador',

  dash_cliente: 'contenido-cliente',
  cl_solicitud: 'contenido-cliente',
  cl_cotizacion: 'contenido-cliente',
  cl_seguimiento: 'contenido-cliente',
  cl_historial: 'contenido-cliente',
  cl_pagos: 'contenido-cliente',
  cl_soporte: 'contenido-cliente',

  dash_conductor: 'contenido-conductor',
  co_parada: 'contenido-conductor',
  co_checklist: 'contenido-conductor',
  co_incidente: 'contenido-conductor',
  co_vehiculo: 'contenido-conductor',
  co_historial: 'contenido-conductor',
  co_gps: 'contenido-conductor',
  co_mecanico: 'contenido-conductor',
};

// Guarda en memoria los archivos ya descargados, para no
// pedirlos de nuevo al servidor cada vez que la persona vuelve
// a esa misma pantalla.
const cacheDePaginas = {};

async function cargarPagina(nombrePagina) {
  // Primero activamos (o limpiamos) el CSS propio de la pantalla,
  // sin importar si tiene HTML por cargar o no.
  actualizarCssDePagina(nombrePagina);

  const ruta = RUTAS_DE_PAGINAS[nombrePagina];
  if (!ruta) return; // 'welcome' u otro valor sin archivo asociado

  const idContenedor = CONTENEDOR_DE_PAGINA[nombrePagina];
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    let html = cacheDePaginas[ruta];
    if (!html) {
      const respuesta = await fetch(ruta);
      html = await respuesta.text();
      cacheDePaginas[ruta] = html;
    }
    contenedor.innerHTML = html;
    // Le avisamos a Alpine.js que hay contenido nuevo para
    // activar (x-show, @click, x-text, x-data del checklist, etc.)
    window.Alpine.initTree(contenedor);
  } catch (error) {
    console.error('No se pudo cargar la página "' + nombrePagina + '" desde ' + ruta, error);
  }
}

document.addEventListener('alpine:init', () => {
  // Alpine.effect vuelve a ejecutar esta función automáticamente
  // cada vez que cambia $store.app.page, sin importar desde
  // dónde se haya cambiado (menú, botón, doLogin, etc.).
  Alpine.effect(() => {
    const paginaActual = Alpine.store('app').page;
    cargarPagina(paginaActual);
  });
});
