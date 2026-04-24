import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { targetUid, newRole } = await request.json();

    if (!targetUid || !newRole) {
      return NextResponse.json({ error: 'targetUid et newRole sont requis' }, { status: 400 });
    }

    // Récupérer le token d'authentification depuis le header de la requête
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé. Jeton manquant.' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Vérifier qui est l'utilisateur effectuant la requête
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // IMPORTANT: Seul un Admin peut changer les rôles.
    // Si c'est la toute première fois et que tu n'as pas encore d'Admin, 
    // tu peux commenter temporairement ces 3 lignes pour t'attribuer le rôle Admin
    if (decodedToken.role !== 'Admin') {
      return NextResponse.json({ error: 'Accès refusé. Réservé aux administrateurs.' }, { status: 403 });
    }

    // 1. Mettre à jour le Custom Claim dans le JWT du Firebase Auth
    await adminAuth.setCustomUserClaims(targetUid, { role: newRole });

    // 2. Mettre à jour la collection Firestore (pour l'affichage UI)
    await adminDb.collection('users').doc(targetUid).update({ role: newRole });

    return NextResponse.json({ success: true, message: `Rôle ${newRole} attribué avec succès.` });
  } catch (error: any) {
    console.error('Erreur lors de l\'attribution du rôle:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
