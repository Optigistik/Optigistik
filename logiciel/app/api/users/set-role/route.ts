import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

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
    
    // Récupérer les services admin
    const auth = getAdminAuth();
    const db = getAdminDb();

    if (!auth || !db) {
      console.error("Firebase Admin non initialisé. Vérifiez les variables d'environnement.");
      return NextResponse.json({ error: 'Erreur de configuration serveur (Firebase Admin)' }, { status: 500 });
    }

    // Vérifier qui est l'utilisateur effectuant la requête
    const decodedToken = await auth.verifyIdToken(token);
    
    // IMPORTANT: Seul un Admin peut changer les rôles.
    if (decodedToken.role !== 'Admin') {
      return NextResponse.json({ error: 'Accès refusé. Réservé aux administrateurs.' }, { status: 403 });
    }

    // 1. Vérifier le rôle actuel de l'utilisateur cible
    const targetUser = await auth.getUser(targetUid);
    const currentTargetRole = targetUser.customClaims?.role;

    // Si la cible est Admin et que ce n'est pas l'utilisateur lui-même qui se modifie
    if (currentTargetRole === 'Admin' && decodedToken.uid !== targetUid) {
      return NextResponse.json({ 
        error: 'Sécurité : Vous ne pouvez pas modifier le rôle d\'un autre administrateur.' 
      }, { status: 403 });
    }

    // 2. Mettre à jour le Custom Claim dans le JWT du Firebase Auth
    await auth.setCustomUserClaims(targetUid, { role: newRole });

    // 3. Mettre à jour la collection Firestore (pour l'affichage UI)
    await db.collection('users').doc(targetUid).update({ role: newRole });

    return NextResponse.json({ success: true, message: `Rôle ${newRole} attribué avec succès.` });
  } catch (error: any) {
    console.error('Erreur lors de l\'attribution du rôle:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
