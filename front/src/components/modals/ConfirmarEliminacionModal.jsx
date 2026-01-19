import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

export function ConfirmarEliminacionModal({ 
  open, 
  onOpenChange, 
  nombreElemento,
  tipoElemento = 'elemento',
  onConfirmar 
}) {
  const handleConfirmar = () => {
    onConfirmar?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#111827]">¿Estás seguro?</DialogTitle>
          <DialogDescription className="text-[#6b7280] pt-2">
            Esta acción es permanente y no se puede deshacer. ¿Confirmas que quieres eliminar a <span className="text-[#111827] font-medium">{nombreElemento}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#d1d5db] text-[#111827] w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
