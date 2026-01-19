import { useState, useEffect } from 'react';
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

export function AgregarEditarCanchaModal({ open, onOpenChange, onGuardar, canchaData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    precio: '',
    imagen: '',
  });

  // Si hay canchaData, estamos editando; si no, estamos agregando
  const isEditing = !!canchaData;

  useEffect(() => {
    if (canchaData) {
      setFormData({
        nombre: canchaData.nombre || '',
        ubicacion: canchaData.ubicacion || '',
        precio: canchaData.precio || '',
        imagen: canchaData.imagen || '',
      });
    } else {
      setFormData({
        nombre: '',
        ubicacion: '',
        precio: '',
        imagen: '',
      });
    }
  }, [canchaData, open]);

  const handleGuardar = () => {
    if (formData.nombre.trim() && formData.ubicacion.trim() && formData.precio.trim()) {
      onGuardar?.(formData);
      setFormData({
        nombre: '',
        ubicacion: '',
        precio: '',
        imagen: '',
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      ubicacion: '',
      precio: '',
      imagen: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-[#111827]">
            {isEditing ? 'Editar Cancha' : 'Agregar Nueva Cancha'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre-cancha" className="text-[#111827]">
              Nombre de la Cancha
            </Label>
            <Input
              id="nombre-cancha"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Cancha La Carlota"
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion-cancha" className="text-[#111827]">
              Ubicación (Sede)
            </Label>
            <Input
              id="ubicacion-cancha"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              placeholder="Ej: Caracas, Miranda"
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio-cancha" className="text-[#111827]">
              Precio por Hora
            </Label>
            <Input
              id="precio-cancha"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              placeholder="Ej: Bs. 500"
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagen-cancha" className="text-[#111827]">
              URL de la Imagen
            </Label>
            <Input
              id="imagen-cancha"
              value={formData.imagen}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="border-[#d1d5db] focus:border-[#16a34a]"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-[#d1d5db] text-[#111827]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGuardar}
            disabled={!formData.nombre.trim() || !formData.ubicacion.trim() || !formData.precio.trim()}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white"
          >
            Guardar Cancha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
