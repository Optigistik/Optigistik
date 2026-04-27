"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type UserData = {
  uid: string;
  email: string;
  name: string;
  role: string;
  createdAt: any;
};

const ROLES = ["Admin", "Gestionnaire", "Lecteur", "Chauffeur"];

export default function RolesAdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Charger la liste des utilisateurs depuis Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: UserData[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() } as UserData);
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fonction pour changer le rôle
  const handleRoleChange = async (targetUid: string, newRole: string) => {
    if (!confirm(`Voulez-vous vraiment attribuer le rôle ${newRole} ?`)) return;
    
    setUpdatingId(targetUid);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Vous n'êtes pas connecté");

      const response = await fetch("/api/users/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUid, newRole }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      alert("Rôle mis à jour avec succès !");
      
      // Mettre à jour l'UI localement
      setUsers(users.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
    } catch (error: any) {
      alert("Erreur: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        <p className="mt-4 text-slate-500">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestion des Rôles et Utilisateurs</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-medium text-slate-600">Nom</th>
              <th className="p-4 text-sm font-medium text-slate-600">Email</th>
              <th className="p-4 text-sm font-medium text-slate-600">Date de création</th>
              <th className="p-4 text-sm font-medium text-slate-600">Rôle</th>
              <th className="p-4 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-800 font-medium">{user.name || "N/A"}</td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-sm text-slate-500">
                  {typeof user.createdAt === "string" 
                    ? user.createdAt 
                    : user.createdAt?.toDate 
                      ? user.createdAt.toDate().toLocaleDateString() 
                      : JSON.stringify(user.createdAt)}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'Gestionnaire' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'Chauffeur' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {user.role || "Aucun"}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="text-sm border border-slate-300 rounded p-1.5 bg-white disabled:opacity-50"
                    value={user.role || ""}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                    disabled={updatingId === user.uid}
                  >
                    <option value="" disabled>Changer le rôle...</option>
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Aucun utilisateur trouvé dans la collection Firestore.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
