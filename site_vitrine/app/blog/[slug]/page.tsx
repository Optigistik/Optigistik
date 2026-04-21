import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '../../lib/articleActions';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article || article.status !== 'published') {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 pt-24 px-6 md:px-16 pb-20 transition-colors duration-300">
            <article className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <Link
                        href="/blog"
                        className="text-[#0C1D36] dark:text-white hover:text-[#FF453A] dark:hover:text-[#FF453A] transition text-sm mb-6 inline-block"
                    >
                        ← Retour au blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-archivoBlack text-[#0C1D36] dark:text-white mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <span>{article.author}</span>
                        <span>•</span>
                        <time dateTime={article.createdAt.toISOString()}>
                            {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </header>

                {/* Featured Image */}
                {article.featuredImage && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-sm">
                        <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <Link
                        href="/blog"
                        className="inline-block px-6 py-3 bg-[#FF453A] text-white rounded-lg hover:bg-[#e63d32] transition font-medium"
                    >
                        ← Retour au blog
                    </Link>
                </footer>
            </article>
        </div>
    );
}
