// ─── Utilidades ─────────────────────────────────────────────────────────────
/**
 * Genera una referencia única para la transacción con formato
 * ParquesSJ-<timestamp>-<random>
 */
function generarReferencia() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `ParquesSJ-${ts}-${rand}`;
}

/**
 * Calcula la firma de integridad SHA-256 requerida por Wompi.
 *
 * ⚠️  IMPORTANTE – SEGURIDAD EN PRODUCCIÓN:
 * En un entorno de producción, esta firma debe calcularse en el BACKEND
 * para evitar exponer el secreto de integridad en el código del cliente.
 * Aquí se implementa en el frontend SOLO para propósitos de prototipo/sandbox.
 *
 * Concatenación: <Referencia><MontoEnCentavos><COP><SecretoIntegridad>
 *
 * Nota: crypto.subtle solo está disponible en contextos seguros (HTTPS o localhost).
 * Cuando se sirve por HTTP plano se usa un fallback SHA-256 en JS puro.
 */
async function calcularFirmaIntegridad(referencia, amountInCents) {
  const cadena = `${referencia}${amountInCents}COP${SECRETO_INTEGRIDAD_WOMPI}`;

  // ── Intento 1: Web Crypto API (disponible en HTTPS / localhost) ──
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(cadena);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // ── Fallback: SHA-256 en JS puro (funciona en HTTP plano) ─────────
  console.warn("[ParquesSJ] crypto.subtle no disponible (contexto no seguro). Usando SHA-256 fallback.");
  return sha256Fallback(cadena);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SHA-256 puro en JavaScript — Implementación conforme a FIPS 180-4.
 * Solo se invoca como fallback cuando crypto.subtle no está disponible.
 * ───────────────────────────────────────────────────────────────────────────── */
function sha256Fallback(message) {
  // Constantes de ronda (primeros 32 bits de las partes fraccionarias de las raíces cúbicas de los primeros 64 primos)
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
    0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
    0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
    0xc67178f2,
  ];

  function rr(x, n) {
    return (x >>> n) | (x << (32 - n));
  }

  // Codificar mensaje a bytes UTF-8
  const encoder = new TextEncoder();
  const msgBytes = encoder.encode(message);
  const bitLen = msgBytes.length * 8;

  // Pre-processing: padding
  const totalLen = msgBytes.length + 1 + 8; // +1 for 0x80, +8 for length
  const padLen = (64 - (totalLen % 64)) % 64;
  const buf = new ArrayBuffer(msgBytes.length + 1 + padLen + 8);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  u8.set(msgBytes, 0);
  u8[msgBytes.length] = 0x80;
  // Longitud en bits como big-endian 64-bit
  view.setUint32(buf.byteLength - 4, bitLen, false);

  // Valores hash iniciales
  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a;
  let h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19;

  // Procesar bloques de 512 bits (64 bytes)
  for (let offset = 0; offset < buf.byteLength; offset += 64) {
    const W = new Uint32Array(64);
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rr(W[i - 15], 7) ^ rr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rr(W[i - 2], 17) ^ rr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) | 0;
      const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  // Convertir a hex string
  return [h0, h1, h2, h3, h4, h5, h6, h7].map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

/**
 * Formatea un número como moneda COP.
 */
function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Elementos del DOM ──────────────────────────────────────────────────────
const loginCard = document.getElementById("loginCard");
const chargeCard = document.getElementById("chargeCard");
const loginForm = document.getElementById("loginForm");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginError = document.getElementById("loginError");
const displayUser = document.getElementById("displayUser");
const chargeForm = document.getElementById("chargeForm");
const amountInput = document.getElementById("amountInput");
const amountHint = document.getElementById("amountHint");
const resultArea = document.getElementById("resultArea");
const btnLogout = document.getElementById("btnLogout");

// ─── Login con BDD simulada ─────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorSpan = loginError.querySelector("span");

  const user = loginUser.value.trim();
  const pass = loginPass.value.trim();

  if (!user || !pass) {
    errorSpan.textContent = "Por favor completa ambos campos.";
    loginError.classList.remove("hidden");
    return;
  }

  try {
    // Consultar el archivo de texto simulando la base de datos
    // Soporta ejecución desde la raíz (/index.html) y desde /pages/pagos.html.
    const posiblesRutas = ["../data/usuarios.txt", "data/usuarios.txt", "/data/usuarios.txt"];
    let response = null;

    for (const ruta of posiblesRutas) {
      const intento = await fetch(ruta);
      if (intento.ok) {
        response = intento;
        break;
      }
    }

    if (!response) throw new Error("Error al conectar con la base de datos");
    const dbData = await response.text();

    // Parsear el archivo: separar por saltos de línea y buscar la coincidencia
    const lines = dbData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let isAuthenticated = false;

    for (const line of lines) {
      const [dbUser, dbPass] = line.split(",");
      if (dbUser === user && dbPass === pass) {
        isAuthenticated = true;
        break;
      }
    }

    if (!isAuthenticated) {
      errorSpan.textContent = "Usuario o contraseña incorrectos.";
      loginError.classList.remove("hidden");
      return;
    }

    loginError.classList.add("hidden");

    // Mostrar panel de recarga
    displayUser.textContent = user;
    loginCard.classList.add("hidden");
    chargeCard.classList.remove("hidden");

    // Si el usuario es administrador, mostramos su panel de estadísticas lateral
    if (user === "admin") {
      const adminStatsCard = document.getElementById("adminStatsCard");
      if (adminStatsCard) {
        adminStatsCard.classList.remove("hidden");
        renderAdminCharts();
      }
    }

    document.body.classList.remove("is-login");
  } catch (error) {
    errorSpan.textContent = "Error del servidor. Intenta nuevamente.";
    loginError.classList.remove("hidden");
  }
});

// ─── Logout ─────────────────────────────────────────────────────────────────
btnLogout.addEventListener("click", () => {
  chargeCard.classList.add("hidden");
  const adminStatsCard = document.getElementById("adminStatsCard");
  if (adminStatsCard) adminStatsCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  document.body.classList.add("is-login");
  loginForm.reset();
  chargeForm.reset();
  resultArea.innerHTML = "";
  amountHint.innerHTML = "Ingresa un valor mínimo de <strong>$2.000 COP</strong>";
});

// ─── Actualizar hint de monto ───────────────────────────────────────────────
amountInput.addEventListener("input", () => {
  const val = parseInt(amountInput.value, 10);
  if (!isNaN(val) && val > 0) {
    amountHint.innerHTML = `Recargarás <strong>${formatCOP(val)}</strong>`;
  } else {
    amountHint.innerHTML = "Ingresa un valor mínimo de <strong>$2.000 COP</strong>";
  }
});

// ─── Confirmar Monto y abrir Widget oficial de Wompi ───────────────────────
// Implementación según la documentación oficial:
// https://docs.wompi.co/docs/colombia/widget-checkout-web/#botón-personalizado
chargeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultArea.innerHTML = "";

  const monto = parseInt(amountInput.value, 10);

  if (isNaN(monto) || monto < 2000) {
    resultArea.innerHTML = `
      <div class="alert alert--error">
        <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
        <span>El monto mínimo de recarga es <strong>$2.000 COP</strong>.</span>
      </div>`;
    return;
  }

  if (!LLAVE_PUBLICA_WOMPI || !SECRETO_INTEGRIDAD_WOMPI) {
    resultArea.innerHTML = `
      <div class="alert alert--error">
        <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
        <span>Configura <strong>LLAVE_PUBLICA_WOMPI</strong> y <strong>SECRETO_INTEGRIDAD_WOMPI</strong> en el código.</span>
      </div>`;
    return;
  }

  // Verificar que el script del widget se haya cargado correctamente
  if (typeof WidgetCheckout === "undefined") {
    resultArea.innerHTML = `
      <div class="alert alert--error">
        <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
        <span>El script de Wompi no se cargó. Verifica tu conexión a internet y recarga la página.</span>
      </div>`;
    return;
  }

  try {
    // Monto en centavos (Wompi requiere centavos)
    const amountInCents = monto * 100;

    // Referencia única
    const referencia = generarReferencia();

    // Calcular firma de integridad (SHA-256)
    // ⚠️ En producción esto DEBE ir en el backend para no exponer el secreto.
    const firma = await calcularFirmaIntegridad(referencia, amountInCents);

    // ── Paso 2: Configura la instancia del checkout ──────────────────────────
    // Según la doc oficial, signature va como objeto anidado: { integrity: hash }
    const checkout = new WidgetCheckout({
      currency: "COP",
      amountInCents: amountInCents,
      reference: referencia,
      publicKey: LLAVE_PUBLICA_WOMPI,
      signature: {
        integrity: firma,
      },
      redirectUrl: window.location.href, // Opcional: regresa aquí tras el pago
    });

    // ── Paso 3: Abre el widget y maneja el resultado ─────────────────────────
    checkout.open(function (result) {
      resultArea.innerHTML = "";

      const transaction = result.transaction;

      if (!transaction) {
        resultArea.innerHTML = `
          <div class="alert alert--error">
            <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
            <span>No se recibió información de la transacción. Intenta de nuevo.</span>
          </div>`;
        return;
      }

      const status = transaction.status;

      if (status === "APPROVED") {
        resultArea.innerHTML = `
          <div class="alert alert--success">
            <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm-1.7 14.3l-3.6-3.6 1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7Z"/></svg>
            <span>
              ✅ <strong>Transacción aprobada.</strong><br/>
              Ref: <code>${transaction.id}</code> — ${formatCOP(monto)}
            </span>
          </div>`;
      } else {
        resultArea.innerHTML = `
          <div class="alert alert--error">
            <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
            <span>
              ❌ <strong>Transacción ${status === "DECLINED" ? "rechazada" : status}.</strong><br/>
              Ref: <code>${transaction.id || referencia}</code>
            </span>
          </div>`;
      }
    });
  } catch (err) {
    // Muestra cualquier error inesperado en el DOM en lugar de fallar silenciosamente
    console.error("[ParquesSJ] Error al abrir el widget de Wompi:", err);
    resultArea.innerHTML = `
      <div class="alert alert--error">
        <svg viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"/></svg>
        <span><strong>Error:</strong> ${err.message || "No se pudo iniciar el pago. Revisa la consola del navegador (F12)."}</span>
      </div>`;
  }
});

// ─── Chart.js Lógica del Admin ──────────────────────────────────────────────
let energyChartInstance = null;
let usageChartInstance = null;

function renderAdminCharts() {
  const energyCtx = document.getElementById("energyChart");
  const usageCtx = document.getElementById("usageChart");

  if (!energyCtx || !usageCtx) return;

  // Destruir gráficos previos si existen para evitar solapamientos
  if (energyChartInstance) energyChartInstance.destroy();
  if (usageChartInstance) usageChartInstance.destroy();

  // Gráfico Lineal: Consumo de Energía
  energyChartInstance = new Chart(energyCtx, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [
        {
          label: "Consumo (kWh)",
          data: [12, 19, 15, 25, 22, 30, 28],
          borderColor: "#15803d",
          backgroundColor: "rgba(21, 128, 61, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#10b981",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
        x: { grid: { display: false } },
      },
    },
  });

  // Gráfico Dona: Uso de Cargadores
  usageChartInstance = new Chart(usageCtx, {
    type: "doughnut",
    data: {
      labels: ["Tipo 1 (Activo)", "Tipo 2 (Activo)", "Inactivo"],
      datasets: [
        {
          data: [45, 35, 20],
          backgroundColor: ["#15803d", "#10b981", "#cbd5e1"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } },
      },
      cutout: "70%",
    },
  });
}
