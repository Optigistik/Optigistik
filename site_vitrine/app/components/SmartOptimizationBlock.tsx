import React from 'react';
import Image from 'next/image';

export default function SmartOptimizationBlock() {
    const features = [
        {
            title: 'Tableau de bord',
            description: 'Itinéraires, retards/avances, imprévus recalculés automatiquement.',
        },
        {
            title: 'Optimisation IA',
            description: 'Pré-optimisation et réoptimisation instantanée des trajets.',
        },
        {
            title: 'Respect des contraintes',
            description: 'Prise en compte des règles légales et techniques.',
        },
        {
            title: 'Suivi en temps réel',
            description: 'Boîtier connecté : vitesse, carburant, géolocalisation, CO₂.',
        },
    ];

    return (
        <section className="w-full bg-[#E5E8EC] py-20 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image Section */}
                <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm">
                    <Image
                        src="/assets/flotteIA.png"
                        alt="Optimisation intelligente des tournées"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content Section */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] mb-8 leading-tight">
                        Optimisation intelligente des tournées
                    </h2>

                    <div className="space-y-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col">
                                <h3 className="text-lg md:text-xl font-archivoBlack text-[#0C1D36] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-700">
                                    → {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
