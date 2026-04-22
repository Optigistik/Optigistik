'use client';

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function trackPageView(page: string) {
    try {
        await addDoc(collection(db, 'pageViews'), {
            page,
            timestamp: serverTimestamp(),
        });
    } catch {
        // Silent fail — tracking shouldn't break the app
    }
}
