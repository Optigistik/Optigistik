'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../lib/firebase';
import { isAdmin } from '../lib/adminUtils';
import { getArticles, deleteArticle, type Article } from '../lib/articleActions';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/login');
                return;
            }

            const adminStatus = await isAdmin();
            if (!adminStatus) {
                alert('Accès refusé. Vous devez être administrateur.');
                router.push('/');
                return;
            }

            setUserEmail(user.email);
            loadArticles();
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    async function loadArticles() {
        const allArticles = await getArticles();
        setArticles(allArticles);
    }

    async function handleDelete(id: string) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        const result = await deleteArticle(id);
        if (result.success) {
            loadArticles();
        } else {
            alert('Erreur lors de la suppression');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-16 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] mb-2">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-600">Connecté en tant que: {userEmail}</p>
                    </div>
                    <Link
                        href="/admin/articles/new"
                        className="px-6 py-3 bg-[#FF453A] text-white rounded-lg hover:bg-[#e63d32] transition font-medium"
                    >
                        Nouvel Article
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-[#0C1D36]">
                            Articles ({articles.length})
                        </h2>
                    </div>

                    {articles.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Aucun article pour le moment.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {articles.map((article) => (
                                <div key={article.id} className="px-6 py-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-[#0C1D36] mb-1">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>Par {article.author}</span>
                                                <span>•</span>
                                                <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                                                <span>•</span>
                                                <span className={article.status === 'published' ? 'text-green-600' : 'text-orange-600'}>
                                                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Link
                                                href={`/admin/articles/${article.id}/edit`}
                                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article.id!)}
                                                className="px-4 py-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="text-[#0C1D36] hover:text-[#FF453A] transition"
                    >
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
