
import React, { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAlertProps {
  isCompleted: boolean;
  onReset: () => void;
}

const SuccessAlert = ({ isCompleted, onReset }: SuccessAlertProps) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isCompleted]);
  
  if (!show) return null;
  
  return (
    <div className="success-alert" onClick={() => setShow(false)}>
      <div className="success-alert-content" onClick={(e) => e.stopPropagation()}>
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCheck className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-3xl font-bold mb-2">¡Lavado de manos exitoso!</h2>
        <p className="text-muted-foreground mb-6">Has completado correctamente todos los pasos del protocolo de la OMS.</p>
        <button
          className={cn(
            "px-6 py-3 bg-success text-white rounded-md hover:bg-success/90 transition-colors",
            "font-medium"
          )}
          onClick={onReset}
        >
          Comenzar de nuevo
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
