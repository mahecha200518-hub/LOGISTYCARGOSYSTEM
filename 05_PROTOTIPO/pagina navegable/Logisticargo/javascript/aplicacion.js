/* ==========================================================
   APLICACIÓN — ESTADO GLOBAL
   Este archivo define el "cerebro" del prototipo: los datos
   que cambian mientras usas la app y las funciones que se
   ejecutan al hacer clic en botones, iniciar sesión, mostrar
   avisos, etc.

   Como ahora cada pantalla vive en su PROPIO archivo HTML
   (dentro de la carpeta paginas/), el estado ya no puede vivir
   dentro de un único x-data en index.html: si lo hiciéramos
   así, cada vez que se carga un archivo de pantalla nuevo se
   perdería la conexión con ese estado.

   La solución es un ALPINE STORE: un lugar único y global
   donde vive el estado ($store.app), accesible desde
   CUALQUIER archivo HTML de la carpeta paginas/, sin importar
   cuál se cargue en cada momento.

   Por eso, en todas las pantallas, donde antes se escribía:
       x-show="page==='login'"
   ahora se escribe:
       x-show="$store.app.page==='login'"

   Y donde antes se escribía:
       @click="page='ad_servicios'"
   ahora se escribe:
       @click="$store.app.page='ad_servicios'"

   El comportamiento es exactamente el mismo. Solo cambió DÓNDE
   vive el dato, para que sobreviva al cambiar de archivo.

   ¿Qué controla cada parte de este archivo?

   - page         → qué pantalla está activa ahora mismo
                     (ej: 'login', 'dash_admin', 'cl_solicitud').
                     El enrutador (enrutador.js) usa este valor
                     para decidir qué archivo de paginas/ cargar.
   - role         → qué rol eligió la persona (cliente,
                     conductor o admin).
   - userName     → nombre que se muestra en los paneles.
   - toast        → mensaje de la notificación flotante.
   - cancelModal  → true/false, controla si se ve el modal
                     "¿Cancelar este servicio?".
   - contactModal → true/false, controla si se ve el modal
                     "Contactar conductor".
   - doLogin()    → qué pasa al iniciar sesión (pantalla de
                     bienvenida y luego el panel según el rol).
   - toast_(msg)  → muestra una notificación flotante (toast)
                     y la oculta sola después de un momento.
   ========================================================== */

document.addEventListener('alpine:init', () => {

  Alpine.store('app', {

    // ── NAVEGACIÓN Y SESIÓN ──
    page: 'login',
    role: '',
    userName: '',

    // ── NOTIFICACIONES Y MODALES ──
    toast: '',
    cancelModal: false,
    contactModal: false,

    // ── INICIO DE SESIÓN ──
    doLogin() {
      if (!this.role) return;
      const names = { cliente: 'Señorit@', conductor: 'Señorit@', admin: 'Señorit@' };
      this.userName = names[this.role];
      this.page = 'welcome';
      setTimeout(() => {
        this.page = this.role === 'cliente' ? 'dash_cliente' : this.role === 'conductor' ? 'dash_conductor' : 'dash_admin';
      }, 2500);
    },

    // ── NOTIFICACIONES (TOAST) ──
    toast_(msg) {
      this.toast = msg;
      setTimeout(() => this.toast = '', 2600);
    }

  });

  /* ==========================================================
     COMPONENTE: CHECKLIST DE CARGA (CONDUCTOR)
     Usado únicamente en paginas/conductor/checklist_carga.html.
     Es independiente del estado global porque solo le importa
     a esa pantalla.
     ========================================================== */
  Alpine.data('checklistCarga', () => ({
    items: [
      { t: 'Confirmar inventario con el cliente', done: true },
      { t: 'Fotografiar muebles grandes', done: true },
      { t: 'Embalar artículos frágiles', done: false },
      { t: 'Cargar al camión en orden de descarga', done: false },
      { t: 'Cliente firma conformidad de recogida', done: false }
    ]
  }));

});
