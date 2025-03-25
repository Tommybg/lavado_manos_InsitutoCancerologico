import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SuccessAlertProps {
  show: boolean;
  onRestart: () => void; // Added prop to handle restart
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ show, onRestart }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onRestart(); // Call the restart function after hiding
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show, onRestart]);
  
  if (!visible) return null;
  
  return (
    <div className="flex items-center justify-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-2 rounded-full mb-2">
            <Check className="text-green-500 w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">¡Lavado de manos exitoso!</h3>
          <p className="text-gray-600 text-center text-sm">
            Ha completado correctamente todos los pasos del protocolo de lavado de manos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
