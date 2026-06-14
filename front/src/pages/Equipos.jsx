import { Plus, Search, Shield, Users, Check, X, Bell } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { VerMiembrosModal } from "../components/modals/VerMiembrosModal";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/v1";

// --- HANDLE RESPONSE ACTUALIZADO ---
// Ahora confiamos en que el backend (gracias al GlobalExceptionHandler)
// siempre nos mandará un JSON con { message: "..." } si hay error.
async function handleResponse(response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Si data.message existe, lo usamos. Si no, un mensaje genérico.
    const errorMessage =
      data.message || "Ocurrió un error inesperado en el servidor";
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}

function EquipoCard({ nombre, miembros, isOwner, onJoin, onClick }) {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  const colorIndex = nombre.length % colors.length;

  return (
    <Card
      className={`p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#16a34a] bg-white ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="truncate font-semibold text-[#111827]">
                {nombre}
              </h3>
              {isOwner && (
                <Badge
                  variant="secondary"
                  className="bg-[#16a34a]/10 text-[#16a34a] text-xs"
                >
                  Capitán
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#6b7280]">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {miembros} {miembros === 1 ? "miembro" : "miembros"}
              </span>
            </div>
          </div>
        </div>
        {onJoin && (
          <Button
            variant="outline"
            className="border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a] hover:text-white flex-shrink-0 font-medium"
            onClick={(e) => {
              e.stopPropagation();
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

function InvitacionCard({ invitacion, onAceptar, onRechazar }) {
  const nombre = invitacion.equipoNombre || "Equipo";
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  const colorIndex = nombre.length % colors.length;

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 bg-white">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="truncate font-semibold text-[#111827]">
                {nombre}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[#6b7280]">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Te han invitado a unirte</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => onRechazar(invitacion.id)}
          >
            <X className="w-4 h-4 mr-1" /> Rechazar
          </Button>
          <Button
            className="bg-[#16a34a] hover:bg-[#15803d] text-white"
            onClick={() => onAceptar(invitacion.id)}
          >
            <Check className="w-4 h-4 mr-1" /> Aceptar
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CrearEquipoModal({ open, onOpenChange, onCrearEquipo }) {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCrear = async () => {
    if (!nombreEquipo.trim()) return;
    setIsCreating(true);
    try {
      await onCrearEquipo?.(nombreEquipo);
      setNombreEquipo("");
      onOpenChange(false);
    } catch (error) {
      console.error("Fallo al crear", error);
      alert("Error al crear el equipo: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre-equipo">Nombre del Equipo</Label>
            <Input
              id="nombre-equipo"
              value={nombreEquipo}
              onChange={(e) => setNombreEquipo(e.target.value)}
              placeholder="Ej: Los Tigres"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCrear}
            disabled={!nombreEquipo.trim() || isCreating}
            className="bg-[#16a34a] hover:bg-[#15803d]"
          >
            {isCreating ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmarUnirseModal({
  open,
  onOpenChange,
  nombreEquipo,
  onConfirmar,
}) {
  const [isJoining, setIsJoining] = useState(false);

  const handleConfirmar = async () => {
    setIsJoining(true);
    try {
      await onConfirmar?.();
      onOpenChange(false);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>¿Confirmar acción?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres unirte a{" "}
            <span className="text-[#16a34a] font-bold">{nombreEquipo}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={isJoining}
            className="bg-[#16a34a] hover:bg-[#15803d]"
          >
            {isJoining ? "Uniéndose..." : "Sí, unirme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Equipos({ userName = "Usuario", user, onNavigate, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);
  const [isMiembrosModalOpen, setIsMiembrosModalOpen] = useState(false);

  const [selectedEquipo, setSelectedEquipo] = useState({
    id: null,
    nombre: "",
    miembros: [],
    isOwner: false,
  });

  const [misEquipos, setMisEquipos] = useState([]);
  const [todosLosEquipos, setTodosLosEquipos] = useState([]);
  const [invitaciones, setInvitaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = () => user?.id || localStorage.getItem("userId") || "";

  const getHeaders = (isJson = true) => {
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    const uid = getUserId();
    if (uid) headers["X-USER-ID"] = uid;
    return headers;
  };

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [resMisEquipos, resTodosEquipos, resInvitaciones] =
        await Promise.all([
          fetch(`${BASE_URL}/equipos/mis-equipos`, {
            headers: getHeaders(false),
          }).then(handleResponse),
          fetch(`${BASE_URL}/equipos/buscar`, {
            headers: getHeaders(false),
          }).then(handleResponse),
          fetch(`${BASE_URL}/equipos/invitaciones`, {
            headers: getHeaders(false),
          }).then(handleResponse),
        ]);
      setMisEquipos(resMisEquipos || []);
      setTodosLosEquipos(resTodosEquipos || []);
      setInvitaciones(resInvitaciones || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearEquipo = async (nombre) => {
    await fetch(`${BASE_URL}/equipos`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ nombre }),
    }).then(handleResponse);
    await cargarDatos();
  };

  const handleJoinTeam = (equipo) => {
    setSelectedEquipo({ ...equipo, miembros: [] });
    setIsConfirmarModalOpen(true);
  };

  const handleConfirmarUnirse = async () => {
    if (!selectedEquipo.id) return;
    await fetch(`${BASE_URL}/equipos/${selectedEquipo.id}/unirse`, {
      method: "POST",
      headers: getHeaders(false),
    }).then(handleResponse);
    await cargarDatos();
    alert(`Te has unido a ${selectedEquipo.nombre} exitosamente.`);
  };

  const handleVerMiembros = (equipo) => {
    setSelectedEquipo({
      id: equipo.id,
      nombre: equipo.nombre,
      miembros: equipo.miembros || [],
      isOwner: equipo.isOwner,
    });
    setIsMiembrosModalOpen(true);
  };

  const handleVerMiembrosBuscar = async (equipo) => {
    try {
      const detalle = await fetch(`${BASE_URL}/equipos/${equipo.id}`, {
        headers: getHeaders(false),
      }).then(handleResponse);
      setSelectedEquipo({
        id: detalle.id,
        nombre: detalle.nombre,
        miembros: detalle.miembros || [],
        isOwner: false,
      });
      setIsMiembrosModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponderInvitacion = async (invitacionId, aceptar) => {
    try {
      await fetch(
        `${BASE_URL}/equipos/invitaciones/${invitacionId}/responder`,
        {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify({ aceptar }),
        },
      ).then(handleResponse);

      await cargarDatos();
      if (aceptar) {
        alert("Has aceptado la invitación. ¡Ahora eres parte del equipo!");
      }
    } catch (err) {
      console.error("Error respondiendo invitación:", err);
      alert("Hubo un error al responder la invitación: " + err.message);
    }
  };

  // --- LOGICA DE INVITAR CON TUS 4 CASOS ---
  const handleInviteMember = async (email) => {
    if (!selectedEquipo?.id) return;

    // CASO 1: Validación Front (Correo mal escrito)
    // Verificamos si tiene @ y al menos un punto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert(
        "El formato del correo es inválido. Verifica que tenga '@' y un dominio.",
      );
      return;
    }

    try {
      // Intentamos llamar a la API
      await fetch(`${BASE_URL}/equipos/${selectedEquipo.id}/invitar`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ email }),
      }).then(handleResponse);

      // ÉXITO (Si no saltó al catch, es que todo fue bien)
      alert(`¡Invitación enviada exitosamente a ${email}!`);

      // Recargar datos
      const detalle = await fetch(`${BASE_URL}/equipos/${selectedEquipo.id}`, {
        headers: getHeaders(false),
      }).then(handleResponse);
      setSelectedEquipo((prev) => ({
        ...prev,
        miembros: detalle.miembros || [],
      }));
      await cargarDatos();
    } catch (err) {
      console.error("Error invitando:", err);

      // Ahora err.message SÍ tiene el texto que envió el GlobalExceptionHandler
      const errorMsg = (err.message || "").toLowerCase();

      // CASO 2: Usuario no encontrado
      if (errorMsg.includes("usuario no encontrado")) {
        alert(" El usuario indicado no existe en nuestra base de datos.");

        // CASO 3: Ya es miembro
      } else if (errorMsg.includes("ya es miembro")) {
        alert(" Este jugador ya forma parte del equipo.");

        // CASO 4: Ya tiene invitación pendiente
      } else if (
        errorMsg.includes("invitación pendiente") ||
        errorMsg.includes("invitacion pendiente")
      ) {
        alert(
          " Ya le has enviado una invitación a este usuario anteriormente.",
        );
      } else {
        // FALLBACK
        alert("Error: " + err.message);
      }
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedEquipo?.id) return;
    if (!window.confirm("¿Eliminar este equipo permanentemente?")) return;

    try {
      await fetch(`${BASE_URL}/equipos/${selectedEquipo.id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      }).then(handleResponse);

      setIsMiembrosModalOpen(false);
      await cargarDatos();
      alert("El equipo ha sido eliminado.");
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("Error: " + err.message);
    }
  };

  const handleLeaveTeam = async () => {
    if (!selectedEquipo?.id) return;
    if (
      !window.confirm(
        `¿Seguro que quieres salir de "${selectedEquipo.nombre}"?`,
      )
    )
      return;

    try {
      await fetch(`${BASE_URL}/equipos/${selectedEquipo.id}/salir`, {
        method: "POST",
        headers: getHeaders(false),
      }).then(handleResponse);

      setIsMiembrosModalOpen(false);
      await cargarDatos();
      alert("Has salido del equipo exitosamente.");
    } catch (err) {
      console.error("Error saliendo:", err);
      alert("Error: " + err.message);
    }
  };

  const equiposFiltrados = todosLosEquipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout
      userName={userName}
      user={user}
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentPage="equipos"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#111827]">Equipos</h1>
        </div>

        <Tabs defaultValue="mis-equipos" className="w-full">
          <TabsList className="bg-[#f3f4f6] p-1 rounded-lg inline-flex mb-6">
            <TabsTrigger
              value="mis-equipos"
              className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white text-[#6b7280]"
            >
              Mis Equipos
            </TabsTrigger>
            <TabsTrigger
              value="buscar-equipos"
              className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white text-[#6b7280]"
            >
              Buscar Equipos
            </TabsTrigger>
            <TabsTrigger
              value="invitaciones"
              className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white text-[#6b7280] flex items-center gap-2"
            >
              Invitaciones
              {invitaciones.length > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full text-[10px]"
                >
                  {invitaciones.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mis-equipos" className="space-y-6">
            <Button
              className="bg-[#16a34a] hover:bg-[#15803d] text-white"
              onClick={() => setIsCrearModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" /> Crear Equipo
            </Button>
            <div className="space-y-4">
              {misEquipos.length === 0 ? (
                <p className="text-gray-500 italic">No tienes equipos.</p>
              ) : (
                misEquipos.map((equipo) => (
                  <EquipoCard
                    key={equipo.id}
                    nombre={equipo.nombre}
                    miembros={equipo.miembros?.length || 0}
                    isOwner={equipo.isOwner}
                    onClick={() => handleVerMiembros(equipo)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="buscar-equipos" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-4">
              {equiposFiltrados.map((equipo) => (
                <EquipoCard
                  key={equipo.id}
                  nombre={equipo.nombre}
                  miembros={equipo.miembros}
                  isOwner={equipo.isOwner}
                  onJoin={() => handleJoinTeam(equipo)}
                  onClick={() => handleVerMiembrosBuscar(equipo)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invitaciones" className="space-y-6">
            <div className="space-y-4">
              {invitaciones.length === 0 ? (
                <p className="text-center py-10 text-gray-500 italic">
                  No tienes invitaciones.
                </p>
              ) : (
                invitaciones.map((invitacion) => (
                  <InvitacionCard
                    key={invitacion.id}
                    invitacion={invitacion}
                    onAceptar={(id) => handleResponderInvitacion(id, true)}
                    onRechazar={(id) => handleResponderInvitacion(id, false)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CrearEquipoModal
        open={isCrearModalOpen}
        onOpenChange={setIsCrearModalOpen}
        onCrearEquipo={handleCrearEquipo}
      />
      <ConfirmarUnirseModal
        open={isConfirmarModalOpen}
        onOpenChange={setIsConfirmarModalOpen}
        nombreEquipo={selectedEquipo.nombre}
        onConfirmar={handleConfirmarUnirse}
      />
      <VerMiembrosModal
        open={isMiembrosModalOpen}
        onOpenChange={setIsMiembrosModalOpen}
        nombreEquipo={selectedEquipo.nombre}
        miembros={selectedEquipo.miembros}
        isOwner={selectedEquipo.isOwner}
        onInvite={handleInviteMember}
        onDelete={handleDeleteTeam}
        onLeave={handleLeaveTeam}
      />
    </DashboardLayout>
  );
}
