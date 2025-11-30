import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ImageUpload = ({ onRecipesGenerated, onError, setLoading, loading, detectedItems, setDetectedItems, setView }) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            onError('Please upload an image file (JPG, PNG, WEBP)');
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            onError('File size must be less than 25MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        processImage(file);
    };

    const processImage = async (file) => {
        setLoading(true);
        onError(null);

        try {
            // Step 1: Detect Food
            const formData = new FormData();
            formData.append('file', file);

            const detectResponse = await axios.post(`${API_URL}/api/detect`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const items = detectResponse.data.detected_items;

            if (!items || items.length === 0) {
                onError('No food items detected. Please try another image.');
                setLoading(false);
                return;
            }

            setDetectedItems(items);
            setView('detection');
            setLoading(false);

        } catch (err) {
            console.error(err);
            onError(err.response?.data?.error || 'Failed to process image. Make sure backend is running.');
            setLoading(false);
        }
    };

    const generateRecipes = async () => {
        setLoading(true);
        try {
            const ingredients = detectedItems.map(item => item.name);
            const uniqueIngredients = [...new Set(ingredients)];

            const recipeResponse = await axios.post(`${API_URL}/api/generate-recipes`, {
                ingredients: uniqueIngredients
            });

            const recipesData = recipeResponse.data.recipes?.recipes || recipeResponse.data.recipes || [];

            if (!recipesData || recipesData.length === 0) {
                onError('No recipes generated. Please try again.');
                setLoading(false);
                return;
            }

            onRecipesGenerated(recipesData, detectedItems);
            setLoading(false);

        } catch (err) {
            console.error(err);
            onError(err.response?.data?.error || 'Failed to generate recipes.');
            setLoading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const clearImage = () => {
        setPreview(null);
        setDetectedItems([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeItem = (index) => {
        setDetectedItems(items => items.filter((_, i) => i !== index));
    };

    // Upload Screen
    if (!preview && detectedItems.length === 0) {
        return (
            <div className="flex flex-col grow">
                {/* Headline */}
                <h1 className="text-[32px] font-bold leading-tight tracking-tight px-4 text-center pb-3 pt-6">
                    What's in your kitchen?
                </h1>
                {/* Body Text */}
                <p className="text-base font-normal leading-normal pb-3 pt-1 px-4 text-center text-zinc-600 dark:text-zinc-400">
                    Upload a photo of your ingredients to get instant recipe ideas.
                </p>
                {/* Upload Area */}
                <div className="flex flex-col p-4 grow">
                    <div
                        className={`flex flex-1 flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed px-6 py-14 transition-colors ${dragActive
                            ? 'border-primary bg-primary/10'
                            : 'border-zinc-300 dark:border-zinc-700'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400" style={{ fontSize: '48px' }}>
                            upload_file
                        </span>
                        <p className="text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                            Tap to upload or take a photo
                        </p>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-center">
                    <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={handleChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] w-full gap-2"
                        >
                            <span className="material-symbols-outlined">photo_camera</span>
                            <span className="truncate">Take Photo</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary/20 dark:bg-primary/20 text-zinc-900 dark:text-zinc-50 text-base font-bold leading-normal tracking-[0.015em] w-full gap-2"
                        >
                            <span className="material-symbols-outlined">folder_open</span>
                            <span className="truncate">Browse Files</span>
                        </button>
                    </div>
                </div>
                {/* Helper Text */}
                <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400 text-center px-4 pt-1">
                    Supports: JPG, PNG, WEBP
                </p>
                {/* Privacy Notice */}
                <div className="flex items-center justify-center gap-2 px-4 py-6">
                    <span className="material-symbols-outlined text-sm text-zinc-500 dark:text-zinc-400">lock</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                        Your images are processed securely on your device.
                    </p>
                </div>
            </div>
        );
    }

    // Detection Screen
    if (detectedItems.length > 0) {
        return (
            <div className="flex flex-col pb-28">
                {/* Header Image */}
                {preview && (
                    <div className="px-4 py-3">
                        <div className="relative w-full overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat pt-[66.66%]" style={{ backgroundImage: `url(${preview})` }}>
                            {/* Optional: Add bounding boxes here if you have bbox data */}
                        </div>
                    </div>
                )}
                {/* Section Header */}
                <h2 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em]">
                    Confirm Your Ingredients
                </h2>
                {/* List Items */}
                <div className="flex flex-col gap-1">
                    {detectedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 px-4 py-2 min-h-[72px] justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                                    <span className="material-symbols-outlined text-primary">restaurant</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-base font-medium leading-normal line-clamp-1 capitalize">
                                        {item.name}
                                    </p>
                                    <p className="text-sm font-normal leading-normal text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {Math.round(item.confidence * 100)}% match
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(idx)}
                                className="shrink-0 flex size-7 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                    ))}
                </div>
                {/* Add Item Button */}
                <div className="px-4 pt-4">
                    <button
                        onClick={clearImage}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-400 dark:border-zinc-600 text-base font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Upload Different Image
                    </button>
                </div>
                {/* Bottom CTA */}
                <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark p-4 pt-6">
                    <button
                        onClick={generateRecipes}
                        disabled={loading || detectedItems.length === 0}
                        className="w-full rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generating Recipes...' : `Generate Recipes (${detectedItems.length} items)`}
                    </button>
                </footer>
            </div>
        );
    }

    return null;
};

export default ImageUpload;
