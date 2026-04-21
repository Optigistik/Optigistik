import Link from "next/link";

export default function CtaStrip({ className = "bg-[#E5E8EC] dark:bg-zinc-800" }: { className?: string }) {
  return (
    <section className={`w-full py-10 px-6 md:px-16 transition-colors duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-archivoBlack text-[#0C1D36] dark:text-white mb-1">
            Prêt à optimiser votre logistique ?
          </h2>

          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Choisissez l’offre OPTIGISTIK qui vous convient
          </p>
        </div>

        <Link
          href="/pricing"
          className="px-6 py-3 bg-[#FF453A] text-white rounded-lg font-medium text-sm md:text-base hover:bg-[#e63d32] transition shadow-sm hover:shadow-md"
        >
          Obtenir le logiciel
        </Link>
      </div>
    </section>
  );
}