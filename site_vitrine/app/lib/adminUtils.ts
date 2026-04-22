import { auth } from './firebase';

/**
 * Check if the current user is an admin via Firebase Custom Claims
 */
export async function isAdmin(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        const token = await user.getIdTokenResult(true);
        return token.claims.admin === true;
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
