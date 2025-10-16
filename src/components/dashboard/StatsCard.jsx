export default function StatsCard({ title, value, trend, icon: Icon, color = 'blue' }) {
  // Map color to background and text color classes
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      gradient: 'from-green-50 to-green-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      gradient: 'from-amber-50 to-amber-100'
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
      gradient: 'from-violet-50 to-violet-100'
    }
  }
  
  const selectedColor = colorClasses[color] || colorClasses.blue
  
  return (
    <div className={`rounded-xl border ${selectedColor.border} bg-gradient-to-br ${selectedColor.gradient} p-4 shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-gray-500">{title}</div>
        <div className={`grid h-10 w-10 place-items-center rounded-full ${selectedColor.bg} ${selectedColor.text} shadow-sm`}>
          {Icon ? <Icon size={20} /> : null}
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend.positive && <span className="inline-block transform rotate-45">+</span>}
          {!trend.positive && <span className="inline-block">-</span>}
          {trend.text}
        </div>
      )}
    </div>
  )
}
