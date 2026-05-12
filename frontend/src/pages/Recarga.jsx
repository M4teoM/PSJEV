import { useState } from 'react'
import { Link } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'

const CHARGERS = [
  {
    id: 'tipo2-a',
    label: 'Cargador A',
    type: 'Tipo 2',
    power: '7 kW',
    location: 'Parqueadero P1 — Sótano 1',
    available: true,
  },
  {
    id: 'tipo2-b',
    label: 'Cargador B',
    type: 'Tipo 2',
    power: '7 kW',
    location: 'Parqueadero P2 — Sótano 1',
    available: true,
  },
]

const PRESET_AMOUNTS = [5000, 10000, 15000, 20000, 30000, 50000]
const RATE_COP_PER_KWH = 850

function formatCOP(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)
}

function sha256Client(message) {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ]
  const rr = (x, n) => (x >>> n) | (x << (32 - n))
  const enc = new TextEncoder()
  const msgBytes = enc.encode(message)
  const bitLen = msgBytes.length * 8
  const totalLen = msgBytes.length + 1 + 8
  const padLen = (64 - (totalLen % 64)) % 64
  const buf = new ArrayBuffer(msgBytes.length + 1 + padLen + 8)
  const view = new DataView(buf)
  new Uint8Array(buf).set(msgBytes)
  new Uint8Array(buf)[msgBytes.length] = 0x80
  view.setUint32(buf.byteLength - 4, bitLen, false)
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a
  let h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19
  for (let off = 0; off < buf.byteLength; off += 64) {
    const W = new Uint32Array(64)
    for (let i = 0; i < 16; i++) W[i] = view.getUint32(off + i * 4, false)
    for (let i = 16; i < 64; i++) {
      const s0 = rr(W[i-15],7)^rr(W[i-15],18)^(W[i-15]>>>3)
      const s1 = rr(W[i-2],17)^rr(W[i-2],19)^(W[i-2]>>>10)
      W[i] = (W[i-16]+s0+W[i-7]+s1)|0
    }
    let [a,b,c,d,e,f,g,h]=[h0,h1,h2,h3,h4,h5,h6,h7]
    for (let i = 0; i < 64; i++) {
      const S1=(rr(e,6)^rr(e,11)^rr(e,25))
      const ch=(e&f)^(~e&g)
      const t1=(h+S1+ch+K[i]+W[i])|0
      const S0=(rr(a,2)^rr(a,13)^rr(a,22))
      const maj=(a&b)^(a&c)^(b&c)
      const t2=(S0+maj)|0
      h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0
    }
    h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0
    h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+h)|0
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map(v=>(v>>>0).toString(16).padStart(8,'0')).join('')
}

// ── Subcomponente: resultado del pago ────────────────────────────────────────
function PaymentResult({ status, transactionId, amount, onReset }) {
  const ok = status === 'APPROVED'
  return (
    <div className={`rounded-2xl p-6 border-2 text-center animate-fade-up ${ok ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
      <p className="text-4xl mb-3">{ok ? '✅' : '❌'}</p>
      <p className={`font-bold text-lg ${ok ? 'text-green-800' : 'text-red-700'}`}>
        {ok ? 'Pago aprobado' : `Pago ${status === 'DECLINED' ? 'rechazado' : status}`}
      </p>
      {transactionId && (
        <p className="text-sm text-slate-500 mt-2">
          Ref: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{transactionId}</code>
        </p>
      )}
      {ok && <p className="text-green-700 font-semibold mt-2">{formatCOP(amount)} recargados</p>}
      <button
        onClick={onReset}
        className="mt-6 px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors text-sm"
      >
        Nueva recarga
      </button>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Recarga() {
  const [step, setStep] = useState(0)
  const [charger, setCharger] = useState(null)
  const [preset, setPreset] = useState(null)
  const [custom, setCustom] = useState('')
  const [paying, setPaying] = useState(false)
  const [result, setResult] = useState(null)

  // El script se carga estáticamente en index.html → siempre disponible
  const widgetReady = typeof window.WidgetCheckout !== 'undefined'

  const finalAmount = preset ?? (parseInt(custom) || 0)
  const estimatedKwh = finalAmount > 0 ? (finalAmount / RATE_COP_PER_KWH).toFixed(2) : '—'

  async function getFirma(referencia, amountInCents) {
    try {
      const res = await fetch('/api/wompi/firma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referencia, amountInCents }),
      })
      if (!res.ok) throw new Error('backend no disponible')
      return res.json() // { firma, publicKey }
    } catch {
      // Fallback: calcula la firma en el cliente (solo para sandbox/prototipo)
      const secreto = 'test_integrity_5IfHdldMe7kwp4PdOWHdAunrfDd9yhVm'
      const publicKey = 'pub_test_H30y3P0ZVVOWdPUN72fbwVlSxm6Va2PO'
      const firma = sha256Client(`${referencia}${amountInCents}COP${secreto}`)
      return { firma, publicKey }
    }
  }

  async function handlePay() {
    if (typeof window.WidgetCheckout === 'undefined') {
      console.error('[PSJ] WidgetCheckout no está disponible')
      return
    }
    setPaying(true)
    try {
      const ref = `PSJ-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
      const amountInCents = finalAmount * 100
      const { firma, publicKey } = await getFirma(ref, amountInCents)

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference: ref,
        publicKey,
        signature: { integrity: firma },
        // redirectUrl solo se usa en modo redirección (no popup).
        // Lo omitimos para que el widget use siempre el callback.
      })

      checkout.open((res) => {
        setPaying(false)
        const tx = res?.transaction
        if (tx) setResult({ status: tx.status, transactionId: tx.id, amount: finalAmount })
      })
    } catch (err) {
      console.error('[PSJ Recarga]', err)
      setPaying(false)
    }
  }

  function reset() {
    setStep(0)
    setCharger(null)
    setPreset(null)
    setCustom('')
    setResult(null)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <PaymentResult {...result} onReset={reset} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 py-10 px-4 font-sans">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center gap-4">
        <Link
          to="/v1-home"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <div>
          <h1 className="font-bold text-slate-900 text-xl">Recarga Vehículo Eléctrico</h1>
          <p className="text-slate-400 text-xs mt-0.5">Parques de San Jerónimo</p>
        </div>
      </div>

      <StepIndicator current={step} steps={['Cargador', 'Monto', 'Confirmar']} />

      <div className="max-w-2xl mx-auto mt-8 animate-fade-up">

        {/* ══ PASO 0: Selección de cargador ══════════════════════════════ */}
        {step === 0 && (
          <div>
            <p className="text-slate-600 text-sm mb-5">Selecciona uno de los cargadores disponibles.</p>
            <div className="grid gap-4">
              {CHARGERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCharger(c)}
                  className={[
                    'w-full text-left p-5 rounded-2xl border-2 transition-all duration-200',
                    charger?.id === c.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-green-300 shadow-sm',
                    !c.available && 'opacity-50 cursor-not-allowed',
                  ].join(' ')}
                  disabled={!c.available}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-base">{c.label}</p>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {c.type} · {c.power} · {c.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${c.available ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
                      />
                      <span
                        className={`text-sm font-semibold ${c.available ? 'text-green-700' : 'text-slate-500'}`}
                      >
                        {c.available ? 'Disponible' : 'Ocupado'}
                      </span>
                    </div>
                  </div>
                  {charger?.id === c.id && (
                    <div className="mt-3 flex items-center gap-1.5 text-green-700 text-xs font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Seleccionado
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              disabled={!charger}
              onClick={() => setStep(1)}
              className="mt-6 w-full py-3.5 bg-green-700 text-white font-bold rounded-xl disabled:opacity-40 hover:bg-green-800 transition-colors shadow"
            >
              Continuar
            </button>
          </div>
        )}

        {/* ══ PASO 1: Monto ═══════════════════════════════════════════════ */}
        {step === 1 && (
          <div>
            <p className="text-slate-600 text-sm mb-5">¿Cuánto deseas recargar?</p>

            {/* Montos rápidos */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setPreset(a); setCustom('') }}
                  className={[
                    'py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-150',
                    preset === a
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-green-300',
                  ].join(' ')}
                >
                  {formatCOP(a)}
                </button>
              ))}
            </div>

            {/* Monto personalizado */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                O ingresa otro valor (mín. $2.000 COP)
              </label>
              <input
                type="number"
                min="2000"
                step="500"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setPreset(null) }}
                placeholder="Ej. 18.000"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none font-semibold text-slate-900 transition-all"
              />
            </div>

            {/* Resumen de energía */}
            {finalAmount >= 2000 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between mb-5">
                <div>
                  <p className="text-green-700 text-xs font-semibold uppercase tracking-wide">Energía estimada</p>
                  <p className="text-green-900 text-2xl font-bold">{estimatedKwh} kWh</p>
                </div>
                <div className="text-right">
                  <p className="text-green-700 text-xs font-semibold uppercase tracking-wide">Total</p>
                  <p className="text-green-900 text-xl font-bold">{formatCOP(finalAmount)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Atrás
              </button>
              <button
                disabled={finalAmount < 2000}
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 bg-green-700 text-white font-bold rounded-xl disabled:opacity-40 hover:bg-green-800 transition-colors shadow"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* ══ PASO 2: Confirmar y pagar ════════════════════════════════════ */}
        {step === 2 && (
          <div>
            <p className="text-slate-600 text-sm mb-5">Revisa el resumen y confirma tu pago.</p>

            {/* Resumen */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-5">
              <h3 className="font-bold text-slate-900 mb-4 text-base">Resumen de recarga</h3>
              <dl className="space-y-3 text-sm">
                <Row label="Cargador" value={`${charger?.label} (${charger?.type})`} />
                <Row label="Potencia" value={charger?.power} />
                <Row label="Ubicación" value={charger?.location} />
                <Row label="Energía estimada" value={`${estimatedKwh} kWh`} />
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <dt className="font-bold text-slate-900 text-base">Total a pagar</dt>
                  <dd className="font-bold text-green-700 text-xl">{formatCOP(finalAmount)}</dd>
                </div>
              </dl>
            </div>

            {/* Sandbox info */}
            <div className="bg-amber-50 border border-dashed border-amber-300 rounded-xl p-4 mb-6 text-sm">
              <p className="font-bold text-amber-800 mb-2">🧪 Sandbox — Tarjetas de prueba</p>
              <div className="space-y-1 text-amber-700 font-mono text-xs">
                <p><code className="bg-amber-100 px-1.5 py-0.5 rounded">4242 4242 4242 4242</code> → Aprobada</p>
                <p><code className="bg-amber-100 px-1.5 py-0.5 rounded">4111 1111 1111 1111</code> → Rechazada</p>
              </div>
              <p className="text-amber-600 text-xs mt-2">CVC: cualquier 3 dígitos · Fecha: cualquier fecha futura</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handlePay}
                disabled={paying || !widgetReady}
                className="flex-1 py-3.5 bg-green-700 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-green-800 transition-colors shadow flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Iniciando pago…
                  </>
                ) : (
                  '⚡ Pagar con Wompi'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900 text-right">{value}</dd>
    </div>
  )
}
