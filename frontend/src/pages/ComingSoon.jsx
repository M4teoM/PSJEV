import { useEffect, useState } from 'react'

export default function ComingSoon() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const id = setInterval(() => setDots(d => (d.length >= 3 ? '.' : d + '.')), 700)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-900/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md animate-fade-up">
        {/* Imagen del conjunto */}
        <div className="w-40 h-40 rounded-3xl overflow-hidden mb-8 shadow-2xl ring-4 ring-white/10">
          <img
            src="/img/PSJ.png"
            alt="Parques de San Jerónimo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-green-400 text-xs font-bold tracking-widest uppercase mb-6 bg-green-950/70 px-4 py-1.5 rounded-full border border-green-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          En Construcción
        </span>

        {/* Título */}
        <h1 className="font-serif text-white font-bold text-4xl sm:text-5xl leading-tight mb-5">
          Parques de<br />San Jerónimo
        </h1>

        {/* Descripción */}
        <p className="text-slate-400 text-base leading-relaxed mb-10">
          Estamos preparando el portal residencial para ti.<br />
          Pronto tendrás acceso a todos los servicios del conjunto.
        </p>

        {/* Estado */}
        <p className="font-mono text-slate-600 text-sm tracking-widest">
          Próximamente{dots}
        </p>
      </div>
    </div>
  )
}
