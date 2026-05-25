document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });

  initCookieConsent();
  initChatbot();
  initSandboxSimulation();

  function initCookieConsent() {
    const saved = localStorage.getItem('cybernova_cookie_choice');
    if (saved) {
      return;
    }

    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
      <div class="cookie-consent__content">
        <strong>Respetamos tu privacidad</strong>
        <p>Usamos cookies para mejorar tu experiencia, analizar tráfico y proteger la plataforma.</p>
      </div>
      <div class="cookie-consent__actions">
        <button type="button" class="cookie-btn cookie-btn--muted" data-cookie="reject">Rechazar</button>
        <button type="button" class="cookie-btn cookie-btn--primary" data-cookie="accept">Aceptar cookies</button>
      </div>
    `;

    document.body.appendChild(banner);

    banner.querySelectorAll('[data-cookie]').forEach((button) => {
      button.addEventListener('click', () => {
        const choice = button.getAttribute('data-cookie') || 'accept';
        localStorage.setItem('cybernova_cookie_choice', choice);
        banner.remove();
      });
    });
  }

  function initChatbot() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-assistant';
    wrapper.innerHTML = `
      <button type="button" class="chat-toggle" aria-label="Abrir chat de ayuda">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9h12M6 13h9M6 17h6" />
          <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        </svg>
      </button>
      <section class="chat-widget" aria-live="polite" hidden>
        <header class="chat-widget__header">
          <div>
            <strong>Asistente CYBERNOVA</strong>
            <p>IA con modelo gratuito</p>
          </div>
          <button type="button" class="chat-close" aria-label="Cerrar chat">×</button>
        </header>
        <div class="chat-messages"></div>
        <form class="chat-form">
          <input type="text" class="chat-input" placeholder="Escribe tu duda..." maxlength="300" />
          <button type="submit" class="chat-send">Enviar</button>
        </form>
      </section>
    `;

    document.body.appendChild(wrapper);

    const toggle = wrapper.querySelector('.chat-toggle');
    const panel = wrapper.querySelector('.chat-widget');
    const close = wrapper.querySelector('.chat-close');
    const form = wrapper.querySelector('.chat-form');
    const input = wrapper.querySelector('.chat-input');
    const messages = wrapper.querySelector('.chat-messages');

    const addMessage = (role, text) => {
      const item = document.createElement('div');
      item.className = `chat-message chat-message--${role}`;
      item.textContent = text;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
    };

    const getBotReply = (text) => {
      const value = text.toLowerCase();

      if (value.includes('precio') || value.includes('plan')) {
        return 'Tenemos planes desde 50€ al mes hasta 1000€ vitalicio. Puedes ver el detalle completo en la sección Pricing.';
      }
      if (value.includes('sandbox') || value.includes('malware')) {
        return 'El sandbox online de esta web es una demo visual. Para análisis real, CYBERNOVA ofrece revisión avanzada de muestras en plataforma operativa.';
      }
      if (value.includes('phishing') || value.includes('estafa')) {
        return 'Recomendamos no abrir enlaces sospechosos, verificar remitentes y usar nuestro asistente IA antiestafas para evaluar riesgos.';
      }
      if (value.includes('ddos')) {
        return 'CYBERNOVA incluye protección anti-DDoS con infraestructura global para mitigar ataques y mantener disponibilidad.';
      }
      if (value.includes('pentest') || value.includes('empresa')) {
        return 'Ofrecemos pentesting avanzado para empresas, con evaluación de infraestructura, aplicaciones y red.';
      }

      return 'Puedo ayudarte con servicios, planes, sandbox, phishing y soporte. Si quieres, te guío paso a paso según tu caso.';
    };

    addMessage('bot', 'Hola, soy el asistente IA de CYBERNOVA. ¿En qué te puedo ayudar?');

    toggle.addEventListener('click', () => {
      if (panel.hidden) {
        panel.hidden = false;
        input.focus();
      } else {
        panel.hidden = true;
      }
    });

    close.addEventListener('click', () => {
      panel.hidden = true;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) {
        return;
      }

      addMessage('user', question);
      input.value = '';

      setTimeout(() => {
        addMessage('bot', getBotReply(question));
      }, 350);
    });
  }

  function initSandboxSimulation() {
    const fileInput = document.getElementById('sandbox-file');
    const startButton = document.getElementById('sandbox-start');
    const progressBar = document.getElementById('sandbox-progress-bar');
    const progressText = document.getElementById('sandbox-progress-text');
    const fileMeta = document.getElementById('sandbox-file-meta');
    const result = document.getElementById('sandbox-result');
    const chart = document.getElementById('sandbox-chart');
    const details = document.getElementById('sandbox-details');

    if (!fileInput || !startButton || !progressBar || !progressText || !fileMeta || !result || !chart || !details) {
      return;
    }

    const maxBytes = 500 * 1024 * 1024;
    let timer = null;

    const formatMb = (bytes) => {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const renderChart = (values) => {
      chart.innerHTML = values
        .map((value) => `<div class="sandbox-chart-bar" style="height:${value}%;"></div>`)
        .join('');
    };

    const renderDetails = (risk, confidence, likelyType) => {
      details.innerHTML = [
        `<div>Nivel de riesgo estimado: <strong>${risk}%</strong></div>`,
        `<div>Confianza de clasificación: <strong>${confidence}%</strong></div>`,
        `<div>Resultado probable: <strong>${likelyType}</strong></div>`
      ].join('');
    };

    const resetState = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      progressBar.style.width = '0%';
      progressText.textContent = 'Esperando archivo para iniciar sandbox...';
      result.textContent = 'La simulación no ejecuta análisis real. Interfaz visual de demostración.';
      chart.innerHTML = '';
      details.innerHTML = '';
    };

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) {
        fileMeta.textContent = 'Ningún archivo seleccionado.';
        fileMeta.classList.remove('error');
        resetState();
        return;
      }

      if (file.size > maxBytes) {
        fileMeta.textContent = `Archivo rechazado: ${formatMb(file.size)}. Máximo permitido: 500 MB.`;
        fileMeta.classList.add('error');
        resetState();
        return;
      }

      fileMeta.textContent = `Archivo listo: ${file.name} (${formatMb(file.size)}).`;
      fileMeta.classList.remove('error');
      resetState();
    });

    startButton.addEventListener('click', () => {
      const file = fileInput.files?.[0];
      if (!file) {
        fileMeta.textContent = 'Selecciona un archivo antes de iniciar.';
        fileMeta.classList.add('error');
        return;
      }

      if (file.size > maxBytes) {
        fileMeta.textContent = `Archivo rechazado: ${formatMb(file.size)}. Máximo permitido: 500 MB.`;
        fileMeta.classList.add('error');
        return;
      }

      if (timer) {
        clearInterval(timer);
      }

      let progress = 0;
      result.textContent = 'Inicializando sandbox virtual...';
      progressText.textContent = 'Subiendo muestra al entorno aislado... 0%';
      progressBar.style.width = '0%';

      timer = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 6;
        if (progress >= 100) {
          progress = 100;
        }

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Ejecución controlada en sandbox... ${progress}%`;

        if (progress === 100) {
          clearInterval(timer);
          timer = null;
          const risk = Math.floor(Math.random() * 81) + 10;
          const confidence = Math.floor(Math.random() * 26) + 72;
          const likelyType = risk >= 65 ? 'Posible malware' : risk >= 40 ? 'Sospechoso' : 'Limpio';
          const bars = Array.from({ length: 5 }, () => Math.floor(Math.random() * 70) + 20);
          renderChart(bars);
          renderDetails(risk, confidence, likelyType);
          result.textContent = `Simulación completada. Estado: ${likelyType}.`;
        }
      }, 220);
    });
  }
});
