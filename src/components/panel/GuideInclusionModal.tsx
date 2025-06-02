import React, { useState } from 'react';
import { X, Search, Trash2 } from 'lucide-react';
import { Guide, Topic } from '../../types';

interface GuideInclusionModalProps {
  topic: Topic;
  guides: Guide[];
  onSubmit: (guideIds: string[]) => void;
  onRemove: (guideId: string) => void;
  onClose: () => void;
}

export default function GuideInclusionModal({ topic, guides, onSubmit, onRemove, onClose }: GuideInclusionModalProps) {
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'add' | 'included'>('add');

  const includedGuides = guides.filter(guide => guide.topic_id === topic.id);
  const availableGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    guide.category_id === topic.category_id &&
    guide.topic_id !== topic.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedGuides);
  };

  const toggleGuide = (guideId: string) => {
    setSelectedGuides(prev =>
      prev.includes(guideId)
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Rehberleri Yönet: {topic.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setTab('add')}
            className={`px-4 py-2 rounded-lg ${
              tab === 'add'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Rehber Ekle
          </button>
          <button
            onClick={() => setTab('included')}
            className={`px-4 py-2 rounded-lg ${
              tab === 'included'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dahil Edilmiş Rehberler ({includedGuides.length})
          </button>
        </div>

        {tab === 'add' && (
          <>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rehberlerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {availableGuides.map((guide) => (
                  <label
                    key={guide.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGuides.includes(guide.id)}
                      onChange={() => toggleGuide(guide.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{guide.title}</div>
                      <div className="text-sm text-gray-500">
                        {guide.status === 'published' ? 'Yayında' : 'Taslak'}
                      </div>
                    </div>
                  </label>
                ))}
                {availableGuides.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Bu kategoride eklenebilecek rehber bulunamadı
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedGuides.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seçili Rehberleri Ekle ({selectedGuides.length})
              </button>
            </div>
          </>
        )}

        {tab === 'included' && (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {includedGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{guide.title}</div>
                    <div className="text-sm text-gray-500">
                      {guide.status === 'published' ? 'Yayında' : 'Taslak'}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(guide.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {includedGuides.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Bu konuya henüz rehber eklenmemiş
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}