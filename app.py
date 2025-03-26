import os
import logging
from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
import torch
from static.models.hand_detection import HandDetector
from static.models.handwashing_detection_model import HandWashingDetector

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

# Initialize the hand detector
hand_detector = HandDetector()

# Initialize the hand washing step detector
handwashing_detector = HandWashingDetector()

# Initialize webcam
camera = None

def get_camera():
    global camera
    if camera is None:
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    return camera

def release_camera():
    global camera
    if camera is not None:
        camera.release()
        camera = None

def generate_frames():
    camera = get_camera()
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Flip horizontally for a mirror effect
            frame = cv2.flip(frame, 1)
            
            # Process frame for hand detection
            hands_detected, processed_frame = hand_detector.detect_hands(frame)
            
            # If hands are detected, run the hand washing step detection
            if hands_detected:
                step_result, processed_frame = handwashing_detector.detect_step(processed_frame)
                # Add step result to the frame if needed
            
            # Encode the frame to JPEG format
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            frame_bytes = buffer.tobytes()
            
            # Yield the frame in the format expected by the browser
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect_step', methods=['POST'])
def detect_step():
    # This endpoint can be used to get the current detection step via AJAX
    current_step = handwashing_detector.get_current_step()
    time_in_step = handwashing_detector.get_time_in_step()
    completion_percentage = handwashing_detector.get_completion_percentage()
    
    return jsonify({
        'current_step': current_step,
        'time_in_step': time_in_step,
        'completion_percentage': completion_percentage,
        'is_complete': handwashing_detector.is_complete()
    })

@app.route('/reset', methods=['POST'])
def reset():
    # Reset the detection process
    handwashing_detector.reset()
    return jsonify({'status': 'success'})

# Clean up resources when the application exits
@app.teardown_appcontext
def teardown(exception):
    release_camera()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
