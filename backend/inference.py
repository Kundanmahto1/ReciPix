from ultralytics import YOLO
import os
import google.generativeai as genai
from PIL import Image

class YOLOv8Inference:
    def __init__(self, model_path='yolov8m.pt', use_vision_api=True, use_food_model=True):
        self.use_vision_api = use_vision_api
        self.use_food_model = use_food_model
        
        # Check if Roboflow API key is available for food detection
        if self.use_food_model:
            rf_api_key = os.getenv('ROBOFLOW_API_KEY')
            if rf_api_key:
                print("Roboflow food ingredient detection API available")
                self.has_roboflow = True
            else:
                print("No ROBOFLOW_API_KEY found, food-specific detection disabled")
                self.use_food_model = False
                self.has_roboflow = False
        else:
            self.has_roboflow = False
        
        # Always load general YOLO as fallback
        print("Loading general YOLOv8 model as fallback...")
        self.model = YOLO(model_path)
        
        # Initialize Gemini Vision if API key is available
        if self.use_vision_api:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
                self.vision_model = genai.GenerativeModel('gemini-flash-lite-latest')
                print("Gemini Vision API initialized for better food detection")
            else:
                print("No GEMINI_API_KEY found, using YOLOv8 only")
                self.use_vision_api = False
    
    def _download_food_model(self, save_path):
        """This method is deprecated - we now use Roboflow serverless inference"""
        raise Exception("Food model download is deprecated. Use Roboflow serverless inference instead.")
    
    def _predict_with_roboflow(self, image_path):
        """Use Roboflow serverless inference for food ingredient detection"""
        try:
            from inference_sdk import InferenceHTTPClient
            
            rf_api_key = os.getenv('ROBOFLOW_API_KEY')
            if not rf_api_key:
                raise Exception("ROBOFLOW_API_KEY not found")
            
            client = InferenceHTTPClient(
                api_url="https://serverless.roboflow.com",
                api_key=rf_api_key
            )
            
            result = client.infer(image_path, model_id="food-ingredients-detection-nxe34/3")
            
            # Convert Roboflow format to our format
            detections = []
            if 'predictions' in result:
                for pred in result['predictions']:
                    detections.append({
                        "name": pred.get('class', 'unknown'),
                        "confidence": pred.get('confidence', 0.0),
                        "bbox": [
                            pred.get('x', 0) - pred.get('width', 0)/2,
                            pred.get('y', 0) - pred.get('height', 0)/2,
                            pred.get('x', 0) + pred.get('width', 0)/2,
                            pred.get('y', 0) + pred.get('height', 0)/2
                        ]
                    })
            
            print(f"Roboflow detected: {[d['name'] for d in detections]}")
            return detections
            
        except Exception as e:
            print(f"Roboflow inference error: {e}")
            raise
        
    def predict(self, image_path, conf_threshold=0.3):
        # Priority: Gemini Vision > Roboflow Food API > General YOLO
        if self.use_vision_api and hasattr(self, 'vision_model'):
            return self._predict_with_vision(image_path)
        elif self.has_roboflow:
            try:
                return self._predict_with_roboflow(image_path)
            except Exception as e:
                print(f"Roboflow failed, falling back to local YOLO: {e}")
                return self._predict_with_yolo(image_path, conf_threshold)
        else:
            return self._predict_with_yolo(image_path, conf_threshold)
    
    def _predict_with_vision(self, image_path):
        """Use Gemini Vision to directly identify food items"""
        try:
            img = Image.open(image_path)
            
            prompt = """Analyze this image and identify ALL food ingredients visible.
            Return ONLY a JSON array of objects with this exact structure:
            [{"name": "ingredient_name", "confidence": 0.95}]
            
            Rules:
            - Only list actual food ingredients (not utensils, plates, etc.)
            - Use common ingredient names (e.g., "potato" not "russet potato")
            - Confidence should be 0.7-0.99 based on visibility
            - Return empty array [] if no food is visible
            - DO NOT include any text before or after the JSON array"""
            
            response = self.vision_model.generate_content([prompt, img])
            text = response.text.strip()
            
            # Extract JSON from response
            import json
            import re
            
            # Try to find JSON array in response
            json_match = re.search(r'\[.*\]', text, re.DOTALL)
            if json_match:
                ingredients = json.loads(json_match.group())
                print(f"Vision API detected: {ingredients}")
                return ingredients
            else:
                print(f"Could not parse Vision API response: {text[:200]}")
                return self._predict_with_yolo(image_path, 0.3)
                
        except Exception as e:
            print(f"Vision API error: {e}, falling back to YOLOv8")
            return self._predict_with_yolo(image_path, 0.3)
    
    def _predict_with_yolo(self, image_path, conf_threshold):
        """YOLOv8 detection (food-specific or general)"""
        model_type = "food-specific" if self.use_food_model else "general"
        print(f"Using {model_type} YOLOv8 model for detection...")
        
        results = self.model(image_path, conf=conf_threshold)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Get confidence
                conf = float(box.conf[0])
                
                # Get class name
                cls = int(box.cls[0])
                name = self.model.names[cls]
                
                detections.append({
                    "name": name,
                    "confidence": conf,
                    "bbox": [x1, y1, x2, y2]
                })
                
        return detections

