
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SuccessAlertProps {
  show: boolean;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ show }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg transform transition-all max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <Check className="text-green-500 w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Lavado de manos exitoso!</h3>
          <p className="text-gray-600 text-center mb-6">
            Ha completado correctamente todos los pasos del protocolo de lavado de manos.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg w-full">
            <p className="text-gray-700 text-sm">
              Recuerde que un correcto lavado de manos es fundamental para prevenir infecciones y garantizar la seguridad del paciente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
