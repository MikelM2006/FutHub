import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { StarRating } from "../components/StarRating";
import { Logo } from "../components/Logo";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// interface RegisterProps se elimina

export function Register({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    cedula: "",
    edad: "",
    posicion: "",
    autoclasificacion: 0,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Se elimina el tipado ': React.FormEvent' de e
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Construir el payload según CreateUsuarioRequest
    const payload = {
      nombreCompleto: formData.nombre,
      email: formData.email,
      clave: formData.password,
      id_cedula: formData.cedula,
      edad: formData.edad === "" ? null : Number(formData.edad),
      posicion: formData.posicion || null,
      autoclasificacion: formData.autoclasificacion || 0,
    };

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        // consumir cuerpo para evitar warnings, no necesitamos el usuario aquí
        try {
          await res.json();
        } catch (e) {
          /* ignore parse errors */
        }
        setSuccess("Usuario creado correctamente. Ya puedes iniciar sesión.");
        // Redirigir a login tras breve pausa
        setTimeout(() => onNavigateToLogin?.(), 1200);
      } else if (res.status === 409) {
        // Email ya existe
        const text = await res.text();
        setError(text || "Ya existe un usuario con ese email");
      } else {
        const text = await res.text();
        setError(text || `Error del servidor: ${res.status}`);
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Columna izquierda con ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#16a34a] to-[#15803d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdGFkaXVtJTIwZGFyayUyMGFlcmlhbHxlbnwxfHx8fDE3NjI0MTA2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fútbol"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center h-full">
          <Logo size="lg" variant="light" />
          <p className="mt-8 text-xl opacity-90 max-w-md mx-auto">
            Crea tu perfil, encuentra equipos y reserva canchas en minutos.
          </p>
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-10 flex justify-center lg:justify-start">
            <Logo />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-[#111827] mb-6 text-center">Crea tu cuenta</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre y apellido"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                  className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                />
              </div>

              {/* ... (resto de los campos del formulario) ... */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cedula">ID (Cédula)</Label>
                  <Input
                    id="cedula"
                    type="text"
                    placeholder="V-12345678"
                    value={formData.cedula}
                    onChange={(e) =>
                      setFormData({ ...formData, cedula: e.target.value })
                    }
                    className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    placeholder="25"
                    value={formData.edad}
                    onChange={(e) =>
                      setFormData({ ...formData, edad: e.target.value })
                    }
                    className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="posicion">Posición de Juego</Label>
                <Select
                  value={formData.posicion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, posicion: value })
                  }
                >
                  <SelectTrigger className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]">
                    <SelectValue placeholder="Selecciona tu posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PORTERO">Portero</SelectItem>
                    <SelectItem value="DEFENSA">Defensa</SelectItem>
                    <SelectItem value="MEDIO">Medio</SelectItem>
                    <SelectItem value="DELANTERO">Delantero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Autoclasificación</Label>
                <StarRating
                  value={formData.autoclasificacion}
                  onChange={(value) =>
                    setFormData({ ...formData, autoclasificacion: value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              {success && (
                <div className="text-green-600 text-sm text-center">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Registrarme"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[#16a34a] hover:underline text-sm"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
