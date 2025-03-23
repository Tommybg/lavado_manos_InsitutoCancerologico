import { useState, useEffect, useRef } from "react";

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    // Asegurarse de que cualquier stream anterior esté detenido
    if (stream) {
      stopCamera();
    }
    
    try {
      console.log("Intentando acceder a la cámara...");
      
      // Primero intentamos con configuraciones específicas
      try {
        const constraints = {
          video: { 
            facingMode: "user",
            width: { ideal: 640 }, // Reducido para mejor compatibilidad
            height: { ideal: 480 } // Reducido para mejor compatibilidad
          },
          audio: false
        };
        
        console.log("Solicitando cámara con constraints:", constraints);
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        console.log("Stream obtenido:", mediaStream);
        setStream(mediaStream);
        
        if (videoRef.current) {
          console.log("Asignando stream al elemento video");
          videoRef.current.srcObject = mediaStream;
          
          // Asegurarse de que el video se reproduzca cuando esté listo
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata cargada, intentando reproducir");
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => console.log("Video reproduciendo correctamente"))
                .catch(e => {
                  console.error("Error reproduciendo video:", e);
                  setError("Error al reproducir el video de la cámara");
                });
            }
          };
        } else {
          console.error("videoRef.current es null");
          setError("Elemento de video no disponible");
        }
        
        setIsLoading(false);
      } catch (initialError) {
        console.warn("Acceso inicial a la cámara falló, intentando con configuraciones básicas:", initialError);
        
        // Fallback a configuraciones básicas
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        
        console.log("Stream de fallback obtenido");
        setStream(fallbackStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => console.log("Video de fallback reproduciendo correctamente"))
                .catch(e => console.error("Error reproduciendo video de fallback:", e));
            }
          };
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error accediendo a la cámara:", err);
      setError("No se pudo acceder a la cámara. Por favor, compruebe los permisos del navegador.");
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log("Deteniendo cámara");
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log("Deteniendo track:", track.kind);
        track.stop();
      });
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        console.log("Stream eliminado del elemento video");
      }
    }
  };

  useEffect(() => {
    console.log("useCamera hook inicializado");
    // Añadir un pequeño retraso para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      startCamera();
    }, 500); // Aumentado a 500ms para dar más tiempo
    
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  // Función para reiniciar la cámara si es necesario
  const restartCamera = () => {
    console.log("Reiniciando cámara");
    stopCamera();
    // Esperar un poco más antes de reiniciar
    setTimeout(startCamera, 1000);
  };

  return {
    videoRef,
    isLoading,
    error,
    startCamera,
    stopCamera,
    restartCamera,
    stream
  };
};
