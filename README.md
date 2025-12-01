# ReciPix: Recipe Master AI 🍳

A privacy-first, locally-deployed AI application that detects food ingredients from images and generates creative recipe suggestions. Built with YOLOv8, Gemini Vision API, Roboflow, and local LLM (Ollama).

![RecipeMaster AI](https://img.shields.io/badge/AI-Food%20Detection-orange) ![Privacy First](https://img.shields.io/badge/Privacy-First-green) ![Local Processing](https://img.shields.io/badge/Processing-Local-blue)

## ✨ Features

- 🔍 **Multi-tier Food Detection**
  - Gemini Vision API for accurate ingredient identification
  - Roboflow serverless inference for food-specific detection
  - Local YOLOv8 fallback for offline operation
  
- 🤖 **Local Recipe Generation**
  - Powered by Ollama (Mistral/Gemma models)
  - 100% private, runs on your machine
  - Generates 3 creative recipes per request

- 🎨 **Modern BigBite UI Design**
  - Clean, professional interface with Space Grotesk typography
  - Material Symbols icons for intuitive navigation
  - Light/Dark mode toggle for comfortable viewing
  - Drag-and-drop image upload
  - Real-time ingredient detection
  - Beautiful recipe display with step-by-step instructions
  - Responsive design optimized for all devices

- 🔒 **Privacy-First Architecture**
  - Optional cloud APIs (can run 100% offline)
  - No data sent to external servers (when using local mode)
  - All processing on your device

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│      React Frontend (Vite + Tailwind CSS v4)        │
└──────────────────────────┬──────────────────────────┘
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────┐
│              Flask Backend (Python)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │  Detection Priority:                         │   │
│  │  1. Gemini Vision API (most accurate)        │   │
│  │  2. Roboflow Food API (food-specific)        │   │
│  │  3. Local YOLOv8 (offline fallback)          │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Recipe Generation:                          │   │
│  │  - Local Ollama (Mistral/Gemma)              │   │  
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Python** 3.9 or higher
- **Node.js** 16 or higher
- **Ollama** (for local LLM)
- **8GB RAM** minimum (16GB recommended)
- **10GB free storage**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ReciepeMaster
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

#### Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your API keys (optional)
```

**Environment Variables:**

```bash
# Gemini Vision API (Optional - for best accuracy)
GEMINI_API_KEY=your_gemini_api_key

# Roboflow API (Optional - for food-specific detection)
ROBOFLOW_API_KEY=your_roboflow_api_key

# Model Configuration
MODEL_LLM=gemma3:4b  # or mistral
```

**Get API Keys (Optional):**
- **Gemini API**: https://makersuite.google.com/app/apikey (Free tier: 15 RPM)
- **Roboflow API**: https://roboflow.com (Free tier available)

### 3. Install and Configure Ollama

#### Install Ollama

**Windows:**
```bash
# Download from https://ollama.ai/download/windows
# Run the installer
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Pull the LLM Model

```bash
# Start Ollama server (in a separate terminal)
ollama serve

# Pull Gemma 3 (recommended, 4GB)
ollama pull gemma3:4b

# OR pull Mistral (alternative, 4GB)
ollama pull mistral
```

**Verify Ollama is running:**
```bash
ollama list
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```


## 🎮 Running the Application

You need **3 terminals** running simultaneously:

### Terminal 1: Ollama Server

```bash
ollama serve
```

### Terminal 2: Backend Server

```bash
cd backend
.\venv\Scripts\activate  # Windows
source venv/bin/activate # macOS/Linux

python app.py
```

Backend runs on: `http://localhost:5000`

### Terminal 3: Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📱 Usage

1. **Open your browser** to `http://localhost:5173`
2. **Toggle dark/light mode** using the icon in the top-right corner (optional)
3. **Upload an image** of food ingredients (drag & drop or click to browse)
4. **View detected ingredients** with confidence scores
5. **Get 3 AI-generated recipes** instantly
6. **Browse recipes** and follow step-by-step instructions

## 🔧 Configuration Options

### Detection Modes

Edit `backend/.env` to configure detection priority:

```bash
# Use all detection methods (recommended)
GEMINI_API_KEY=your_key
ROBOFLOW_API_KEY=your_key

# Use only Roboflow + local YOLO (no Gemini)
# GEMINI_API_KEY=  # commented out
ROBOFLOW_API_KEY=your_key

# Use only local YOLO (100% offline)
# GEMINI_API_KEY=  # commented out
# ROBOFLOW_API_KEY=  # commented out
```

### LLM Model Selection

```bash
# In backend/.env
MODEL_LLM=gemma3:4b  # Fast, good quality
# MODEL_LLM=mistral  # Alternative
# MODEL_LLM=llama2   # Another option
```

## 📊 Performance

| Hardware | Detection Time | Recipe Generation | Total Time |
|----------|---------------|-------------------|------------|
| CPU (i5) | 250ms | 45s | ~46s |
| CPU (i7) | 180ms | 30s | ~31s |
| GPU (RTX 3060) | 50ms | 8s | ~9s |
| GPU (RTX 4090) | 30ms | 3s | ~4s |

## 🛠️ Troubleshooting

### Backend won't start
- Ensure virtual environment is activated
- Check Python version: `python --version` (should be 3.9+)
- Reinstall dependencies: `pip install -r requirements.txt`

### Ollama connection failed
- Verify Ollama is running: `ollama list`
- Check if model is pulled: `ollama pull gemma3:4b`
- Restart Ollama: `ollama serve`

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 16+)

### No ingredients detected
- Try better lighting and clearer images
- Ensure food items are clearly visible
- Check if API keys are configured (for better accuracy)

## 📁 Project Structure

```
ReciepeMaster/
├── backend/
│   ├── app.py              # Flask server
│   ├── inference.py        # Food detection logic
│   ├── recipe_engine.py    # Recipe generation
│   ├── utils.py            # Helper functions
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── components/
│   │   │   ├── UploadScreen.jsx      # Image upload UI
│   │   │   ├── DetectionScreen.jsx   # Detected items display
│   │   │   ├── RecipeListScreen.jsx  # Recipe suggestions
│   │   │   └── RecipeDetailScreen.jsx # Recipe instructions
│   │   ├── services/
│   │   │   └── api.js     # API client
│   │   └── index.css      # Tailwind v4 styles & theme
│   ├── index.html         # HTML template with fonts
│   └── package.json       # Node dependencies
└── README.md
```

## 🔐 Privacy & Security

- **Local Processing**: Recipe generation runs entirely on your device
- **Optional APIs**: Cloud APIs (Gemini, Roboflow) are optional
- **No Data Storage**: Images are processed in memory and not saved
- **No Tracking**: Zero telemetry or analytics

## 🚧 Roadmap

- [ ] Fine-tune YOLOv8 on Food-101 dataset
- [ ] Add nutritional information
- [ ] Recipe favorites and history
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Dietary restriction filters

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Made with ❤️ for food lovers and privacy advocates**
