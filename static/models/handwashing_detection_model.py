import cv2
import numpy as np
import torch
import logging
import time

logger = logging.getLogger(__name__)

class HandWashingDetector:
    """
    Detector for the 6 WHO hand washing steps using PyTorch.
    """
    def __init__(self, required_time_per_step=7):
        """
        Initialize the hand washing step detector.
        
        Args:
            required_time_per_step: Required time (in seconds) to complete each step
        """
        self.required_time_per_step = required_time_per_step
        self.steps = [
            "Palma con palma",
            "Palma sobre dorso",
            "Entre los dedos",
            "El Cepillado",
            "Pulgares",
            "Uñas y yemas"
        ]
        
        # Current state
        self.current_step = 0
        self.step_start_time = None
        self.step_completed = [False] * len(self.steps)
        
        logger.info("Initializing hand washing detection model")
        
        # In a real implementation, we would load a pre-trained model:
        # self.model = torch.hub.load('custom/repository', 'handwashing_model')
        
        # For this example, we'll use a mock model
        self.model = MockHandWashingModel()
        
        logger.info("Hand washing detector initialized successfully")
    
    def detect_step(self, frame):
        """
        Detect the current hand washing step in the given frame.
        
        Args:
            frame: The video frame to analyze
            
        Returns:
            tuple: (step result dictionary, processed frame with annotations)
        """
        try:
            # Process the frame
            processed_frame = frame.copy()
            
            # Perform step detection
            step_id, confidence = self.model.detect_step(processed_frame)
            
            # Update state based on detection
            current_time = time.time()
            
            # If we detect a new step, update the state
            if step_id != self.current_step and confidence > 0.7:
                if self.current_step == step_id - 1:  # Only advance to next step in sequence
                    self.current_step = step_id
                    self.step_start_time = current_time
            
            # Track time in the current step
            time_in_step = 0
            if self.step_start_time is not None:
                time_in_step = current_time - self.step_start_time
                
                # Mark step as completed if enough time has passed
                if time_in_step >= self.required_time_per_step and not self.step_completed[self.current_step]:
                    self.step_completed[self.current_step] = True
                    
                    # Auto-advance to next step if current step is completed
                    if self.current_step < len(self.steps) - 1:
                        self.current_step += 1
                        self.step_start_time = current_time
            
            # Draw step information on the frame
            step_name = self.steps[self.current_step] if self.current_step < len(self.steps) else "Complete"
            cv2.putText(processed_frame, f"Step {self.current_step + 1}: {step_name}", 
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Draw time progress
            if self.step_start_time is not None:
                progress = min(time_in_step / self.required_time_per_step, 1.0)
                bar_width = int(200 * progress)
                cv2.rectangle(processed_frame, (10, 50), (10 + bar_width, 70), (0, 255, 0), -1)
                cv2.rectangle(processed_frame, (10, 50), (210, 70), (255, 255, 255), 2)
                cv2.putText(processed_frame, f"{time_in_step:.1f}s / {self.required_time_per_step}s", 
                            (220, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Prepare the result
            result = {
                'current_step': self.current_step,
                'step_name': step_name,
                'time_in_step': time_in_step,
                'required_time': self.required_time_per_step,
                'completed': self.is_complete()
            }
            
            return result, processed_frame
        
        except Exception as e:
            logger.error(f"Error in step detection: {str(e)}")
            return {'error': str(e)}, frame
    
    def get_current_step(self):
        """Get the current step number (0-based index)"""
        return self.current_step
    
    def get_time_in_step(self):
        """Get the time spent in the current step"""
        if self.step_start_time is None:
            return 0
        return time.time() - self.step_start_time
    
    def get_completion_percentage(self):
        """Get the overall completion percentage"""
        if self.is_complete():
            return 100
        
        completed_steps = sum(1 for step in self.step_completed if step)
        current_step_progress = min(self.get_time_in_step() / self.required_time_per_step, 1.0)
        
        return (completed_steps + current_step_progress) / len(self.steps) * 100
    
    def is_complete(self):
        """Check if all steps are completed"""
        return all(self.step_completed)
    
    def reset(self):
        """Reset the detection state"""
        self.current_step = 0
        self.step_start_time = None
        self.step_completed = [False] * len(self.steps)


class MockHandWashingModel:
    """
    Mock hand washing step detection model for demonstration purposes.
    In a real implementation, this would be replaced with a proper PyTorch model.
    """
    def __init__(self):
        """Initialize the mock model"""
        self.last_step = -1
        self.step_change_time = time.time()
        
    def detect_step(self, frame):
        """
        Detect the hand washing step from the frame.
        
        Args:
            frame: Input video frame
            
        Returns:
            tuple: (step id (0-5), confidence score)
        """
        # For the mock, we'll cycle through steps
        current_time = time.time()
        
        # Cycle to a new step every 10 seconds for the demo
        if current_time - self.step_change_time > 10:
            self.last_step = (self.last_step + 1) % 6
            self.step_change_time = current_time
        
        # Return the current mock step with high confidence
        return self.last_step, 0.95
