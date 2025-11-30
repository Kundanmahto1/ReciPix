import React, { useState } from 'react';

const RecipeDisplay = ({ recipe, recipes, onSelectRecipe }) => {
    const [checkedIngredients, setCheckedIngredients] = useState({});

    const toggleIngredient = (index) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const text = `${recipe.name}\n\n${recipe.description}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
        navigator.clipboard.writeText(text);
        alert('Recipe copied to clipboard!');
    };

    if (!recipe) return null;

    return (
        <div className="relative flex min-h-screen w-full flex-col pb-32">
            {/* Recipe Image Placeholder */}
            <div className="px-4">
                <div className="w-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 flex flex-col justify-end overflow-hidden rounded-xl min-h-80 items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '120px' }}>
                        restaurant_menu
                    </span>
                </div>
            </div>

            {/* Recipe Title */}
            <h1 className="text-zinc-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">
                {recipe.name}
            </h1>

            {/* Description */}
            <p className="text-zinc-700 dark:text-zinc-300 text-base font-normal leading-normal pb-3 pt-1 px-4">
                {recipe.description}
            </p>

            {/* Info Chips */}
            <div className="flex gap-3 px-4 py-3 flex-wrap">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-3 pr-4">
                    <span className="material-symbols-outlined text-primary text-base">timer</span>
                    <p className="text-zinc-900 dark:text-white text-sm font-medium leading-normal">{recipe.time}</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-3 pr-4">
                    <span className="material-symbols-outlined text-primary text-base">groups</span>
                    <p className="text-zinc-900 dark:text-white text-sm font-medium leading-normal">{recipe.servings} Servings</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-3 pr-4">
                    <span className="material-symbols-outlined text-primary text-base">cooking</span>
                    <p className="text-zinc-900 dark:text-white text-sm font-medium leading-normal">{recipe.difficulty}</p>
                </div>
            </div>

            <div className="px-4 py-4">
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </div>

            {/* Ingredients Section */}
            <div className="px-4 py-2">
                <h3 className="text-zinc-900 dark:text-white text-2xl font-bold leading-snug">Ingredients</h3>
                <div className="flex flex-col gap-4 pt-4">
                    {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
                        <label key={idx} className="flex items-center gap-4 group cursor-pointer">
                            <input
                                className="peer hidden"
                                type="checkbox"
                                checked={checkedIngredients[idx] || false}
                                onChange={() => toggleIngredient(idx)}
                            />
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-zinc-300 dark:border-zinc-600 peer-checked:border-primary peer-checked:bg-primary">
                                <span className="material-symbols-outlined text-white !text-sm hidden peer-checked:block">check</span>
                            </div>
                            <span className="text-zinc-700 dark:text-zinc-300 peer-checked:text-zinc-900 dark:peer-checked:text-white peer-checked:line-through">
                                {ingredient}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="px-4 py-4">
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </div>

            {/* Instructions Section */}
            <div className="px-4 py-2 pb-32">
                <h3 className="text-zinc-900 dark:text-white text-2xl font-bold leading-snug">Instructions</h3>
                <div className="flex flex-col gap-6 pt-4">
                    {recipe.steps && recipe.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                                {idx + 1}
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 flex-1">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recipe Selector (if multiple recipes) */}
            {recipes && recipes.length > 1 && (
                <div className="px-4 py-4">
                    <h3 className="text-zinc-900 dark:text-white text-lg font-bold mb-3">Other Recipes</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {recipes.map((r, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectRecipe(r)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-colors ${r.name === recipe.name
                                        ? 'border-primary bg-primary/10 text-zinc-900 dark:text-white'
                                        : 'border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-primary/50'
                                    }`}
                            >
                                <p className="text-sm font-medium whitespace-nowrap">{r.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent">
                <div className="flex w-full items-center justify-center gap-4 rounded-xl bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-sm p-3 shadow-2xl">
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-700/50 dark:bg-zinc-700 h-12 text-white font-bold hover:bg-zinc-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">print</span>
                        <span>Print</span>
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-700/50 dark:bg-zinc-700 h-12 text-white font-bold hover:bg-zinc-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">content_copy</span>
                        <span>Copy</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDisplay;
