import React, { useState } from 'react';
import { authService } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authService.register(username, password, role);
      } else {
        await authService.login(username, password);
      }
      onLoginSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Authentication failed. Please check credentials.';
      setError(typeof msg === 'string' ? msg : 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/90 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Join Campus Sustainability' : 'Smart Campus Tracker'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isRegister
              ? 'Create your academic account to view or log carbon emissions'
              : 'Sign in to access real-time energy & footprint metrics'}
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Demo Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center justify-center space-x-1"
            >
              <span>👑 Admin (Full Access)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student', 'student123')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 hover:bg-sky-500/20 transition-all flex items-center justify-center space-x-1"
            >
              <span>🎓 Student (View Only)</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center space-x-2">
            <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login / Register Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or john_doe"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assign System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="ROLE_STUDENT">Student (Dashboard Viewer)</option>
                <option value="ROLE_ADMIN">Campus Admin (Manage & Log Data)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-lg font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-slate-900" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Authenticate & Enter'}</span>
            )}
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRegister
              ? 'Already registered? Click here to Login'
              : "Don't have an account? Register a new Student or Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
