import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CanchaCard } from '../components/CanchaCard';
import { useState, useEffect } from 'react';

export function Canchas({ userName = 'Usuario', user, onNavigate, onLogout, isAdmin = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCanchas() {
      try {
        const res = await fetch('/api/canchas/'); // proxied a localhost:8080 por vite.config
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setCanchas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setError('No se pudieron cargar las canchas.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCanchas();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout userName={userName} user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="canchas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-[#111827]">Explorar Canchas</h1>
          {isAdmin && (
            <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg">
              <Plus className="w-5 h-5 mr-2" />
              Agregar Nueva Cancha
            </Button>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar canchas por nombre o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
          />
        </div>

        {/* Estados de carga / error */}
        {loading && <div>Cargando canchas...</div>}
        {!loading && error && <div className="text-red-600">{error}</div>}

        {/* Cuadrícula de canchas */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canchas
              .filter((c) =>
                (c.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.ubicacion || '').toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((cancha, index) => {
                const imagen = cancha.imagenUrl || cancha.imagen || cancha.image || 'https://via.placeholder.com/400x250?text=Sin+imagen';
                return (
                  <CanchaCard
                    key={cancha.id ?? index}
                    {...cancha}
                    imagen={imagen}
                  />
                );
              })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}