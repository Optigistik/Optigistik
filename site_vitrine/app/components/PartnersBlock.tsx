export default function PartnersBlock() {
  const partners = [
    { name: "Landry", logo: "/assets/partnerslogo1.png" },
    { name: "Quince", logo: "/assets/partnerslogo2.png" },
    { name: "Groussard", logo: "/assets/partnerslogo3.png" },
    { name: "Le Guével", logo: "/assets/partnerslogo4.png" },
    { name: "Lalanne", logo: "/assets/partnerslogo5.png" },
    { name: "Desrumaux", logo: "/assets/partnerslogo6.png" },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 md:px-16">
      
      {/* TITRES dans un container centré */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <p className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#0C1D36] mb-2">
          NOS PARTENAIRES
        </p>
        <h2 className="text-2xl md:text-3xl font-archivoBlack text-[#0C1D36]">
          Ils nous font confiance
        </h2>
      </div>

      {/* LOGOS FULL-WIDTH MAIS AVEC LE MÊME PADDING QUE LE CTA */}
      <div className="w-full flex flex-wrap justify-between items-center gap-6 md:gap-10">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex justify-center items-center flex-1 min-w-[120px]"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-9 w-auto object-contain"
            />
          </div>
        ))}
      </div>

    </section>
  );
}