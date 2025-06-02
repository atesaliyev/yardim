import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-black text-gray-400 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg')] bg-cover bg-center opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="h-10 w-10 text-white" />
              <span className="ml-3 text-2xl font-bold text-white">YardımRehberi</span>
            </div>
            <p className="text-lg text-gray-400 mb-6">
              Günlük hayatınızı kolaylaştıran pratik rehberler ve çözümler.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Kategoriler</h3>
            <ul className="space-y-4">
              {['Finans', 'Sağlık', 'Hukuk', 'Teknoloji'].map((category) => (
                <li key={category}>
                  <Link
                    to={`/kategori/${category.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Kurumsal</h3>
            <ul className="space-y-4">
              {[
                { title: 'Hakkımızda', path: '/hakkimizda' },
                { title: 'İletişim', path: '/iletisim' },
                { title: 'Kariyer', path: '/kariyer' },
                { title: 'Misyon & Vizyon', path: '/misyon-vizyon' }
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Yasal</h3>
            <ul className="space-y-4">
              {[
                { title: 'Kullanım Şartları', path: '/kullanim-sartlari' },
                { title: 'Gizlilik Politikası', path: '/gizlilik-politikasi' },
                { title: 'KVKK', path: '/kvkk' },
                { title: 'Çerez Politikası', path: '/cerez-politikasi' }
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-gradient-to-b from-gray-900 to-black text-sm text-gray-500">
              YardımRehberi
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 YardımRehberi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}