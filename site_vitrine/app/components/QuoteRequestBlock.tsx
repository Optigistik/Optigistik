'use client';

import { useState } from 'react';
import { sendQuoteRequestEmail } from '../actions';

export default function QuoteRequestBlock() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await sendQuoteRequestEmail(formData);

        setIsSubmitting(false);

        if (result.success) {
            setIsSuccess(true);
        } else {
            setError(result.error || 'Une erreur est survenue.');
        }
    }

    if (isSuccess) {
        return (
            <section className="w-full py-20 px-4 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center rounded-xl shadow-sm my-12 transition-colors duration-300">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0C1D36] dark:text-white mb-6">
                        Demande reçue !
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Merci de votre intérêt pour Optigistik. Notre équipe commerciale va étudier votre demande et vous recontactera très prochainement avec une proposition adaptée.
                    </p>
                    <div className="flex justify-center">
                        <img
                            src="/assets/LogoOpitigistik2RMBG.png"
                            alt="Optigistik Logo"
                            className="h-24 w-auto"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="devis" className="w-full bg-white dark:bg-zinc-900 py-16 px-6 md:px-16 rounded-[2rem] shadow-sm my-12 transition-colors duration-300 scroll-mt-28">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] dark:text-white mb-4">
                        Demander un devis personnalisé
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Remplissez ce formulaire pour que nous puissions comprendre vos besoins et vous proposer la meilleure offre.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nom de l'entreprise *
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nom du contact *
                            </label>
                            <input
                                type="text"
                                id="contactName"
                                name="contactName"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email professionnel *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Téléphone *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Section 2: Operational Details */}
                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
                        <h3 className="text-xl font-archivoBlack text-[#0C1D36] dark:text-white mb-6">
                            Vos opérations logistiques
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="fleetSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Taille de la flotte (véhicules) *
                                </label>
                                <input
                                    type="number"
                                    id="fleetSize"
                                    name="fleetSize"
                                    min="1"
                                    placeholder="Ex: 1200"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Secteur d'activité *
                                </label>
                                <input
                                    type="text"
                                    id="sector"
                                    name="sector"
                                    placeholder="Ex: Transport frigorifique, BTP, Livraison dernier km..."
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Needs */}
                    <div className="space-y-2">
                        <label htmlFor="needs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Vos besoins spécifiques ou challenges actuels
                        </label>
                        <textarea
                            id="needs"
                            name="needs"
                            rows={4}
                            placeholder="Dites-nous en plus sur ce que vous cherchez à améliorer (optimisation de tournées, réduction des coûts, suivi temps réel...)"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-[#F5F7FA] dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow resize-none"
                        ></textarea>
                    </div>

                    {error && (
                        <div className="text-red-600 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-[#FF453A] hover:bg-[#e63d32] text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Demander mon devis gratuit'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
