import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useFrontendStore } from '../store/frontendStore';

const kurumsal = [
  { title: 'Biz Kimiz', href: '/hakkimizda' },
  { title: 'Misyon & Vizyon', href: '/misyon-vizyon' },
  { title: 'İletişim', href: '/iletisim' },
  { title: 'Kariyer', href: '/kariyer' }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [showKurumsalDropdown, setShowKurumsalDropdown] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);
  const { categories, guides, fetchCategories } = useFrontendStore();
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Rastgele 3 kategori seç
  const randomCategories = React.useMemo(() => {
    if (!categories.length) return [];
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [categories]);

  // Kategoriye uygun ikon döndür
  const getCategoryIcon = (iconName: string | undefined) => {
    if (!iconName) return <LucideIcons.BookOpen className="w-5 h-5 mr-1 text-blue-600" />;
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.BookOpen;
    return <Icon className="w-5 h-5 mr-1 text-blue-600" />;
  };

  // Menü açıkken tıklama ile kapanmasın, sadece mouse leave ile kapansın ve kullanıcı alt menüye geçerken hemen kapanmasın
  const handleMegaMenuEnter = (category: string) => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setActiveMegaMenu(category);
  };
  const handleMegaMenuLeave = () => {
    const timeout = setTimeout(() => setActiveMegaMenu(null), 180); // 180ms gecikme
    setCloseTimeout(timeout);
  };

  const toggleMobileMenu = (category: string) => {
    setExpandedMobileMenus(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 shadow-md bg-white/90 backdrop-blur-lg ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <LucideIcons.BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-1 text-2xl font-extrabold text-gray-900 tracking-tight">YardımRehberi</span>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center space-x-2">
            {randomCategories.map((cat: any) => (
              <div
                key={cat.id}
                className="relative group"
                onMouseEnter={() => handleMegaMenuEnter(cat.slug)}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">
                  {getCategoryIcon(cat.icon)}
                  {cat.name}
                  <LucideIcons.ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {activeMegaMenu === cat.slug && (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                    onMouseEnter={() => handleMegaMenuEnter(cat.slug)}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className="w-[600px] bg-white shadow-xl rounded-2xl p-6 grid grid-cols-2 gap-8 border border-blue-100">
                      {/* Rastgele 2 konu veya rehber göster */}
                      {cat.topics && cat.topics.length > 0 ? (
                        cat.topics
                          .sort(() => 0.5 - Math.random())
                          .slice(0, 2)
                          .map((topic: any) => (
                            <div key={topic.id}>
                              <h3 className="font-semibold text-blue-700 mb-4 text-base flex items-center">
                                <LucideIcons.FileText className="w-4 h-4 mr-1 text-blue-400" />
                                <Link to={`/kategori/${cat.slug}/${topic.slug}`}>{topic.title}</Link>
                              </h3>
                              <ul className="space-y-2">
                                {(topic.guides || []).sort(() => 0.5 - Math.random()).slice(0, 2).map((guide: any) => (
                                  <li key={guide.id}>
                                    <Link to={`/rehber/${guide.slug}`} className="text-gray-600 hover:text-blue-600 transition-colors block text-sm rounded px-2 py-1 hover:bg-blue-50">
                                      <LucideIcons.BookOpen className="inline w-4 h-4 mr-1 text-blue-300" />
                                      {guide.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-400">Bu kategoride konu yok.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div
              className="relative group"
              onMouseEnter={() => setShowKurumsalDropdown(true)}
              onMouseLeave={() => setShowKurumsalDropdown(false)}
            >
              <button className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition">
                <LucideIcons.Building2 className="w-5 h-5 mr-1" />
                Kurumsal
                <LucideIcons.ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {showKurumsalDropdown && (
                <div className="absolute right-0 w-56 bg-white shadow-xl rounded-2xl mt-2 py-2 border border-blue-100 z-50">
                  {kurumsal.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.href}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-600 p-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {isMenuOpen ? (
                <LucideIcons.X className="h-7 w-7" />
              ) : (
                <LucideIcons.Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg lg:hidden pt-24">
          <div className="p-6">
            <div className="flex flex-col space-y-6">
              {randomCategories.map((cat: any) => (
                <div key={cat.id} className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleMobileMenu(cat.slug)}
                    className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 text-lg font-semibold text-gray-900"
                  >
                    <span className="flex items-center">{getCategoryIcon(cat.icon)}{cat.name}</span>
                    <LucideIcons.ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedMobileMenus.includes(cat.slug) ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileMenus.includes(cat.slug) && (
                    <div className="mt-4 space-y-4">
                      {cat.topics && cat.topics.length > 0 ? (
                        cat.topics
                          .sort(() => 0.5 - Math.random())
                          .slice(0, 2)
                          .map((topic: any) => (
                            <div key={topic.id} className="pl-4">
                              <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                                <LucideIcons.FileText className="w-4 h-4 mr-1 text-blue-400" />
                                <Link to={`/kategori/${cat.slug}/${topic.slug}`}>{topic.title}</Link>
                              </h4>
                              <ul className="space-y-2 pl-2">
                                {(topic.guides || []).sort(() => 0.5 - Math.random()).slice(0, 2).map((guide: any) => (
                                  <li key={guide.id}>
                                    <Link to={`/rehber/${guide.slug}`} className="text-gray-600 hover:text-blue-700 block py-1 rounded hover:bg-blue-50">
                                      <LucideIcons.BookOpen className="inline w-4 h-4 mr-1 text-blue-300" />
                                      {guide.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-400">Bu kategoride konu yok.</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => setShowKurumsalDropdown(!showKurumsalDropdown)}
                  className="flex items-center justify-between w-full px-2 py-2 rounded-lg hover:bg-blue-50 text-lg font-semibold text-gray-900"
                >
                  <span>Kurumsal</span>
                  <LucideIcons.ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${showKurumsalDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showKurumsalDropdown && (
                  <div className="mt-4 space-y-2 pl-4">
                    {kurumsal.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      >
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}