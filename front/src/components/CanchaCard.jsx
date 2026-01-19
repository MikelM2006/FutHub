import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

// interface CanchaCardProps se elimina

export function CanchaCard({ nombre, ubicacion, precio, imagen, onSelect, isSelected, isAdminMode, onEdit, onDelete }) {
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-lg relative ${
        isSelected ? 'ring-2 ring-[#16a34a]' : ''
      } ${!isAdminMode ? 'cursor-pointer' : ''}`}
      onClick={!isAdminMode ? onSelect : undefined}
    >
      {/* Botones de Admin */}
      {isAdminMode && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="bg-white hover:bg-gray-100 text-[#16a34a] border border-[#16a34a] w-8 h-8"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="bg-white hover:bg-red-50 text-red-600 border border-red-600 w-8 h-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2">{nombre}</h3>
        <div className="flex items-center gap-1 text-[#6b7280] mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{ubicacion}</span>
        </div>
        <Badge variant="secondary" className="bg-[#16a34a] text-white hover:bg-[#15803d]">
          {precio}
        </Badge>
      </div>
    </Card>
  );
}