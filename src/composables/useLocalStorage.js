export function useLocalStorage() {
  const getItem = (key) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error(`Failed to get item "${key}" from localStorage:`, e);
      return null
    }
  }

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error(`Failed to set item "${key}" in localStorage:`, e);
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error(`Failed to remove item "${key}" from localStorage:`, e);
    }
  }

  return {
    getItem,
    setItem,
    removeItem
  }
}