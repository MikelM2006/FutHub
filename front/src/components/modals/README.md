# Modales de Futhub

Este directorio contiene los 4 componentes modales de la aplicación Futhub, diseñados siguiendo estrictamente el sistema de diseño de la aplicación.

## Componentes

### 1. CrearEquipoModal
Modal para crear un nuevo equipo.

**Props:**
- `open: boolean` - Estado de apertura del modal
- `onOpenChange: (open: boolean) => void` - Callback para cambiar el estado
- `onCrearEquipo?: (nombre: string) => void` - Callback al crear equipo

**Ejemplo de uso:**
```tsx
import { CrearEquipoModal } from '../components/modals';

const [isOpen, setIsOpen] = useState(false);

<CrearEquipoModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onCrearEquipo={(nombre) => console.log('Equipo creado:', nombre)}
/>
```

### 2. VerMiembrosModal
Modal que muestra la lista de miembros de un equipo.

**Props:**
- `open: boolean` - Estado de apertura del modal
- `onOpenChange: (open: boolean) => void` - Callback para cambiar el estado
- `nombreEquipo: string` - Nombre del equipo a mostrar
- `miembros: Array<{ nombre: string; posicion: string }>` - Lista de miembros

**Ejemplo de uso:**
```tsx
import { VerMiembrosModal } from '../components/modals';

const miembros = [
  { nombre: 'Carlos Rodríguez', posicion: 'Delantero Centro' },
  { nombre: 'María González', posicion: 'Portero' },
];

<VerMiembrosModal
  open={isOpen}
  onOpenChange={setIsOpen}
  nombreEquipo="Los Tigres"
  miembros={miembros}
/>
```

### 3. MiPerfilModal
Modal con pestañas para ver y editar el perfil del usuario.

**Props:**
- `open: boolean` - Estado de apertura del modal
- `onOpenChange: (open: boolean) => void` - Callback para cambiar el estado
- `profile: UserProfile` - Objeto con los datos del perfil
- `onGuardarCambios?: (profile: Partial<UserProfile>) => void` - Callback al guardar

**Tipo UserProfile:**
```typescript
interface UserProfile {
  nombreCompleto: string;
  correo: string;
  cedula: string;
  posicion: string;
  autoclasificacion: number; // 1-5
}
```

**Ejemplo de uso:**
```tsx
import { MiPerfilModal } from '../components/modals';

const profile = {
  nombreCompleto: 'Carlos Rodríguez',
  correo: 'carlos@email.com',
  cedula: 'V-12345678',
  posicion: 'Mediocampista Central',
  autoclasificacion: 4,
};

<MiPerfilModal
  open={isOpen}
  onOpenChange={setIsOpen}
  profile={profile}
  onGuardarCambios={(updated) => console.log('Perfil actualizado:', updated)}
/>
```

### 4. ConfirmarUnirseModal
Modal de confirmación antes de unirse a un equipo.

**Props:**
- `open: boolean` - Estado de apertura del modal
- `onOpenChange: (open: boolean) => void` - Callback para cambiar el estado
- `nombreEquipo: string` - Nombre del equipo al que se va a unir
- `onConfirmar?: () => void` - Callback al confirmar la acción

**Ejemplo de uso:**
```tsx
import { ConfirmarUnirseModal } from '../components/modals';

<ConfirmarUnirseModal
  open={isOpen}
  onOpenChange={setIsOpen}
  nombreEquipo="Real Madrid Venezuela"
  onConfirmar={() => console.log('Usuario se unió al equipo')}
/>
```

## Importación

Puedes importar todos los modales desde el archivo índice:

```tsx
import { 
  CrearEquipoModal, 
  VerMiembrosModal, 
  MiPerfilModal, 
  ConfirmarUnirseModal 
} from '../components/modals';
```

O importar individualmente:

```tsx
import { CrearEquipoModal } from '../components/modals/CrearEquipoModal';
```

## Sistema de Diseño

Todos los modales siguen el sistema de diseño de Futhub:

- **Color primario:** Verde césped `#16a34a`
- **Color hover:** Verde oscuro `#15803d`
- **Fondo:** Blanco `#ffffff`
- **Texto principal:** Gris oscuro `#111827`
- **Texto secundario:** Gris medio `#6b7280`
- **Bordes:** Gris claro `#d1d5db`
- **Tipografía:** Inter/Roboto (definida en globals.css)

## Componentes Utilizados

Los modales utilizan los siguientes componentes de ShadCN UI:

- Dialog (DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter)
- Button
- Input
- Label
- Tabs (TabsList, TabsTrigger, TabsContent)
- Select
- ScrollArea

Y componentes personalizados:

- StarRating (para el sistema de autoclasificación)

## Páginas que los Utilizan

- **CrearEquipoModal:** Página de Equipos (pestaña "Mis Equipos")
- **VerMiembrosModal:** Página de Home y Equipos (al hacer clic en una tarjeta de equipo)
- **MiPerfilModal:** DashboardLayout (botón "Mi Perfil" en la sidebar)
- **ConfirmarUnirseModal:** Página de Equipos (pestaña "Buscar Equipos")
