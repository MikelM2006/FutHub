import { MapPin, LogOut } from 'lucide-react';
import { Logo } from './Logo';

export function AdminLayout({ children, onNavigate, onLogout, currentPage }) {
  const navItems = [
    { id: 'gestionar-canchas', label: 'Gestionar Canchas', icon: MapPin },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937] text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Logo size="md" variant="light" />
          <p className="text-sm text-gray-400 mt-2">Panel de Administrador</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-[#16a34a] text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión (Admin)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white">
              A
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Administrador</p>
              <h2 className="text-[#111827]">Panel de Control</h2>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
