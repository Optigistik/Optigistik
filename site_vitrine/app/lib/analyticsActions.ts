'use server';

import { adminAuth } from './firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export type PageViewStat = {
    page: string;
    count: number;
};

export type AnalyticsData = {
    totalToday: number;
    totalWeek: number;
    totalAll: number;
    topPages: PageViewStat[];
};

export type UserRecord = {
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: string | null;
    lastLogin: string | null;
    isAdmin: boolean;
};

export async function getAnalytics(): Promise<AnalyticsData> {
    const db = getFirestore();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 7);

    const snapshot = await db.collection('pageViews').orderBy('timestamp', 'desc').get();

    const docs = snapshot.docs.map(d => ({
        page: d.data().page as string,
        timestamp: (d.data().timestamp as Timestamp)?.toDate() ?? new Date(0),
    }));

    const totalAll = docs.length;
    const totalToday = docs.filter(d => d.timestamp >= startOfToday).length;
    const totalWeek = docs.filter(d => d.timestamp >= startOfWeek).length;

    const pageCounts: Record<string, number> = {};
    for (const d of docs) {
        pageCounts[d.page] = (pageCounts[d.page] ?? 0) + 1;
    }

    const topPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return { totalToday, totalWeek, totalAll, topPages };
}

export async function getOnlineCount(): Promise<number> {
    const db = getFirestore();
    const cutoff = new Date(Date.now() - 60_000); // actif dans la dernière minute
    const snapshot = await db.collection('sessions')
        .where('lastSeen', '>=', Timestamp.fromDate(cutoff))
        .get();
    return snapshot.size;
}

export async function getUsers(): Promise<UserRecord[]> {
    const result = await adminAuth.listUsers(1000);
    return result.users.map(u => ({
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        createdAt: u.metadata.creationTime ?? null,
        lastLogin: u.metadata.lastSignInTime ?? null,
        isAdmin: (u.customClaims as Record<string, unknown> | undefined)?.admin === true,
    }));
}
