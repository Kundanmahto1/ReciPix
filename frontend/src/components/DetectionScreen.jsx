import React from 'react';

const DetectionScreen = ({ detectedItems, imagePreview, onRemoveItem, onGenerateRecipes, onRetakePhoto, loading }) => {
    return (
        <div className="flex flex-col pb-28">
            {/* Header Image */}
            {imagePreview && (
                <div className="px-4 py-3">
                    <div className="relative w-full overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat pt-[66.66%]" style={{ backgroundImage: `url(${imagePreview})` }}>
                        {/* Bounding boxes could be added here if coordinates are available */}
                    </div>
                </div>
            )}

            {/* Section Header */}
            <h2 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white">
                Confirm Your Ingredients
            </h2>

            {/* List Items */}
            <div className="flex flex-col gap-1">
                {detectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-4 py-2 min-h-[72px] justify-between bg-background-light dark:bg-background-dark">
                        <div className="flex items-center gap-4">
                            {/* Placeholder for item image if available, otherwise icon */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                                <span className="material-symbols-outlined text-primary">restaurant</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-base font-medium leading-normal line-clamp-1 capitalize text-zinc-900 dark:text-white">
                                    {item.name}
                                </p>
                                <p className="text-sm font-normal leading-normal text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                    {Math.round(item.confidence * 100)}% match
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemoveItem(idx)}
                            className="shrink-0 flex size-7 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                            aria-label="Remove item"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Item / Retake Button */}
            <div className="px-4 pt-4">
                <button
                    onClick={onRetakePhoto}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-400 dark:border-zinc-600 text-base font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Item / Upload Different Image
                </button>
            </div>

            {/* Bottom CTA */}
            <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark p-4 pt-6">
                <button
                    onClick={onGenerateRecipes}
                    disabled={loading || detectedItems.length === 0}
                    className="w-full rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-black shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <span className="animate-spin material-symbols-outlined">progress_activity</span>}
                    {loading ? 'Generating Recipes...' : `Generate Recipes (${detectedItems.length} items)`}
                </button>
            </footer>
        </div>
    );
};

export default DetectionScreen;
