import React, { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Users, Settings, LogOut, BookOpen, LayoutTemplate } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { name: 'Dashboard', href: '/panel/dashboard', icon: LayoutDashboard },
  { name: 'Rehberler', href: '/panel/guides', icon: FileText },
  { name: 'Kategoriler', href: '/panel/categories', icon: FolderOpen },
  { name: 'Konular', href: '/panel/topics', icon: BookOpen },
  { name: 'Reklamlar', href: '/panel/ads', icon: LayoutTemplate },
  { name: 'Kullanıcılar', href: '/panel/users', icon: Users },
  { name: 'Ayarlar', href: '/panel/settings', icon: Settings },
];

export default function PanelLayout() {
  const { user, signOut, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return <Navigate to="/panel/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
              <h1 className="text-xl font-bold text-white">Yönetim Paneli</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}