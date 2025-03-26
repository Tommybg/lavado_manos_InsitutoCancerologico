import asyncio
import websockets
import json
import torch
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

# Import necessary modules for model reconstruction
from ultralytics import YOLO

# Load full model directly from .pt file
model = YOLO("weights.pt")
model.fuse()
model.eval()

# Class names for hand washing steps
CLASS_NAMES = [
    "Palma con palma",
    "Entre los dedos",
    "Dorso de las manos",
    "Base de los pulgares",
    "Uñas y yemas",
    "Uñas en palma"
]

def process_frame(frame_data):
    try:
        # Convert base64 image to numpy array
        image_data = base64.b64decode(frame_data.split(',')[1])
        image = Image.open(BytesIO(image_data))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Preprocess the frame
        frame = cv2.resize(frame, (640, 640))
        frame = torch.from_numpy(frame).float().permute(2, 0, 1) / 255.0
        frame = frame.unsqueeze(0)
        
        # Run inference
        with torch.no_grad():
            predictions = model(frame)
        
        # Get the predicted class
        predicted_class = torch.argmax(predictions).item()
        
        return CLASS_NAMES[predicted_class]
    except Exception as e:
        print(f"Error processing frame: {e}")
        return None

async def handle_websocket(websocket, path):
    origin = websocket.request_headers.get("Origin")
    print(f"Connection from origin: {origin}")

    try:
        async for message in websocket:
            data = json.loads(message)
            frame_data = data.get('frame')

            if frame_data:
                # Process the frame and get predictions
                predicted_step = process_frame(frame_data)

                if predicted_step:
                    # Send back the prediction
                    await websocket.send(json.dumps({
                        'step': predicted_step
                    }))
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket connection closed.")
    except Exception as e:
        print(f"Error in websocket handler: {e}")

async def main():
    async with websockets.serve(handle_websocket, "localhost", 8000):
        print("WebSocket server started on ws://localhost:8000")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())