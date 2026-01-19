import { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  CrearEquipoModal, 
  VerMiembrosModal, 
  MiPerfilModal, 
  ConfirmarUnirseModal 
} from '../components/modals';
import { Card } from '../components/ui/card';

export function DemoModales() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isMiembrosModalOpen, setIsMiembrosModalOpen] = useState(false);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);

  const mockMiembros = [
    { nombre: 'Carlos Rodríguez', posicion: 'Delantero Centro' },
    { nombre: 'María González', posicion: 'Mediocampista Central' },
    { nombre: 'Juan Pérez', posicion: 'Defensa Central' },
    { nombre: 'Ana Martínez', posicion: 'Portero' },
    { nombre: 'Luis Fernández', posicion: 'Lateral Derecho' },
  ];

  const mockProfile = {
    id: 'demo-user-1', // id añadido para que el botón de eliminar funcione en la demo
    nombreCompleto: 'Carlos Rodríguez',
    correo: 'carlos@email.com',
    cedula: 'V-12345678',
    posicion: 'Mediocampista Central',
    autoclasificacion: 4,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-[#111827] mb-4">Página de Demostración de Modales</h1>
          <p className="text-[#6b7280] mb-6">
            Presiona los botones a continuación para probar los diferentes modales que se usarán en la aplicación Futhub.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsCrearModalOpen(true)} className="bg-[#16a34a] hover:bg-[#15803d] text-white">
              Abrir Modal "Crear Equipo"
            </Button>
            <Button onClick={() => setIsMiembrosModalOpen(true)} variant="outline">
              Abrir Modal "Ver Miembros"
            </Button>
            <Button onClick={() => setIsPerfilModalOpen(true)} variant="outline">
              Abrir Modal "Mi Perfil"
            </Button>
            <Button onClick={() => setIsConfirmarModalOpen(true)} variant="destructive">
              Abrir Modal "Confirmar Unirse"
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-[#111827] mb-4">Funcionalidades Implementadas</h2>
          <ul className="space-y-3 text-[#111827]">
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>4 componentes modales distintos y reutilizables.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>Uso de Radix UI (Dialog) para accesibilidad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>Manejo de estado de apertura/cierre con `useState`.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>Pase de props para callbacks (ej. `onCrearEquipo`, `onConfirmar`).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>Sistema de pestañas para navegación en el perfil</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-1">✓</span>
              <span>Componente de rating con estrellas (StarRating)</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Modales */}
      <CrearEquipoModal
        open={isCrearModalOpen}
        onOpenChange={setIsCrearModalOpen}
        onCrearEquipo={(nombre) => {
          console.log('Equipo creado:', nombre);
          alert(`Equipo "${nombre}" creado exitosamente!`);
        }}
      />

      <VerMiembrosModal
        open={isMiembrosModalOpen}
        onOpenChange={setIsMiembrosModalOpen}
        nombreEquipo="Los Tigres FC"
        miembros={mockMiembros}
      />

      <MiPerfilModal
        open={isPerfilModalOpen}
        onOpenChange={setIsPerfilModalOpen}
        profile={mockProfile}
        onGuardarCambios={(updatedProfile) => {
          console.log('Perfil actualizado:', updatedProfile);
          alert('Perfil actualizado exitosamente!');
        }}
      />

      <ConfirmarUnirseModal
        open={isConfirmarModalOpen}
        onOpenChange={setIsConfirmarModalOpen}
        nombreEquipo="Real Madrid Venezuela"
        onConfirmar={() => {
          console.log('Usuario se unió al equipo');
          alert('¡Te has unido al equipo exitosamente!');
        }}
      />
    </div>
  );
}