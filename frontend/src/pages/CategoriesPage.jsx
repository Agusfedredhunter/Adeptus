import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';
import { useCategories } from '../hooks/useCategories';
import categoryService from '../services/categoryService';

export default function CategoriesPage() {
  const { categories, cargando, recargar } = useCategories();
  const [enviando, setEnviando] = useState(false);

  const handleCrear = async (datos) => {
    setEnviando(true);
    try {
      await categoryService.crear(datos);
      toast.success('Categoría creada');
      await recargar();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo crear la categoría');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await categoryService.eliminar(id);
      toast.success('Categoría eliminada');
      await recargar();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la categoría');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <p className="text-sm text-gray-500">Organizá tus ingresos y gastos por categoría</p>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Nueva categoría</h2>
        <CategoryForm onSubmit={handleCrear} enviando={enviando} />
      </Card>

      <Card>
        {cargando ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <CategoryList categories={categories} onEliminar={handleEliminar} />
        )}
      </Card>
    </div>
  );
}
