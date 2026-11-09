import React from 'react';

export default function MetricCard({ title, value, unit, subtext, icon, trend, accentColor = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
    },
    sky: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconBg: 'bg-sky-500/10 text-sky-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-400',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.emerald;

  return (
    <div className={`bg-slate-900/80 rounded-2xl p-5 border ${scheme.border} transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group`}>
      {/* Background radial gradient accent on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/20 rounded-full blur-2xl group-hover:bg-emerald-500/5 transition-all" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${scheme.iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {subtext && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400">
          {trend && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${scheme.badge}`}>
              {trend}
            </span>
          )}
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </div>
  );
}
