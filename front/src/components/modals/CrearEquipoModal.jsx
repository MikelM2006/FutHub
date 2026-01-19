import { useState } from 'react';
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

export function CrearEquipoModal({ open, onOpenChange, onCrearEquipo }) {
    const [nombreEquipo, setNombreEquipo] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCrear = async () => {
        if (!nombreEquipo.trim()) {
            return;
        }

        setIsCreating(true);
        try {
            await onCrearEquipo?.(nombreEquipo);
            setNombreEquipo('');
            onOpenChange(false);
        } catch (error) {
            console.error("Fallo al crear (manejado por el modal)", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        if (isCreating) return; // No cerrar si está cargando
        setNombreEquipo('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-md bg-white" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="text-[#111827]">Crear Nuevo Equipo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre-equipo" className="text-[#111827]">
                            Nombre del Equipo
                        </Label>
                        <Input
                            id="nombre-equipo"
                            value={nombreEquipo}
                            onChange={(e) => setNombreEquipo(e.target.value)}
                            placeholder="Ej: Los Tigres"
                            className="border-[#d1d5db] focus:border-[#16a34a]"
                            disabled={isCreating}
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-[#d1d5db] text-[#111827]"
                        disabled={isCreating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCrear}
                        disabled={!nombreEquipo.trim() || isCreating}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white"
                    >
                        {isCreating ? 'Creando...' : 'Crear'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}