import React, { useState, useRef } from 'react';

const UploadScreen = ({ onImageSelected, onError }) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const MAX_SIZE = 25 * 1024 * 1024; // 25MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error('Invalid file type. Support: JPG, PNG, WEBP');
        }

        if (file.size > MAX_SIZE) {
            throw new Error('File too large. Max 25MB');
        }

        return true;
    };

    const handleFile = (file) => {
        if (!file) return;

        try {
            validateFile(file);
            onImageSelected(file);
        } catch (err) {
            onError(err.message);
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

    return (
        <div className="flex flex-col grow">
            {/* Headline */}
            <h1 className="text-[32px] font-bold leading-tight tracking-tight px-4 text-center pb-3 pt-6 text-zinc-900 dark:text-white">
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
                    <p className="text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center text-zinc-900 dark:text-white">
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
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] w-full gap-2"
                    >
                        <span className="material-symbols-outlined">photo_camera</span>
                        <span className="truncate">Take Photo</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary/20 dark:bg-primary/20 text-zinc-900 dark:text-zinc-50 text-base font-bold leading-normal tracking-[0.015em] w-full gap-2"
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
};

export default UploadScreen;
