'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../../lib/firebase';
import { isAdmin, getCurrentUserEmail } from '../../../../lib/adminUtils';
import { getArticleById, updateArticle, deleteArticle, type Article } from '../../../../lib/articleActions';
import { onAuthStateChanged } from 'firebase/auth';

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const articleId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [article, setArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        status: 'draft' as 'draft' | 'published'
    });

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

            await loadArticle();
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, articleId]);

    async function loadArticle() {
        const fetchedArticle = await getArticleById(articleId);
        if (fetchedArticle) {
            setArticle(fetchedArticle);
            setFormData({
                title: fetchedArticle.title,
                content: fetchedArticle.content,
                excerpt: fetchedArticle.excerpt,
                featuredImage: fetchedArticle.featuredImage || '',
                status: fetchedArticle.status
            });
        } else {
            alert('Article non trouvé');
            router.push('/admin');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        const result = await updateArticle(articleId, formData);

        if (result.success) {
            router.push('/admin');
        } else {
            alert('Erreur lors de la mise à jour de l\'article');
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        const result = await deleteArticle(articleId);
        if (result.success) {
            router.push('/admin');
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

    if (!article) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-16 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-archivoBlack text-[#0C1D36] mb-2">
                        Modifier l'Article
                    </h1>
                    <Link
                        href="/admin"
                        className="text-[#0C1D36] hover:text-[#FF453A] transition text-sm"
                    >
                        ← Retour au dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Titre *
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#F5F7FA] focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                        />
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                            Extrait *
                        </label>
                        <textarea
                            id="excerpt"
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#F5F7FA] focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Contenu *
                        </label>
                        <textarea
                            id="content"
                            required
                            rows={15}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#F5F7FA] focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                            Image à la une (URL)
                        </label>
                        <input
                            type="url"
                            id="featuredImage"
                            value={formData.featuredImage}
                            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#F5F7FA] focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Statut *
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#F5F7FA] focus:ring-2 focus:ring-[#FF453A] focus:outline-none transition-shadow"
                        >
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-8 py-3 bg-[#FF453A] hover:bg-[#e63d32] text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-8 py-3 bg-red-100 text-red-600 hover:bg-red-200 font-medium rounded-lg transition-colors"
                        >
                            Supprimer
                        </button>
                        <Link
                            href="/admin"
                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-center flex items-center"
                        >
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
