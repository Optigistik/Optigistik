export default function CookiesPage() {
    return (
        <div className="pt-32 pb-20 px-6 md:px-16 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <p className="text-sm text-gray-500 mb-2">Dernière mise à jour : 30/10/2025</p>
                <h1 className="text-3xl md:text-5xl font-archivoBlack text-[#0C1D36] mb-4">
                    Politique Cookies
                </h1>
                <p className="text-gray-600 mb-12">
                    La présente politique explique comment Optigistik utilise des cookies et technologies similaires sur son site internet. Elle complète notre <a href="/confidentialite" className="text-[#FF453A] underline">Politique de Confidentialité</a>.
                </p>

                <div className="space-y-10 text-gray-700">

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">1. Qu'est-ce qu'un cookie ?</h2>
                        <p>Un cookie est un petit fichier texte enregistré sur votre appareil (ordinateur, smartphone, tablette) lorsque vous consultez un site. Il permet d'assurer le bon fonctionnement du site, d'améliorer la navigation et, lorsque vous y consentez, d'analyser l'audience ou personnaliser l'expérience.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">2. Qui dépose les cookies ?</h2>
                        <p className="mb-2">Les cookies utilisés sur le site sont déposés par :</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Optigistik SAS</li>
                            <li>Nos prestataires techniques (hébergeur, outils d'analyse, CRM…)</li>
                        </ul>
                        <p className="mt-2">Tous nos partenaires respectent le RGPD.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">3. Types de cookies utilisés</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-[#0C1D36] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Finalité</th>
                                        <th className="px-4 py-3 text-left">Consentement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Techniques essentiels</td>
                                        <td className="px-4 py-3">Bon fonctionnement du site, sécurité, affichage</td>
                                        <td className="px-4 py-3 text-gray-500">Non (obligatoires)</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="px-4 py-3 font-medium">Analytics / mesure d'audience</td>
                                        <td className="px-4 py-3">Analyser le trafic, pages visitées, performances</td>
                                        <td className="px-4 py-3 text-green-600 font-medium">Oui</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="px-4 py-3 font-medium">Marketing (optionnels)</td>
                                        <td className="px-4 py-3">Tracking publicitaire, retargeting</td>
                                        <td className="px-4 py-3 text-green-600 font-medium">Oui</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="px-4 py-3 font-medium">Personnalisation</td>
                                        <td className="px-4 py-3">Amélioration expérience utilisateur</td>
                                        <td className="px-4 py-3 text-green-600 font-medium">Oui</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">4. Pourquoi utilisons-nous des cookies ?</h2>
                        <p className="font-medium mb-2">Cookies nécessaires</p>
                        <p className="mb-2">Ces cookies sont indispensables pour :</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                            <li>faire fonctionner le site</li>
                            <li>sécuriser les connexions</li>
                            <li>mémoriser vos préférences basiques</li>
                            <li>assurer la stabilité technique</li>
                        </ul>
                        <p className="font-medium mb-2">Cookies d'analyse (si accepté)</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                            <li>Pages visitées</li>
                            <li>Durée de visite</li>
                            <li>Navigation sur le site</li>
                            <li>Zones d'intérêt</li>
                        </ul>
                        <p className="font-medium mb-2">Cookies marketing (si mis en place)</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Google Ads</li>
                            <li>Meta Pixel</li>
                            <li>LinkedIn Insight Tag</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">5. Gestion et refus des cookies</h2>
                        <p className="mb-2">Lors de votre première visite, vous pouvez accepter, personnaliser ou refuser tous les cookies non essentiels. Vous pouvez également désactiver les cookies via votre navigateur (Chrome, Firefox, Safari, Edge).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">6. Durée de conservation</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-[#0C1D36] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Type de cookie</th>
                                        <th className="px-4 py-3 text-left">Durée maximale</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-white"><td className="px-4 py-3">Cookies essentiels</td><td className="px-4 py-3">Durée de session ou 12 mois</td></tr>
                                    <tr className="bg-gray-50"><td className="px-4 py-3">Cookies d'analyse</td><td className="px-4 py-3">13 mois maximum</td></tr>
                                    <tr className="bg-white"><td className="px-4 py-3">Consentement cookie</td><td className="px-4 py-3">6 mois</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#0C1D36] mb-3">7. Contact</h2>
                        <p>Mail : <a href="mailto:optigistik@gmail.com" className="text-[#FF453A] underline">optigistik@gmail.com</a></p>
                        <p>Adresse : 2 Rue du Professeur Charles Appleton, 69007 Lyon</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
