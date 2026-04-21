

import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface Article {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    status: 'draft' | 'published';
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Create a new article
 */
export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const now = Timestamp.now();
        const docRef = await addDoc(collection(db, 'articles'), {
            ...data,
            createdAt: now,
            updatedAt: now
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating article:', error);
        return { success: false, error: 'Failed to create article' };
    }
}

/**
 * Update an existing article
 */
export async function updateArticle(id: string, data: Partial<Article>) {
    try {
        const articleRef = doc(db, 'articles', id);
        await updateDoc(articleRef, {
            ...data,
            updatedAt: Timestamp.now()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating article:', error);
        return { success: false, error: 'Failed to update article' };
    }
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string) {
    try {
        await deleteDoc(doc(db, 'articles', id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting article:', error);
        return { success: false, error: 'Failed to delete article' };
    }
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
    try {
        const docSnap = await getDoc(doc(db, 'articles', id));

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            } as Article;
        }

        return null;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            } as Article;
        }

        return null;
    } catch (error) {
        console.error('Error fetching article by slug:', error);
        return null;
    }
}

/**
 * Get all articles (with optional status filter)
 */
export async function getArticles(status?: 'draft' | 'published'): Promise<Article[]> {
    try {
        let q;

        if (status) {
            // Note: Mixing where() and orderBy() requires a composite index in Firestore.
            // We remove orderBy() here to avoid the need for an index initially.
            q = query(collection(db, 'articles'), where('status', '==', status));
        } else {
            q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const articles: Article[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            articles.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            } as Article);
        });

        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}
