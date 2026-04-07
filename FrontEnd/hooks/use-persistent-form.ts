import { useState, useEffect } from 'react';

export function usePersistentForm<T>(key: string, initialValues: T) {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValues;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValues;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValues;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(values));
        } catch (error) {
          console.error('Error writing to localStorage', error);
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(timeoutId);
    }
  }, [key, values]);

  const clearForm = () => {
    setValues(initialValues);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('Error clearing localStorage', error);
      }
    }
  };

  return [values, setValues, clearForm] as const;
}
