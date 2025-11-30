import React from 'react';

const RecipeList = ({ recipes, onSelectRecipe }) => {
    if (!recipes || recipes.length === 0) return null;

    return (
        <div className="relative flex min-h-screen w-full flex-col">
            {/* Body Text */}
            <div className="px-4 pt-4">
                <p className="text-base font-normal leading-normal text-slate-600 dark:text-slate-400 pb-3 pt-1">
                    Here are some recipe ideas based on your ingredients
                </p>
            </div>

            {/* Recipe List */}
            <div className="flex flex-col gap-4 p-4 pt-2 pb-8">
                {recipes.map((recipe, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSelectRecipe(recipe)}
                        className="flex w-full cursor-pointer flex-col gap-4 rounded-xl bg-white dark:bg-[#1C2C21] p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Recipe Image Placeholder */}
                        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>
                                restaurant_menu
                            </span>
                        </div>

                        {/* Recipe Info */}
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1 flex-1">
                                <p className="text-base font-bold leading-tight text-black dark:text-white">
                                    {recipe.name}
                                </p>
                                <p className="text-sm font-normal leading-normal text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {recipe.description}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 ml-2">
                                chevron_right
                            </span>
                        </div>

                        {/* Recipe Metadata */}
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined !text-xl">timer</span>
                                <span className="text-sm">{recipe.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined !text-xl">local_fire_department</span>
                                <span className="text-sm">{recipe.difficulty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
