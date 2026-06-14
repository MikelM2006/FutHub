// language: javascript
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";

const PARTIDOS_API_URL = import.meta.env.VITE_API_URL + "/api/partidos";

export function UnirsePartidoModal({
  open,
  onOpenChange,
  user,
  todosLosEquipos,
  misEquipos,
  canchas,
  onJoined,
}) {
  const [partidos, setPartidos] = useState([]);
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [loading, setLoading] = useState(false);
  const ownerTeams = Array.isArray(misEquipos)
    ? misEquipos.filter((t) => t.isOwner)
    : [];

  useEffect(() => {
    if (!open) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await fetch(PARTIDOS_API_URL).then((r) => r.json());
        // Filtrar partidos que NO tienen id_equipo_2
        const disponibles = Array.isArray(res)
          ? res.filter((p) => !p.id_equipo_2)
          : [];
        setPartidos(disponibles);
      } catch (err) {
        setPartidos([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [open]);

  const handleJoin = async () => {
    if (!selectedPartido || !selectedEquipo) return;
    try {
      const res = await fetch(`${PARTIDOS_API_URL}/${selectedPartido}/unirse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(user && user.id ? { "X-USER-ID": user.id } : {}),
        },
        body: JSON.stringify({ id_equipo_2: selectedEquipo }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al unirse al partido");
      }
      const data = await res.json();
      onJoined && onJoined(data);
      onOpenChange(false);
    } catch (err) {
      alert("No se pudo unir al partido: " + (err.message || err));
    }
  };

  const getEquipoNombre = (id) => {
    const equipo = todosLosEquipos.find((e) => e.id === id);
    return equipo ? equipo.nombre : `Equipo ${id}`;
  };

  const getCanchaNombre = (id) => {
    if (!canchas || canchas.length === 0) return `Cancha ${id}`;
    const cancha = canchas.find((c) => c.id === id);
    return cancha ? cancha.nombre : `Cancha ${id}`;
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-white"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-[#111827]">
            Unirse a un Partido
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="partido" className="text-[#111827]">
              Selecciona un Partido
            </Label>
            <select
              id="partido"
              className="w-full border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
              value={selectedPartido || ""}
              onChange={(e) => setSelectedPartido(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Selecciona --</option>
              {loading ? (
                <option disabled>Cargando partidos...</option>
              ) : (
                partidos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fecha
                      ? new Date(p.fecha.replace("T", " ")).toLocaleDateString(
                          "es-ES",
                        )
                      : "Sin fecha"}{" "}
                    — Equipo: {getEquipoNombre(p.id_equipo_1)} — Cancha:{" "}
                    {getCanchaNombre(p.id_cancha)}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipo" className="text-[#111827]">
              Selecciona tu Equipo
            </Label>
            <select
              id="equipo"
              className="w-full border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
              value={selectedEquipo || ""}
              onChange={(e) => setSelectedEquipo(e.target.value)}
            >
              <option value="">-- Selecciona equipo --</option>
              {ownerTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#d1d5db] text-[#111827]"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleJoin}
            disabled={!selectedPartido || !selectedEquipo || loading}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white"
          >
            {loading ? "Uniendo..." : "Unirse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
