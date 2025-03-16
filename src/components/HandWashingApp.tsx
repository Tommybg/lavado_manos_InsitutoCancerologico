
import React from "react";
import { useHandWashingSteps } from "@/hooks/useHandWashingSteps";
import { WASHING_STEPS } from "@/lib/constants";
import CameraFeed from "./CameraFeed";
import CountdownTimer from "./CountdownTimer";
import StepIndicator from "./StepIndicator";
import GuidancePanel from "./GuidancePanel";
import SuccessAlert from "./SuccessAlert";
import { Clock, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";

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
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <header className="bg-white border-b border-border px-6 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center">
          <div className="bg-[#0EA5E9] text-white p-2 rounded mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplets"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Monitor de Lavado de Manos</h1>
            <p className="text-xs text-muted-foreground">Sistema de Seguimiento de Higiene de Manos</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-3">
            <div className="text-sm text-muted-foreground">Personal Hospitalario</div>
            <div className="text-xs text-muted-foreground">Sistema de Cumplimiento de Higiene</div>
          </div>
          <div className="bg-blue-100 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
            PH
          </div>
        </div>
      </header>
      
      {/* Main Content - Flex grow to fill available space */}
      <div className="flex-grow flex overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 py-3 flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Left & Center - Camera Feed & Controls */}
          <div className="lg:w-2/3 flex flex-col overflow-hidden">
            <div className="bg-muted/30 rounded-lg overflow-hidden shadow-md mb-2 flex-shrink-0">
              <CameraFeed isRunning={isRunning} isCompleted={isCompleted} />
              
              {/* Control button positioned directly below camera */}
              <div className="flex justify-center py-2 bg-white rounded-b-lg">
                {!isRunning && !isCompleted ? (
                  <Button
                    onClick={startProcess}
                    size="lg" 
                    className="px-8 py-5 text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Iniciar proceso de lavado
                  </Button>
                ) : isCompleted ? (
                  <Button
                    onClick={resetProcess}
                    variant="outline"
                    size="lg"
                    className="px-8 py-5 text-base font-medium border-success text-success hover:bg-success/10 transition-all duration-300"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Comenzar de nuevo
                  </Button>
                ) : (
                  <div className="px-8 py-3 glass-panel animate-pulse">
                    <p className="text-primary font-medium flex items-center">
                      <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                      Proceso en curso...
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-primary text-white px-4 py-2 rounded-lg mb-3 flex-shrink-0">
              <h3 className="font-semibold">Detección de Lavado de Manos</h3>
              <p className="text-sm">Posicione sus manos dentro de la vista de la cámara para una detección adecuada</p>
            </div>

            {/* Progress Section */}
            <div className="flex-grow flex flex-col overflow-hidden">
              {/* Progress Title with Timer */}
              <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <h2 className="text-lg font-bold">Progreso de Lavado de Manos</h2>
                <div className="flex items-center text-primary font-mono">
                  <Clock className="w-5 h-5 mr-1" />
                  <span className="text-xl">
                    {Math.floor(timeRemaining / 60)}:{Math.floor(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              {/* Overall progress bar */}
              <div className="mb-3 flex-shrink-0">
                <Progress value={overallProgress} className="h-2" />
              </div>
              
              {/* Step indicators in a scrollable container if needed */}
              <ScrollArea className="flex-grow">
                <div className="grid grid-cols-7 gap-2 pr-2">
                  {WASHING_STEPS.map((washingStep, index) => {
                    const step = steps.find(s => s.id === washingStep.id);
                    if (!step) return null;
                    
                    return (
                      <div key={washingStep.id} className="flex flex-col items-center">
                        <StepIndicator
                          step={washingStep.id}
                          label={washingStep.name}
                          icon={washingStep.icon}
                          status={step.status}
                          progress={step.progress}
                          position={index}
                          totalSteps={WASHING_STEPS.length}
                          rowLayout={true}
                        />
                        <div className="text-center mt-2">
                          <div className="font-medium text-xs">{washingStep.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 hidden md:block">{washingStep.shortDescription}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Right Panel - Step Guidance */}
          <div className="lg:w-1/3 overflow-hidden">
            <GuidancePanel 
              currentStep={currentStep}
              isRunning={isRunning}
              isCompleted={isCompleted}
              overallProgress={overallProgress}
            />
          </div>
        </div>
      </div>
      
      {/* Success Alert */}
      <SuccessAlert isCompleted={isCompleted} onReset={resetProcess} />
    </div>
  );
};

export default HandWashingApp;
