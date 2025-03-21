
import React, { useState, useEffect } from "react";
import { useCamera } from "../hooks/useCamera";
import { Play } from "lucide-react";

interface CameraFeedProps {
  isActive: boolean;
  onStart: () => void;
  showSuccess: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isActive, onStart, showSuccess }) => {
  const { videoRef, isLoading, error } = useCamera();
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setCameraReady(true);
      };
    }
  }, [videoRef]);

  return (
    <div className="camera-container relative w-full h-[200px] md:h-[390px] rounded-xl flex flex-col items-center justify-center transition-all duration-300 bg-gray-100">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl animate-pulse-opacity">
          <span className="text-gray-500">Cargando cámara...</span>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4">
          <div className="text-red-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <p className="text-center text-gray-700 font-medium">
            No se pudo acceder a la cámara. Por favor, compruebe los permisos.
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover rounded-xl ${isActive ? 'border-4 border-blue-500' : 'border-4 border-gray-200'}`}
          />
          
          {!isActive && cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl">
              <button
                onClick={onStart}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center px-5 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg animate-fade-in"
              >
                <Play className="mr-2" size={20} />
                <span className="font-medium">Iniciar proceso de lavado</span>
              </button>
            </div>
          )}
          
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl animate-success-opacity">
              <div className="bg-white/80 backdrop-blur-md px-8 py-6 rounded-xl shadow-lg text-center transform transition-all">
                <div className="text-green-500 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Lavado de manos exitoso</h3>
                <p className="text-gray-600">Has completado correctamente todos los pasos</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CameraFeed;
