import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Reducir las posiciones a las que el backend entiende (enum)
const POSICIONES = [
  { label: 'Portero', value: 'PORTERO' },
  { label: 'Defensa', value: 'DEFENSA' },
  { label: 'Medio', value: 'MEDIO' },
  { label: 'Delantero', value: 'DELANTERO' },
];

function titleCase(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .split(/\s+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

// Convierte valores tipo 'PORTERO' o 'DELANTERO' a 'Portero', 'Delantero'
function humanizePosition(pos) {
  if (!pos) return '';
  // si ya contiene espacios o minusculas, aplicar titleCase directamente
  if (/[a-z]/.test(pos)) return titleCase(pos);
  return titleCase(pos.replace(/_/g, ' '));
}

export function MiPerfilModal({ open, onOpenChange, profile, onGuardarCambios }) {
  // Sincronizar estado local con `profile` cuando cambia o cuando se abre
  const [editedProfile, setEditedProfile] = useState({
    nombreCompleto: '',
    posicion: '',
    autoclasificacion: 0,
    correo: '',
    cedula: '',
  });

  // Nueva clave (campo en el formulario de edición)
  const [nuevaClave, setNuevaClave] = useState('');

  // Estado para controlar la pestaña activa (Información / Editar)
  const [activeTab, setActiveTab] = useState('informacion');

  // Estado para la acción de eliminar
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Inicializar solo cuando cambie el id del profile (evita sobrescrituras por referencia)
    if (profile && profile.id) {
      // Normalizar posicion: preferir enum (PORTERO/DEFENSA/MEDIO/DELANTERO)
      let initialPos = '';
      const rawPos = profile.posicion;
      if (rawPos) {
        // Si ya es uno de los enum values
        const matchEnum = POSICIONES.find(p => p.value === String(rawPos));
        if (matchEnum) {
          initialPos = matchEnum.value;
        } else {
          // Intentar mapear desde etiqueta humana (p. ej. 'Defensa')
          const matchLabel = POSICIONES.find(p => p.label.toLowerCase() === String(rawPos).toLowerCase());
          if (matchLabel) initialPos = matchLabel.value;
        }
      }

      setEditedProfile({
        nombreCompleto: profile.nombreCompleto || '',
        posicion: initialPos,
        autoclasificacion: profile.autoclasificacion || 0,
        correo: profile.correo || profile.email || '',
        cedula: profile.cedula || profile.id_cedula || '',
      });
    }
  }, [profile?.id]);

  // Cuando se abre el modal, asegurarnos de que la pestaña activa sea 'informacion'
  useEffect(() => {
    if (open) {
      setActiveTab('informacion');
      setNuevaClave('');
    }
  }, [open]);

  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:8080';

  // Mapear enum (ej. 'DEFENSA') a label para mostrar en UI
  const mapEnumToLabel = (enumValue) => {
    if (!enumValue) return '';
    const found = POSICIONES.find(p => p.value === enumValue);
    return found ? found.label : humanizePosition(enumValue);
  };

  const handleGuardar = async () => {
    // Actualizamos localStorage para mantener sesión consistente y actualizar la UI
    const updated = { ...profile, ...editedProfile };

    // Si el usuario tiene id y hay cambios en contraseña o posicion, llamar al backend
    const id = profile?.id;
    const toUpdate = {};
    if (nuevaClave && nuevaClave.trim() !== '') {
      toUpdate.clave = nuevaClave.trim();
    }

    // Aqui `editedProfile.posicion` almacena directamente el enum (ej. 'DEFENSA')
    const selectedEnum = editedProfile.posicion || null;
    const currentEnum = profile?.posicion || null;
    if (selectedEnum && selectedEnum !== currentEnum) {
      toUpdate.posicion = selectedEnum;
      // También actualizar en el objeto local para reflejar el cambio
      updated.posicion = selectedEnum;
    }

    try {
      if (Object.keys(toUpdate).length > 0 && id) {
        const url = `${apiBase.replace(/\/$/, '')}/api/usuarios/${id}/perfil`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toUpdate),
        });

        if (!res.ok) {
          const text = await res.text();
          alert(`Error actualizando perfil (${res.status}): ${text}`);
          return;
        }

        // Si todo ok, podemos leer la respuesta (UsuarioDTO) y actualizar estado local
        const respJson = await res.json();
        // respJson.posicion viene como enum (ej. 'DEFENSA')
        updated.posicion = respJson.posicion || updated.posicion;
        // Actualizar estado local con el enum para mantener consistencia
        setEditedProfile(prev => ({ ...prev, posicion: respJson.posicion || updated.posicion }));
      }

      // Actualizar otras propiedades locales como nombre, autoclasificacion, correo, cedula
      // (esto sigue la lógica previa: el modal permitía editar nombre y rating)
      try { localStorage.setItem('user', JSON.stringify(updated)); } catch (e) { /* ignore */ }
      onGuardarCambios?.(updated);
      onOpenChange(false);
    } catch (e) {
      alert('Error guardando cambios: ' + (e.message || e));
    }
  };

  // Función para eliminar el usuario conectado (sin cambios)
  const handleEliminar = async () => {
    if (!profile || !profile.id) {
      alert('No se pudo determinar el id del usuario.');
      return;
    }

    const confirmed = window.confirm('¿Estás seguro que quieres eliminar tu usuario? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const url = profile?.id ? `${apiBase.replace(/\/$/, '')}/api/usuarios/${profile.id}` : `${apiBase.replace(/\/$/, '')}/api/usuarios/`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 204) {
        try { localStorage.removeItem('user'); } catch (e) { /* ignore */ }
        alert('Usuario eliminado correctamente. Se cerrará la sesión.');
        onOpenChange(false);
        window.location.href = '/';
      } else {
        const text = await res.text();
        alert(`Error eliminando usuario (${res.status}): ${text}`);
      }
    } catch (e) {
      alert('Error de red eliminando usuario: ' + (e.message || e));
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStaticStars = (rating) => {
    const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < r
                ? 'fill-[#16a34a] text-[#16a34a]'
                : 'fill-none text-[#d1d5db]'
            }`}
          />
        ))}
      </div>
    );
  };

  // Mostrar la posición con Title Case (primera mayúscula, resto minúsculas por palabra)
  const displayPosition = (pos) => {
    if (!pos) return '';
    // Si es un enum conocido, mapear a label humana
    const asLabel = mapEnumToLabel(pos);
    if (asLabel) return asLabel;
    return titleCase(String(pos));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:w-[94vw] md:w-[92vw] lg:w-[88vw] xl:w-[82vw] max-w-[1600px] bg-white max-h-[90vh] overflow-y-auto px-12 py-8" aria-describedby={undefined}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[#111827]">Mi Perfil</DialogTitle>
        </DialogHeader>

        <div className="w-full flex-1 overflow-y-auto pb-4">
          <Tabs value={activeTab || 'informacion'} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-4 bg-gray-100 p-2 rounded-md">
              <TabsTrigger value="informacion" className="data-[state=active]:bg-white data-[state=active]:text-[#16a34a] py-3">Información</TabsTrigger>
              <TabsTrigger value="editar" className="data-[state=active]:bg-white data-[state=active]:text-[#16a34a] py-3">Editar Perfil</TabsTrigger>
            </TabsList>

          <TabsContent value="informacion" className="space-y-6 mt-6 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[#111827]">Nombre Completo</Label>
                  <p className="text-[#111827] text-lg w-full">{profile?.nombreCompleto || editedProfile.nombreCompleto}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-[#111827]">Correo</Label>
                  <p className="text-[#111827] text-lg w-full">{profile?.email || profile?.correo || editedProfile.correo}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-[#111827]">ID (Cédula)</Label>
                  <p className="text-[#111827] text-lg w-full">{profile?.id_cedula || profile?.cedula || editedProfile.cedula}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-[#111827]">Posición</Label>
                  {/* Preferir el estado local editado para que la selección se refleje inmediatamente */}
                  <p className="text-[#111827] text-lg w-full">{displayPosition(editedProfile.posicion || profile?.posicion)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#111827]">Autoclasificación</Label>
                <div className="mt-2">{renderStaticStars(profile?.autoclasificacion ?? editedProfile.autoclasificacion)}</div>
              </div>

              <div className="h-6" />

            </div>
          </TabsContent>

          <TabsContent value="editar" className="space-y-6 mt-6 p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-posicion" className="text-[#111827]">Posición</Label>
                  <select
                    id="edit-posicion"
                    className="w-full border-[#d1d5db] rounded-md focus:border-[#16a34a] focus:ring-[#16a34a] p-2"
                    value={editedProfile.posicion || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // value is the enum (pos.value)
                      setEditedProfile(prev => ({ ...prev, posicion: value }));
                    }}
                  >
                    <option value="">-- Selecciona una posición --</option>
                    {POSICIONES.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-clave" className="text-[#111827]">Nueva contraseña</Label>
                  <Input
                    id="edit-clave"
                    type="password"
                    value={nuevaClave}
                    onChange={(e) => setNuevaClave(e.target.value)}
                    placeholder="Dejar vacío para no cambiar la contraseña"
                    className="border-[#d1d5db] focus:border-[#16a34a] w-full"
                  />
                </div>

                <Button onClick={handleGuardar} className="bg-[#16a34a] hover:bg-[#15803d] text-white w-full mt-4">Guardar Cambios</Button>
              </div>
            </div>
           </TabsContent>
        </Tabs>
        </div>

        <DialogFooter className="mt-6 sticky bottom-0 bg-white z-50 border-t pt-4">
          {activeTab === 'informacion' && (
            <div className="w-full sm:w-auto flex-1">
              <button
                onClick={handleEliminar}
                disabled={isDeleting}
                data-testid="delete-user-info"
                style={{
                  position: 'fixed',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2147483647,
                  width: 'min(800px, 90vw)',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: 8,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar usuario'}
              </button>
              {!profile?.id && (
                <p className="mt-2 text-sm text-gray-500 text-center">Nota: No se detectó un id de usuario en este contexto; al eliminar no se modificará el backend.</p>
              )}
            </div>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
