import Link from 'next/link';
import { getArticles } from '../lib/articleActions';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let articles = await getArticles('published');

    // Sort articles by date desc (in memory since we removed orderBy from query)
    articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const featuredArticle = articles[0];
    const otherArticles = articles.slice(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-32 px-6 md:px-16 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-archivoBlack text-[#0C1D36] dark:text-white mb-4">
                        Blog
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Découvrez nos derniers articles sur la logistique et l'optimisation des tournées
                    </p>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Aucun article publié pour le moment.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* FEATURED ARTICLE */}
                        {featuredArticle && (
                            <Link
                                href={`/blog/${featuredArticle.slug}`}
                                className="block mb-16 group"
                            >
                                <div className="bg-white dark:bg-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
                                    <div className="h-64 lg:h-auto relative overflow-hidden">
                                        {featuredArticle.featuredImage ? (
                                            <img
                                                src={featuredArticle.featuredImage}
                                                alt={featuredArticle.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400 dark:text-gray-300">
                                                Pas d'image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="px-3 py-1 bg-[#E5E8EC] dark:bg-zinc-700 rounded-full text-[#0C1D36] dark:text-white font-medium text-xs">
                                                À la une
                                            </span>
                                            <span>{new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] dark:text-white mb-6 group-hover:text-[#FF453A] dark:group-hover:text-[#FF453A] transition-colors leading-tight">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8 line-clamp-3">
                                            {featuredArticle.excerpt}
                                        </p>
                                        <div className="text-[#FF453A] dark:text-[#FF6B64] font-medium flex items-center gap-2">
                                            Lire l'article
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* OTHER ARTICLES GRID (2-3-2-3 Pattern) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {otherArticles.map((article, index) => {
                                // Pattern: 2 items (row 1), 3 items (row 2), 2 items (row 3), etc.
                                // Cycle of 5 items: indices 0,1 are width-6 (half), indices 2,3,4 are width-4 (third)
                                const cycleIndex = index % 5;
                                const isRowOfTwo = cycleIndex < 2;
                                const colSpanClass = isRowOfTwo ? "md:col-span-6" : "md:col-span-4";

                                return (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className={`${colSpanClass} bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col`}
                                    >
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            {article.featuredImage ? (
                                                <img
                                                    src={article.featuredImage}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-400 dark:text-gray-300">
                                                    Pas d'image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                                <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</span>
                                                <span>•</span>
                                                <span>{article.author}</span>
                                            </div>
                                            <h3 className="text-xl font-archivoBlack text-[#0C1D36] dark:text-white mb-3 group-hover:text-[#FF453A] dark:group-hover:text-[#FF453A] transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">
                                                {article.excerpt}
                                            </p>
                                            <div className="text-[#FF453A] dark:text-[#FF6B64] text-sm font-medium mt-auto">
                                                Lire la suite →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
