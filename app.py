from flask import Flask, render_template, Response, jsonify
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64
import torch
import torchvision.transforms as transforms
from pathlib import Path
import json
import time

app = Flask(__name__, static_folder='static')
socketio = SocketIO(app, cors_allowed_origins="*")

# Model and device setup
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Define class names for hand washing steps
CLASS_NAMES = [
    "Wet hands", "Apply soap", "Rub palms", "Rub backs", "Rub fingers", "Rinse hands"
]

# Load model (reuse code from test_modelo.py)
def load_model(weights_path):
    try:
        # First try loading as a complete model
        model = torch.load(weights_path, map_location=device)
        print("Loaded complete model")
        
        # Move model to device and set to evaluation mode
        model = model.to(device)
        model.eval()
        
        return model
    except Exception as e:
        print(f"Error loading as complete model: {e}")
        print("Attempting to load with ultralytics...")
        
        # Try loading with ultralytics (for YOLO models)
        try:
            from ultralytics import YOLO
            model = YOLO(weights_path)
            print("Loaded model with ultralytics YOLO")
            return model
        except Exception as e:
            print(f"Error loading with ultralytics: {e}")
            
            # Try loading with torch hub
            try:
                model = torch.hub.load('ultralytics/yolov5', 'custom', path=weights_path)
                model.to(device)
                print("Loaded model with YOLOv5")
                return model
            except Exception as e:
                print(f"Error loading with torch hub: {e}")
                raise Exception("Failed to load model. Please check the model format.")

# Preprocess image for the model
def preprocess_image(img):
    # Resize to the input size expected by your model
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((640, 640)),  # Adjust size as needed
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Apply transformations
    img_tensor = transform(img)
    
    # Add batch dimension
    img_tensor = img_tensor.unsqueeze(0).to(device)
    
    return img_tensor

# Process predictions
def process_predictions(img, predictions, model_type="standard"):
    height, width = img.shape[:2]
    
    if model_type == "yolo":
        # For YOLO models loaded with ultralytics
        try:
            # Get results as dictionaries
            result = predictions[0].cpu().boxes.data.numpy()
            if len(result) > 0:
                # Just return the class with highest confidence
                class_indices = result[:, 1].astype(int)
                confidences = result[:, 4]
                max_conf_idx = np.argmax(confidences)
                class_id = class_indices[max_conf_idx]
                confidence = confidences[max_conf_idx]
                return class_id, confidence
            return None, 0
        except:
            try:
                # For YOLOv5 models
                result = predictions.xyxy[0].cpu().numpy()
                if len(result) > 0:
                    # Return the class with highest confidence
                    class_indices = result[:, 5].astype(int)
                    confidences = result[:, 4]
                    max_conf_idx = np.argmax(confidences)
                    class_id = class_indices[max_conf_idx]
                    confidence = confidences[max_conf_idx]
                    return class_id, confidence
                return None, 0
            except:
                print("Error processing YOLO predictions")
                return None, 0
    
    # Standard processing for PyTorch models
    if isinstance(predictions, torch.Tensor):
        preds = predictions.cpu().detach().numpy()
        # Assuming predictions are class probabilities
        if len(preds.shape) > 1 and preds.shape[1] >= len(CLASS_NAMES):
            class_id = np.argmax(preds[0])
            confidence = preds[0][class_id]
            return class_id, confidence
    
    return None, 0

# Load the model
weights_path = 'weights.pt'
model = load_model(weights_path)

# Determine model type
model_type = "standard"
if hasattr(model, 'predict') or str(type(model)).find('YOLO') != -1:
    model_type = "yolo"
print(f"Detected model type: {model_type}")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('video_frame')
def handle_video_frame(data):
    try:
        # Decode base64 image
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Run inference
        if model_type == "yolo":
            # Resize frame for better performance
            input_frame = cv2.resize(frame, (640, 640))
            
            # Run inference
            if hasattr(model, 'predict'):
                predictions = model.predict(input_frame)
            else:
                predictions = model(input_frame)
            
            # Process predictions
            class_id, confidence = process_predictions(frame, predictions, model_type)
        else:
            # Preprocess the frame
            img_tensor = preprocess_image(frame)
            
            # Run inference
            with torch.no_grad():
                predictions = model(img_tensor)
            
            # Process predictions
            class_id, confidence = process_predictions(frame, predictions, model_type)
        
        # Send result back to client
        if class_id is not None and confidence > 0.5:  # Adjust confidence threshold as needed
            step_name = CLASS_NAMES[class_id] if class_id < len(CLASS_NAMES) else f"Class {class_id}"
            emit('prediction_result', {'step': class_id, 'step_name': step_name, 'confidence': float(confidence)})
        else:
            emit('prediction_result', {'step': -1, 'step_name': 'No step detected', 'confidence': 0})
    
    except Exception as e:
        print(f"Error processing frame: {e}")
        emit('prediction_result', {'step': -1, 'step_name': 'Error', 'confidence': 0})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)