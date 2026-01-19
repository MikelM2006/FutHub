import { Users, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// interface EquipoCardProps se elimina

export function EquipoCard({ nombre, miembros, isOwner, onJoin, onClick }) {
  // Generar color único para cada equipo basado en su nombre
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'];
  const colorIndex = nombre.length % colors.length;
  
  return (
    <Card 
      className={`p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#16a34a] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar del equipo */}
          <div className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="truncate">{nombre}</h3>
              {isOwner && (
                <Badge variant="secondary" className="bg-[#16a34a]/10 text-[#16a34a] text-xs">
                  Capitán
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#6b7280]">
              <Users className="w-4 h-4" />
              <span className="text-sm">{miembros} miembros</span>
            </div>
          </div>
        </div>
        
        {!isOwner && onJoin && (
          <Button 
            variant="outline" 
            className="border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a] hover:text-white flex-shrink-0" 
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el clic active el onClick de la Card
              onJoin();
            }}
          >
            Unirme
          </Button>
        )}
      </div>
    </Card>
  );
}