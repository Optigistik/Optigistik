import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK lazily
const getApp = () => {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      // During build time, we might not have these variables.
      return null;
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
      return null;
    }
  }
  return admin.app();
};

// Helpers to get the Admin services lazily
export const getAdminAuth = () => {
  const app = getApp();
  return app ? admin.auth(app) : null;
};

export const getAdminDb = () => {
  const app = getApp();
  return app ? admin.firestore(app) : null;
};

// Exporting these for backward compatibility
// Note: These will be null if called during build phase where env vars are missing
export const adminAuth = typeof window === 'undefined' ? getAdminAuth() : null as any;
export const adminDb = typeof window === 'undefined' ? getAdminDb() : null as any;
