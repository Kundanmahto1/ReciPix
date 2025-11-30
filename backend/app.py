import os
from dotenv import load_dotenv

# Load environment variables FIRST before other imports
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from inference import YOLOv8Inference
from recipe_engine import RecipeGenerator
import utils

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Lazy loading for models (initialized on first use)
yolo_model = None
recipe_generator = None

def get_yolo_model():
    global yolo_model
    if yolo_model is None:
        print("Loading YOLOv8 model...")
        yolo_model = YOLOv8Inference()
        print("YOLOv8 model loaded successfully")
    return yolo_model

def get_recipe_generator():
    global recipe_generator
    if recipe_generator is None:
        print("Initializing recipe generator...")
        recipe_generator = RecipeGenerator()
        print("Recipe generator initialized successfully")
    return recipe_generator

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "models_loaded": {
            "yolov8": yolo_model is not None,
            "ollama": recipe_generator is not None
        }
    })

@app.route('/api/detect', methods=['POST'])
def detect_food():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and utils.allowed_file(file.filename, ALLOWED_EXTENSIONS):
        # Save file temporarily
        filename = utils.secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Run inference with lazy loading
            model = get_yolo_model()
            detections = model.predict(filepath)
            return jsonify({
                "success": True,
                "detected_items": detections
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            # Clean up - optional, maybe keep for debugging or user choice
            # os.remove(filepath) 
            pass
            
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/generate-recipes', methods=['POST'])
def generate_recipes():
    data = request.json
    ingredients = data.get('ingredients', [])
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
        
    try:
        generator = get_recipe_generator()
        recipes = generator.generate(ingredients)
        return jsonify({
            "success": True,
            "recipes": recipes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
