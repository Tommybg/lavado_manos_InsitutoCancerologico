
import React from "react";
import Header from "@/components/Header";
import CameraFeed from "@/components/CameraFeed";
import ProgressCircles from "@/components/ProgressCircles";
import StepGuide from "@/components/StepGuide";
import Timer from "@/components/Timer";
import HealthTips from "@/components/HealthTips";
import SuccessAlert from "@/components/SuccessAlert";
import { useHandwashing } from "@/hooks/useHandwashing";

const Index = () => {
  const {
    isActive,
    currentStep,
    completedSteps,
    timeRemaining,
    showSuccess,
    startProcess,
    resetProcess
  } = useHandwashing();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera and Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed 
              isActive={isActive} 
              onStart={startProcess} 
              showSuccess={showSuccess}
            />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium text-gray-800">Detección de Lavado de Manos</h2>
                <Timer timeRemaining={timeRemaining} isActive={isActive} />
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Posicione sus manos dentro de la vista de la cámara para una detección adecuada
              </p>
              
              <ProgressCircles 
                currentStep={currentStep} 
                completedSteps={completedSteps}
                onStart={startProcess}
                isActive={isActive}
              />
            </div>
          </div>
          
          {/* Instructions and Tips Section */}
          <div className="space-y-6">
            <StepGuide currentStep={currentStep} />
            <HealthTips />
          </div>
        </div>
      </main>
      
      {/* Success Alert */}
      <SuccessAlert show={showSuccess} />
    </div>
  );
};

export default Index;
