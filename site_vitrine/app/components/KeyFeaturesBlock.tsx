import Link from "next/link";

export default function KeyFeaturesBlock() {
  const features = [
    {
      icon: "/assets/camion.png",
      title: "Flotte & Conducteurs",
      text: "Suivi des véhicules, plannings et permis."
    },
    {
      icon: "/assets/cadeau.png",
      title: "Tournées & Commandes",
      text: "Trajets optimisés et gestion des commandes récurrentes."
    },
    {
      icon: "/assets/live.png",
      title: "Visualisation en direct",
      text: "Géolocalisation, CO₂, vitesse, alertes en direct."
    },
  ];

  return (
    <section className="w-full bg-[#E5E8EC] dark:bg-zinc-800 py-20 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#0C1D36] dark:text-gray-300 mb-4">
          LES FONCTIONNALITÉS CLÉS
        </p>

        <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] dark:text-white mb-4">
          Toutes vos opérations, réunies dans un seul logiciel
        </h2>

        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          OPTIGISTIK centralise vos besoins logistiques dans une plateforme unique,
          intuitive et boostée par l’IA.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {features.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <img
                src={item.icon}
                alt={item.title}
                className="w-12 h-12 mb-4"
              />

              <h3 className="text-lg font-archivoBlack text-[#0C1D36] dark:text-white mb-2">
                {item.title}
              </h3>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          className="inline-block px-6 py-3 bg-[#FF453A] text-white rounded-lg text-sm md:text-base font-medium hover:bg-[#e63d32] transition shadow-sm hover:shadow-md"
        >
          Obtenir le logiciel
        </Link>
      </div>
    </section>
  );
}