'use client';

import { db } from './firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

function getSessionId(): string {
    let id = sessionStorage.getItem('_sid');
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('_sid', id);
    }
    return id;
}

export function startPresenceTracking() {
    const sessionId = getSessionId();
    const ref = doc(db, 'sessions', sessionId);

    const ping = () => setDoc(ref, { lastSeen: serverTimestamp() }, { merge: true });

    ping();
    const interval = setInterval(ping, 30_000);

    const cleanup = () => {
        clearInterval(interval);
        deleteDoc(ref);
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
        cleanup();
        window.removeEventListener('beforeunload', cleanup);
    };
}
