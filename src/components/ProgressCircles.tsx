import React from "react";
import { handwashingSteps, HandwashingStep } from "../utils/handwashingSteps";
import { Button } from "@/components/ui/button";
import { Play, Circle } from "lucide-react";

interface ProgressCirclesProps {
  currentStep: number;
  completedSteps: number[];
  onStart?: () => void;
  isActive: boolean;
}

const ProgressCircles: React.FC<ProgressCirclesProps> = ({ 
  currentStep, 
  completedSteps, 
  onStart,
  isActive 
}) => {
  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      return "completed";
    }
    if (stepId === currentStep) {
      return "active";
    }
    return "pending";
  };

  const getCircleColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-100";
      case "active":
        return "border-blue-500 bg-blue-100";
      default:
        return "border-gray-300 bg-gray-100";
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "active":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  const getProgressWidth = (status: string, stepId: number) => {
    if (status === "completed") return "w-full";
    if (status === "active") {
      // Calculate progress based on time
      return "w-1/2"; // This would need to be dynamic based on time
    }
    return "w-0";
  };

  return (
    <div className="w-full relative mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">Progreso de Lavado de Manos</h2>
        
        {!isActive && (
          <Button 
            onClick={onStart} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Play className="mr-2" size={16} />
            Iniciar Lavado
          </Button>
        )}
      </div>
      
      <div className="relative flex flex-col space-y-4 justify-center items-center">
        {/* Step items displayed in a line */}
        <div className="flex justify-between w-full">
          {handwashingSteps.map((step) => {
            const status = getStepStatus(step.id);
            
            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center transition-all duration-300 ${
                  status === "active" ? "scale-110 z-10" : ""
                }`}
              >
                <div className={`w-28 h-28 rounded-full border-4 ${getCircleColor(status)} overflow-hidden flex items-center justify-center transition-all duration-300`}>
                  <img 
                    src={step.image} 
                    alt={step.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${getTextColor(status)}`}>
                    {step.id}. {step.name}
                  </div>
                </div>
                
                {/* Remove the linear progress bar */}
                {/* You can add a circular progress indicator here if needed */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressCircles;
