import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

export function ConfirmarUnirseModal({
        open,
        onOpenChange,
        nombreEquipo,
        onConfirmar
    }) {
    const [isJoining, setIsJoining] = useState(false);

    const handleConfirmar = async () => {
        setIsJoining(true);
        try {
            await onConfirmar?.();
            onOpenChange(false);
        } catch (error) {
            console.error("Fallo al unirse (manejado por el modal)", error);
        } finally {
            setIsJoining(false);
        }
    };

    const handleCancel = () => {
        if (isJoining) return; // No cerrar si está cargando
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-[#111827]">¿Confirmar acción?</DialogTitle>
                    <DialogDescription className="text-[#6b7280] pt-2">
                        ¿Estás seguro de que quieres unirte a <span className="text-[#16a34a]">{nombreEquipo}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isJoining}
                        className="border-[#d1d5db] text-[#111827]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmar}
                        disabled={isJoining}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white"
                    >
                        {isJoining ? 'Uniéndose...' : 'Sí, unirme'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}