import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Play, Camera, AlertCircle, RefreshCw, Check } from "lucide-react";

interface CameraFeedProps {
  isActive: boolean;
  onStart: () => void;
  showSuccess: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isActive, onStart, showSuccess }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  // Configuración de la cámara
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // Función para manejar cuando la cámara está lista
  const handleUserMedia = () => {
    setIsLoading(false);
    setCameraReady(true);
    setError(null);
  };

  // Función para manejar errores de la cámara
  const handleUserMediaError = (err: string | DOMException) => {
    setIsLoading(false);
    setCameraReady(false);
    
    // Determinar el tipo de error para mostrar un mensaje más específico
    let errorMessage = "No se pudo acceder a la cámara. Por favor, compruebe los permisos.";
    
    if (err instanceof DOMException) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permiso para acceder a la cámara denegado. Por favor, permita el acceso.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No se encontró ninguna cámara en su dispositivo.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Su cámara está siendo utilizada por otra aplicación.";
      }
    }
    
    setError(errorMessage);
    console.error("Error de cámara:", err);
  };

  // Función para reintentar la conexión a la cámara
  const handleRetryCamera = () => {
    setIsLoading(true);
    setError(null);
    
    // Forzar la recarga del componente Webcam
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    
    // Pequeño retraso antes de reintentar
    setTimeout(() => {
      if (webcamRef.current) {
        webcamRef.current.forceUpdate();
      }
    }, 500);
  };

  // Instrucciones específicas según el navegador
  const getBrowserSpecificInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.indexOf('chrome') > -1) {
      return (
        <ol className="text-left text-xs mt-2 space-y-1">
          <li>1. Haga clic en el icono del candado en la barra de direcciones</li>
          <li>2. Seleccione "Configuración del sitio"</li>
          <li>3. Busque "Cámara" y cambie a "Permitir"</li>
          <li>4. Recargue la página</li>
        </ol>
      );
    } else if (userAgent.indexOf('firefox') > -1) {
      return (
        <ol className="text-left text-xs mt-2 space-y-1">
          <li>1. Haga clic en el icono del candado en la barra de direcciones</li>
          <li>2. Seleccione "Permisos"</li>
          <li>3. Cambie "Usar cámara" a "Permitir"</li>
          <li>4. Recargue la página</li>
        </ol>
      );
    } else if (userAgent.indexOf('safari') > -1) {
      return (
        <ol className="text-left text-xs mt-2 space-y-1">
          <li>1. Abra Preferencias de Safari</li>
          <li>2. Vaya a "Sitios web" y seleccione "Cámara"</li>
          <li>3. Busque este sitio y seleccione "Permitir"</li>
          <li>4. Recargue la página</li>
        </ol>
      );
    } else {
      return (
        <ol className="text-left text-xs mt-2 space-y-1">
          <li>1. Busque la configuración de permisos en su navegador</li>
          <li>2. Permita el acceso a la cámara para este sitio</li>
          <li>3. Recargue la página</li>
        </ol>
      );
    }
  };

  return (
    <div className="camera-container relative w-full h-[180px] md:h-[350px] rounded-xl flex flex-col items-center justify-center transition-all duration-300 bg-gray-100 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
          <div className="flex flex-col items-center">
            <RefreshCw className="animate-spin text-blue-500 mb-2" size={24} />
            <span className="text-gray-600 text-sm">Cargando cámara...</span>
          </div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4">
          <div className="text-red-500 mb-2">
            <AlertCircle size={32} />
          </div>
          <p className="text-center text-gray-700 font-medium mb-3 text-sm">
            {error}
          </p>
          
          <div className="bg-gray-50 p-2 rounded-lg w-full max-w-xs mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Cómo habilitar la cámara:</p>
            {getBrowserSpecificInstructions()}
          </div>
          
          <button 
            onClick={handleRetryCamera}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <Camera size={14} className="mr-1.5" />
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className={`w-full h-full object-cover rounded-xl ${isActive ? 'border-4 border-blue-500' : 'border-4 border-gray-200'}`}
            style={{ transform: 'scaleX(-1)' }} // Espejo horizontal
            mirrored={true} // Propiedad adicional de react-webcam para espejo
            screenshotFormat="image/jpeg"
          />
          
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-20">
              <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg text-center max-w-[250px]">
                <div className="bg-green-100 p-2 rounded-full inline-flex mb-2">
                  <Check className="text-green-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">¡Lavado de manos exitoso!</h3>
                <p className="text-gray-600 text-sm">Ha completado correctamente todos los pasos del protocolo.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CameraFeed;
