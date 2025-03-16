
import React from "react";
import { useCamera } from "@/hooks/useCamera";
import { cn } from "@/lib/utils";
import { Camera, AlertCircle } from "lucide-react";

interface CameraFeedProps {
  isRunning: boolean;
  isCompleted: boolean;
}

const CameraFeed = ({ isRunning, isCompleted }: CameraFeedProps) => {
  const { videoRef, status, startCamera, isError } = useCamera();
  
  React.useEffect(() => {
    startCamera();
  }, [startCamera]);
  
  return (
    <div className="relative w-full mx-auto aspect-video overflow-hidden rounded-lg">
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent",
          isRunning && "opacity-50",
          !isRunning && "opacity-30"
        )}
      />
      
      {/* Camera access error - similar to the image */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-center p-8">
          <Camera className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-red-500 mb-4">No se pudo acceder a la cámara. Asegúrese de que los permisos de la cámara estén concedidos.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => startCamera()}
          >
            Reintentar Acceso a la Cámara
          </button>
        </div>
      )}
      
      {status === "requesting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-pulse w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">Accediendo a la cámara...</p>
          </div>
        </div>
      )}
      
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-panel bg-white/40 backdrop-blur px-8 py-4 rounded-xl animate-fade-in">
            <h2 className="text-3xl font-bold text-success">Lavado de manos exitoso</h2>
          </div>
        </div>
      )}
      
      {/* Border glow when active */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500",
          isRunning ? "opacity-100" : "opacity-0",
          "ring-2 ring-primary rounded-lg"
        )}
      />
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-gray-900"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default CameraFeed;
