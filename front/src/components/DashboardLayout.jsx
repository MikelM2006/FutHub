import { Users, Calendar, MapPin, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react'; // ReactNode se puede dejar o quitar, es opcional en JS
import { Logo } from './Logo';
import { MiPerfilModal } from './modals';

// interface DashboardLayoutProps se elimina

export function DashboardLayout({ children, userName, user, onNavigate, onLogout, currentPage }) {
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

  // Mantener un estado local del usuario para que los cambios en el modal se reflejen inmediatamente
  const [localUser, setLocalUser] = useState(user || null);

  // Sincronizar localUser cuando la prop `user` cambie desde afuera
  useEffect(() => {
    setLocalUser(user || null);
  }, [user]);

  // Construir perfil real a partir del objeto `localUser` si está disponible (permite refrescar UI al editar)
  const userProfile = {
    id: localUser?.id || user?.id,
    nombreCompleto: localUser?.nombreCompleto || user?.nombreCompleto || userName || 'Usuario',
    correo: localUser?.email || localUser?.correo || user?.email || user?.correo || 'usuario@email.com',
    cedula: localUser?.id_cedula || localUser?.cedula || user?.id_cedula || user?.cedula || 'V-00000000',
    posicion: localUser?.posicion || user?.posicion || 'Mediocampista Central',
    autoclasificacion: localUser?.autoclasificacion != null ? localUser.autoclasificacion : (user?.autoclasificacion != null ? user.autoclasificacion : 4),
  };

  const navItems = [
    { id: 'partidos', label: 'Partidos', icon: Calendar },
    { id: 'equipos', label: 'Equipos', icon: Users },
    { id: 'canchas', label: 'Canchas', icon: MapPin },
  ];

  const handleOpenPerfil = () => {
    setIsPerfilModalOpen(true);
  };

  // Se elimina el tipado ': any' de updatedProfile
  const handleGuardarPerfil = (updatedProfile) => {
    console.log('Perfil actualizado:', updatedProfile);
    // Actualizar el estado local del usuario para que la UI muestre los cambios inmediatamente
    setLocalUser(prev => ({ ...(prev || {}), ...(updatedProfile || {}) }));
    // Mantener también en localStorage para compatibilidad con la app existente
    try { localStorage.setItem('user', JSON.stringify({ ...(localUser || {}), ...(updatedProfile || {}) })); } catch (e) { /* ignore */ }
  };

  const initials = (userProfile.nombreCompleto || 'Usuario').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* ... (el resto del JSX sigue igual) ... */}
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937] text-white flex flex-col p-6 shadow-lg">
        <div className="mb-10">
          <Logo variant="light" size="md" />
        </div>
        
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#16a34a] text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="space-y-3">
          <button
            onClick={handleOpenPerfil}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {userName && (
          <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Bienvenido de vuelta</p>
                <h2 className="text-[#111827]">{userName}</h2>
              </div>
            </div>
          </header>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Modal de Perfil */}
      <MiPerfilModal
        open={isPerfilModalOpen}
        onOpenChange={setIsPerfilModalOpen}
        profile={userProfile}
        onGuardarCambios={handleGuardarPerfil}
      />
    </div>
  );
}