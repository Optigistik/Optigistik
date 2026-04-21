'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../lib/firebase';
import { isAdmin } from '../lib/adminUtils';
import { getArticles, deleteArticle, type Article } from '../lib/articleActions';
import { onAuthStateChanged } from 'firebase/auth';
import { getAnalytics, getOnlineCount, getUsers, type AnalyticsData, type UserRecord } from '../lib/analyticsActions';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [onlineCount, setOnlineCount] = useState<number>(0);
    const [users, setUsers] = useState<UserRecord[]>([]);

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
            getAnalytics().then(setAnalytics);
            getOnlineCount().then(setOnlineCount);
            getUsers().then(setUsers);
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
        <div className="min-h-screen bg-gray-50 pt-32 px-6 md:px-16 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] mb-2">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">Connecté en tant que : {userEmail}</p>
                </div>

                {/* TRAFFIC */}
                <div className="mb-10">
                    <h2 className="text-2xl font-archivoBlack text-[#0C1D36] mb-6">Trafic du site</h2>

                    {analytics ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-green-200">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <p className="text-sm text-gray-500">En ligne</p>
                                    </div>
                                    <p className="text-4xl font-archivoBlack text-green-600">{onlineCount}</p>
                                    <p className="text-xs text-gray-400 mt-1">visiteurs actifs</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500 mb-1">Aujourd'hui</p>
                                    <p className="text-4xl font-archivoBlack text-[#0C1D36]">{analytics.totalToday}</p>
                                    <p className="text-xs text-gray-400 mt-1">pages vues</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500 mb-1">7 derniers jours</p>
                                    <p className="text-4xl font-archivoBlack text-[#0C1D36]">{analytics.totalWeek}</p>
                                    <p className="text-xs text-gray-400 mt-1">pages vues</p>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                    <p className="text-4xl font-archivoBlack text-[#0C1D36]">{analytics.totalAll}</p>
                                    <p className="text-xs text-gray-400 mt-1">pages vues</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-[#0C1D36]">Pages les plus visitées</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {analytics.topPages.map(({ page, count }) => (
                                        <div key={page} className="px-6 py-3 flex items-center justify-between">
                                            <span className="text-sm text-gray-700 font-medium">{page}</span>
                                            <span className="text-sm text-gray-500">{count} vues</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-sm">Chargement des stats...</p>
                    )}
                </div>

                {/* USERS */}
                <div className="mt-10">
                    <h2 className="text-2xl font-archivoBlack text-[#0C1D36] mb-6">Comptes utilisateurs ({users.length})</h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <p className="px-6 py-8 text-center text-gray-500 text-sm">Aucun utilisateur.</p>
                            ) : users.map(u => (
                                <div key={u.uid} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#0C1D36] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {u.email?.charAt(0).toUpperCase() ?? '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{u.email ?? '—'}</p>
                                            <p className="text-xs text-gray-400">
                                                Créé le {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                                                {u.lastLogin ? ` · Dernière connexion ${new Date(u.lastLogin).toLocaleDateString('fr-FR')}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    {u.isAdmin && (
                                        <span className="px-2 py-1 text-xs bg-[#0C1D36] text-white rounded-md flex-shrink-0">Admin</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ARTICLES */}
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-archivoBlack text-[#0C1D36]">Articles ({articles.length})</h2>
                        <Link
                            href="/admin/articles/new"
                            className="px-6 py-3 bg-[#FF453A] text-white rounded-lg hover:bg-[#e63d32] transition font-medium"
                        >
                            Nouvel Article
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {articles.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">Aucun article pour le moment.</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {articles.map((article) => (
                                    <div key={article.id} className="px-6 py-4 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-[#0C1D36] mb-1">{article.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
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
                                                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
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
                </div>

                <div className="mt-8">
                    <Link href="/" className="text-[#0C1D36] hover:text-[#FF453A] transition">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
