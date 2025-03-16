
import React from "react";
import { useHandWashingSteps } from "@/hooks/useHandWashingSteps";
import { WASHING_STEPS } from "@/lib/constants";
import CameraFeed from "./CameraFeed";
import CountdownTimer from "./CountdownTimer";
import StepIndicator from "./StepIndicator";
import GuidancePanel from "./GuidancePanel";
import SuccessAlert from "./SuccessAlert";
import { cn } from "@/lib/utils";

const HandWashingApp = () => {
  const {
    steps,
    currentStepIndex,
    currentStep,
    isRunning,
    timeRemaining,
    isCompleted,
    startProcess,
    resetProcess,
    overallProgress,
  } = useHandWashingSteps();
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/50 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Monitoreo de Lavado de Manos
        </h1>
        <p className="text-muted-foreground mt-1">
          Protocolo OMS - 7 pasos, 60 segundos
        </p>
      </header>
      
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Guidance */}
          <div className="lg:col-span-1">
            <GuidancePanel 
              currentStep={currentStep}
              isRunning={isRunning}
              isCompleted={isCompleted}
              overallProgress={overallProgress}
            />
          </div>
          
          {/* Center Panel - Camera Feed & Controls */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative mb-6">
              <CameraFeed isRunning={isRunning} isCompleted={isCompleted} />
            </div>
            
            <div className="flex justify-center mb-4">
              {!isRunning && !isCompleted ? (
                <button
                  onClick={startProcess}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Iniciar proceso de lavado
                </button>
              ) : isCompleted ? (
                <button
                  onClick={resetProcess}
                  className="px-6 py-3 bg-success text-white rounded-md hover:bg-success/90 transition-colors font-medium"
                >
                  Comenzar de nuevo
                </button>
              ) : (
                <div className="px-6 py-3 glass-panel">
                  <p className="text-primary font-medium">Proceso en curso...</p>
                </div>
              )}
            </div>
            
            {/* Timer in the middle of step indicators */}
            <div className="mb-8 flex items-center justify-center">
              <CountdownTimer 
                timeRemaining={timeRemaining} 
                isRunning={isRunning} 
                isCompleted={isCompleted} 
              />
            </div>
            
            {/* Step indicators in a semi-circle */}
            <div className="relative h-[300px] mb-10">
              {WASHING_STEPS.map((washingStep, index) => {
                const step = steps.find(s => s.id === washingStep.id);
                if (!step) return null;
                
                return (
                  <StepIndicator
                    key={washingStep.id}
                    step={washingStep.id}
                    label={washingStep.name}
                    icon={washingStep.icon}
                    status={step.status}
                    progress={step.progress}
                    position={index}
                    totalSteps={WASHING_STEPS.length}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Alert */}
      <SuccessAlert isCompleted={isCompleted} onReset={resetProcess} />
    </div>
  );
};

export default HandWashingApp;
