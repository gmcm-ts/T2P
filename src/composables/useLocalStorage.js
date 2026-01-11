export function useLocalStorage() {
  const getItem = (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  }

  return {
    getItem,
    setItem,
    removeItem
  }
}