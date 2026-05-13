export default function StepIndicator({ current, steps }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  i < current
                    ? 'bg-green-600 text-white shadow'
                    : i === current
                    ? 'bg-green-700 text-white ring-4 ring-green-100 shadow-md'
                    : 'bg-slate-200 text-slate-400',
                ].join(' ')}
              >
                {i < current ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-semibold whitespace-nowrap ${
                  i <= current ? 'text-green-700' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 mb-5 rounded transition-colors duration-300 ${
                  i < current ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
