import React from 'react';

export default function DepartmentBarChart({ emissionsByDepartment }) {
  if (!emissionsByDepartment || Object.keys(emissionsByDepartment).length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 text-center text-slate-400">
        No department emission records available.
      </div>
    );
  }

  const entries = Object.entries(emissionsByDepartment).sort((a, b) => b[1] - a[1]);
  const maxEmission = Math.max(...entries.map(([, val]) => val), 1);

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Departmental Carbon Emissions</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ranked
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Calculated in kg CO₂ equivalent across campus zones</p>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-slate-400 flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Benchmark Formula: E(0.82) + W(0.0003)</span>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map(([dept, emission]) => {
          const percentage = Math.min(100, Math.round((emission / maxEmission) * 100));
          const isHighest = emission === maxEmission;

          return (
            <div key={dept} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2 font-medium text-slate-200">
                  <span>{dept}</span>
                  {isHighest && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-semibold">
                      Highest Load
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-emerald-400">{emission.toLocaleString()}</span>
                  <span className="text-slate-500">kg CO₂e</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isHighest
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
