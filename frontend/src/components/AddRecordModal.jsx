import React, { useState } from 'react';
import { recordService } from '../services/api';

export default function AddRecordModal({ isOpen, onClose, onRecordAdded }) {
  const [departmentName, setDepartmentName] = useState('');
  const [electricityKWh, setElectricityKWh] = useState('');
  const [waterUsageLitres, setWaterUsageLitres] = useState('');
  const [loggedDate, setLoggedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time calculation preview
  const numElectricity = parseFloat(electricityKWh) || 0;
  const numWater = parseFloat(waterUsageLitres) || 0;
  const electricCarbon = (numElectricity * 0.82);
  const waterCarbon = (numWater * 0.0003);
  const liveTotalCarbon = (electricCarbon + waterCarbon).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!departmentName.trim()) {
      setError('Please provide a valid department name.');
      return;
    }
    if (numElectricity < 0 || numWater < 0) {
      setError('Values cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      await recordService.createRecord({
        departmentName: departmentName.trim(),
        electricityKWh: numElectricity,
        waterUsageLitres: numWater,
        loggedDate: loggedDate || new Date().toISOString().split('T')[0],
      });

      // Reset form
      setDepartmentName('');
      setElectricityKWh('');
      setWaterUsageLitres('');
      onRecordAdded();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record entry. Ensure Admin privileges.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Log Department Energy Usage</h3>
            <p className="text-xs text-slate-400">Emissions calculated using standard campus sustainability factors</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
            <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Department / Building</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science Lab B, Main Library, Cafeteria"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Electricity (kWh)</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 1250"
                value={electricityKWh}
                onChange={(e) => setElectricityKWh(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <span className="text-[10px] text-slate-500">Factor: 0.82 kg CO₂/kWh</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Water Usage (Litres)</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 4500"
                value={waterUsageLitres}
                onChange={(e) => setWaterUsageLitres(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <span className="text-[10px] text-slate-500">Factor: 0.0003 kg CO₂/L</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Log Date</label>
            <input
              type="date"
              required
              value={loggedDate}
              onChange={(e) => setLoggedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Real-time Dynamic Emissions Preview */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/20">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-300">Live Carbon Computation Preview:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{liveTotalCarbon} kg CO₂e</span>
            </div>
            <div className="text-[11px] text-slate-400 flex flex-wrap gap-2">
              <span>⚡ Power: {electricCarbon.toFixed(1)} kg</span>
              <span>•</span>
              <span>💧 Water: {waterCarbon.toFixed(1)} kg</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <span>Recording...</span>
              ) : (
                <span>Confirm & Store Record</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
