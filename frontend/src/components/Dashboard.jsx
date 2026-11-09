import React, { useState, useEffect, useCallback } from 'react';
import { recordService } from '../services/api';
import MetricCard from './MetricCard';
import DepartmentBarChart from './DepartmentBarChart';
import AddRecordModal from './AddRecordModal';

export default function Dashboard({ role, user }) {
  const isAdmin = role === 'ROLE_ADMIN';
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [recordsData, statsData] = await Promise.all([
        recordService.getAllRecords(selectedDeptFilter),
        recordService.getStats(),
      ]);
      setRecords(recordsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setActionMessage({ text: 'Error connecting to Spring Boot backend.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedDeptFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id, dept) => {
    if (!window.confirm(`Delete energy record for "${dept}"?`)) return;

    try {
      await recordService.deleteRecord(id);
      setActionMessage({ text: `Record for "${dept}" successfully deleted.`, type: 'success' });
      fetchData();
      setTimeout(() => setActionMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      setActionMessage({ text: 'Failed to delete record. Admin access required.', type: 'error' });
    }
  };

  // Filter records by client-side search box
  const filteredRecords = records.filter((r) =>
    r.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.loggedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification Banner */}
      {actionMessage.text && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage({ text: '', type: '' })} className="hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Hero Welcome & Eco Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Campus Net-Zero Intelligence Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Department Carbon & Energy Monitor
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time tracking of institutional power and water consumption converted to verifiable CO₂ emissions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Log Energy Record</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300 flex items-center space-x-2">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Student View Mode (Read-Only)</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Carbon Footprint"
          value={stats ? stats.totalCarbonEmissionsKg : 0}
          unit="kg CO₂e"
          trend="Grid Mix"
          subtext="Total Campus Impact"
          accentColor="emerald"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <MetricCard
          title="Electricity Consumed"
          value={stats ? stats.totalElectricityKWh : 0}
          unit="kWh"
          trend="0.82 kg/unit"
          subtext="Across All Departments"
          accentColor="amber"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />

        <MetricCard
          title="Water Usage"
          value={stats ? stats.totalWaterUsageLitres : 0}
          unit="Litres"
          trend="0.0003 kg/L"
          subtext="Campus Distribution"
          accentColor="sky"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />

        <MetricCard
          title="Highest Emitting Zone"
          value={stats?.topEmittingDepartment || 'N/A'}
          unit=""
          trend="Alert"
          subtext="Requires Energy Audit"
          accentColor="purple"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Visual Indicator: Department Bar Chart */}
      <DepartmentBarChart emissionsByDepartment={stats?.emissionsByDepartment} />

      {/* Data Table Section */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
        {/* Table Controls (Search & Filters) */}
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white">Campus Energy & Footprint Ledger</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search department or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              title="Refresh"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Electricity (kWh)</th>
                <th className="py-3 px-4">Water (Litres)</th>
                <th className="py-3 px-4">Carbon Footprint</th>
                <th className="py-3 px-4">Logged Date</th>
                <th className="py-3 px-4">Recorded By</th>
                {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading campus records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-slate-500">
                    No matching energy records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  // Badge styling based on carbon emission intensity
                  const emissionBadge =
                    r.carbonEmissions > 2000
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : r.carbonEmissions > 1000
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {r.departmentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {r.electricityKWh.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {r.waterUsageLitres.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold border ${emissionBadge}`}>
                          {r.carbonEmissions.toLocaleString()} kg CO₂e
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {r.loggedDate}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          <span>{r.loggedBy}</span>
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(r.id, r.departmentName)}
                            title="Delete Record"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal (Admin Only) */}
      {isAdmin && (
        <AddRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRecordAdded={fetchData}
        />
      )}
    </div>
  );
}
