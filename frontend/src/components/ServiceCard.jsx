export default function ServiceCard({ icon, title, description, badge, cta, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'group text-left w-full rounded-2xl p-6 border-2 transition-all duration-200',
        disabled
          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
          : 'bg-white border-slate-200 hover:border-green-400 hover:shadow-xl hover:-translate-y-1 shadow-sm cursor-pointer',
      ].join(' ')}
    >
      {/* Icon */}
      <div
        className={[
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors',
          disabled ? 'bg-slate-100' : 'bg-green-50 group-hover:bg-green-100',
        ].join(' ')}
      >
        {icon}
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-slate-900 text-base leading-snug">{title}</h3>
        {badge && !disabled && (
          <span className="shrink-0 text-xs font-bold bg-green-700 text-white px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        {disabled && (
          <span className="shrink-0 text-xs font-semibold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
            Próximo
          </span>
        )}
      </div>

      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>

      {!disabled && cta && (
        <p className="mt-4 text-green-700 text-sm font-bold group-hover:underline underline-offset-2">
          {cta} →
        </p>
      )}
    </button>
  )
}
