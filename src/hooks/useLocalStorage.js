import { useEffect, useState } from 'react';

// Hook extra de la rúbrica: persistencia reutilizable para favoritos y tema.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // No bloqueamos la UI si no hay espacio o acceso al almacenamiento.
    }
  }, [key, value]);

  return [value, setValue];
}
