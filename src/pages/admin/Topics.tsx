import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FileText, Search, BookOpen } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { useTopicStore } from '../../store/topicStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useGuideStore } from '../../store/guideStore';
import TopicModal from '../../components/panel/TopicModal';
import GuideInclusionModal from '../../components/panel/GuideInclusionModal';
import toast from 'react-hot-toast';

export default function Topics() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { topics, loading, error, fetchTopics, createTopic, updateTopic, deleteTopic } = useTopicStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { guides, fetchGuides, updateGuide } = useGuideStore();

  useEffect(() => {
    fetchTopics();
    fetchCategories();
    fetchGuides();
  }, [fetchTopics, fetchCategories, fetchGuides]);

  const handleCreate = async (data: any) => {
    try {
      await createTopic({
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      });
      toast.success('Konu başarıyla oluşturuldu');
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedTopic) return;
    try {
      await updateTopic(selectedTopic.id, {
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      });
      toast.success('Konu başarıyla güncellendi');
      setShowEditModal(false);
      setSelectedTopic(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTopic(id);
        toast.success('Konu başarıyla silindi');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleIncludeGuides = async (topicId: string, guideIds: string[]) => {
    try {
      // Update each guide with the new topic_id
      for (const guideId of guideIds) {
        await updateGuide(guideId, { topic_id: topicId });
      }
      toast.success('Rehberler başarıyla konuya eklendi');
      fetchTopics(); // Refresh topics to update guide counts
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemoveGuide = async (guideId: string) => {
    try {
      await updateGuide(guideId, { topic_id: null });
      toast.success('Rehber başarıyla konudan çıkarıldı');
      fetchTopics(); // Refresh topics to update guide counts
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || topic.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            onClick={() => fetchTopics()}
            className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Konular"
        description="Rehber konularını yönetin"
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Konu
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Konularda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rehber Sayısı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {topic.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {topic.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {categories.find(c => c.id === topic.category_id)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {topic.guides_count || 0} rehber
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedTopic(topic);
                        setShowGuideModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Rehberleri Yönet"
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTopic(topic);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <TopicModal
          categories={categories}
          onSubmit={handleCreate}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          categories={categories}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTopic(null);
          }}
        />
      )}

      {/* Guide Inclusion Modal */}
      {showGuideModal && selectedTopic && (
        <GuideInclusionModal
          topic={selectedTopic}
          guides={guides}
          onSubmit={(guideIds) => handleIncludeGuides(selectedTopic.id, guideIds)}
          onRemove={handleRemoveGuide}
          onClose={() => {
            setShowGuideModal(false);
            setSelectedTopic(null);
          }}
        />
      )}
    </div>
  );
}