export default function LegalPage() {
    return (
        <div className="pt-32 pb-20 px-6 md:px-16 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <p className="text-sm text-gray-500 mb-2">Dernière mise à jour : 30/10/2025</p>
                <h1 className="text-3xl md:text-5xl font-archivoBlack text-[#0C1D36] mb-4">
                    Mentions Légales
                </h1>
                <p className="text-gray-600 mb-12">
                    Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN).
                </p>

                <div className="space-y-10 text-gray-700">

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">1. Éditeur du site</h2>
                        <p className="mb-1"><strong>Optigistik SAS</strong></p>
                        <p>Capital social : 8 900 €</p>
                        <p>Siège social : 2 Rue du Professeur Charles Appleton, 69007 Lyon</p>
                        <p>Immatriculation : 393 152 129 00011 / 393 152 129</p>
                        <p>Numéro RCS : 393 152 129 RCS Lyon</p>
                        <p>Numéro TVA intracommunautaire : FR31 393152129</p>
                        <p>Représentant : Chan Tien Alexandre, Président</p>
                        <p>Email : <a href="mailto:optigistik@gmail.com" className="text-[#FF453A] underline">optigistik@gmail.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">2. Directeur de publication</h2>
                        <p>Chan Tien Alexandre</p>
                        <p>Mail : <a href="mailto:optigistik@gmail.com" className="text-[#FF453A] underline">optigistik@gmail.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">3. Hébergeur</h2>
                        <p><strong>Infomaniak Network SA</strong></p>
                        <p>Rue Eugène-Marziano 25, 1227 Genève, Suisse</p>
                        <p>Tél. : +41 22 820 35 40</p>
                        <p>Site : <a href="https://www.infomaniak.com" className="text-[#FF453A] underline" target="_blank" rel="noopener noreferrer">infomaniak.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">4. Propriété intellectuelle</h2>
                        <p>Le site, la marque Optigistik, le logo, les textes, images, solutions techniques et logiciels sont protégés par le Code de la Propriété Intellectuelle. Toute reproduction, distribution, modification, adaptation ou utilisation non autorisée est interdite.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">5. Responsabilité</h2>
                        <p className="mb-2">Optigistik met tout en œuvre pour fournir des informations fiables mais ne garantit pas l'absence d'erreur ou d'omission. Optigistik ne pourra être tenue responsable en cas :</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>d'interruption du site</li>
                            <li>de dysfonctionnement technique</li>
                            <li>de violation du système par un tiers</li>
                            <li>d'erreurs dans les contenus</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">6. Protection des données – RGPD</h2>
                        <p>Les données collectées via le site sont traitées conformément au RGPD. Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-[#FF453A] underline">Politique de Confidentialité</a>.</p>
                        <p className="mt-2">Demande d'exercice des droits RGPD : <a href="mailto:optigistik@gmail.com" className="text-[#FF453A] underline">optigistik@gmail.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">7. Cookies</h2>
                        <p>Le site utilise des cookies techniques et, avec consentement, des cookies analytiques et marketing. Voir notre <a href="/cookies" className="text-[#FF453A] underline">Politique Cookies</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">8. Liens externes</h2>
                        <p>Le site peut contenir des liens vers d'autres sites. Optigistik décline toute responsabilité concernant leur contenu ou fonctionnement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">9. Contact</h2>
                        <p>Mail : <a href="mailto:optigistik@gmail.com" className="text-[#FF453A] underline">optigistik@gmail.com</a></p>
                        <p>Adresse : 2 Rue du Professeur Charles Appleton, 69007 Lyon</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
