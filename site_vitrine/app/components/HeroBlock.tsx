import Link from "next/link";

export default function HeroBlock() {
  return (
    <section className="w-full bg-[#E5E8EC] py-20 px-6 md:px-16 rounded-xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] leading-tight mb-6">
            Une solution qui vous fera <br /> gagner du temps
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
            Notre solution révolutionne la logistique grâce à l’intelligence
            artificielle. Elle identifie les optimisations possibles et génère 
            automatiquement des feuilles de route intelligentes. Grâce à elle, 
            planifier vos opérations devient simple, rapide et efficace, tout en 
            réduisant les coûts et en améliorant la performance globale de vos livraisons.
          </p>

          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-[#FF453A] text-white rounded-lg text-sm md:text-base font-medium hover:bg-[#e63d32] transition"
          >
            Accéder au logiciel
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/assets/warehouse.jpg"
            alt="Entrepôt logistique"
            className="w-full h-auto max-w-md md:max-w-none rounded-xl shadow-sm"
          />
        </div>

      </div>
    </section>
  );
}