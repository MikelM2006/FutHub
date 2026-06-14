import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { PartidoCard } from "../components/PartidoCard";
import { EquipoCard } from "../components/EquipoCard";
import { VerMiembrosModal, UnirsePartidoModal } from "../components/modals"; // Importar el modal

const PARTIDOS_API_URL = import.meta.env.VITE_API_URL + "/api/partidos";
const EQUIPOS_API_URL =
  import.meta.env.VITE_API_URL + "/api/v1/equipos/mis-equipos";
const CANCHAS_API_URL =
  import.meta.env.VITE_API_URL + "/api/canchas/disponibles";
const BASE_URL = import.meta.env.VITE_API_URL + "/api/v1";

async function handleResponse(response) {
  const contentType = response.headers.get("Content-Type") || "";
  const bodyText = await response.text().catch(() => "");
  let parsedBody = bodyText;

  if (contentType.includes("application/json") && bodyText) {
    try {
      parsedBody = JSON.parse(bodyText);
    } catch (error) {
      parsedBody = bodyText;
    }
  }

  if (!response.ok) {
    const message =
      parsedBody && typeof parsedBody === "object" && parsedBody.message
        ? parsedBody.message
        : bodyText || "Error en la solicitud a la API: " + response.status;
    const error = new Error(message);
    error.status = response.status;
    error.body = parsedBody;
    throw error;
  }

  return contentType.includes("application/json")
    ? parsedBody
    : bodyText || null;
}

const getUserId = (user) => {
  if (user && user.id) return user.id;
  const stored = localStorage.getItem("userId");
  return stored || "";
};

const getHeaders = (user, isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const uid = getUserId(user);
  if (uid) headers["X-USER-ID"] = uid;
  headers["Accept"] = "application/json";
  return headers;
};

export function Home({
  userName = "Usuario",
  user,
  onNavigate,
  onLogout,
  onCreatePartido,
}) {
  // Estados para Partidos
  const [proximosPartidos, setProximosPartidos] = useState([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const [errorPartidos, setErrorPartidos] = useState(null);
  const [canchas, setCanchas] = useState([]);

  // Estados para Equipos
  const [misEquipos, setMisEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [errorEquipos, setErrorEquipos] = useState(null);
  const [todosLosEquipos, setTodosLosEquipos] = useState([]);

  // Estados para el Modal
  const [isMiembrosModalOpen, setIsMiembrosModalOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState({
    id: null,
    nombre: "",
    miembros: [],
  });

  // Estados para el modal de unirse a partidos
  const [isUnirsePartidoModalOpen, setIsUnirsePartidoModalOpen] =
    useState(false);

  // Logica para Cargar Canchas (solo para mostrarlas en las tarjetas de los partidos)
  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        const response = await fetch(CANCHAS_API_URL).then(handleResponse);
        setCanchas(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error al cargar canchas:", error);
        setCanchas([]); // En caso de error, dejar vacío
      }
    };

    cargarCanchas();
  }, [misEquipos, todosLosEquipos, canchas, loadingEquipos]);

  // Lógica para Cargar Partidos
  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        if (
          loadingEquipos ||
          misEquipos.length === 0 ||
          todosLosEquipos.length === 0
        ) {
          setProximosPartidos([]); // No procesar partidos si los equipos no están cargados
          return;
        }

        setLoadingPartidos(true);
        setErrorPartidos(null);

        const response = await fetch(PARTIDOS_API_URL).then(handleResponse);

        if (!Array.isArray(response)) {
          throw new Error("La respuesta de partidos no es un array.");
        }

        const partidosTransformados = response.map((partidoDTO) => {
          const dateObject = new Date(partidoDTO.fecha.replace("T", " "));

          const equipoAId = partidoDTO.id_equipo_1 || null;
          const equipoBId = partidoDTO.id_equipo_2 || null;

          const equipoAobj = todosLosEquipos.find((e) => e.id === equipoAId);
          const equipoBobj = todosLosEquipos.find((e) => e.id === equipoBId);

          const equipoAName = equipoAobj
            ? equipoAobj.nombre
            : `Equipo ${equipoAId}`;
          const equipoBName = equipoBobj
            ? equipoBobj.nombre
            : `Equipo ${equipoBId}`;

          return {
            id: partidoDTO.id,
            cancha: partidoDTO.id_cancha,
            fecha: dateObject.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            equipoA: equipoAName,
            equipoB: equipoBName,
            equipoAId: partidoDTO.id_equipo_1,
            equipoBId: partidoDTO.id_equipo_2,
          };
        });

        // Filtrar partidos para mostrar solo los relacionados con los equipos del usuario
        const myTeamIds = new Set(misEquipos.map((e) => e.id));
        const partidosFiltrados = partidosTransformados.filter(
          (p) =>
            (p.equipoAId && myTeamIds.has(p.equipoAId)) ||
            (p.equipoBId && myTeamIds.has(p.equipoBId)),
        );

        setProximosPartidos(partidosFiltrados);
      } catch (error) {
        setErrorPartidos(error.message || "Error al cargar partidos.");
      } finally {
        setLoadingPartidos(false);
      }
    };

    fetchPartidos();
  }, [user, misEquipos, todosLosEquipos, loadingEquipos]);

  // Logica para reemplazar ids por nombres en equipos y canchas y filtrar partidos para que sean solo los tuyos
  useEffect(() => {
    if (
      loadingEquipos ||
      misEquipos.length === 0 ||
      todosLosEquipos.length === 0 ||
      canchas.length === 0
    ) {
      setProximosPartidos([]);
      return;
    }

    const myTeamIds = new Set(misEquipos.map((e) => e.id));

    const partidosFiltrados = proximosPartidos
      .map((p) => {
        const nombreEquipo1 =
          (todosLosEquipos.find((e) => e.id === p.equipoAId) || {}).nombre ||
          `Equipo ${p.equipoAId}`;
        const nombreEquipo2 =
          (todosLosEquipos.find((e) => e.id === p.equipoBId) || {}).nombre ||
          `Equipo ${p.equipoBId}`;
        const nombreCancha =
          (canchas.find((c) => c.id === p.cancha) || {}).nombre || p.cancha;

        return {
          ...p,
          equipoA: nombreEquipo1,
          equipoB: nombreEquipo2,
          cancha: nombreCancha,
        };
      })
      .filter(
        (p) =>
          (p.equipoAId && myTeamIds.has(p.equipoAId)) ||
          (p.equipoBId && myTeamIds.has(p.equipoBId)),
      );

    setProximosPartidos(partidosFiltrados);
  }, [misEquipos, todosLosEquipos, canchas, loadingEquipos]);

  // Lógica para Cargar Equipos
  useEffect(() => {
    const cargarMisEquipos = async () => {
      if (!user) {
        // No intentar cargar si no hay usuario
        setLoadingEquipos(false);
        return;
      }

      setLoadingEquipos(true);
      setErrorEquipos(null);
      try {
        const res = await fetch(EQUIPOS_API_URL, {
          method: "GET",
          headers: getHeaders(user, false),
        }).then(handleResponse);

        setMisEquipos(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error al cargar mis equipos:", err);
        if (err && err.status === 401) {
          setErrorEquipos("No autorizado. Asegúrate de haber iniciado sesión.");
        } else {
          setErrorEquipos(err.message || "Error al cargar mis equipos.");
        }
      } finally {
        setLoadingEquipos(false);
      }
    };

    cargarMisEquipos();
  }, [user]);

  // Lógica para cargar todos los equipos
  useEffect(() => {
    const cargarTodosLosEquipos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/equipos/buscar`, {
          method: "GET",
          headers: getHeaders(user, false),
        }).then(handleResponse);

        const equiposActuales = await fetch(`${BASE_URL}/equipos/mis-equipos`, {
          method: "GET",
          headers: getHeaders(user, false),
        }).then(handleResponse);

        const equiposBackend = Array.isArray(response) ? response : [];

        const equiposCombinados = [
          ...equiposBackend,
          ...equiposActuales.filter(
            (miEquipo) =>
              !equiposBackend.some((equipo) => equipo.id === miEquipo.id),
          ),
        ];

        setTodosLosEquipos(equiposCombinados);
      } catch (error) {
        console.error("Error al cargar todos los equipos:", error);
        setTodosLosEquipos([]); // En caso de error, dejar vacío
      }
    };

    if (user) {
      cargarTodosLosEquipos();
    }
  }, [user]);

  // Handler para ver miembros
  const handleVerMiembros = (equipo) => {
    // Lógica real
    const miembrosList = Array.isArray(equipo.miembros) ? equipo.miembros : [];
    setSelectedEquipo({
      id: equipo.id,
      nombre: equipo.nombre,
      miembros: miembrosList,
    });
    setIsMiembrosModalOpen(true);
  };

  // Función para cancelar un partido
  const handleCancelarPartido = async (partidoId) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este partido?"))
      return;

    try {
      await fetch(`${PARTIDOS_API_URL}/${partidoId}`, {
        method: "DELETE",
        headers: getHeaders(user, false),
      });

      // Actualizar la lista de partidos eliminando el partido cancelado
      setProximosPartidos((prev) =>
        prev.filter((partido) => partido.id !== partidoId),
      );
      alert("El partido ha sido cancelado exitosamente.");
    } catch (error) {
      console.error("Error al cancelar el partido:", error);
      alert("No se pudo cancelar el partido. Intenta nuevamente.");
    }
  };

  // Renderizado de Partidos
  const renderPartidos = () => {
    if (loadingPartidos) {
      return <p className="text-[#6b7280]">Cargando partidos...</p>;
    }
    if (errorPartidos) {
      return (
        <p className="text-red-600">
          Error al cargar partidos: {errorPartidos}
        </p>
      );
    }
    if (proximosPartidos.length === 0) {
      return (
        <p className="text-[#6b7280]">
          No hay partidos programados. ¡Crea uno!
        </p>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proximosPartidos.map((partido) => (
          <PartidoCard
            key={partido.id}
            {...partido}
            isOwner={misEquipos.some(
              (e) => e.id === partido.equipoAId && e.isOwner,
            )} // Verificar si el usuario es el creador
            onCancel={() => handleCancelarPartido(partido.id)} // Pasar la función de cancelar
          />
        ))}
      </div>
    );
  };

  // Renderizado de Equipos
  const renderMisEquipos = () => {
    if (loadingEquipos) {
      return <div className="text-center p-6">Cargando equipos...</div>;
    }
    if (errorEquipos) {
      return <div className="text-center p-6 text-red-500">{errorEquipos}</div>;
    }
    if (misEquipos.length === 0) {
      return (
        <p className="text-gray-500">Aún no eres miembro de ningún equipo.</p>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {misEquipos.map((equipo) => (
          <EquipoCard
            key={equipo.id}
            nombre={equipo.nombre}
            miembros={
              Array.isArray(equipo.miembros) ? equipo.miembros.length : 0
            }
            isOwner={!!equipo.isOwner}
            onClick={() => handleVerMiembros(equipo)}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      userName={userName}
      user={user}
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentPage="partidos"
    >
      <div className="space-y-8">
        {/* Banner CTA */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-xl p-8 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h1 className="text-white">Organiza tu Próximo Partido</h1>
            <p className="mb-6 max-w-xl">
              Reserva tu cancha favorita y organiza el próximo partido con tu
              equipo
            </p>
            <Button
              onClick={onCreatePartido}
              className="bg-white text-[#16a34a] hover:bg-gray-100"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Partido Nuevo
            </Button>
          </div>
        </div>

        {/* Mis Próximos Partidos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#111827]">Mis Próximos Partidos</h2>
            <Button
              onClick={() => setIsUnirsePartidoModalOpen(true)} // Abrir el modal
              className="bg-[#16a34a] text-white hover:bg-[#15803d]"
            >
              Ver Partidos Disponibles
            </Button>
          </div>
          {renderPartidos()}
        </div>

        {/* Mis Equipos */}
        <div>
          <h2 className="text-[#111827] mb-4">Mis Equipos</h2>
          {renderMisEquipos()}
        </div>
      </div>

      {/* Modal Ver Miembros */}
      <VerMiembrosModal
        open={isMiembrosModalOpen}
        onOpenChange={setIsMiembrosModalOpen}
        nombreEquipo={selectedEquipo.nombre}
        miembros={selectedEquipo.miembros}
      />

      {/* Modal para unirse a partidos */}
      <UnirsePartidoModal
        open={isUnirsePartidoModalOpen}
        onOpenChange={setIsUnirsePartidoModalOpen}
        user={user}
        todosLosEquipos={todosLosEquipos}
        misEquipos={misEquipos}
        canchas={canchas}
        onJoined={(nuevoPartido) => {
          // Actualizar la lista de partidos después de unirse
          setProximosPartidos((prev) => [...prev, nuevoPartido]);
        }}
      />
    </DashboardLayout>
  );
}
