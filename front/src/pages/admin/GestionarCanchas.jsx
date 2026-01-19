import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { CanchaCard } from '../../components/CanchaCard';
import { AgregarEditarCanchaModal } from '../../components/modals/AgregarEditarCanchaModal';
import { EditCanchaModal } from '../../components/modals/EditCanchaModal';

export function GestionarCanchas({ onNavigate, onLogout }) {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState(null);

  // Abrir modal de edición con la cancha seleccionada
  const handleEditClick = (cancha) => {
    setSelectedCancha(cancha);
    setIsEditOpen(true);
  };

  // Eliminar una cancha
  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta cancha?');
    if (!confirmed) return;

    try {
      setError(null);
      const res = await fetch(`/api/canchas/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}${txt ? ` - ${txt}` : ''}`);
      }
      // Remover del estado local sin recargar
      setCanchas((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error('Error al eliminar cancha:', e);
      setError('No se pudo eliminar la cancha. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    let mounted = true;
    async function fetchCanchas() {
      try {
        const res = await fetch('/api/canchas/'); // proxied por vite.config
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
    return () => { mounted = false; };
  }, []);

  return (
    <AdminLayout onNavigate={onNavigate} onLogout={onLogout} currentPage="gestionar-canchas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-[#111827]">Gestionar Canchas</h1>
          <Button
            onClick={() => setIsAgregarModalOpen(true)}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nueva Cancha
          </Button>
        </div>

        {/* Estados de carga / error */}
        {loading && <div>Cargando canchas...</div>}
        {!loading && error && <div className="text-red-600">{error}</div>}

        {/* Grid de canchas */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canchas.map((cancha, index) => {
              const imagen = cancha.imagenUrl || 'https://via.placeholder.com/400x250?text=Sin+imagen';
              return (
                <CanchaCard
                  key={cancha.id ?? index}
                  nombre={cancha.nombre}
                  ubicacion={cancha.ubicacion}
                  precio={cancha.precio}
                  imagen={imagen}
                  isAdminMode={true}
                  onEdit={() => handleEditClick(cancha)}
                  onDelete={() => handleDelete(cancha.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      <AgregarEditarCanchaModal
        open={isAgregarModalOpen}
        onOpenChange={setIsAgregarModalOpen}
        onGuardar={async (formData) => {
          // Map modal formData to backend DTO and POST
          const parsePrice = (p) => {
            if (typeof p === 'number') return p;
            if (!p) return null;
            const cleaned = String(p).replace(/[^0-9.,-]/g, '').replace(',', '.');
            const n = parseFloat(cleaned);
            return Number.isFinite(n) ? n : null;
          };

          const body = {
            nombre: formData.nombre,
            ubicacion: formData.ubicacion,
            precio: parsePrice(formData.precio),
            imagenUrl: formData.imagen || null,
          };

          if (body.precio === null) {
            setError('Precio inválido');
            return;
          }

          try {
            setIsSubmitting(true);
            setError(null);
            const res = await fetch('/api/canchas/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            if (!res.ok) {
              const txt = await res.text();
              throw new Error(`HTTP ${res.status} ${txt}`);
            }
            const created = await res.json();
            setCanchas((prev) => [created, ...prev]);
            setIsAgregarModalOpen(false);
          } catch (e) {
            console.error(e);
            setError('No se pudo crear la cancha.');
          } finally {
            setIsSubmitting(false);
          }
        }}
        canchaData={null}
      />

      {isEditOpen && (
        <EditCanchaModal
          open={isEditOpen}
          cancha={selectedCancha}
          onClose={() => { 
            setIsEditOpen(false); 
            setSelectedCancha(null); 
          }}
          onUpdateSuccess={(updated) => {
            // 1. Actualiza la lista visualmente
            setCanchas((prev) => prev.map(c => c.id === updated.id ? updated : c));
            
            // 2. ¡Cierra el modal y limpia el estado! ✅
            setIsEditOpen(false);
            setSelectedCancha(null);
          }}
        />
)}

    </AdminLayout>
  );
}
