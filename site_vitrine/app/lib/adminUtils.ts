import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        // Check if user email is in the admins collection
        const adminDoc = await getDoc(doc(db, 'admins', user.email!));
        return adminDoc.exists();
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Get current user email or null
 */
export function getCurrentUserEmail(): string | null {
    return auth.currentUser?.email || null;
}
