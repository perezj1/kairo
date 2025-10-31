// Categorías simplificadas para KAIRO
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'bajar_peso',
    name: 'Bajar peso',
    icon: '⚖️',
    color: '#6366f1', // Indigo - Unique
    description: 'Alcanza tu peso ideal con hábitos saludables'
  },
  {
    id: 'ahorrar',
    name: 'Ahorrar',
    icon: '💰',
    color: '#10b981', // Emerald - Unique
    description: 'Mejora tus finanzas y ahorra dinero'
  },
  {
    id: 'mantenerse_forma',
    name: 'Mantenerse en forma',
    icon: '💪',
    color: '#f59e0b', // Amber/Orange - Unique
    description: 'Mantén tu cuerpo activo y saludable'
  },
  {
    id: 'dejar_fumar',
    name: 'Dejar de fumar',
    icon: '🚭',
    color: '#ef4444', // Red - Unique
    description: 'Libérate del tabaco y mejora tu salud'
  },
  {
    id: 'comer_sano',
    name: 'Comer más sano',
    icon: '🥗',
    color: '#84cc16', // Lime Green - Unique (diferente del emerald)
    description: 'Nutre tu cuerpo con alimentos saludables'
  },
  {
    id: 'dormir_mejor',
    name: 'Dormir mejor',
    icon: '😴',
    color: '#a855f7', // Purple - Unique
    description: 'Mejora la calidad de tu descanso'
  },
  {
    id: 'eliminar_stress',
    name: 'Eliminar estrés',
    icon: '🧘',
    color: '#ec4899', // Pink - Unique
    description: 'Reduce el estrés y encuentra paz interior'
  },
  {
    id: 'mejorar_medio_ambiente',
    name: 'Mejorar el medio ambiente',
    icon: '🌍',
    color: '#06b6d4', // Cyan - Unique (más azul que teal)
    description: 'Cuida el planeta con acciones sostenibles'
  },
  {
    id: 'reducir_uso_pantallas',
    name: 'Reducir uso de pantallas',
    icon: '📱',
    color: '#8b5cf6', // Violet - Unique (diferente del purple)
    description: 'Desconecta y recupera tu tiempo libre'
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryIcon = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.icon || '🎯';
};

export const getCategoryColor = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.color || 'gray';
};
