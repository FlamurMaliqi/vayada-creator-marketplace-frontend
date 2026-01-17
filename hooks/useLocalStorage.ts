/**
 * Hook for type-safe localStorage access with SSR support
 */

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get value from localStorage or return initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      // Handle string values that aren't JSON
      if (typeof initialValue === 'string') {
        return item as T
      }
      // Handle boolean values stored as strings
      if (typeof initialValue === 'boolean') {
        return (item === 'true') as T
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Read from localStorage after mount (SSR safety)
  useEffect(() => {
    setStoredValue(readValue())
  }, [readValue])

  // Set value in localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (typeof window === 'undefined') {
        console.warn(`Cannot set localStorage key "${key}" during SSR`)
        return
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value

        // Store based on type
        if (typeof newValue === 'string') {
          window.localStorage.setItem(key, newValue)
        } else if (typeof newValue === 'boolean') {
          window.localStorage.setItem(key, String(newValue))
        } else {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        }

        setStoredValue(newValue)

        // Dispatch storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: String(newValue) }))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
