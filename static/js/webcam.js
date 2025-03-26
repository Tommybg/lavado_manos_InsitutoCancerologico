/**
 * Webcam management and initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cameraFeed = document.getElementById('camera-feed');
    const noCamera = document.getElementById('no-camera');
    const btnTryAgain = document.getElementById('btn-try-again');
    
    // Check if the browser supports getUserMedia
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    
    // Initialize the webcam
    function initializeWebcam() {
        if (hasGetUserMedia()) {
            // The video feed is handled by the Flask backend
            // Just check if the feed is working correctly
            const img = cameraFeed.querySelector('img');
            
            // Check if the image is loading properly
            img.onerror = function() {
                console.error('Error loading webcam feed');
                showCameraError();
            };
            
            img.onload = function() {
                // Hide the error message if the image loads
                noCamera.style.display = 'none';
                cameraFeed.style.display = 'block';
                
                // Notify the handwashing module that the camera is ready
                document.dispatchEvent(new CustomEvent('cameraReady'));
            };
        } else {
            console.error('getUserMedia not supported');
            showCameraError();
        }
    }
    
    // Display camera error UI
    function showCameraError() {
        cameraFeed.style.display = 'none';
        noCamera.style.display = 'block';
    }
    
    // Try again button event listener
    if (btnTryAgain) {
        btnTryAgain.addEventListener('click', function() {
            initializeWebcam();
        });
    }
    
    // Initialize webcam on page load
    initializeWebcam();
    
    // Add fullscreen toggle functionality
    const fullscreenToggle = document.querySelector('.toggle-fullscreen button');
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
});
