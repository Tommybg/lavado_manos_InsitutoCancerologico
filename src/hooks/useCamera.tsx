
import { useState, useEffect, useRef } from "react";

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get the camera normally
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setIsLoading(false);
      } catch (initialError) {
        console.error("Initial camera access failed, trying with basic constraints:", initialError);
        
        // Fallback to basic constraints
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        
        setStream(fallbackStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Por favor, compruebe los permisos.");
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    isLoading,
    error,
    startCamera,
    stopCamera,
    stream
  };
};
