
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type CameraStatus = "idle" | "requesting" | "active" | "error";

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    if (status === "active") return;
    
    setStatus("requesting");
    
    try {
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStatus("active");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setStatus("error");
      toast.error("No se pudo acceder a la cámara. Por favor, compruebe los permisos.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setStatus("idle");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    status,
    startCamera,
    stopCamera,
    isActive: status === "active",
    isError: status === "error",
    isRequesting: status === "requesting"
  };
}
