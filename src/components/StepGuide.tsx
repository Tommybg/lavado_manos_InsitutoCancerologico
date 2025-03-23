
import React from "react";
import { handwashingSteps } from "../utils/handwashingSteps";
import { Play } from "lucide-react";

interface StepGuideProps {
  currentStep: number;
}

const StepGuide: React.FC<StepGuideProps> = ({ currentStep }) => {
  const currentStepData = handwashingSteps.find(step => step.id === currentStep);

  if (!currentStepData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-4">
        <div className="text-center text-gray-400 py-6">
          <Play className="mx-auto mb-2" size={24} />
          <p>Inicie el proceso para ver las instrucciones</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 animate-fade-in">
      
      <div className="bg-blue-500 text-white px-3 py-1.5 rounded-lg mb-3">
        <h3 className="font-medium text-sm">Guía del Paso Actual</h3>
      </div>
      
      <div className="flex items-start mb-2">
        <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 text-sm">
          {currentStepData.id}
        </span>
        <h3 className="text-base font-semibold text-gray-800">{currentStepData.name}</h3>
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="mb-3 flex items-center justify-center">
            <div className="bg-white p-2 rounded-lg shadow-sm w-full max-w-xs">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.name}
                className="w-full h-36 object-cover rounded"
              />
              <p className="text-xs text-center mt-1 text-black font-bold">Demostración del paso</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 text-sm">{currentStepData.description}</p>
          
          <div className="mt-3">
            <h4 className="font-medium text-gray-800 mb-1 text-sm">Técnica:</h4>
            <p className="text-gray-600 text-sm">{currentStepData.technique}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepGuide;
