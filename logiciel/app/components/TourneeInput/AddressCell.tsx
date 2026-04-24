'use client'

import { useState, useCallback } from 'react'
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete'
import { useDeliveryStore } from '@/stores/deliveryStore'
import type { DeliveryPoint } from '@/types/logistics'

interface AddressCellProps {
  point: DeliveryPoint
  onDone: () => void
}

export default function AddressCell({ point, onDone }: AddressCellProps) {
  const updateDeliveryPoint = useDeliveryStore((s) => s.updateDeliveryPoint)
  const [value, setValue] = useState(point.address)
  const [activeIndex, setActiveIndex] = useState(-1)
  const { suggestions, isLoading, search, clearSuggestions } = useAddressAutocomplete()

  const handleSelect = useCallback((address: string) => {
    setValue(address)
    clearSuggestions()
    updateDeliveryPoint(point.id, { address })
    onDone()
  }, [point.id, updateDeliveryPoint, clearSuggestions, onDone])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) handleSelect(suggestions[activeIndex])
      else if (value.trim()) handleSelect(value.trim())
    } else if (e.key === 'Escape') { clearSuggestions(); onDone() }
  }

  return (
    <div className="relative w-full">
      <input
        autoFocus
        aria-label="Modifier l'adresse"
        value={value}
        onChange={(e) => { setValue(e.target.value); search(e.target.value) }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => {
          clearSuggestions()
          if (value.trim() && value !== point.address) updateDeliveryPoint(point.id, { address: value.trim() })
          onDone()
        }, 150)}
        className="w-full border border-opti-red rounded-lg px-3 py-1.5 text-sm text-opti-blue focus:outline-none focus:ring-2 focus:ring-opti-red/20"
      />
      {isLoading && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">…</span>}
      {suggestions.length > 0 && (
        <ul role="listbox" className="absolute z-50 mt-1 w-full bg-white rounded-2xl shadow-lg border border-gray-100 max-h-48 overflow-auto text-sm">
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={() => handleSelect(s)}
              className={`cursor-pointer px-4 py-2.5 transition-colors ${i === activeIndex ? 'bg-opti-blue text-white' : 'text-opti-blue hover:bg-gray-50'}`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
