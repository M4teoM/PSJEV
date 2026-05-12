import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ServiceCard from '../components/ServiceCard'

const SERVICES = [
  {
    icon: '⚡',
    title: 'Recarga Vehículos Eléctricos',
    description:
      'Sistema de recarga para cargadores Tipo 2 (7 kW). Selecciona tu cargador, define el monto y paga de forma segura con Wompi.',
    badge: 'Prioritario',
    cta: 'Ir a recargar',
    route: '/v1-home/recarga',
  },
  {
    icon: '💳',
    title: 'Pago de Administración',
    description:
      'Realiza el pago de tu cuota mensual de administración de manera fácil, con confirmación al instante.',
    cta: 'Ir a pagar',
    disabled: true,
  },
  {
    icon: '🏠',
    title: 'Reserva Zonas Comunes',
    description:
      'Gestiona y paga la reserva del salón social, zona BBQ y otros espacios de uso privado del conjunto.',
    cta: 'Reservar espacio',
    disabled: true,
  },
  {
    icon: '📋',
    title: 'Circulares y Comunicados',
    description:
      'Consulta las últimas circulares, actas de asamblea y comunicaciones oficiales de la administración.',
    cta: 'Ver circulares',
    disabled: true,
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-slate-50 font-sans">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className="pt-20 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto animate-fade-up">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-teal-800 p-8 sm:p-14 shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="text-green-300 text-xs font-bold tracking-widest uppercase mb-3">
                  Conjunto Residencial
                </p>
                <h1 className="font-serif text-white text-3xl sm:text-5xl font-bold leading-tight max-w-xl">
                  Bienvenido a Parques de San Jerónimo
                </h1>
                <p className="text-green-100/90 mt-4 max-w-md leading-relaxed text-sm sm:text-base">
                  Tu portal de servicios residenciales. Gestiona pagos, reservas y
                  comunicaciones en un solo lugar.
                </p>
                <button
                  onClick={() => navigate('/v1-home/recarga')}
                  className="mt-8 inline-flex items-center gap-2 bg-white text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg text-sm"
                >
                  ⚡ Ir a Recarga EV
                </button>
              </div>

              {/* Logo  */}
              <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl hidden sm:block">
                <img src="/img/PSJ.png" alt="PSJ" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Services ──────────────────────────────────────────────── */}
      <main id="servicios" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="mb-6">
          <h2 className="font-serif text-slate-900 text-2xl font-bold">Servicios disponibles</h2>
          <p className="text-slate-500 text-sm mt-1">
            Accede a los módulos activos del conjunto residencial.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.title}
              {...s}
              onClick={s.route ? () => navigate(s.route) : undefined}
            />
          ))}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <img src="/img/PSJ.png" alt="PSJ" className="w-8 h-8 rounded-lg object-cover" />
            <span>Parques de San Jerónimo — Portal Residencial</span>
          </div>
          <a
            href="mailto:administracion@parquesdesanjeronimo.com"
            className="text-green-700 font-semibold hover:underline underline-offset-2"
          >
            Contactar Administración
          </a>
        </div>
      </footer>
    </div>
  )
}
