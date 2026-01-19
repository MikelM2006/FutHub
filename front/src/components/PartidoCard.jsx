import { Calendar, Users, Trash2 } from 'lucide-react';
import { Card } from './ui/card';

// Props actualizadas: se van 'ubicacion' y 'hora', entran 'equipoA' y 'equipoB'
export function PartidoCard({ cancha, fecha, equipoA, equipoB, isOwner, onCancel }) {

  if(equipoA === 'Equipo null') {
    equipoA = null;
  }
  
  if(equipoB === 'Equipo null') {
    equipoB = null;
  }

  return (
    <Card className={`p-5 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-[#16a34a]`}>
      
      {/* Nombre de la cancha */}
      <h3 className="text-xl font-bold text-[#111827] mb-3">{cancha}</h3>
      
      {/* Detalles */}
      <div className="space-y-2">
        {/* Fecha (sin hora) */}
        <div className="flex items-center gap-2 text-[#6b7280]">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{fecha}</span>
        </div>

        {/* Sección vertical para equipos */}
        <div className="flex items-start gap-2 text-[#6b7280] pt-2">
          <Users className="w-4 h-4 flex-shrink-0 mt-1" />
          <div className="text-sm">
            {/* Equipo 1 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">EQUIPO 1:</span>
              {equipoA ? (
                <span className="font-medium text-[#111827]">{equipoA}</span>
              ) : (
                <span className="text-gray-500 italic">No se ha unido nadie</span>
              )}
            </div>
            {/* Equipo 2 */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold text-gray-500">EQUIPO 2:</span>
              {equipoB ? (
                <span className="font-medium text-[#111827]">{equipoB}</span>
              ) : (
                <span className="text-gray-500 italic">No se ha unido nadie</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cancelar partido */}
      {isOwner && (
        <div className="mt-4">
          <button
            onClick={onCancel}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            <Trash2 className="w-4 h-4" />
            Cancelar Partido
          </button>
        </div>
      )}
    </Card>
  );
}