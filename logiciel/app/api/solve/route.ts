import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

const SOLVER_URL = process.env.SOLVER_URL ?? 'http://localhost:8000'
const SHIFT_START = 28800 // 08:00 en secondes

function timeStringToSeconds(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 3600 + m * 60
}

export async function POST(request: NextRequest) {
  const db = getAdminDb()
  if (!db) {
    return NextResponse.json({ error: 'Firebase Admin non initialisé' }, { status: 500 })
  }

  const body = await request.json()
  const { session_id } = body
  if (!session_id) {
    return NextResponse.json({ error: 'session_id requis' }, { status: 400 })
  }

  // 1. Lire la matrice de distances depuis Firestore
  const matrixDoc = await db.collection('distance_matrices').doc(session_id).get()
  if (!matrixDoc.exists) {
    return NextResponse.json({ error: 'Matrice non trouvée — calcule la matrice d\'abord' }, { status: 404 })
  }
  const matrixData = matrixDoc.data()!
  const durationMatrix: number[][] = JSON.parse(matrixData.duration_matrix)
  const distanceMatrix: number[][] = JSON.parse(matrixData.distance_matrix)
  const matrixPoints: Array<{ id: string; role: string; address: string }> = matrixData.points

  // 2. Lire la session de livraison pour les palettes / service_time / time_windows
  const sessionDoc = await db.collection('delivery_sessions').doc(session_id).get()
  if (!sessionDoc.exists) {
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  }
  const sessionData = sessionDoc.data()!
  const deliveryPoints: Array<{
    id: string
    pallets: number
    loading_time_at_depot: number
    unloading_time_at_client: number
    time_window: { start: string; end: string }
  }> = sessionData.delivery_points ?? []

  const deliveryMap = new Map(deliveryPoints.map((d) => [d.id, d]))

  // 3. Construire les points enrichis dans l'ordre de la matrice
  const points = matrixPoints.map((mp) => {
    if (mp.role === 'origin' || mp.role === 'end') {
      return {
        id: mp.id,
        role: mp.role,
        address: mp.address,
        demand: 0,
        service_time: 0,
        time_window: null,
      }
    }
    const dp = deliveryMap.get(mp.id)
    if (!dp) {
      return {
        id: mp.id,
        role: mp.role,
        address: mp.address,
        demand: 0,
        service_time: 0,
        time_window: null,
      }
    }
    return {
      id: mp.id,
      role: mp.role,
      address: mp.address,
      demand: dp.pallets,
      service_time: Math.round(dp.unloading_time_at_client * 60),
      time_window: {
        start: timeStringToSeconds(dp.time_window.start),
        end: timeStringToSeconds(dp.time_window.end),
      },
    }
  })

  // 4. Récupérer les véhicules actifs
  const vehiclesSnap = await db.collection('vehicles').where('is_active', '==', true).get()
  const activeVehicles = vehiclesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any))

  if (activeVehicles.length === 0) {
    return NextResponse.json({ error: 'Aucun véhicule actif trouvé' }, { status: 400 })
  }

  // 5. Récupérer les conducteurs disponibles et les matcher aux véhicules
  const driversSnap = await db.collection('drivers').where('status', '==', 'DISPONIBLE').get()
  const drivers = driversSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any))

  const vehiclePayload = activeVehicles.map((v: any) => {
    const driver = drivers.find((d: any) =>
      Array.isArray(d.assignedVehicles) &&
      d.assignedVehicles.some((av: any) => av.vehicleId === v.id && av.isActive)
    )
    return {
      id: v.id,
      name: v.name ?? '',
      plate: v.plate ?? '',
      capacity: v.capacity_palettes ?? 0,
      driver_id: driver?.id ?? '',
      driver_name: driver ? `${driver.firstName} ${driver.lastName}` : 'Non assigné',
    }
  })

  // 6. Appeler le solveur Python
  const solverPayload = {
    session_id,
    points,
    duration_matrix: durationMatrix,
    distance_matrix: distanceMatrix,
    vehicles: vehiclePayload,
    shift_start: SHIFT_START,
  }

  let solverResult: any
  try {
    const solverResponse = await fetch(`${SOLVER_URL}/api/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solverPayload),
    })
    if (!solverResponse.ok) {
      const err = await solverResponse.json().catch(() => ({ detail: solverResponse.statusText }))
      return NextResponse.json(
        { error: `Erreur solveur (${solverResponse.status}): ${err.detail ?? err}` },
        { status: solverResponse.status }
      )
    }
    solverResult = await solverResponse.json()
  } catch (e: any) {
    return NextResponse.json({ error: `Solveur injoignable: ${e.message}` }, { status: 503 })
  }

  // 7. Sauvegarder le résultat dans Firestore
  await db.collection('solve_results').doc(session_id).set({
    ...solverResult,
    computed_at: new Date().toISOString(),
  })

  return NextResponse.json(solverResult)
}
