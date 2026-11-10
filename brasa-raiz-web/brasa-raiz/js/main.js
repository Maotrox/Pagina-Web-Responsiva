

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Menú móvil */
  const boton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu-principal');

  const cambiarMenu = (abrir) => {
    nav.classList.toggle('abierto', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  };

  boton.addEventListener('click', () => {
    cambiarMenu(!nav.classList.contains('abierto'));
  });

  // Cierra el menú al elegir una sección o al pulsar Escape
  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => cambiarMenu(false));
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && nav.classList.contains('abierto')) {
      cambiarMenu(false);
      boton.focus();
    }
  });

  /* 2. Pestañas del menú */
  const pestanas = document.querySelectorAll('[role="tab"]');

  const activarPestana = (pestana) => {
    pestanas.forEach((t) => {
      const activa = t === pestana;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
    });

    document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
      panel.hidden = panel.id !== pestana.getAttribute('aria-controls');
    });
  };

  pestanas.forEach((pestana, indice) => {
    pestana.addEventListener('click', () => activarPestana(pestana));

    // Navegación con flechas izquierda y derecha
    pestana.addEventListener('keydown', (evento) => {
      if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
      const paso = evento.key === 'ArrowRight' ? 1 : -1;
      const siguiente = pestanas[(indice + paso + pestanas.length) % pestanas.length];
      siguiente.focus();
      activarPestana(siguiente);
    });
  });

  /* 3. Formulario de reservas */
  const formulario = document.getElementById('form-reserva');
  const mensaje = document.getElementById('mensaje-form');
  const fecha = document.getElementById('fecha');

  // Fecha mínima: hoy, en la zona horaria local del usuario
  const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  fecha.min = hoy;

  const reglas = {
    nombre: (valor) => valor.trim().length >= 3 || 'Escribe tu nombre completo.',
    correo: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) || 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    fecha: (valor) => (valor !== '' && valor >= hoy) || 'Elige una fecha de hoy en adelante.'
  };

  const validarCampo = (id) => {
    const input = document.getElementById(id);
    const resultado = reglas[id](input.value);
    const error = document.getElementById('error-' + id);
    const esValido = resultado === true;

    error.textContent = esValido ? '' : resultado;
    input.setAttribute('aria-invalid', String(!esValido));
    return esValido;
  };

  // Valida al salir de cada campo para dar retroalimentación inmediata
  Object.keys(reglas).forEach((id) => {
    document.getElementById(id).addEventListener('blur', () => validarCampo(id));
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const validos = Object.keys(reglas).map(validarCampo);
    if (validos.every(Boolean)) {
      const nombre = document.getElementById('nombre').value.trim();
      mensaje.textContent = `¡Gracias, ${nombre}! Recibimos tu solicitud de reserva.`;
      formulario.reset();
      fecha.min = hoy;
    } else {
      mensaje.textContent = 'Revisa los campos marcados en rojo.';
      formulario.querySelector('[aria-invalid="true"]').focus();
    }
  });
});
