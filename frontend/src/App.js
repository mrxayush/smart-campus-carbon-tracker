import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddRecordModal from './components/AddRecordModal';
import { authService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setUser(authService.getCurrentUser() || '');
      setRole(authService.getRole() || '');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser('');
    setRole('');
  };

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleRecordAdded = () => {
    // Increment refresh key to trigger dashboard refresh
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        user={user}
        role={role}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        <Dashboard
          key={refreshKey}
          role={role}
          user={user}
        />
      </main>

      {/* Global Admin Modal accessed from Navbar */}
      {role === 'ROLE_ADMIN' && (
        <AddRecordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onRecordAdded={handleRecordAdded}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>Smart Campus Carbon Footprint & Energy Tracker • Net-Zero Academic Initiative</p>
      </footer>
    </div>
  );
}

export default App;
