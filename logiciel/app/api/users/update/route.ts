import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { targetUid, name, email, role } = await request.json();

    if (!targetUid || !name || !email || !role) {
      return NextResponse.json({ error: 'Tous les champs sont requis (uid, name, email, role)' }, { status: 400 });
    }

    // 1. Vérification de l'autorisation
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.role !== 'Admin') {
      return NextResponse.json({ error: 'Accès refusé. Réservé aux administrateurs.' }, { status: 403 });
    }

    // 2. Sécurité : Ne pas modifier un autre Admin (sauf soi-même)
    const targetUser = await adminAuth.getUser(targetUid);
    const currentTargetRole = targetUser.customClaims?.role;

    if (currentTargetRole === 'Admin' && decodedToken.uid !== targetUid) {
      return NextResponse.json({ error: 'Sécurité : Vous ne pouvez pas modifier les informations d\'un autre administrateur.' }, { status: 403 });
    }

    // 3. Mise à jour dans Firebase Auth (Email et Nom d'affichage)
    await adminAuth.updateUser(targetUid, {
      email,
      displayName: name,
    });

    // 4. Mise à jour du rôle (Custom Claims)
    await adminAuth.setCustomUserClaims(targetUid, { role });

    // 5. Mise à jour dans Firestore
    await adminDb.collection('users').doc(targetUid).update({
      name,
      email,
      role,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur mis à jour avec succès' 
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Cet email est déjà utilisé par un autre compte.' }, { status: 400 });
    }
    
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
