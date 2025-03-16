
import React from "react";
import { WashingStep } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuidancePanelProps {
  currentStep: WashingStep | undefined;
  isRunning: boolean;
  isCompleted: boolean;
  overallProgress: number;
}

const GuidancePanel = ({
  currentStep,
  isRunning,
  isCompleted,
  overallProgress,
}: GuidancePanelProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Current Step Guide Box */}
      <div className="bg-[#0EA5E9] text-white rounded-t-lg flex-shrink-0">
        <div className="px-4 py-2 border-b border-white/20">
          <h2 className="font-semibold">Guía del Paso Actual</h2>
        </div>
        
        <div className="p-4 bg-white text-foreground rounded-b-lg">
          <h3 className="font-bold text-lg mb-2">
            {isCompleted 
              ? "¡Lavado completado!" 
              : currentStep 
                ? `${currentStep.id}. ${currentStep.name}` 
                : "Preparado para iniciar"}
          </h3>
          
          {currentStep && (
            <div className="bg-gray-100 p-2 rounded-md mb-3 aspect-video flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-400">▶</span>
                </div>
                <span className="text-xs">Demonstración del paso</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-3 text-sm">
            {isCompleted 
              ? "¡Felicidades! Has completado correctamente todos los pasos del lavado de manos."
              : currentStep 
                ? currentStep.description 
                : "Siga las instrucciones para completar el lavado de manos según el protocolo de la OMS."}
          </p>
          
          {currentStep && !isCompleted && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <h4 className="font-semibold text-sm text-gray-700">Técnica:</h4>
              <p className="text-sm text-gray-600 mt-1">
                {currentStep.technique || "Asegúrese de aplicar suficiente jabón para cubrir todas las superficies de las manos."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Health Tips Box - Scrollable if needed */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-3 flex-grow flex flex-col">
        <div className="flex items-center px-4 py-2 border-b border-gray-200 flex-shrink-0">
          <Info className="text-[#0EA5E9] w-5 h-5 mr-2" />
          <h3 className="font-semibold">Consejos Sanitarios</h3>
        </div>
        
        <ScrollArea className="flex-grow p-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Use jabón y agua tibia para una limpieza efectiva</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">El lavado de manos debe durar al menos 60 segundos</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">No olvide sus pulgares, a menudo se pasan por alto</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Limpie bien entre los dedos</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Seque las manos completamente para evitar el crecimiento bacteriano</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#0EA5E9] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Cierre los grifos con toallas de papel para evitar la recontaminación</span>
            </li>
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GuidancePanel;
