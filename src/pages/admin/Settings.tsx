import React, { useEffect } from 'react';
import { Save, Globe, Bell, Lock, Mail } from 'lucide-react';
import PageHeader from '../../components/panel/PageHeader';
import { useSettingsStore } from '../../store/settingsStore';
import toast from 'react-hot-toast';

export default function Settings() {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newSettings = {
      siteTitle: formData.get('siteTitle') as string,
      siteDescription: formData.get('siteDescription') as string,
      smtpHost: formData.get('smtpHost') as string,
      smtpPort: Number(formData.get('smtpPort')),
      smtpUser: formData.get('smtpUser') as string,
      smtpPass: formData.get('smtpPass') as string,
      minPasswordLength: Number(formData.get('minPasswordLength')),
      requireTwoFactor: formData.get('requireTwoFactor') === 'on',
      emailNotifications: formData.get('emailNotifications') === 'on',
      browserNotifications: formData.get('browserNotifications') === 'on',
    };

    try {
      await updateSettings(newSettings);
      toast.success('Ayarlar başarıyla güncellendi');
    } catch (error: any) {
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
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
          onClick={() => fetchSettings()}
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
        title="Ayarlar"
        description="Sistem ayarlarını yapılandırın"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-gray-400" />
            Site Ayarları
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site Başlığı
              </label>
              <input
                type="text"
                name="siteTitle"
                defaultValue={settings.siteTitle}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site Açıklaması
              </label>
              <textarea
                name="siteDescription"
                rows={3}
                defaultValue={settings.siteDescription}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-gray-400" />
            Bildirim Ayarları
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="emailNotifications"
                name="emailNotifications"
                type="checkbox"
                defaultChecked={settings.emailNotifications}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                Email bildirimleri
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="browserNotifications"
                name="browserNotifications"
                type="checkbox"
                defaultChecked={settings.browserNotifications}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="browserNotifications" className="ml-2 block text-sm text-gray-900">
                Tarayıcı bildirimleri
              </label>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-gray-400" />
            Email Ayarları
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Sunucu
              </label>
              <input
                type="text"
                name="smtpHost"
                defaultValue={settings.smtpHost}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Port
              </label>
              <input
                type="number"
                name="smtpPort"
                defaultValue={settings.smtpPort}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Kullanıcı Adı
              </label>
              <input
                type="text"
                name="smtpUser"
                defaultValue={settings.smtpUser}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="username@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Şifre
              </label>
              <input
                type="password"
                name="smtpPass"
                defaultValue={settings.smtpPass}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-gray-400" />
            Güvenlik Ayarları
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Şifre Uzunluğu
              </label>
              <select
                name="minPasswordLength"
                defaultValue={settings.minPasswordLength}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="6">6 karakter</option>
                <option value="8">8 karakter</option>
                <option value="10">10 karakter</option>
                <option value="12">12 karakter</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="requireTwoFactor"
                name="requireTwoFactor"
                type="checkbox"
                defaultChecked={settings.requireTwoFactor}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="requireTwoFactor" className="ml-2 block text-sm text-gray-900">
                İki faktörlü kimlik doğrulama zorunlu
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}