import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Logo } from '../components/Logo';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// interface LoginProps se elimina

export function Login({ onNavigateToRegister, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Envío asíncrono al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          // El backend espera el campo 'clave'
          clave: formData.password,
        }),
      });

      if (res.ok) {
        const user = await res.json();
        try { localStorage.setItem('user', JSON.stringify(user)); } catch (err) { /* ignore */ }
        onLogin?.(user);
      } else if (res.status === 401) {
        setError('Correo o contraseña incorrectos');
      } else {
        const text = await res.text();
        setError(text || `Error del servidor: ${res.status}`);
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('No se pudo conectar con el servidor');
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
            src="https://images.unsplash.com/photo-1650327987377-90bf6c9789fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwZ3JlZW4lMjBncmFzc3xlbnwxfHx8fDE3NjI0ODAwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fútbol"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center h-full">
          <Logo size="lg" variant="light" />
          <p className="mt-8 text-xl opacity-90 max-w-md mx-auto">
            Tu plataforma para reservar canchas y organizar partidos de fútbol
          </p>
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <h2 className="text-[#111827]">Bienvenido de vuelta</h2>
          </div>

          <div className="hidden lg:block mb-6">
            <h1 className="text-[#111827]">Bienvenido de vuelta</h1>
            <p className="text-[#6b7280] mt-2">Ingresa a tu cuenta de Futhub</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="text-[#16a34a] hover:underline text-sm block w-full"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </button>
                <p className="text-xs text-[#6b7280] mt-4 pt-4 border-t border-gray-200">
                  <strong>Tip:</strong> Usa <code className="bg-gray-100 px-2 py-1 rounded">admin@futhub.com</code> para acceder al panel de administrador
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}