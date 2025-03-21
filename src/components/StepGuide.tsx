
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
        <div className="text-center text-gray-400 py-6">
          <Play className="mx-auto mb-2" size={24} />
          <p>Inicie el proceso para ver las instrucciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">
        <h3 className="font-medium">Guía del Paso Actual</h3>
      </div>
      
      <div className="flex items-start mb-4">
        <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
          {currentStepData.id}
        </span>
        <h3 className="text-lg font-semibold text-gray-800">{currentStepData.name}</h3>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="mb-4 flex items-center justify-center">
            <div className="bg-white p-2 rounded-lg shadow-sm w-full max-w-xs">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.name}
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-xs text-center mt-2 text-gray-500">Demostración del paso</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{currentStepData.description}</p>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-1">Técnica:</h4>
            <p className="text-gray-600">{currentStepData.technique}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepGuide;
