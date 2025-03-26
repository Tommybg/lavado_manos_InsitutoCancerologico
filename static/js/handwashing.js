/**
 * Hand washing detection and progress tracking
 */
document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const REQUIRED_TIME_PER_STEP = 7; // seconds
    const TOTAL_STEPS = 6;
    const POLLING_INTERVAL = 200; // ms
    
    // Elements
    const progressBar = document.getElementById('progress-bar').querySelector('.progress-bar');
    const timerCircle = document.getElementById('timer-circle');
    const timerPercentage = document.getElementById('timer-percentage');
    const stepItems = document.querySelectorAll('.step-item');
    const alertContainer = document.getElementById('alert-container');
    const instructionsContent = document.getElementById('instructions-content');
    const completionModal = new bootstrap.Modal(document.getElementById('completion-modal'), {
        backdrop: 'static',
        keyboard: false
    });
    const totalTimeElement = document.getElementById('total-time');
    const startButton = document.getElementById('iniciar-lavado');
    
    // State
    let currentStep = 0;
    let timeInStep = 0;
    let completionPercentage = 0;
    let isComplete = false;
    let isProcessStarted = false;
    let startTime = null;
    let pollingInterval = null;
    
    // Step instructions text
    const stepInstructions = [
        "Frótese las palmas de las manos entre sí.",
        "Frótese la palma de la mano derecha contra el dorso de la mano izquierda entrelazando los dedos y viceversa.",
        "Frótese las palmas de las manos entre sí, con los dedos entrelazados.",
        "Frótese el dorso de los dedos de una mano con la palma de la mano opuesta, agarrándose los dedos.",
        "Frótese con un movimiento de rotación el pulgar izquierdo, atrapándolo con la palma de la mano derecha y viceversa.",
        "Frótese la punta de los dedos de la mano derecha contra la palma de la mano izquierda, haciendo un movimiento de rotación y viceversa."
    ];
    
    // Initialize
    function init() {
        updateUI();
        
        // Add event listener for camera ready event
        document.addEventListener('cameraReady', function() {
            showAlert('info', 'Cámara lista', 'Coloque sus manos frente a la cámara para iniciar el proceso de detección.');
        });
        
        // Start button event listener
        startButton.addEventListener('click', function() {
            if (!isProcessStarted) {
                startProcess();
            } else {
                resetProcess();
            }
        });
    }
    
    // Start the hand washing process
    function startProcess() {
        isProcessStarted = true;
        startTime = Date.now();
        startButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i> Reiniciar';
        showAlert('info', 'Proceso iniciado', 'El sistema está detectando sus manos. Siga las instrucciones en pantalla.');
        
        // Start polling for step detection
        pollingInterval = setInterval(pollStepDetection, POLLING_INTERVAL);
    }
    
    // Reset the process
    function resetProcess() {
        clearInterval(pollingInterval);
        
        // Reset server state via API
        fetch('/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reset successful:', data);
            
            // Reset UI state
            currentStep = 0;
            timeInStep = 0;
            completionPercentage = 0;
            isComplete = false;
            isProcessStarted = false;
            startTime = null;
            
            // Update UI
            updateUI();
            
            // Clear alerts
            alertContainer.innerHTML = '';
            
            // Reset button text
            startButton.innerHTML = '<i class="fas fa-play me-2"></i> Iniciar Lavado';
            
            // Show reset notification
            showAlert('info', 'Proceso reiniciado', 'El sistema ha sido reiniciado. Listo para comenzar un nuevo lavado de manos.');
        })
        .catch(error => {
            console.error('Error resetting process:', error);
            showAlert('danger', 'Error', 'No se pudo reiniciar el proceso. Intente recargar la página.');
        });
    }
    
    // Poll the server for step detection updates
    function pollStepDetection() {
        fetch('/detect_step', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update state from server response
            const previousStep = currentStep;
            currentStep = data.current_step;
            timeInStep = data.time_in_step;
            completionPercentage = data.completion_percentage;
            isComplete = data.is_complete;
            
            // Check if step changed
            if (previousStep !== currentStep) {
                onStepChange(previousStep, currentStep);
            }
            
            // Update UI with new state
            updateUI();
            
            // Check for completion
            if (isComplete && !document.getElementById('completion-modal').classList.contains('show')) {
                onCompletion();
            }
        })
        .catch(error => {
            console.error('Error polling step detection:', error);
        });
    }
    
    // Handle step change
    function onStepChange(oldStep, newStep) {
        // Show alert for new step
        if (newStep < TOTAL_STEPS) {
            showAlert('info', `Paso ${newStep + 1}`, stepInstructions[newStep]);
            
            // Update instructions
            instructionsContent.innerHTML = `
                <h5>Paso ${newStep + 1}: ${stepItems[newStep].querySelector('.step-text').textContent.substring(3)}</h5>
                <p>${stepInstructions[newStep]}</p>
                <p>Mantenga esta posición durante ${REQUIRED_TIME_PER_STEP} segundos.</p>
            `;
            
            // Add completion class to previous step
            if (oldStep >= 0 && oldStep < TOTAL_STEPS) {
                stepItems[oldStep].classList.add('completed');
            }
            
            // Add highlight animation to current step
            stepItems.forEach(item => item.classList.remove('active', 'step-highlight'));
            stepItems[newStep].classList.add('active', 'step-highlight');
        }
    }
    
    // Handle completion of all steps
    function onCompletion() {
        clearInterval(pollingInterval);
        
        // Calculate total time
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        totalTimeElement.textContent = totalTime;
        
        // Show completion modal
        completionModal.show();
        
        // Mark all steps as completed
        stepItems.forEach(item => {
            item.classList.add('completed');
            item.classList.remove('active');
        });
        
        // Show success alert
        showAlert('success', '¡Proceso completado!', 'Ha completado correctamente todos los pasos del lavado de manos.');
        
        // Reset button text
        startButton.innerHTML = '<i class="fas fa-play me-2"></i> Iniciar Nuevo Lavado';
        isProcessStarted = false;
    }
    
    // Update UI based on current state
    function updateUI() {
        // Update progress bar
        progressBar.style.width = `${completionPercentage}%`;
        progressBar.setAttribute('aria-valuenow', completionPercentage);
        progressBar.textContent = `${Math.round(completionPercentage)}%`;
        
        // Update timer circle
        if (currentStep < TOTAL_STEPS) {
            const stepProgress = Math.min(timeInStep / REQUIRED_TIME_PER_STEP, 1) * 100;
            timerPercentage.textContent = `${Math.round(stepProgress)}%`;
            
            // Update timer circle visual
            const degrees = stepProgress * 3.6; // Convert percentage to degrees (100% = 360 degrees)
            let transformValue = 'rotate(0deg)';
            
            if (degrees <= 180) {
                transformValue = `rotate(${degrees}deg)`;
            } else {
                transformValue = `rotate(${degrees}deg)`;
                // For >180 degrees, we need to adjust the display
                timerCircle.style.borderTopColor = '#28a745';
                timerCircle.style.borderRightColor = '#28a745';
                timerCircle.style.borderBottomColor = '#28a745';
                timerCircle.style.borderLeftColor = degrees >= 270 ? '#28a745' : 'transparent';
            }
            
            timerCircle.style.transform = transformValue;
        } else {
            // If all steps are complete
            timerPercentage.textContent = '100%';
            timerCircle.style.borderColor = '#28a745';
        }
        
        // Update step indicators
        stepItems.forEach((item, index) => {
            if (index < currentStep) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (index === currentStep) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
    }
    
    // Show an alert message
    function showAlert(type, title, message) {
        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                <strong>${title}</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
        
        // Auto-remove alert after 5 seconds
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }
        }, 5000);
    }
    
    // Initialize when DOM is ready
    init();
});
