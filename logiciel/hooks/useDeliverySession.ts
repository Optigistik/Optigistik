import { useEffect, useRef, useCallback, useState } from 'react'
import { useDeliveryStore } from '@/stores/deliveryStore'
import { saveSession, loadSession } from '@/services/firestoreSession'

const AUTO_SAVE_INTERVAL_MS = 30_000

export function useDeliverySession() {
  const session = useDeliveryStore((s) => s.session)
  const isDirty = useDeliveryStore((s) => s.isDirty)
  const savingRef = useRef(false)
  const [isSaving, setIsSaving] = useState(false)

  const save = useCallback(async () => {
    if (!session || savingRef.current) return
    savingRef.current = true
    setIsSaving(true)
    try {
      await saveSession(session)
      useDeliveryStore.setState({ isDirty: false })
    } catch (err) {
      console.error('[useDeliverySession] save error:', err)
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }, [session])

  const load = useCallback(async (id: string) => {
    try {
      const loaded = await loadSession(id)
      if (loaded) {
        useDeliveryStore.setState({ session: loaded, isDirty: false })
      }
    } catch (err) {
      console.error('[useDeliverySession] load error:', err)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) save()
    }, AUTO_SAVE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isDirty, save])

  return { save, load, isSaving }
}
