'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100); // Percentage
    const [isReading, setIsReading] = useState(false);
    const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Font Size Change
    useEffect(() => {
        const html = document.documentElement;
        if (fontSize === 100) {
            html.style.fontSize = '';
        } else {
            html.style.fontSize = `${fontSize}%`;
        }
    }, [fontSize]);

    // Handle Read Mode (Text-to-Speech)
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'fr-FR';
            utterance.rate = 1;
            setSpeechUtterance(utterance);
        }
    }, []);

    if (!mounted) return null;

    const toggleReadMode = () => {
        if (!speechUtterance) return;

        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            // Get visible text content from main
            const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
            speechUtterance.text = mainContent;

            speechUtterance.onend = () => setIsReading(false);

            window.speechSynthesis.speak(speechUtterance);
            setIsReading(true);
        }
    };

    const increaseText = () => setFontSize((prev) => Math.min(prev + 25, 200));
    const decreaseText = () => setFontSize((prev) => Math.max(prev - 25, 75));
    const resetText = () => setFontSize(100);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            {/* Toolbar Content */}
            <div
                className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 transition-all duration-300 origin-bottom-right border border-gray-100 dark:border-zinc-800 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none absolute bottom-0 right-0'
                    }`}
                role="dialog"
                aria-label="Options d'accessibilité"
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-[#0C1D36] dark:text-white mb-1">Taille du texte</h3>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 p-1 rounded-lg">
                        <button
                            onClick={decreaseText}
                            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition text-gray-700 dark:text-gray-200 font-bold text-sm"
                            aria-label="Diminuer la taille du texte"
                            title="Diminuer"
                        >
                            A-
                        </button>
                        <button
                            onClick={resetText}
                            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition text-gray-700 dark:text-gray-200 font-bold text-base"
                            aria-label="Réinitialiser la taille du texte"
                            title="Réinitialiser"
                        >
                            {fontSize}%
                        </button>
                        <button
                            onClick={increaseText}
                            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition text-gray-700 dark:text-gray-200 font-bold text-lg"
                            aria-label="Augmenter la taille du texte"
                            title="Augmenter"
                        >
                            A+
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-[#0C1D36] dark:text-white mb-1">Lecture vocale</h3>
                    <button
                        onClick={toggleReadMode}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${isReading
                            ? 'bg-[#FF453A] text-white hover:bg-[#e53e32]'
                            : 'bg-gray-50 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600'
                            }`}
                        aria-label={isReading ? "Arrêter la lecture" : "Lire le contenu de la page"}
                    >
                        {isReading ? (
                            <>
                                <span className="animate-pulse">●</span> Arrêter
                            </>
                        ) : (
                            <>
                                <span>🔊</span> Lire la page
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-[#0C1D36] dark:text-white mb-1">Thème</h3>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-700 p-1 rounded-lg">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 py-2 rounded-md transition font-medium text-sm ${theme === 'light' ? 'bg-white dark:bg-zinc-600 shadow-sm text-[#0C1D36] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            aria-label="Thème clair"
                            title="Clair"
                        >
                            ☀️
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 py-2 rounded-md transition font-medium text-sm ${theme === 'dark' ? 'bg-white dark:bg-zinc-600 shadow-sm text-[#0C1D36] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            aria-label="Thème sombre"
                            title="Sombre"
                        >
                            🌙
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`flex-1 py-2 rounded-md transition font-medium text-sm ${theme === 'system' ? 'bg-white dark:bg-zinc-600 shadow-sm text-[#0C1D36] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            aria-label="Thème système"
                            title="Système"
                        >
                            💻
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-800 transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black/30"
                aria-label="Ouvrir les options d'accessibilité"
                aria-expanded={isOpen}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                </svg>
            </button>
        </div>
    );
}
