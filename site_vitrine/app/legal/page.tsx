export default function LegalPage() {
    return (
        <div className="pt-32 pb-20 px-6 md:px-16 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-archivoBlack text-[#0C1D36] mb-12">
                    Mentions Légales
                </h1>

                <div className="space-y-8 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-4">1. Éditeur du site</h2>
                        <p>
                            Le site Optigistik est édité par la société [NOM DE LA SOCIÉTÉ], [FORME JURIDIQUE] au capital de [MONTANT] €, immatriculée au Registre du Commerce et des Sociétés de [VILLE] sous le numéro [NUMÉRO SIREN].
                        </p>
                        <p className="mt-2">
                            <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
                            <strong>Numéro de TVA intracommunautaire :</strong> [NUMÉRO]<br />
                            <strong>Directeur de la publication :</strong> [NOM DU DIRECTEUR]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-4">2. Hébergement</h2>
                        <p>
                            Le site est hébergé par [NOM DE L'HÉBERGEUR], dont le siège social est situé au [ADRESSE DE L'HÉBERGEUR].<br />
                            <strong>Téléphone :</strong> [NUMÉRO DE TÉLÉPHONE]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-4">3. Propriété intellectuelle</h2>
                        <p>
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-4">4. Données personnelles</h2>
                        <p>
                            Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit en nous contactant à l'adresse : contact@optigistik.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
