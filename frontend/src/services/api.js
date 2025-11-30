const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const detectFoodItems = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/detect`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Detection failed');
    }
    return response.json();
};

export const generateRecipes = async (ingredients) => {
    const response = await fetch(`${API_URL}/api/generate-recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Recipe generation failed');
    }
    return response.json();
};
