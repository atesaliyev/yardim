import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FolderTree, ChevronRight, ChevronDown } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { useCategoryStore } from '../../store/categoryStore';
import CategoryModal from '../../components/panel/CategoryModal';
import toast from 'react-hot-toast';

interface CategoryWithChildren {
  id: string;
  name: string;
  description: string;
  icon: string;
  parent_id: string | null;
  children?: CategoryWithChildren[];
  level: number;
}

export default function Categories() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data: any) => {
    try {
      await createCategory({
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      });
      toast.success('Kategori başarıyla oluşturuldu');
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedCategory) return;
    try {
      await updateCategory(selectedCategory.id, {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      });
      toast.success('Kategori başarıyla güncellendi');
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const buildCategoryTree = (categories: CategoryWithChildren[]): CategoryWithChildren[] => {
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories: CategoryWithChildren[] = [];
    categoryMap.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCategory(id);
        toast.success('Kategori başarıyla silindi');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const renderCategoryRow = (category: CategoryWithChildren, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);

    return (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div style={{ marginLeft: `${level * 24}px` }} className="flex items-center">
                {hasChildren && (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-1 hover:bg-gray-100 rounded-full mr-2"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{category.description}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => {
                setSelectedCategory(category);
                setShowEditModal(true);
              }}
              className="text-blue-600 hover:text-blue-900 mr-3"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </td>
        </tr>
        {isExpanded && category.children?.map(child => renderCategoryRow(child, level + 1))}
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p>Bir hata oluştu: {error}</p>
          <button
            onClick={() => fetchCategories()}
            className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  const categoryTree = buildCategoryTree(categories as CategoryWithChildren[]);

  return (
    <div>
      <PageHeader
        title="Kategoriler"
        description="Rehber kategorilerini yönetin"
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kategori
        </button>
      </PageHeader>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryTree.map(category => renderCategoryRow(category))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <CategoryModal
          categories={categories}
          onSubmit={handleCreate}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          categories={categories}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
}