// Destructuring React hooks
const { useState, useEffect, useRef } = React;

// Hand washing step images
// Note: You'll need to place these images in your static/images folder
const stepImages = [
    '/static/images/paso1.png', // Wet hands
    '/static/images/paso2.png', // Apply soap
    '/static/images/paso3.png', // Rub palms
    '/static/images/paso4.png', // Rub backs
    '/static/images/paso5.png', // Rub fingers
    '/static/images/paso6.png'  // Rinse hands
];

// Constants for timing
const TOTAL_DURATION = 50; // seconds
const STEPS_COUNT = 6;
const STEP_DURATION = TOTAL_DURATION / STEPS_COUNT;

const HandWashingApp = () => {
    // State management
    const [currentStep, setCurrentStep] = useState(0);
    const [stepProgress, setStepProgress] = useState(Array(STEPS_COUNT).fill(0));
    const [totalProgress, setTotalProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [streamActive, setStreamActive] = useState(false);
    const [detectedStep, setDetectedStep] = useState(-1);
    const [isCorrectStep, setIsCorrectStep] = useState(false);
    const [timer, setTimer] = useState(TOTAL_DURATION);
    
    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const animationRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const stepTimerRef = useRef(null);
    
    // Initialize socket connection and video stream
    useEffect(() => {
        socketRef.current = io();
        
        socketRef.current.on('connect', () => {
            console.log('Conectado al servidor');
        });
        
        socketRef.current.on('prediction_result', (data) => {
            setDetectedStep(data.step);
            setIsCorrectStep(data.step === currentStep);
        });
        
        startCamera();
        
        return () => {
            stopCamera();
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (stepTimerRef.current) {
                clearInterval(stepTimerRef.current);
            }
        };
    }, []);
    
    // Handle step progression based on detected steps
    useEffect(() => {
        if (completed) return;
        
        if (stepTimerRef.current) {
            clearInterval(stepTimerRef.current);
        }
        
        // Only start step timer if correct step is detected
        if (isCorrectStep && streamActive) {
            stepTimerRef.current = setInterval(() => {
                setStepProgress(prev => {
                    const newProgress = [...prev];
                    
                    if (newProgress[currentStep] < 100) {
                        newProgress[currentStep] += (100 / (STEP_DURATION * 10)); // 10 updates per second
                    }
                    
                    // Check if current step is completed
                    if (newProgress[currentStep] >= 100) {
                        clearInterval(stepTimerRef.current);
                        
                        // Move to next step or complete
                        if (currentStep < STEPS_COUNT - 1) {
                            setCurrentStep(prevStep => prevStep + 1);
                        } else {
                            setCompleted(true);
                            setTimeout(() => {
                                resetApp();
                            }, 5000); // Reset after 5 seconds
                        }
                    }
                    
                    return newProgress;
                });
                
                // Update total progress
                setTotalProgress(prev => {
                    const newProgress = prev + (100 / (TOTAL_DURATION * 10));
                    return Math.min(newProgress, 100);
                });
                
                // Update timer
                setTimer(prev => Math.max(0, prev - 0.1));
            }, 100);
        }
        
        return () => {
            if (stepTimerRef.current) {
                clearInterval(stepTimerRef.current);
            }
        };
    }, [currentStep, isCorrectStep, streamActive, completed]);
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setStreamActive(true);
                animationRef.current = requestAnimationFrame(captureFrame);
            }
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
            alert('Error al acceder a la cámara. Por favor verifique los permisos.');
        }
    };
    
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreamActive(false);
        }
    };
    
    const captureFrame = (timestamp) => {
        if (!videoRef.current || !canvasRef.current || !socketRef.current) {
            animationRef.current = requestAnimationFrame(captureFrame);
            return;
        }
        
        // Throttle frame rate to 5 fps
        if (timestamp - lastFrameTimeRef.current < 200) {
            animationRef.current = requestAnimationFrame(captureFrame);
            return;
        }
        
        lastFrameTimeRef.current = timestamp;
        
        const context = canvasRef.current.getContext('2d');
        const { videoWidth, videoHeight } = videoRef.current;
        
        // Set canvas dimensions to match video
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        
        // Send frame to server for analysis
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.7);
        socketRef.current.emit('video_frame', { image: imageData });
        
        // Request next frame
        animationRef.current = requestAnimationFrame(captureFrame);
    };
    
    const resetApp = () => {
        setCurrentStep(0);
        setStepProgress(Array(STEPS_COUNT).fill(0));
        setTotalProgress(0);
        setCompleted(false);
        setTimer(TOTAL_DURATION);
    };
    
    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold text-center mb-6">
                Protocolo de Lavado de Manos
            </h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Main content */}
                <div className="w-full md:w-2/3">
                    {/* Video feed and progress */}
                    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Video display */}
                        <div className="relative">
                            <video 
                                ref={videoRef} 
                                className="w-full h-auto"
                                muted
                                playsInline
                            ></video>
                            
                            <canvas 
                                ref={canvasRef} 
                                className="hidden" // Hidden canvas for processing
                            ></canvas>
                            
                            {/* Overlay for incorrect step warning */}
                            {streamActive && !isCorrectStep && detectedStep !== -1 && (
                                <div className="absolute bottom-4 left-0 right-0 mx-auto w-4/5 bg-yellow-500 bg-opacity-80 text-white py-2 px-4 rounded-lg text-center">
                                    <p>Por favor realice el paso {currentStep + 1} correctamente</p>
                                </div>
                            )}
                            
                            {/* Completion overlay */}
                            {completed && (
                                <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-white p-8 rounded-lg shadow-lg">
                                        <h2 className="text-2xl font-bold text-green-600 text-center">
                                            ¡Lavado de manos exitoso!
                                        </h2>
                                    </div>
                                </div>
                            )}
                            
                            {/* Main timer */}
                            <div className="absolute top-4 right-4">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    <svg className="w-14 h-14 circle-progress">
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            fill="none"
                                            stroke="#e0e0e0"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            fill="none"
                                            stroke="#4CAF50"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeDasharray={`${totalProgress} 100`}
                                        />
                                    </svg>
                                    <div className="absolute text-sm font-bold">
                                        {formatTime(timer)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Steps indicators */}
                        <div className="px-4 py-6">
                            <div className="flex justify-between items-center">
                                {stepProgress.map((progress, index) => (
                                    <div 
                                        key={index}
                                        className={`step-indicator flex flex-col items-center ${
                                            currentStep === index ? 'step-active' : ''
                                        } ${
                                            progress >= 100 ? 'step-completed' : ''
                                        }`}
                                    >
                                        <div className="relative mb-2">
                                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center overflow-hidden ${
                                                currentStep === index ? 'border-blue-500' : 'border-gray-300'
                                            }`}>
                                                <img 
                                                    src={stepImages[index]} 
                                                    alt={`Paso ${index + 1}`}
                                                    className="w-10 h-10 object-contain"
                                                />
                                                
                                                {/* Progress circle */}
                                                <svg className="absolute w-16 h-16 circle-progress">
                                                    <circle
                                                        cx="32"
                                                        cy="32"
                                                        r="30"
                                                        fill="none"
                                                        stroke="transparent"
                                                        strokeWidth="4"
                                                    />
                                                    <circle
                                                        cx="32"
                                                        cy="32"
                                                        r="30"
                                                        fill="none"
                                                        stroke={progress >= 100 ? '#4CAF50' : '#3B82F6'}
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${progress} 100`}
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium">Paso {index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tips section */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-blue-600">Consejos para un lavado efectivo</h2>
                        
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Moje sus manos</h3>
                                    <p className="text-sm text-gray-600">Use agua corriente limpia y aplique jabón.</p>
                                </div>
                            </li>
                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Frote palma con palma</h3>
                                    <p className="text-sm text-gray-600">Asegúrese de cubrir todas las superficies.</p>
                                </div>
                            </li>
                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Palma contra dorso</h3>
                                    <p className="text-sm text-gray-600">Con los dedos entrelazados.</p>
                                </div>
                            </li>
                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Entre los dedos</h3>
                                    <p className="text-sm text-gray-600">Frote vigorosamente entre los dedos.</p>
                                </div>
                            </li>
                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">5</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Dorso de los dedos</h3>
                                    <p className="text-sm text-gray-600">Frote el dorso de los dedos.</p>
                                </div>
                            </li>
                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">6</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Enjuague y seque</h3>
                                    <p className="text-sm text-gray-600">Enjuague con agua limpia y seque con una toalla limpia.</p>
                                </div>
                            </li>
                        </ul>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-bold text-blue-700">Recuerde:</h3>
                            <p className="text-sm text-gray-700">Un correcto lavado de manos dura al menos 50 segundos y es la medida más efectiva para prevenir la transmisión de infecciones.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<HandWashingApp />, document.getElementById('root'));