import React, { useState, useEffect } from 'react';
import UploadScreen from './components/UploadScreen';
import DetectionScreen from './components/DetectionScreen';
import RecipeListScreen from './components/RecipeListScreen';
import RecipeDetailScreen from './components/RecipeDetailScreen';
import { detectFoodItems, generateRecipes } from './services/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [detectedItems, setDetectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [view, setView] = useState('upload'); // 'upload', 'detection', 'recipes', 'recipe-detail'
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize dark mode (default to light)
  useEffect(() => {
    // Default to light mode for now as per user request
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageSelected = async (file) => {
    setLoading(true);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const data = await detectFoodItems(file);
      if (!data.detected_items || data.detected_items.length === 0) {
        throw new Error('No food items detected. Please try another image.');
      }
      setDetectedItems(data.detected_items);
      setView('detection');
    } catch (err) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const ingredients = detectedItems.map(item => item.name);
      const uniqueIngredients = [...new Set(ingredients)];

      const data = await generateRecipes(uniqueIngredients);
      const recipesData = data.recipes?.recipes || data.recipes || [];

      if (!recipesData || recipesData.length === 0) {
        throw new Error('No recipes generated. Please try again.');
      }

      setRecipes(recipesData);
      setView('recipes');
    } catch (err) {
      setError(err.message || 'Failed to generate recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (index) => {
    setDetectedItems(items => items.filter((_, i) => i !== index));
  };

  const handleRetakePhoto = () => {
    setView('upload');
    setDetectedItems([]);
    setImagePreview(null);
    setRecipes([]);
    setError(null);
  };

  const handleBack = () => {
    const navigationMap = {
      'recipe-detail': 'recipes',
      'recipes': 'detection',
      'detection': 'upload',
    };

    const nextView = navigationMap[view] || 'upload';

    if (nextView === 'upload') {
      handleRetakePhoto();
    } else {
      setView(nextView);
      if (nextView === 'recipes') {
        setSelectedRecipe(null);
      }
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setView('recipe-detail');
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'upload':
        return 'Upload Image';
      case 'detection':
        return 'Detected Items';
      case 'recipes':
        return 'Recipe Suggestions';
      case 'recipe-detail':
        return selectedRecipe?.name || 'Recipe';
      default:
        return 'BigBite';
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden text-zinc-900 dark:text-zinc-50 bg-background-light dark:bg-background-dark font-display">
      {/* TopAppBar */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start">
          {view !== 'upload' && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
            </button>
          )}
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          {getHeaderTitle()}
        </h2>
        <div className="flex w-12 items-center justify-end">
          {view === 'upload' && (
            <button
              onClick={toggleDarkMode}
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
            >
              <span className="material-symbols-outlined">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}
          {view === 'recipe-detail' && (
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined">ios_share</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r animate-fade-in">
          <div className="flex justify-between items-start">
            <div className="flex">
              <span className="material-symbols-outlined text-red-500 mr-3">error</span>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {loading && view === 'upload' && (
          <div className="flex flex-col items-center justify-center h-64">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
            <p className="text-zinc-600 dark:text-zinc-400">Processing image...</p>
          </div>
        )}

        {!loading && view === 'upload' && (
          <UploadScreen
            onImageSelected={handleImageSelected}
            onError={(msg) => setError(msg)}
          />
        )}

        {view === 'detection' && (
          <DetectionScreen
            detectedItems={detectedItems}
            imagePreview={imagePreview}
            onRemoveItem={handleRemoveItem}
            onGenerateRecipes={handleGenerateRecipes}
            onRetakePhoto={handleRetakePhoto}
            loading={loading}
          />
        )}

        {view === 'recipes' && (
          <RecipeListScreen
            recipes={recipes}
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {view === 'recipe-detail' && selectedRecipe && (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            recipes={recipes}
            onSelectRecipe={handleSelectRecipe}
          />
        )}
      </main>
    </div>
  );
}

export default App;
