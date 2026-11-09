import React from 'react';
import { authService } from '../services/api';

export default function Navbar({ user, role, onLogout, onOpenAddModal }) {
  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-white">EcoCampus</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live IoT Tracker
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Campus Carbon Footprint & Energy Analytics</p>
            </div>
          </div>

          {/* User Controls & Role Badges */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Log Department Energy</span>
              </button>
            )}

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                {user ? user.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-purple-400' : 'text-sky-400'}`}>
                  {isAdmin ? 'Campus Admin' : 'Student'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
