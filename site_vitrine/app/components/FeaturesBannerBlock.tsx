import Link from "next/link";

export default function FeaturesBannerBlock() {
    return (
        <section className="w-full bg-[#E5E8EC] dark:bg-zinc-800 pt-32 pb-20 px-6 md:px-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT IMAGE */}
                <div className="flex justify-center lg:justify-start">
                    <img
                        src="/assets/controlecenter.png"
                        alt="Opérations logistiques centralisées"
                        className="w-full h-auto lg:max-w-none rounded-xl shadow-sm"
                    />
                </div>

                {/* RIGHT TEXT */}
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] dark:text-white leading-tight mb-6">
                        Toutes vos opérations <br />
                        logistiques, centralisées et <br />
                        optimisées par l’IA
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                        OPTIGISTIK regroupe l’essentiel d’un TMS moderne et y ajoute une couche
                        d’intelligence artificielle. De la gestion de vos véhicules à l’optimisation
                        de vos tournées en temps réel, notre logiciel s’adapte à votre entreprise
                        et simplifie vos prises de décision.
                    </p>

                    <Link
                        href="/pricing"
                        className="inline-block px-6 py-3 bg-[#FF453A] text-white rounded-lg text-sm md:text-base font-medium hover:bg-[#e63d32] transition shadow-sm hover:shadow-md"
                    >
                        Obtenir le logiciel
                    </Link>
                </div>

            </div>
        </section>
    );
}
