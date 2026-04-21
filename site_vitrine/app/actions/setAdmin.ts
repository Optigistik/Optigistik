'use server';

import { adminAuth } from '../lib/firebase-admin';

export async function setAdminClaim(email: string) {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { admin: true });
    return { success: true };
}

export async function removeAdminClaim(email: string) {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.setCustomUserClaims(user.uid, { admin: false });
    return { success: true };
}
