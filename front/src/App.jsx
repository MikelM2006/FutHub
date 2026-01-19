import { useState, useEffect } from 'react';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Canchas } from './pages/Canchas';
import { Partidos } from './pages/Partidos';
import  { Equipos }   from './pages/Equipos'; //se pone sin llaves porque se usa default export
import { GestionarCanchas } from './pages/admin/GestionarCanchas';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setIsAuthenticated(true);
        setCurrentPage('home');
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
    setIsAuthenticated(true);
    setCurrentPage('home');
    try { localStorage.setItem('user', JSON.stringify(userObj)); } catch (e) { /* ignore */ }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('login');
    try { localStorage.removeItem('user'); } catch (e) { /* ignore */ }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return <Register onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    return (
      <Login
        onNavigateToRegister={() => setCurrentPage('register')}
        onLogin={handleLogin}
      />
    );
  }

  const userName = user?.nombreCompleto || 'Usuario';

  // Si está autenticado, mostrar las páginas del dashboard
  // Si el usuario es administrador, mostrar el panel de admin
  if (user?.rol === 'ADMINISTRADOR') {
    return (
      <GestionarCanchas
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  switch (currentPage) {
    case 'home':
    case 'partidos':
      return (
        <Home
          userName={userName}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onCreatePartido={() => setCurrentPage('crear-partido')}
        />
      );
    case 'canchas':
      return (
        <Canchas
          userName={userName}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          isAdmin={false}
        />
      );
    case 'crear-partido':
      return (
        <Partidos
          userName={userName}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    case 'equipos':
      return (
        <Equipos
          userName={userName}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    default:
      return (
        <Home
          userName={userName}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onCreatePartido={() => setCurrentPage('crear-partido')}
        />
      );
  }
}