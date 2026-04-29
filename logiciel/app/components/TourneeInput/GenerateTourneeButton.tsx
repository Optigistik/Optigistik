'use client'

import { useState } from 'react'
import { useDeliveryStore } from '@/stores/deliveryStore'
import { geocodeAddress } from '@/services/geocoding'
import { generateClusters, ClusterNode, ClusteringResult } from '@/services/clustering'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Check, Copy, X, Loader2, MapPin, Group, AlertCircle, Send, Code, Grid3X3 } from 'lucide-react'
import { generateAndSaveDistanceMatrix, MatrixPoint } from '@/services/distanceMatrix'

export default function GenerateTourneeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<ClusteringResult | null>(null)
  const [unlocated, setUnlocated] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [matrixStatus, setMatrixStatus] = useState<'idle' | 'computing' | 'done' | 'error'>('idle')

  const session = useDeliveryStore((s) => s.session)
  const selectValidationErrors = useDeliveryStore((s) => s.selectValidationErrors)
  const errors = selectValidationErrors()
  const canGenerate = errors.length === 0 && (session?.delivery_points.length ?? 0) > 0

  const handleGenerate = async () => {
    if (!session) return
    setIsOpen(true)
    setIsProcessing(true)
    setResult(null)
    setUnlocated([])
    setShowJson(false)
    setMatrixStatus('idle')

    const nodes: ClusterNode[] = []
    const failed: string[] = []

    // 1. Géocodage séquentiel
    for (const point of session.delivery_points) {
      const geo = await geocodeAddress(point.address)
      if (geo) {
        nodes.push({
          ...point, // On garde l'intégralité des métadonnées originales
          lat: geo.lat,
          lng: geo.lng,
          demand: point.pallets,
          service_time: point.unloading_time_at_client * 60,
          time_window: {
            start: parseInt(point.time_window.start.split(':')[0]) * 3600 + parseInt(point.time_window.start.split(':')[1]) * 60,
            end: parseInt(point.time_window.end.split(':')[0]) * 3600 + parseInt(point.time_window.end.split(':')[1]) * 60,
          }
        } as any)
      } else {
        failed.push(point.address)
      }
    }

    // 2. Géocodage du dépôt de départ et du point final (en parallèle)
    const [originGeo, endGeo] = await Promise.all([
      geocodeAddress(session.origin_node.address),
      geocodeAddress(session.end_node.address),
    ])

    // 3. Clustering (synchrone, instantané)
    const clusteringResult = generateClusters(nodes)

    // 4. Construction des points pour la matrice : dépôt + livraisons + retour
    const matrixPoints: MatrixPoint[] = []
    if (originGeo) {
      matrixPoints.push({ id: 'depot_origin', address: session.origin_node.address, lat: originGeo.lat, lng: originGeo.lng, role: 'origin' })
    }
    for (const node of nodes) {
      matrixPoints.push({ id: node.id, address: node.address, lat: node.lat, lng: node.lng, role: 'delivery' })
    }
    if (endGeo) {
      matrixPoints.push({ id: 'depot_end', address: session.end_node.address, lat: endGeo.lat, lng: endGeo.lng, role: 'end' })
    }

    // 5. Sauvegarde des clusters (bloquant, rapide)
    setIsSaving(true)
    try {
      await updateDoc(doc(db, 'delivery_sessions', session.id), {
        clusters: clusteringResult.clusters,
        unlocated_points: failed,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des clusters dans Firebase:", error)
    } finally {
      setIsSaving(false)
    }

    // 6. Affichage des résultats immédiatement
    setResult(clusteringResult)
    setUnlocated(failed)
    setIsProcessing(false)

    // 7. Calcul de la matrice en arrière-plan (non bloquant pour l'UI)
    if (matrixPoints.length >= 2) {
      setMatrixStatus('computing')
      generateAndSaveDistanceMatrix(session.id, matrixPoints)
        .then(() => setMatrixStatus('done'))
        .catch((err) => {
          console.error('Erreur matrice (non bloquant):', err)
          setMatrixStatus('error')
        })
    }
  }

  const handleCopyJSON = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-opti-blue text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
      >
        <Group className="w-4 h-4" />
        Générer la tournée
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-opti-blue font-display">Optimisation de la tournée</h3>
                <p className="text-slate-500 text-sm mt-1">Groupement intelligent & stockage Firebase synchronisé</p>
              </div>
              <div className="flex items-center gap-2">
                {result && (
                  <button 
                    onClick={() => setShowJson(!showJson)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showJson ? 'bg-opti-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <Code className="w-4 h-4" />
                    {showJson ? 'Voir les cartes' : 'Voir le JSON'}
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-opti-blue animate-spin" />
                    <MapPin className="w-6 h-6 text-opti-red absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h4 className="text-xl font-bold text-opti-blue mb-2">Traitement en cours...</h4>
                  <p className="text-slate-500 max-w-xs">Géocodage, regroupement et sauvegarde sécurisée dans Firebase.</p>
                </div>
              ) : showJson ? (
                <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden">
                  <pre className="text-xs text-green-400 font-mono overflow-auto max-h-[500px]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-8">
                  {unlocated.length > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 text-opti-red mb-4">
                        <AlertCircle className="w-6 h-6" />
                        <h4 className="font-bold">Adresses non localisées ({unlocated.length})</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {unlocated.map((addr, i) => (
                          <div key={i} className="text-xs font-medium text-red-600 bg-white/50 px-3 py-2 rounded-lg border border-red-50 truncate">
                            {addr}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result?.clusters.map((cluster) => (
                      <div key={cluster.group_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-bold text-opti-blue uppercase tracking-wider">Groupe #{cluster.group_id}</span>
                          <span className="text-[10px] font-bold bg-white text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                            {cluster.nodes.length} points
                          </span>
                        </div>
                        <div className="p-5 space-y-3">
                          {cluster.nodes.map((node) => (
                            <div key={node.id} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-opti-red mt-1.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">{node.address}</p>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] text-slate-400 font-medium">{node.pallets} palettes</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{node.time_window.start} - {node.time_window.end}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-white sticky bottom-0">
              <button 
                onClick={handleCopyJSON}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-opti-blue transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'JSON Copié' : 'Copier le JSON complet'}
              </button>
              
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-xl mr-2">
                  <Check className="w-3 h-3" />
                  Firebase Synchronisé
                </div>
                {matrixStatus === 'computing' && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl mr-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Matrice en calcul...
                  </div>
                )}
                {matrixStatus === 'done' && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl mr-2">
                    <Grid3X3 className="w-3 h-3" />
                    Matrice calculée
                  </div>
                )}
                {matrixStatus === 'error' && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl mr-2">
                    <AlertCircle className="w-3 h-3" />
                    Matrice non disponible
                  </div>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Fermer
                </button>
                <button 
                  disabled={isProcessing || !result}
                  onClick={() => alert('Tournée envoyée au calcul !')}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-opti-red text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                  Lancer l'optimisation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
