import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Trash2, LogOut, UserPlus } from 'lucide-react';

export function VerMiembrosModal({
                                     open,
                                     onOpenChange,
                                     equipo,
                                     nombreEquipo,
                                     miembros,
                                     isOwner,
                                     onInvite,
                                     onDelete,
                                     onLeave
                                 }) {
    const [inviteEmail, setInviteEmail] = useState('');

    // Protección contra undefined
    const listaMiembros = Array.isArray(miembros) ? miembros : [];
    // Prioridad de nombre: prop > objeto > fallback
    const nombreMostrado = nombreEquipo || equipo?.nombre || 'Equipo';

    const handleSendInvite = () => {
        if (inviteEmail.trim() && onInvite) {
            onInvite(inviteEmail);
            setInviteEmail('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* IMPORTANTE: Mantenemos el style inline para sobrescribir los defaults de shadcn */}
            <DialogContent
                style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    height: '80vh',
                    width: '95vw',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
                className="focus:outline-none" // Evita bordes azules extraños
            >
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-[#111827] text-2xl font-bold">
                        {nombreMostrado}
                    </DialogTitle>
                </DialogHeader>

                <div className="shrink-0 mt-2">
                    <Label className="text-[#111827] text-lg font-semibold">
                        Miembros ({listaMiembros.length})
                    </Label>
                </div>

                {/* Zona de invitación (Solo Owner) */}
                {isOwner && (
                    <div className="flex gap-2 shrink-0">
                        <Input
                            placeholder="Email del jugador a invitar..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
                            className="flex-1 bg-white border-blue-200"
                        />
                        <Button
                            onClick={handleSendInvite}
                            // Forzamos color AZUL
                            style={{ backgroundColor: '#2563eb', color: 'white' }}
                            className="hover:opacity-90"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invitar
                        </Button>
                    </div>
                )}

                {/* Lista de miembros */}
                <ScrollArea className="flex-1 min-h-0 rounded-md border border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {listaMiembros.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No hay miembros en este equipo.
                            </div>
                        ) : (
                            listaMiembros.map((miembro, index) => (
                                <div
                                    key={miembro.id || index}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                        {(miembro.nombre || miembro.email || '?').substring(0,2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-medium text-gray-900 truncate text-sm">
                                            {miembro.nombreCompleto || miembro.nombre || 'Sin nombre'}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate">
                                            {miembro.email || 'Miembro'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                {/* Footer con acciones */}
                <DialogFooter className="shrink-0 mt-4 flex justify-between sm:justify-between w-full">
                    <div className="flex gap-2">
                        {isOwner ? (
                            <Button
                                onClick={onDelete}
                                // Forzamos color ROJO para eliminar
                                style={{ backgroundColor: '#dc2626', color: 'white' }}
                                className="hover:opacity-90 border-none"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar Equipo
                            </Button>
                        ) : (
                            <Button
                                onClick={onLeave}
                                // Forzamos color ROJO para salir
                                style={{ backgroundColor: '#dc2626', color: 'white' }}
                                className="hover:opacity-90 border-none"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Salirse
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => onOpenChange(false)}
                        // Forzamos color VERDE para cerrar
                        style={{ backgroundColor: '#16a34a', color: 'white' }}
                        className="px-6 hover:opacity-90 border-none"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}