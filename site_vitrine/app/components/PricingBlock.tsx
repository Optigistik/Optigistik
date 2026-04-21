import React from 'react';

export default function PricingBlock() {
    return (
        <section className="w-full bg-[#E5E8EC] dark:bg-zinc-800 pt-32 pb-20 px-6 md:px-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#0C1D36] dark:text-gray-300 uppercase mb-4">
                        Nos offres
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] dark:text-white mb-6">
                        Une solution adaptée à chaque besoin
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                        Que vous soyez une petite entreprise de transport ou un grand groupe logistique, OPTIGISTIK propose des formules adaptées à votre taille et à vos objectifs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Illimité Card */}
                    <div className="bg-white dark:bg-zinc-700 rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-2xl md:text-3xl font-archivoBlack text-[#0C1D36] dark:text-white mb-4">Illimité</h3>
                        <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base font-medium mb-8 min-h-[48px] flex items-center">
                            L'abonnement qui vous donne accès à notre Logiciel en illimité
                        </p>
                        <div className="text-4xl md:text-6xl font-archivoBlack text-[#0C1D36] dark:text-white mb-10">
                            14 999€/M
                        </div>
                        <button className="mt-auto px-8 py-3 bg-[#FF453A] hover:bg-[#e63d32] text-white font-medium rounded-lg transition-colors">
                            Activer
                        </button>
                    </div>

                    {/* À l'usage Card */}
                    <div className="bg-white dark:bg-zinc-700 rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-2xl md:text-3xl font-archivoBlack text-[#0C1D36] dark:text-white mb-4">À l'usage</h3>
                        <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base font-medium mb-8 min-h-[48px] flex items-center">
                            L'abonnement adapté à la taille de votre entreprise. Avec lequel vous avez accès à l'entièreté du logiciel
                        </p>
                        <div className="text-4xl md:text-6xl font-archivoBlack text-[#0C1D36] dark:text-white mb-10">
                            x€/M
                        </div>
                        <button className="mt-auto px-8 py-3 bg-[#FF453A] hover:bg-[#e63d32] text-white font-medium rounded-lg transition-colors">
                            Activer
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
