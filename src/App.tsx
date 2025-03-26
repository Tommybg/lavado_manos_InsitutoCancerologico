import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

// Types for our steps
interface Step {
  id: number;
  name: string;
  image: string;
  duration: number;
  completed: boolean;
  active: boolean;
}

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Define the washing steps
  const steps: Step[] = [
    { id: 1, name: "Palma con palma", image: "/paso1.png", duration: 8.33, completed: false, active: false },
    { id: 2, name: "Entre los dedos", image: "/paso2.png", duration: 8.33, completed: false, active: false },
    { id: 3, name: "Dorso de las manos", image: "/paso3.png", duration: 8.33, completed: false, active: false },
    { id: 4, name: "Base de los pulgares", image: "/paso4.png", duration: 8.33, completed: false, active: false },
    { id: 5, name: "Uñas y yemas", image: "/paso5.png", duration: 8.33, completed: false, active: false },
    { id: 6, name: "Uñas en palma", image: "/paso6.png", duration: 8.33, completed: false, active: false },
  ];

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPredictionResult(data.step);
      if (data.step === steps[currentStep].name) {
        updateProgress();
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket cerrado");
    };

    return () => {
      socket.close();
    };
  }, [currentStep]);

  // Send frames to the AI model
  const processFrame = () => {
    if (videoRef.current && canvasRef.current && isStarted) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Draw the current video frame on the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Get the frame data and send it to the server
        const frameData = canvasRef.current.toDataURL('image/jpeg');
        socketRef.current?.send(JSON.stringify({ frame: frameData }));
      }
      
      // Process the next frame
      requestAnimationFrame(processFrame);
    }
  };

  // Initialize camera
  useEffect(() => {
    if (isStarted) {
      initializeCamera();
    }
  }, [isStarted]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current!.videoWidth;
            canvasRef.current.height = videoRef.current!.videoHeight;
            processFrame();
          }
        };
      }
    } catch (error) {
      setCameraError('Error al acceder a la cámara. Por favor, verifique los permisos.');
    }
  };

  const updateProgress = () => {
    setTimeLeft((prev) => Math.max(0, prev - 1));
    if (timeLeft <= 0) {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }
  };

  const startProcess = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setTimeLeft(50);
  };

  const resetProcess = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setTimeLeft(50);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/paso1.png" alt="Logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Monitor de Lavado de Manos</h1>
              <p className="text-sm text-gray-500">Sistema de Seguimiento de Higiene de Manos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Personal Hospitalario</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">PH</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Feed Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
              {!isStarted ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500">Inicie el proceso para ver las instrucciones</p>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </>
              )}
              {cameraError && (
                <div className="absolute inset-0 bg-red-50 bg-opacity-90 flex items-center justify-center p-4">
                  <p className="text-red-600 text-center">{cameraError}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Detección de Lavado de Manos</h2>
                {!isStarted ? (
                  <button
                    onClick={startProcess}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Iniciar Lavado
                  </button>
                ) : (
                  <button
                    onClick={resetProcess}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Posicione sus manos dentro de la vista de la cámara para una detección adecuada
              </p>
              {predictionResult && (
                <p className="mt-2 text-sm font-medium text-blue-600">
                  Paso detectado: {predictionResult}
                </p>
              )}
            </div>
          </div>

          {/* Instructions and Progress Section */}
          <div className="space-y-8">
            {/* Timer and Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Progreso de Lavado de Manos</h3>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${(timeLeft / 50) * 100}, 100`}
                    />
                    <text x="18" y="20.35" className="text-xs" textAnchor="middle" fill="#666">
                      {timeLeft}s
                    </text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`relative p-4 rounded-lg border ${
                      step.id - 1 === currentStep
                        ? 'border-blue-500 bg-blue-50'
                        : step.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img src={step.image} alt={step.name} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{step.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Consejos Sanitarios</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                  <span className="ml-2 text-sm text-gray-600">Use jabón y agua tibia para una limpieza efectiva</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                  <span className="ml-2 text-sm text-gray-600">El lavado de manos debe durar al menos 60 segundos</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                  <span className="ml-2 text-sm text-gray-600">No olvide sus pulgares, a menudo se pasan por alto</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                  <span className="ml-2 text-sm text-gray-600">Limpie bien entre los dedos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;