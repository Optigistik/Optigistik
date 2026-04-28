import { useState, useRef, useCallback } from 'react'
import { fetchSuggestions } from '@/services/autocomplete'

const DEBOUNCE_MS = 300

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortController = useRef<AbortController | null>(null)

  const search = useCallback((text: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (abortController.current) abortController.current.abort()

    if (text.length < 3) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer.current = setTimeout(async () => {
      abortController.current = new AbortController()
      const results = await fetchSuggestions(text, abortController.current.signal)
      setSuggestions(results)
      setIsLoading(false)
    }, DEBOUNCE_MS)
  }, [])

  const clearSuggestions = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (abortController.current) abortController.current.abort()
    setSuggestions([])
    setIsLoading(false)
  }, [])

  return { suggestions, isLoading, search, clearSuggestions }
}
