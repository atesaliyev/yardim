import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, LayoutTemplate, Power, Calendar, Search } from 'lucide-react';
import PageHeader from '../../components/panel/PageHeader';
import { useAdStore } from '../../store/adStore';
import toast from 'react-hot-toast';

interface AdFormData {
  name: string;
  location: string;
  type: string;
  content: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

const adLocations = [
  { value: 'home_top', label: 'Ana Sayfa Üst' },
  { value: 'home_bottom', label: 'Ana Sayfa Alt' },
  { value: 'category_top', label: 'Kategori Sayfası Üst' },
  { value: 'category_sidebar', label: 'Kategori Sayfası Kenar' },
  { value: 'guide_top', label: 'Rehber Sayfası Üst' },
  { value: 'guide_bottom', label: 'Rehber Sayfası Alt' },
  { value: 'guide_sidebar', label: 'Rehber Sayfası Kenar' }
];

const adTypes = [
  { value: 'banner', label: 'Banner (728x90)' },
  { value: 'large_banner', label: 'Büyük Banner (970x250)' },
  { value: 'sidebar', label: 'Kenar Çubuğu (300x600)' },
  { value: 'custom', label: 'Özel Boyut' }
];

export default function Ads() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { ads, loading, error, fetchAds, createAd, updateAd, deleteAd, toggleAdStatus } = useAdStore();

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const adData: AdFormData = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      content: formData.get('content') as string,
      is_active: formData.get('is_active') === 'on',
      start_date: formData.get('start_date') as string || undefined,
      end_date: formData.get('end_date') as string || undefined
    };

    try {
      if (selectedAd) {
        await updateAd(selectedAd.id, adData);
        toast.success('Reklam başarıyla güncellendi');
      } else {
        await createAd(adData);
        toast.success('Reklam başarıyla oluşturuldu');
      }
      setShowModal(false);
      setSelectedAd(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu reklamı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAd(id);
        toast.success('Reklam başarıyla silindi');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const filteredAds = ads.filter(ad =>
    ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adLocations.find(loc => loc.value === ad.location)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p>Bir hata oluştu: {error}</p>
        <button
          onClick={() => fetchAds()}
          className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reklamlar"
        description="Reklam alanlarını yönetin"
      >
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Reklam
        </button>
      </PageHeader>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Reklamlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ads List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reklam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih Aralığı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <LayoutTemplate className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {adLocations.find(loc => loc.value === ad.location)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {adTypes.find(type => type.value === ad.type)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAdStatus(ad.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        ad.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <Power className="h-3 w-3 mr-1" />
                      {ad.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {ad.start_date && new Date(ad.start_date).toLocaleDateString('tr-TR')}
                        {ad.end_date && ` - ${new Date(ad.end_date).toLocaleDateString('tr-TR')}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAd ? 'Reklamı Düzenle' : 'Yeni Reklam'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAd(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reklam Adı
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedAd?.name}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Konum
                </label>
                <select
                  name="location"
                  defaultValue={selectedAd?.location}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {adLocations.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reklam Tipi
                </label>
                <select
                  name="type"
                  defaultValue={selectedAd?.type}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {adTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reklam İçeriği (HTML)
                </label>
                <textarea
                  name="content"
                  defaultValue={selectedAd?.content}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="<script>...</script> veya <div>...</div>"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={selectedAd?.start_date?.split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={selectedAd?.end_date?.split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  defaultChecked={selectedAd?.is_active ?? true}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Aktif
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAd(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {selectedAd ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}