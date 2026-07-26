import { useCallback, useEffect, useState } from 'react';
import categoryService from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await categoryService.listar();
      setCategories(data);
    } catch (err) {
      setError('No se pudieron cargar las categorías');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { categories, cargando, error, recargar };
}
