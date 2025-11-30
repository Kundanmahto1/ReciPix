# AI Food Recipe Suggester MVP - Product Requirements Document

## Document Information
- **Product Name:** AI Food Recipe Suggester (MVP)
- **Document Version:** 2.0
- **Last Updated:** November 2024
- **Document Type:** MVP Product Requirements Document (PRD)
- **Deployment Mode:** Local-only with Pre-trained Models

---

## 1. Executive Summary

The AI Food Recipe Suggester MVP is a locally-deployed intelligent application designed to detect food items from images and generate recipe suggestions. This MVP operates entirely on the user's machine using pre-trained computer vision models and a local language model, eliminating dependency on cloud APIs and ensuring complete data privacy.

The MVP prioritizes core functionality: accurate food detection using state-of-the-art pre-trained models and intelligent recipe generation using local LLM inference, creating a seamless, privacy-first user experience without external service dependencies.

---

## 2. MVP Vision & Scope

### 2.1 MVP Goals
- Deliver core food detection functionality using pre-trained models
- Generate contextual recipes locally without cloud dependencies
- Ensure 100% data privacy with local-only processing
- Minimize latency with optimized model inference
- Create a solid foundation for future enhancements

### 2.2 What's Included in MVP
- Local food detection using pre-trained YOLOv8 or EfficientDet model
- Local recipe generation using Ollama + open-source LLM
- Web-based UI for image upload and recipe display
- Support for images: JPG, PNG, WEBP
- Ingredient list management and recipe filtering
- Complete offline functionality

### 2.3 What's NOT Included in MVP
- Cloud API integration (Google Vision, Anthropic Claude)
- User authentication and accounts
- Database for recipe storage
- Recipe saving/favorites
- Multi-language support
- Mobile applications
- Social sharing features
- Nutritional analysis
- Advanced filtering (dietary restrictions, cuisine type)

---

## 3. Problem Statement & Solution

### 3.1 Problem
- Users lack a private, offline solution for food detection and recipe generation
- Existing solutions rely on cloud services and expose user data
- Offline solutions are difficult to deploy and configure
- There is no local, lightweight food recognition system integrated with recipe generation

### 3.2 Solution
The MVP provides a completely local solution combining:
- **Pre-trained YOLOv8 object detection model** for food recognition
- **Local LLM (via Ollama)** for intelligent recipe generation
- **Lightweight web interface** for ease of use
- **Privacy-first architecture** with zero external API calls

### 3.3 Target Users (MVP)
- Privacy-conscious users and developers
- Users without internet connectivity
- Developers looking to self-host food detection systems
- Organizations requiring data-on-device processing
- Early adopters willing to trade cloud convenience for privacy

---

## 4. Core Architecture: Local Pre-trained Models

### 4.1 Food Detection Model

#### Selected Model: YOLOv8-Medium (Recommended)
**Why YOLOv8?**
- State-of-the-art object detection accuracy
- Fast inference on CPU/GPU
- Pre-trained on COCO dataset with food categories
- Lightweight (~52 MB) for local deployment
- Easy integration with Python
- Strong community support

**Model Specifications:**
```
Model: YOLOv8m (Medium variant)
Framework: PyTorch
Pre-trained on: COCO dataset (includes 90+ categories, multiple food items)
Model Size: ~52 MB
Inference Speed: ~30-50ms on GPU, ~200-300ms on CPU
Accuracy: mAP 0.5:0.95 = 0.82 on COCO
Input: 640x640 RGB images
Output: Bounding boxes with confidence scores and class labels
```

**Alternative Models (Fallback Options):**
1. **YOLOv8-Small** (~28 MB) - For resource-constrained devices
2. **EfficientDet-D1** (~40 MB) - Better accuracy on small objects
3. **Faster R-CNN** (~168 MB) - Higher accuracy but slower inference

**Food Detection Categories from COCO:**
- Vegetables: carrot, broccoli, potato, tomato, onion, mushroom
- Fruits: apple, banana, orange, strawberry, sandwich
- Proteins: hot dog, pizza, cake, donut, tie
- Prepared foods: pizza, sandwich, hot dog, cake, donut
- Beverages: cup, wine glass, bottle, bowl
- Condiments: spoon, fork, knife, plate

**Fine-tuning Datasets (For Future Enhancement):**
If accuracy needs improvement, models can be fine-tuned on:
1. **Food-101 Dataset** - 101 food categories, 101,000 images
2. **AIFood Dataset** - Food image classification dataset
3. **Ingredients101** - Ingredient-specific food recognition
4. **FoodSeg103** - Food segmentation with 103 food classes
5. **UNIMIB2016** - Food image segmentation

### 4.2 Local Language Model for Recipe Generation

#### Selected Model: Ollama + Mistral-7B or Llama-2 (7B)
**Why Ollama?**
- Easy one-command deployment of local LLMs
- No GPU required (works on CPU)
- Pre-quantized models for memory efficiency
- Simple Python integration
- Growing community and model library

**Model Specifications:**

**Option 1: Mistral-7B (Recommended)**
```
Model: Mistral-7B
Framework: Ollama-compatible
Model Size: ~4 GB (quantized Q4_K_M)
Memory Required: 8 GB RAM minimum (can work with 6 GB)
Inference Speed: ~50-100 tokens/second on CPU
Inference Speed: ~200-400 tokens/second on GPU
Accuracy: Better reasoning than Llama-2
License: Apache 2.0
```

**Option 2: Llama-2-7B (Alternative)**
```
Model: Llama-2-7B
Framework: Ollama-compatible
Model Size: ~4 GB (quantized Q4_K_M)
Memory Required: 8 GB RAM minimum
Inference Speed: ~30-80 tokens/second on CPU
License: Llama 2 Community License
```

**Model Quantization Levels Available:**
- Q4_K_M (Default): 4-bit quantization, ~4GB, recommended
- Q5_K_M: 5-bit quantization, ~5GB, better quality
- Q8_0: 8-bit quantization, ~7GB, highest quality
- Full precision (Not recommended for local deployment)

### 4.3 Pre-trained Model Selection Criteria Met
✓ Accuracy: >80% for food detection
✓ Speed: <500ms inference on CPU
✓ Size: <5GB combined footprint
✓ License: Open-source, free to use
✓ Privacy: 100% local processing
✓ Community: Active support and documentation
✓ Deployment: Easy setup with minimal configuration

---

## 5. Functional Requirements (MVP Core)

### 5.1 Local Image Upload & Processing

**Requirement:** Users upload food images for local analysis

**Detailed Specifications:**
- Support formats: JPG, PNG, WEBP
- Maximum file size: 25 MB
- Drag-and-drop upload interface
- File browser selection
- Image preview before processing
- Local processing with progress indicator
- Error handling with clear messages
- No data sent to external services
- Images deleted after processing or stored locally only

**Processing Flow:**
1. User uploads image locally
2. Image validated on client-side
3. Sent to backend for local processing
4. YOLOv8 model inference on local machine
5. Results returned to frontend
6. Image optionally saved locally or deleted

**Acceptance Criteria:**
- Upload completes and processing starts within 2 seconds
- Files larger than 25MB rejected with error message
- Visual feedback during processing
- Results displayed within 5 seconds on average hardware
- No network calls or external API requests

### 5.2 Local Food Detection with Pre-trained YOLOv8

**Requirement:** Accurately detect food items using pre-trained model

**Detailed Specifications:**
- Use YOLOv8-Medium pre-trained model
- Process at 640x640 resolution
- Confidence threshold: 50% minimum
- Return top 15 detected items by confidence
- Show bounding boxes on image with labels
- Display confidence scores as percentages
- Allow manual selection/deselection of detected items
- Fallback to 3 default recipes if detection fails

**Food Detection Output:**
```
{
  "detected_items": [
    {
      "name": "Potato",
      "confidence": 0.94,
      "bbox": [x1, y1, x2, y2]
    },
    {
      "name": "Bread",
      "confidence": 0.87,
      "bbox": [x1, y1, x2, y2]
    }
  ],
  "processing_time_ms": 187,
  "model_used": "YOLOv8m",
  "image_resolution": "640x640"
}
```

**Supported Food Categories (MVP):**
- Vegetables: Carrot, Broccoli, Potato, Tomato, Onion, Mushroom, Lettuce, Cucumber, Bell Pepper
- Fruits: Apple, Banana, Orange, Strawberry, Lemon, Lime
- Proteins: Chicken, Beef, Pork, Fish, Hot Dog, Sandwich
- Dairy: Cheese, Milk, Yogurt, Butter, Egg
- Grains & Bread: Bread, Rice, Pasta, Donut, Cake
- Prepared Foods: Pizza, Sandwich, Hot Dog, Salad, Bowl

**Acceptance Criteria:**
- Detects 80%+ of visible food items accurately
- Confidence scores align with detection accuracy
- Processing time <500ms on standard CPU
- Zero network requests during detection
- Handles poor lighting/angles gracefully

### 5.3 Local Recipe Generation with Ollama

**Requirement:** Generate contextual recipes using local LLM

**Detailed Specifications:**
- Use Ollama with Mistral-7B or Llama-2 model
- Inference runs locally on user's machine
- Generate 3 recipes per detected ingredient set
- Each recipe includes:
  - Recipe name
  - Brief description
  - Cooking time
  - Servings
  - Difficulty level
  - Ingredients list
  - Step-by-step instructions
- Optimize prompts for 7B model size
- Cache common recipe patterns
- Timeout: 60 seconds max generation time

**Recipe Generation Prompt Template:**
```
Generate 3 creative recipes using these ingredients: [INGREDIENTS]

For each recipe, provide ONLY valid JSON with this structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "One sentence description",
      "time": "XX mins",
      "servings": 2-4,
      "difficulty": "Easy",
      "ingredients": ["item1", "item2"],
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}

Constraints:
- Use detected ingredients as primary components
- Include 1-2 pantry staples if needed
- Make recipes feasible for average home cooks
- Ensure varied cuisines and cooking methods
```

**Recipe Generation Output:**
```json
{
  "recipes": [
    {
      "name": "Garlic Butter Toast",
      "description": "Crispy bread with aromatic garlic butter and herbs",
      "time": "10 mins",
      "servings": 2,
      "difficulty": "Easy",
      "ingredients": ["Bread", "Butter", "Garlic"],
      "steps": [
        "Toast bread slices until golden",
        "Mix softened butter with minced garlic",
        "Spread on warm toast and serve"
      ]
    }
  ],
  "generation_time_ms": 4500,
  "model_used": "mistral-7b",
  "tokens_generated": 187
}
```

**Recipe Quality Standards:**
- All 3 recipes generated successfully
- JSON format valid and parseable
- Instructions clear and actionable
- 60%+ of detected ingredients utilized
- Generation time <60 seconds

**Acceptance Criteria:**
- Zero network requests during generation
- Recipes are creative and practical
- JSON parsing success rate >95%
- All recipes complete with required fields
- Graceful timeout handling if generation exceeds 60s

### 5.4 Recipe Display & Interaction (MVP)

**Requirement:** Display recipes in clean, usable interface

**Detailed Specifications:**
- Recipe list sidebar showing all generated recipes
- Main content area with recipe details
- Color-coded difficulty levels
- Icons for time and servings
- Numbered step-by-step instructions
- Ingredient checklist functionality
- Copy ingredients to clipboard
- Print recipe functionality
- Search/filter recipes (basic filtering)

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Recipe Suggester (Local)                          │
├──────────────────┬────────────────────────────────┤
│  Detected Items  │  Recipe Details                │
│  ✓ Potato (94%)  │  Garlic Butter Toast          │
│  ✓ Bread (87%)   │  Crispy bread with garlic...  │
│  ○ Butter        │                                │
│                  │  ⏱ 10 mins | 👥 2 | Easy     │
│  [Generate]      │                                │
│  [New Upload]    │  Ingredients:                  │
├──────────────────┤  ☐ Bread                       │
│ Recipe List      │  ☐ Butter                      │
│                  │  ☐ Garlic                      │
│ 1. Garlic Toast  │                                │
│ 2. Potato Bread  │  Instructions:                 │
│ 3. Creamy Soup   │  1. Toast bread slices...     │
│                  │  2. Mix butter with garlic... │
│                  │  3. Spread and serve           │
│                  │                                │
│                  │  [Print] [Copy] [Share]       │
└──────────────────┴────────────────────────────────┘
```

**Acceptance Criteria:**
- All recipes display correctly
- Interface responsive on different screen sizes
- Print output is properly formatted
- Easy navigation between recipes
- Ingredient checklist functional

### 5.5 System Requirements & Performance

**Minimum System Requirements (MVP):**
```
CPU: Intel i5 / AMD Ryzen 5 or equivalent
RAM: 8 GB minimum (16 GB recommended)
Storage: 10 GB free space (5GB models + OS + app)
GPU: Optional (significant speedup if available)
OS: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
Internet: Not required for processing
```

**Performance Targets (MVP):**
- Food detection: <500ms on CPU, <100ms on GPU
- Recipe generation: <60s total (Mistral-7B on CPU)
- App startup: <5 seconds
- UI responsiveness: <100ms for all interactions
- Memory usage: <6GB peak during processing

**Hardware-Specific Performance:**

| Hardware | YOLOv8 Detection | Recipe Generation | Total Time |
|----------|------------------|-------------------|-----------|
| CPU Only (i5) | 250ms | 45s | ~46s |
| CPU (i7) | 180ms | 30s | ~31s |
| GPU (RTX 3060) | 50ms | 8s | ~9s |
| GPU (RTX 4090) | 30ms | 3s | ~4s |

---

## 6. Technical Architecture (Local-Only)

### 6.1 System Architecture

```
┌─────────────────────────────────────────────────────┐
│           React Frontend (Vite)                     │
│  ┌────────────────┬────────────────────────────┐  │
│  │  Upload Page   │  Recipe Display Page       │  │
│  └────────────────┴────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ REST API (Local)
                      ▼
┌─────────────────────────────────────────────────────┐
│       Flask Backend (Local Processing)              │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Routes                                  │  │
│  │  • POST /api/detect (local YOLOv8)          │  │
│  │  • POST /api/generate-recipes (local LLM)   │  │
│  │  • GET /api/health                          │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Model Loaders                               │  │
│  │  • YOLOv8 Model Loader (inference.py)       │  │
│  │  • Ollama Integration (recipe_engine.py)    │  │
│  │  • Image Processing (utils.py)              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           │                      │
     ┌─────▼─────────┐    ┌───────▼──────────┐
     │ YOLOv8m Model │    │  Ollama Server   │
     │ (Local PyTorch)    │  (Running locally)
     │ • 52 MB        │    │  • Mistral-7B    │
     │ • COCO trained │    │  • 4 GB RAM      │
     │ • Real-time    │    │  • Low latency   │
     └────────────────┘    └──────────────────┘
```

### 6.2 Backend Stack

**Framework:** Flask 2.3+
**Language:** Python 3.9+
**Local Model Integration:**
- YOLOv8 via `ultralytics` library
- Ollama Python client for LLM inference
- PyTorch for model inference

**Key Dependencies:**
```python
# requirements.txt
Flask==2.3.2
Flask-CORS==4.0.0
python-dotenv==1.0.0
ultralytics==8.0.200  # YOLOv8
torch==2.0.1
torchvision==0.15.2
Pillow==10.0.0
opencv-python==4.8.1
numpy==1.24.3
requests==2.31.0
ollama==0.0.11  # Ollama Python client
```

### 6.3 Frontend Stack

**Framework:** React 18+
**Build Tool:** Vite 4+
**Styling:** Tailwind CSS
**HTTP Client:** Axios
**Icons:** Lucide React

### 6.4 Model Deployment Strategy

**Model Initialization (On First Run):**
1. Check if YOLOv8m exists locally
2. If not, download and cache (~52 MB)
3. Check if Ollama is running
4. If not, prompt user to start Ollama
5. Pull Mistral-7B model via Ollama (~4 GB)
6. Cache models in `.models/` directory

**Model Storage:**
```
project_root/
├── .models/
│   ├── yolov8m.pt  (52 MB)
│   └── ollama/     (managed by Ollama)
├── backend/
├── frontend/
└── ...
```

---

## 7. Pre-trained Model Specifications

### 7.1 YOLOv8 Model Details

**Model Card:**
```
Name: YOLOv8m (Medium)
Architecture: Ultralytics YOLOv8
Pre-training Dataset: COCO 2017 (80 classes)
Framework: PyTorch
Model Size: 52 MB (.pt format)
Input Shape: 640×640×3
Output: Detection format (x1, y1, x2, y2, conf, class)
mAP@0.5:0.95: 0.82
Inference Speed: 31ms (GPU), 250ms (CPU)
Support: Food categories via COCO classes
License: AGPL-3.0
```

**COCO Food-Related Classes:**
- person (can indicate dining context)
- chair (dining context)
- dining table (food context)
- cup, bowl, plate (food containers)
- fork, knife, spoon (utensils)
- pizza, hot dog, sandwich, donut, cake (prepared foods)

**Note:** While YOLOv8m is trained on COCO with limited specific food categories, it performs well on detecting food presence, colors, and shapes. For future enhancement, fine-tuning on Food-101 or AIFood datasets will significantly improve accuracy.

### 7.2 Ollama + Mistral-7B Details

**Model Card:**
```
Name: Mistral-7B
Organization: Mistral AI
Model Size: 7 billion parameters
Quantization: Q4_K_M (recommended), ~4 GB
Full Size: ~13 GB (unquantized)
License: Apache 2.0 (fully open-source)
Context Window: 8,000 tokens
Training Data: Diverse multilingual data
Reasoning Capability: Superior reasoning for instructions
Inference Framework: Ollama-compatible
Compatible Hardware: CPU, NVIDIA, AMD, Apple Silicon
```

**Mistral-7B Performance:**
- Outperforms Llama-2-13B on benchmarks
- Faster inference than larger models
- Excellent instruction-following capabilities
- Good for recipe generation and creative tasks
- Supports long context for detailed instructions

**Alternative: Llama-2-7B**
```
Name: Llama-2-7B
Organization: Meta
License: Llama 2 Community License
Model Size: 7 billion parameters
Quantization: Q4_K_M, ~4 GB
Community: Extensive tooling and integrations
Performance: Good for general tasks
Reasoning: Good but not as strong as Mistral
```

---

## 8. API Specifications (Local)

### 8.1 Health Check Endpoint

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "running",
  "models_loaded": {
    "yolov8": true,
    "ollama": true
  },
  "device": "cpu",
  "timestamp": "2024-11-30T10:00:00Z"
}
```

### 8.2 Food Detection Endpoint

**Endpoint:** `POST /api/detect`

**Request:**
```
Content-Type: multipart/form-data
- file: Image file (JPG, PNG, WEBP)
- confidence_threshold: Optional (default: 0.5)
```

**Response:**
```json
{
  "success": true,
  "detected_items": [
    {
      "name": "Potato",
      "confidence": 0.94,
      "bbox": [100, 150, 300, 400]
    },
    {
      "name": "Bread",
      "confidence": 0.87,
      "bbox": [320, 100, 520, 350]
    }
  ],
  "processing_time_ms": 187,
  "model": "YOLOv8m",
  "device": "cpu",
  "image_size": "640x640"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "No food items detected with confidence > 0.5",
  "suggestions": ["Try better lighting", "Center the food items"]
}
```

### 8.3 Recipe Generation Endpoint

**Endpoint:** `POST /api/generate-recipes`

**Request:**
```json
{
  "ingredients": ["Potato", "Bread", "Butter"],
  "cuisine_preference": "any",
  "difficulty": "easy"
}
```

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "name": "Garlic Butter Toast",
      "description": "Crispy bread with aromatic garlic butter",
      "time": "10 mins",
      "servings": 2,
      "difficulty": "Easy",
      "ingredients": ["Bread", "Butter", "Garlic"],
      "steps": [
        "Toast bread until golden",
        "Mix butter with minced garlic",
        "Spread on warm toast and serve"
      ]
    }
  ],
  "generation_time_ms": 4500,
  "model": "Mistral-7B",
  "device": "cpu",
  "tokens_generated": 187
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Recipe generation timeout (exceeded 60s)",
  "fallback_recipes": [/* 3 default recipes */]
}
```

---

## 9. Installation & Deployment (MVP)

### 9.1 Prerequisites
- Python 3.9+
- Node.js 16+
- 8 GB RAM (16 GB recommended)
- 10 GB free storage

### 9.2 Backend Setup

**Step 1: Clone/Create Project**
```bash
mkdir food-recipe-suggester-mvp
cd food-recipe-suggester-mvp
git init
```

**Step 2: Backend Setup**
```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

**Step 3: Install Dependencies**
```bash
pip install -r requirements.txt
```

**Step 4: Models Configuration**
```bash
# Create models directory
mkdir .models

# YOLOv8 model auto-downloads on first run
# Ollama models managed via Ollama commands
```

### 9.3 Ollama Installation

**Install Ollama:**
1. Download from https://ollama.ai
2. Install for your OS (Windows, macOS, Linux)

**Pull Mistral Model:**
```bash
ollama pull mistral
ollama serve  # Start Ollama server (runs on port 11434)
```

### 9.4 Frontend Setup

**Step 1: Create React App**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom lucide-react
```

**Step 2: Configure API URL**
Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

### 9.5 Running MVP

**Terminal 1: Start Ollama**
```bash
ollama serve
# Runs on http://localhost:11434
```

**Terminal 2: Start Backend**
```bash
cd backend
source venv/bin/activate
python app.py
# Runs on http://localhost:5000
```

**Terminal 3: Start Frontend**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 9.6 First Run Configuration

**On first backend start:**
- Detects and downloads YOLOv8m (~52 MB)
- Checks for Ollama connection
- Validates model availability
- Displays initialization status

**Expected startup time:** 30-60 seconds (first run), 3-5 seconds (subsequent runs)

---

## 10. Model Fine-tuning Roadmap (Post-MVP)

### 10.1 Fine-tuning Strategy

If MVP detection accuracy is insufficient, fine-tune YOLOv8 on food-specific datasets:

**Dataset Options:**

| Dataset | Size | Classes | Best For | URL |
|---------|------|---------|----------|-----|
| Food-101 | 101K images | 101 foods | Food classification | https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/ |
| AIFood | 70K images | Multiple | Food recognition | Custom internal dataset |
| Ingredients101 | 50K images | 101 ingredients | Ingredient detection | Community dataset |
| FoodSeg103 | 12K images | 103 foods | Segmentation | https://github.com/jianghongfan/FoodSeg103 |
| UNIMIB2016 | 1,027 images | 73 foods | Segmentation | https://github.com/unimib-object-retrieval/unimib2016 |

### 10.2 Fine-tuning Process

**Steps:**
1. Collect annotated food images
2. Convert to YOLO format
3. Fine-tune YOLOv8m on custom data
4. Validate on test set
5. Deploy optimized model

**Expected Improvements:**
- Detection accuracy: 80% → 92%+
- Model size: 52 MB → 55-60 MB (minimal increase)
- Inference time: Negligible change

---

## 11. Functional Requirements Detail

### 11.1 Image Upload UI
- Drag-and-drop zone with clear instructions
- File browser button
- Supported formats display (JPG, PNG, WEBP)
- Max file size indicator (25 MB)
- Image preview after selection
- Upload button
- Loading spinner during upload

**Acceptance Criteria:**
- Upload interface visible and functional
- Image preview displays correctly
- Upload initiates within 1 click
- Progress indicator shown during processing

### 11.2 Detection Results Display
- Show uploaded image with bounding boxes
- List all detected items with confidence scores
- Allow user to toggle detected items on/off
- Show confidence as percentage
- Manual ingredient input option
- "Generate Recipes" button
- "Try Another Image" button

**Acceptance Criteria:**
- All detected items listed with scores
- User can modify selection
- Interface updates in real-time
- Clear visual hierarchy

### 11.3 Recipe Display
- List of generated recipes in sidebar
- Full recipe details in main area
- Quick stats (time, servings, difficulty)
- Ingredient list with checkboxes
- Numbered instructions
- Print functionality
- Search/filter recipes

**Acceptance Criteria:**
- All 3 recipes display properly
- All information visible and readable
- Print output is usable
- Filtering works correctly

### 11.4 Error Handling
- No food detected → Show helpful message with suggestions
- Model loading failed → Display setup instructions
- Ollama not running → Prompt to start Ollama
- Recipe generation timeout → Show fallback recipes
- Invalid file format → Clear error message
- Out of memory → Graceful degradation
- Network error → Inform user (not expected in MVP)

---

## 12. Non-Functional Requirements (MVP Focus)

### 12.1 Performance
- Image upload and validation: <2 seconds
- Food detection: <500ms (CPU), <100ms (GPU)
- Recipe generation: <60 seconds (CPU), <15 seconds (GPU)
- UI responsiveness: <100ms for all interactions
- Page load: <3 seconds
- Memory footprint: <6GB peak usage

### 12.2 Reliability
- Application uptime: 100% (local, no external dependencies)
- Graceful error handling: All errors caught and displayed
- Fallback mechanisms: 3 default recipes if generation fails
- Model auto-download on first run
- Session persistence: Recipes stay on screen during session

### 12.3 Security (MVP-scoped)
- No external API calls (100% local processing)
- Images not persisted without user consent
- No sensitive data transmission
- File upload validation (type and size)
- Protection against malicious files
- No telemetry or tracking

### 12.4 Usability
- Intuitive interface requiring no training
- Clear error messages with suggestions
- Visual feedback for all operations
- Mobile-friendly responsive design
- Accessibility basics (color contrast, readable text)
- Help text and tooltips

### 12.5 Compatibility
- Browser: Chrome, Firefox, Safari, Edge (latest 2 versions)
- OS: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- CPU: Any modern processor (i5/Ryzen 5 or better)
- GPU: Optional (NVIDIA/AMD/Metal supported)

---

## 13. Success Criteria (MVP)

The MVP will be considered successful when it achieves:

1. **Functionality:**
   - Food detection accuracy: 75%+ on test images
   - Recipe generation success rate: 95%+ (valid JSON, complete recipes)
   - Zero external API dependencies

2. **Performance:**
   - Food detection: <500ms on standard CPU
   - Recipe generation: <60 seconds on standard CPU
   - Application startup: <5 seconds
   - Memory usage: <6GB during processing

3. **Quality:**
   - Generated recipes are practical and feasible
   - All recipes include required fields
   - Instructions are clear and beginner-friendly
   - 60%+ ingredient utilization in recipes

4. **Reliability:**
   - Zero crashes on valid inputs
   - Graceful handling of all error conditions
   - Fallback recipes when generation fails
   - Models auto-download and load correctly

5. **User Experience:**
   - Interface intuitive without documentation
   - All buttons and features easily discoverable
   - Clear feedback for all user actions
   - Mobile-responsive and accessible

---

## 14. User Stories (MVP)

### 14.1 Core User Story
**As a** privacy-conscious user with leftover ingredients,
**I want to** upload a photo and get recipe suggestions entirely offline,
**So that** I can discover meals to cook while keeping my data private.

**Acceptance Criteria:**
- Upload image locally without internet
- Food detection happens on my machine
- Recipe generation offline
- No external service calls
- Results displayed within 60 seconds

### 14.2 Food Detection Story
**As a** home cook,
**I want to** see exactly what food items the system detected from my image,
**So that** I can correct any misidentifications before generating recipes.

**Acceptance Criteria:**
- Detected items shown with bounding boxes
- Confidence scores displayed
- Can toggle items on/off
- Can manually add missing items
- Detection happens locally

### 14.3 Recipe Generation Story
**As a** user with detected ingredients,
**I want to** receive 3 creative recipe suggestions,
**So that** I have options for what to cook tonight.

**Acceptance Criteria:**
- 3 recipes generated
- All recipes use detected ingredients
- Generation completes in reasonable time
- Recipes are practical and feasible
- Instructions are clear

### 14.4 Recipe Interaction Story
**As a** user viewing recipes,
**I want to** easily see all recipe details and follow instructions,
**So that** I can confidently prepare the meal.

**Acceptance Criteria:**
- Recipe details clearly displayed
- Ingredients listed with quantities
- Instructions are numbered
- I can print the recipe
- I can search/filter recipes

---

## 15. Risk Assessment (MVP)

### 15.1 Technical Risks
- **Risk:** Ollama server not running or unavailable
- **Mitigation:** Check connection on startup, prompt user to start Ollama, provide clear instructions

- **Risk:** Recipe generation timeout (LLM takes too long)
- **Mitigation:** 60-second timeout, fallback to 3 default recipes, inform user

- **Risk:** YOLOv8 model download fails
- **Mitigation:** Retry mechanism, offline fallback, detailed error messages

- **Risk:** Insufficient system memory
- **Mitigation:** Display memory requirements upfront, graceful degradation, system check on startup

### 15.2 Quality Risks
- **Risk:** Food detection accuracy insufficient
- **Mitigation:** Accept 75% accuracy for MVP, plan fine-tuning with Food-101 dataset post-MVP

- **Risk:** Generated recipes are low quality or irrelevant
- **Mitigation:** Prompt optimization, fallback recipes, user feedback collection for improvement

- **Risk:** Model performance varies significantly by hardware
- **Mitigation:** Document hardware requirements, provide performance metrics, support GPU acceleration

### 15.3 User Experience Risks
- **Risk:** Complex setup process discourages users
- **Mitigation:** Simplified installation guide, automated model downloads, clear error messages

- **Risk:** Slow inference times frustrate users
- **Mitigation:** Show progress indicators, set realistic expectations, provide performance tips

---

## 16. Testing Strategy (MVP)

### 16.1 Functional Testing
- Test image upload with various formats and sizes
- Validate food detection on diverse images
- Test recipe generation with different ingredient combinations
- Verify JSON parsing and data integrity
- Test error handling paths
- Cross-browser testing

### 16.2 Performance Testing
- Measure inference time on CPU
- Measure inference time on GPU
- Test with various image resolutions
- Monitor memory usage during operations
- Load test multiple rapid requests

### 16.3 Integration Testing
- YOLOv8 model integration with Flask
- Ollama connection and model pulling
- Frontend-backend API communication
- File upload and processing pipeline
- Error propagation and handling

### 16.4 User Testing
- Usability testing with 5-10 beta users
- Gather feedback on interface clarity
- Test on various hardware configurations
- Collect performance metrics from real usage
- Iterate based on feedback

---

## 17. Models Summary Table

| Component | Model | Size | Speed (CPU) | Speed (GPU) | Accuracy | License |
|-----------|-------|------|-----------|-----------|----------|---------|
| Food Detection | YOLOv8m | 52 MB | 250ms | 30ms | 82% mAP | AGPL-3.0 |
| Recipe Generation | Mistral-7B | 4 GB | 45s/recipe | 8s/recipe | High | Apache 2.0 |
| **Total** | **Combined** | **~4.1 GB** | **<60s total** | **<10s total** | **Good** | **Open Source** |

---

## 18. MVP Limitations & Future Scope

### 18.1 MVP Limitations
- No cloud deployment (local-only)
- No user accounts or recipe saving
- No nutritional information
- Limited to pre-trained model performance
- Single language support (English)
- No ingredient quantity estimation
- No dietary restriction filtering
- No meal planning features

### 18.2 Post-MVP Enhancements
- **Phase 1:** YOLOv8 fine-tuning on Food-101 dataset
- **Phase 2:** User authentication and recipe favorites
- **Phase 3:** Nutritional analysis integration
- **Phase 4:** Mobile application
- **Phase 5:** Cloud deployment option
- **Phase 6:** Multi-language support
- **Phase 7:** Community recipe sharing

---

## 19. Deployment Checklist (MVP)

### Pre-Release Checklist
- [ ] YOLOv8m model downloads and loads correctly
- [ ] Ollama integration tested and working
- [ ] All API endpoints functional
- [ ] Frontend-backend communication verified
- [ ] Error handling tested for all scenarios
- [ ] Performance benchmarks documented
- [ ] Installation guide complete and tested
- [ ] System requirements clearly specified
- [ ] README with setup instructions
- [ ] Example images provided for testing
- [ ] Hardware requirements clearly stated
- [ ] License information included
- [ ] Security audit for local processing
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Documentation complete
- [ ] 5-10 beta testers provided feedback
- [ ] Bugs fixed and documented
- [ ] Performance acceptable on target hardware
- [ ] Ready for GitHub/release

---

## 20. Appendix: Model Architecture Diagrams

### 20.1 YOLOv8m Architecture (Simplified)
```
Input: 640×640 RGB Image
        ↓
   Backbone (CSPDarknet)
   - Conv blocks
   - MaxPool layers
   - Residual connections
        ↓
   Neck (PANet)
   - Feature pyramid
   - Multi-scale feature fusion
        ↓
   Head (Detection)
   - Objectness prediction
   - Class prediction
   - Bounding box regression
        ↓
Output: Detections (x1, y1, x2, y2, conf, class)
```

### 20.2 Recipe Generation Pipeline
```
Detected Ingredients
        ↓
Prompt Engineering (Python)
        ↓
Ollama Client
        ↓
Mistral-7B Model (Local)
        ↓
Token Generation
        ↓
JSON Parsing
        ↓
Recipe Objects
        ↓
Frontend Display
```

### 20.3 Complete MVP Data Flow
```
User Action
    │
    ├─→ Upload Image
    │       ↓
    │   Image Validation
    │       ↓
    │   YOLOv8 Detection (Local)
    │       ↓
    │   Display Detections
    │       ↓
    ├─→ User Confirms/Edits Items
    │       ↓
    │   Generate Recipes Request
    │       ↓
    │   Ollama + Mistral-7B (Local)
    │       ↓
    │   Parse Recipes JSON
    │       ↓
    │   Display Recipes
    │       ↓
    └─→ User Interacts
            • View details
            • Print recipe
            • Filter recipes
            • Upload new image
```

---

## 21. Configuration Files

### 21.1 Environment Setup (.env)
```bash
# Local Processing
FLASK_ENV=development
DEBUG=true

# Model Configuration
MODEL_YOLO=yolov8m
MODEL_LLM=mistral
YOLO_CONF_THRESHOLD=0.5
RECIPE_GENERATION_TIMEOUT=60

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral

# Server Configuration
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
REACT_PORT=5173

# File Upload
MAX_FILE_SIZE=25000000  # 25 MB in bytes
UPLOAD_FOLDER=./uploads
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp
```

### 21.2 Backend Structure (flexible a little bit)
```
backend/
├── app.py                 # Flask server
├── inference.py           # YOLOv8 integration
├── recipe_engine.py       # Ollama/Mistral integration
├── utils.py              # Helper functions
├── config.py             # Configuration
├── requirements.txt      # Python dependencies
├── .models/              # Model storage
└── uploads/              # Temporary image storage
```

---

## 22. Success Metrics (MVP a little flexible)

**Quantitative Metrics:**
- Detection accuracy: 75%+ on test set
- Recipe generation success: 95%+
- Average inference time: <60 seconds
- Memory usage: <6GB
- User error rate: <5%

**Qualitative Metrics:**
- User feedback: Positive on usability
- Recipe quality: Practical and feasible
- Documentation: Clear and complete
- Community feedback: Helpful and encouraging

---

## 23. Glossary

- **YOLOv8:** Latest YOLO object detection model by Ultralytics
- **COCO:** Common Objects in Context dataset (80 classes)
- **Ollama:** Lightweight local LLM server
- **Any LLM model good at recipe generation:** 3-7 billion parameter open-source LLM
- **mAP:** Mean Average Precision (detection accuracy metric)
- **Quantization:** Reducing model precision (16-bit → 8-bit → 4-bit) for efficiency
- **Q4_K_M-Q6_K_M:** 4-bit quantization format (good balance of speed/quality)
- **Inference:** Running a trained model on new data
- **Fine-tuning:** Training a pre-trained model on new data
- **GPU:** Graphics Processing Unit (accelerates ML)
- **CPU:** Central Processing Unit (all-purpose computing)
- **Token:** Individual word or subword in LLM processing

---
