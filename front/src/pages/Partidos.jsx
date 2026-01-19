import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { CanchaCard } from '../components/CanchaCard';
import { Calendar } from '../components/ui/calendar';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { get } from 'react-hook-form';

const API_URL = 'http://localhost:8080/api/partidos';
const EQUIPOS_API_URL = 'http://localhost:8080/api/v1/equipos/mis-equipos';
const CANCHAS_API_URL = 'http://localhost:8080/api/canchas/disponibles';

function formatDateTimeForBackend(dateOrString) {
  if (!dateOrString) return null;
  const date = dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  if (isNaN(date)) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text().catch(() => '');
  let parsedBody = bodyText;

  if (contentType.includes('application/json') && bodyText) {
    try {
      parsedBody = JSON.parse(bodyText);
    } catch (err) {
      parsedBody = bodyText;
    }
  }

  if (!response.ok) {
    const message = (parsedBody && parsedBody.message) ? parsedBody.message : bodyText || `Error en la solicitud a la API (status ${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.body = parsedBody;
    throw error;
  }

  return contentType.includes('application/json') ? parsedBody : (bodyText || null);
}

const getUserId = (user) => {
  if (user && user.id) return user.id;
  const stored = localStorage.getItem('userId');
  return stored || '';
};

const getHeaders = (user, isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const uid = getUserId(user);
  if (uid) headers['X-USER-ID'] = uid;
  headers['Accept'] = 'application/json';
  return headers;
};

export function Partidos({ userName = 'Usuario', user, onNavigate, onLogout }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedEquipoA, setSelectedEquipoA] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

  // Variables para equipos

  const [misEquipos, setMisEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);

  // Variables para canchas

  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);

  // Logica para cargar equipos desde el backend

  useEffect(() => {
    const cargarMisEquipos = async () => {
      setLoadingEquipos(true);
      try {
        const response = await fetch(EQUIPOS_API_URL, {
          method: 'GET',
          headers: getHeaders(user,false),
        }).then(handleResponse);
        setMisEquipos(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error al cargar mis equipos:', error);
        setMisEquipos([]);
      } finally {
        setLoadingEquipos(false);
        }
      };

      if (user || getUserId(user)) {
        cargarMisEquipos();
      } else {
        setLoadingEquipos(false);
      }
    }, [user]);

  // Logica para cargar canchas desde el backend

  useEffect(() => {
    const cargarCanchas = async () => {
      setLoadingCanchas(true);
      try {
        const response = await fetch(CANCHAS_API_URL).then(handleResponse);
        setCanchas(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error al cargar canchas:', error);
        setCanchas([]);
      } finally {
        setLoadingCanchas(false);
      }
    };
    cargarCanchas();
  }, []);

  

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirm = async () => {
    setErrorMessage(null);
    const fechaParaBackend = formatDateTimeForBackend(selectedDate);

    const partidoData = {
      fecha: fechaParaBackend,
      id_cancha: selectedCancha,
      id_equipo_1: selectedEquipoA,
      id_equipo_2: null,
      id_creador: getUserId(user)
    };

    try {
      console.log('Enviando payload a API:', partidoData);
      const result = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(partidoData)
      }).then(handleResponse);

      console.log('Respuesta del servidor: ', result);

      // limpiar formulario
      setSelectedDate(null);
      setSelectedCancha(null);
      setSelectedEquipoA(null);

      // Mostrar modal de éxito SIN timer automático. El usuario debe pulsar "Listo" para ir a home.
      setSuccessModalMessage('Reserva completada correctamente.');
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('Error al crear partido:', error);
      console.error('Status:', error.status, 'Body:', error.body);

      const bodyText = error?.body
        ? (typeof error.body === 'string' ? error.body : JSON.stringify(error.body))
        : error?.message || 'Error al crear partido';

      const mensajeFechasPasadas = 'No se pueden crear partidos en fechas pasadas.';
      const mensajeCanchaReservada = 'La cancha ya esta reservada en la fecha seleccionada.';

      if (String(bodyText).includes(mensajeFechasPasadas) || String(bodyText).includes(mensajeCanchaReservada)) {
        // Llevar al usuario al paso de selección de fecha para corregir la fecha y mostrar el error
        setCurrentStep(2);
        setErrorMessage(String(bodyText));
        return;
      }

      setErrorMessage(bodyText);
    }
  };

  const isNextStepDisabled = () => {
    switch (currentStep) {
      case 1:
        return selectedCancha === null;
      case 2:
        return !selectedDate;
      case 3:
        return !selectedEquipoA;
      default:
        return false;
    }
  };

  const StepIndicator = ({ step, label, isCurrent, isCompleted }) => (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isCurrent ? 'bg-[#16a34a] text-white' : isCompleted ? 'bg-gray-200 text-[#16a34a]' : 'bg-gray-200 text-[#6b7280]'
      }`}>
        {isCompleted ? <Check className="w-6 h-6" /> : <span>{step}</span>}
      </div>
      <span className={isCurrent ? 'text-[#111827]' : 'text-[#6b7280]'}>{label}</span>
    </div>
  );

  return (
    <DashboardLayout userName={userName} user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="partidos">
      <div className="space-y-8">
        {/* Alert de error */}
        {errorMessage && (
          <div className="flex items-start justify-between gap-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
            <div className="text-sm">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              aria-label="Cerrar alerta"
              className="font-semibold px-2 py-1 rounded hover:bg-red-100"
            >✕</button>
          </div>
        )}
        {/* Header y Stepper */}
        <h1 className="text-[#111827]">Crear Nuevo Partido</h1>
        <div className="flex justify-around p-4 bg-white rounded-lg shadow-sm border">
          <StepIndicator step={1} label="Selecciona la Cancha" isCurrent={currentStep === 1} isCompleted={currentStep > 1} />
          <StepIndicator step={2} label="Define los Detalles" isCurrent={currentStep === 2} isCompleted={currentStep > 2} />
          <StepIndicator step={3} label="Selecciona tu Equipo" isCurrent={currentStep === 3} isCompleted={currentStep > 3} /> 
          <StepIndicator step={4} label="Confirmación" isCurrent={currentStep === 4} isCompleted={currentStep > 4} />
        </div>

        {/* Contenido del Step 1: Seleccionar Cancha */}
        {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCanchas ? (
            <div className="col-span-full text-center p-6">Cargando canchas...</div>
          ) : canchas.length === 0 ? (
            <div className="col-span-full text-center p-6 text-gray-500">No hay canchas disponibles.</div>
          ) : (
            canchas.map((cancha, index) => {
                const imagen = cancha.imagenUrl || cancha.imagen || cancha.image || 'https://via.placeholder.com/400x250?text=Sin+imagen';
                return (
                  <CanchaCard
                    key={cancha.id ?? index}
                    {...cancha}
                    imagen={imagen}
                    isSelected={selectedCancha === cancha.id}
                    onSelect={() => setSelectedCancha(cancha.id)}
                  />
                );
              })
          )}
        </div>
        
      )}

        {/* Contenido del Step 2: Detalles */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-[#111827] mb-4">Define los Detalles</h2>
              <Card className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </Card>
            </div>
          </div>
        )}

        {/* Contenido del Step 3: Equipos */}
        {currentStep === 3 && (
          <div className="md:col-span-1">
            <h2 className="text-[#111827] mb-4">Selecciona tu Equipo</h2>
            <Card className="p-4">
              <h3 className="text-[#111827]">Tus equipos</h3>

              {/*selector de equipos*/}
              <div className="space-y-2">
                <Label htmlFor="equipo-a" className="text-lg font-medium text-[#111827]">Equipo A (Local)</Label>
                <Select onValueChange={(value) => setSelectedEquipoA(value)} value={selectedEquipoA}>
                  <SelectTrigger id="equipo-a" className="w-full border-[#d1d5db] rounded-md focus:ring-[#16a34a] focus:border-[#16a34a]">
                    <SelectValue placeholder={loadingEquipos ? "Cargando equipos..." : "Selecciona un equipo..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEquipos ? (
                      <SelectItem value="">No tienes equipos</SelectItem>
                    ) : (
                      misEquipos.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>{eq.nombre}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/*boton de crear equipo*/}
              <div className="mt-8 border-t pt-6 flex justify-end">
              <Button 
                variant="outline"
                className="border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a] hover:text-white"
                onClick={() => onNavigate('equipos')} // Te lleva a la página de crear equipo
              >
                + Crear Equipo Nuevo
              </Button>
            </div>
            </Card>
          </div>
        )}

        {/* Contenido del Step 4: Confirmación */}
        {currentStep === 4 && (
            <div className="md:col-span-1">
              <h2 className="text-[#111827] mb-4">Confirmación</h2>
              <Card className="p-6 space-y-4">
                <h3 className="text-[#111827]">Resumen de tu Reserva</h3>
                {selectedCancha && (
                  (() => {
                    const canchaObj = canchas.find(c => c.id === selectedCancha);
                    return (
                      <div>
                        <Label className="text-[#6b7280]">Cancha</Label>
                        <p className="text-[#111827]">{canchaObj ? canchaObj.nombre : selectedCancha}</p>
                        <p className="text-sm text-[#6b7280]">{canchaObj ? canchaObj.ubicacion : ''}</p>
                      </div>
                    );
                  })()
                )}
                <div>
                  <Label className="text-[#6b7280]">Fecha</Label>
                  <p className="text-[#111827]">{selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'No seleccionada'}</p>
                </div>
                <div>
                  <Label className="text-[#6b7280]">Equipo</Label>
                  <p className="text-[#111827]">{selectedEquipoA ? (misEquipos.find(e=>e.id===selectedEquipoA)?.nombre || selectedEquipoA) : 'No seleccionada'}</p>
                </div>
                <div>
                  <Label className="text-[#6b7280]">Costo Total</Label>
                  <p className="text-[#111827] text-lg">{(() => {
                    const canchaObj = canchas.find(c => c.id === selectedCancha);
                    return canchaObj ? canchaObj.precio : 'N/A';
                  })()}</p>
                </div>
              </Card>
            </div>
          )}
          

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="border-[#d1d5db]"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={handleNextStep}
              disabled={isNextStepDisabled()}
              className="bg-[#16a34a] hover:bg-[#15803d] text-white"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              className="bg-[#16a34a] hover:bg-[#15803d] text-white"
            >
              Confirmar Reserva
            </Button>
          )}
        </div>
      </div>

      {/* Modal de éxito (ventana tipo "agregar cancha") */}
      {successModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="p-6 w-full max-w-xl mx-4">
            <h3 className="text-xl font-semibold text-[#111827] mb-2">Reserva exitosa</h3>
            <p className="text-sm text-[#6b7280] mb-4">{successModalMessage}</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSuccessModalVisible(false);
                  setSuccessModalMessage('');
                  onNavigate('home');
                }}
                className="border-[#d1d5db]"
              >
                Listo
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}