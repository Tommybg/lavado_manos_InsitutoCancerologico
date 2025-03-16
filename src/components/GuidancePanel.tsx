
import React from "react";
import { WashingStep } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
  const Icon = currentStep?.icon;
  
  return (
    <div className="glass-panel p-6 w-full max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Progreso total</h3>
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <div 
        className={cn(
          "border rounded-xl p-4 transition-all duration-300",
          isRunning && !isCompleted 
            ? "border-primary bg-primary/5" 
            : "border-muted bg-muted/10",
          isCompleted && "border-success bg-success/5"
        )}
      >
        <div className="flex items-center mb-3">
          {Icon && (
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                isRunning && !isCompleted ? "bg-primary/10 text-primary" : "bg-muted/20 text-muted-foreground",
                isCompleted && "bg-success/10 text-success"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <div>
            <h3 
              className={cn(
                "font-semibold text-lg",
                isRunning && !isCompleted ? "text-primary" : "text-foreground",
                isCompleted && "text-success"
              )}
            >
              {isCompleted 
                ? "Proceso completado" 
                : currentStep 
                  ? `Paso ${currentStep.id}: ${currentStep.name}` 
                  : "Preparado para iniciar"}
            </h3>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          {isCompleted 
            ? "¡Felicidades! Has completado correctamente todos los pasos del lavado de manos." 
            : currentStep 
              ? currentStep.description 
              : "Siga las instrucciones para completar el lavado de manos según el protocolo de la OMS."}
        </p>
      </div>
      
      <div className="mt-6 bg-muted/20 rounded-lg p-4">
        <h4 className="font-medium mb-2">Consejos para un lavado eficaz:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Utilice agua tibia y jabón suficiente</li>
          <li>• Complete todos los pasos durante 60 segundos</li>
          <li>• Preste especial atención a las áreas entre los dedos</li>
          <li>• No olvide limpiar debajo de las uñas</li>
          <li>• Seque sus manos con una toalla limpia o papel desechable</li>
        </ul>
      </div>
    </div>
  );
};

export default GuidancePanel;
