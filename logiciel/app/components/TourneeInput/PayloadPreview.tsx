'use client'

import { useState, useCallback } from 'react'
import { useDeliveryStore } from '@/stores/deliveryStore'

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const min = totalMinutes % 60
  if (h === 0) return `${min}min`
  if (min === 0) return `${h}h`
  return `${h}h ${min}min`
}

export default function PayloadPreview() {
  const selectPayload = useDeliveryStore((s) => s.selectPayload)
  const selectValidationErrors = useDeliveryStore((s) => s.selectValidationErrors)
  const selectTotalDepotServiceTime = useDeliveryStore((s) => s.selectTotalDepotServiceTime)

  const payload = selectPayload()
  const errors = selectValidationErrors()
  const totalTime = selectTotalDepotServiceTime()
  const canSend = errors.length === 0

  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const jsonString = payload ? JSON.stringify(payload, null, 2) : '{}'

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [jsonString])

  return (
    <>
      <button
        aria-label="Ouvrir la prévisualisation du payload OR-Tools"
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-opti-blue hover:bg-gray-50 transition-colors"
      >
        Prévisualiser le payload
        {errors.length > 0 && (
          <span
            aria-label={`${errors.length} erreur(s) bloquante(s)`}
            className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-opti-red text-white text-xs font-bold"
          >
            {errors.length}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payload OR-Tools"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-opti-blue font-display">Payload OR-Tools</h3>
                <button
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 hover:bg-gray-100 text-slate-400 hover:text-opti-blue transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span>
                  Chargement dépôt total :{' '}
                  <span className="font-bold text-opti-blue">{formatDuration(totalTime)}</span>
                </span>
                {payload && (
                  <span>
                    Points valides :{' '}
                    <span className="font-bold text-opti-blue">{payload.delivery_points.length}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Validation errors */}
            {errors.length > 0 && (
              <div className="mx-6 mt-4 rounded-2xl border border-opti-red/20 bg-red-50 p-4">
                <p className="text-sm font-bold text-opti-red mb-2">
                  {errors.length} erreur(s) bloquante(s)
                </p>
                <ul className="space-y-1" role="list" aria-label="Liste des erreurs de validation">
                  {errors.map((err) => (
                    <li key={err} className="text-xs text-opti-red flex items-start gap-1.5">
                      <span aria-hidden>•</span>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* JSON preview */}
            <div className="flex-1 overflow-auto mx-6 mt-4 rounded-2xl border border-gray-100 bg-gray-50">
              <pre
                aria-label="JSON payload OR-Tools"
                className="p-4 text-xs text-opti-blue whitespace-pre-wrap break-words font-mono leading-relaxed"
              >
                {jsonString}
              </pre>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                aria-label="Copier le JSON dans le presse-papier"
                onClick={handleCopy}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-opti-blue hover:bg-gray-50 transition-colors"
              >
                {copied ? '✓ Copié !' : 'Copier le JSON'}
              </button>
              <button
                aria-label="Envoyer le payload au moteur de calcul OR-Tools"
                disabled={!canSend}
                onClick={() => alert('Payload prêt — intégration OR-Tools à brancher ici.')}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-opti-red hover:bg-opti-red-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Envoyer au calcul
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
