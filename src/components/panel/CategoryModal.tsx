import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Category } from '../../types';

interface CategoryModalProps {
  category?: Category;
  categories: Category[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function CategoryModal({ category, categories, onSubmit, onClose }: CategoryModalProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: category || {
      name: '',
      slug: '',
      description: '',
      icon: '',
      parent_id: '',
      image: ''
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {category ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori Adı
            </label>
            <input
              type="text"
              {...register('name', { required: 'Kategori adı zorunludur' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              {...register('slug', { required: 'Slug zorunludur' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Görsel URL
            </label>
            <input
              type="url"
              {...register('image')}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {watch('image') && (
              <div className="mt-2">
                <img
                  src={watch('image')}
                  alt="Önizleme"
                  className="h-32 w-full object-cover rounded-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = 'https://via.placeholder.com/800x400?text=Görsel+Bulunamadı';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              İkon
            </label>
            <input
              type="text"
              {...register('icon')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Örn: FolderTree"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Üst Kategori
            </label>
            <select
              {...register('parent_id')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Ana Kategori</option>
              {categories
                .filter(c => c.id !== category?.id)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              }
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {category ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}