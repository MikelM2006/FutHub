import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function EditCanchaModal({ open, cancha, onClose, onUpdateSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    precio: '',
    disponible: true,
    imagenUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializa el formulario con la cancha recibida
  useEffect(() => {
    if (cancha) {
      setForm({
        nombre: cancha.nombre || '',
        ubicacion: cancha.ubicacion || '',
        precio: cancha.precio ?? '',
        disponible: cancha.disponible != null ? cancha.disponible : true,
        imagenUrl: cancha.imagenUrl || '',
      });
    }
  }, [cancha, open]);

  const parsePrice = (p) => {
    if (typeof p === 'number') return p;
    const cleaned = String(p).replace(/[^0-9.,-]/g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const handleSave = async () => {
    setError(null);

    // Validaciones mínimas
    const precioParsed = parsePrice(form.precio);
    if (!form.nombre.trim() || !form.ubicacion.trim() || precioParsed == null) {
      setError('Completa nombre, ubicación y un precio válido.');
      return;
    }

    const body = {
      nombre: form.nombre.trim(),
      ubicacion: form.ubicacion.trim(),
      precio: precioParsed,
      disponible: !!form.disponible,
      imagenUrl: form.imagenUrl?.trim() || null,
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/canchas/${cancha.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      const updated = await res.json();
      onUpdateSuccess?.(updated);
      onClose?.();
    } catch (e) {
      console.error(e);
      setError('No se pudo actualizar la cancha.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent className="sm:max-w-md bg-white" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-[#111827]">Editar Cancha</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-[#111827]">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion" className="text-[#111827]">Ubicación</Label>
            <Input
              id="ubicacion"
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio" className="text-[#111827]">Precio</Label>
            <Input
              id="precio"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="disponible"
              type="checkbox"
              checked={!!form.disponible}
              onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
              className="rounded border-[#d1d5db] text-[#16a34a] focus:ring-[#16a34a]"
            />
            <Label htmlFor="disponible" className="text-[#111827]">Disponible</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagenUrl" className="text-[#111827]">URL de Imagen</Label>
            <Input
              id="imagenUrl"
              value={form.imagenUrl}
              onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#d1d5db] text-[#111827]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}