import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key)
      if (!storedValue) return initialValue

      const parsedValue = JSON.parse(storedValue)
      if (Array.isArray(initialValue) && !Array.isArray(parsedValue)) return initialValue
      if (typeof initialValue === 'number') {
        return typeof parsedValue === 'number' && Number.isFinite(parsedValue) && parsedValue > 0
          ? parsedValue
          : initialValue
      }
      return parsedValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // A aplicação continua utilizável mesmo quando o navegador bloqueia o armazenamento.
    }
  }, [key, value])

  return [value, setValue]
}
