import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFrontendStore } from '../store/frontendStore';
import { BookOpen, Search, ChevronRight, Eye, Star, Layers, FolderOpen, FileText, Flame, Users, MessageCircle, X } from 'lucide-react';
// import './Home.premium.css'; // KURUMSAL için gerek yok

const categoryGradients = [
  'from-pink-500 via-red-400 to-yellow-400',
  'from-blue-500 via-cyan-400 to-green-300',
  'from-purple-600 via-indigo-400 to-blue-400',
  'from-emerald-500 via-lime-400 to-yellow-300',
  'from-orange-500 via-pink-400 to-red-400',
  'from-gray-700 via-gray-500 to-gray-300',
];

export default function Home() {
  const { categories, guides, loading, error, fetchCategories, fetchGuides } = useFrontendStore();
  const [search, setSearch] = useState('');
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchGuides();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredGuides([]);
      return;
    }
    const q = search.toLowerCase();
    setFilteredGuides(
      guides.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.overview?.toLowerCase().includes(q) ||
        g.content?.toLowerCase().includes(q)
      )
    );
  }, [search, guides]);

  // Debug: log all guides
  console.log('Ana sayfa guides:', guides);

  // En popüler ve en yeni rehberler
  const popularGuides = [...guides].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
  const newGuides = [...guides].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

  return (
    <>
      <Helmet>
        <title>YardımRehberi.com - Kategori, Konu ve Rehberlerle Hayatı Kolaylaştır</title>
        <meta name="description" content={`Tüm kategoriler, konular ve rehberler tek sayfada. ${categories.length}+ kategori, ${guides.length}+ rehber, topluluk desteği!`} />
        <meta name="keywords" content="rehber, kategori, konu, bilgi, yardım, finans, sağlık, hukuk, teknoloji, eğitim, yaşam, YardımRehberi" />
        <link rel="canonical" href="https://yardimrehberi.com/" />
        <meta property="og:title" content="YardımRehberi.com - Kategori, Konu ve Rehberlerle Hayatı Kolaylaştır" />
        <meta property="og:description" content={`Tüm kategoriler, konular ve rehberler tek sayfada. ${categories.length}+ kategori, ${guides.length}+ rehber, topluluk desteği!`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yardimrehberi.com/" />
        <meta property="og:image" content="https://yardimrehberi.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YardımRehberi.com - Kategori, Konu ve Rehberlerle Hayatı Kolaylaştır" />
        <meta name="twitter:description" content={`Tüm kategoriler, konular ve rehberler tek sayfada. ${categories.length}+ kategori, ${guides.length}+ rehber, topluluk desteği!`} />
        <meta name="twitter:image" content="https://yardimrehberi.com/og-default.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "YardımRehberi.com",
          "url": "https://yardimrehberi.com/",
          "logo": "https://yardimrehberi.com/og-default.jpg",
          "sameAs": [
            "https://www.facebook.com/yardimrehberi",
            "https://www.instagram.com/yardimrehberi",
            "https://www.linkedin.com/company/yardimrehberi"
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "YardımRehberi.com",
          "url": "https://yardimrehberi.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://yardimrehberi.com/rehberler?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>

      {/* HERO + ARAMA */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <BookOpen className="mx-auto mb-4 w-14 h-14 text-blue-600" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-2">Kategoriler, Konular ve Rehberler</h1>
          <div className="h-1 w-24 bg-blue-100 rounded-full mx-auto mb-6" />
          <p className="text-lg text-gray-600 mb-4">Uzmanlardan pratik rehberler, kategorilere göre kolayca keşfet!</p>
          <div className="flex items-center bg-white/70 backdrop-blur-md rounded-full shadow p-2 border border-gray-200 max-w-xl mx-auto mb-6">
            <Search className="h-6 w-6 text-blue-400 ml-4 cursor-pointer" onClick={() => setIsSearchModalOpen(true)} />
            <input
              type="text"
              placeholder="Rehber, konu veya kategori ara..."
              value={search}
              onFocus={() => setIsSearchModalOpen(true)}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-transparent focus:outline-none text-gray-900 text-lg placeholder-gray-400"
            />
          </div>
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Link to="/kategoriler" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 font-semibold text-lg shadow-sm transition">
              <Layers className="w-6 h-6" /> Kategorilere Göz At
            </Link>
            <Link to="/rehberler" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 text-yellow-700 font-semibold text-lg shadow-sm transition">
              <Flame className="w-6 h-6" /> Popüler Rehberler
            </Link>
            <Link to="/soru-sor" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-lg shadow-sm transition">
              <MessageCircle className="w-6 h-6" /> Soru Sor
              </Link>
            </div>
          <div className="mt-2 text-sm text-gray-500 flex flex-col items-center">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium mb-1">{categories.length}+ kategori, {guides.length}+ rehber, topluluk desteği!</span>
            <span className="text-xs text-gray-400">YardımRehberi ile bilgiye ulaşmak çok kolay.</span>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="bg-white py-14 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center"><Layers className="w-7 h-7 mr-2 text-blue-600" /> Kategoriler</h2>
            <Link to="/kategoriler" className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-transform duration-200 hover:scale-105">
              Tüm Kategoriler <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
                            </div>
          <div className="h-1 w-16 bg-blue-100 rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
                                  <Link 
                key={cat.id}
                to={`/kategori/${cat.slug}`}
                className="group rounded-2xl p-8 bg-gray-50 shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 flex flex-col items-center text-center border border-gray-100"
                style={{ minHeight: 220 }}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow bg-white">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                          </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-600 mb-4 text-base line-clamp-2">{cat.description}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {cat.topics?.slice(0, 3).map((topic: any) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate(`/kategori/${cat.slug}/${topic.slug}`);
                      }}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
                <span className="mt-2 text-gray-500 font-medium flex items-center text-sm">{cat.topics?.length || 0} konu</span>
                      </Link>
                    ))}
                  </div>
              </div>
      </section>

      {/* KONULAR */}
      <section className="bg-gray-50 py-12 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center"><FileText className="w-6 h-6 mr-2 text-blue-600" /> Popüler Konular</h2>
          </div>
          <div className="h-1 w-12 bg-blue-100 rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.flatMap((cat: any) => cat.topics?.slice(0, 2).map((topic: any) => (
              <Link
                key={topic.id}
                to={`/kategori/${cat.slug}/${topic.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 p-6 flex flex-col border border-gray-100"
                style={{ minHeight: 160 }}
              >
                <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{topic.description}</p>
                <div className="flex items-center text-xs text-blue-600 mb-2">
                  <FolderOpen className="w-4 h-4 mr-1" /> {cat.name}
            </div>
                <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold mb-2">{topic.guides?.length || 0} rehber</span>
                <span className="mt-auto text-blue-700 hover:text-blue-900 font-medium flex items-center transition">Konuyu İncele <ChevronRight className="w-4 h-4 ml-1" /></span>
              </Link>
            )))}
          </div>
        </div>
      </section>

      {/* REHBERLER */}
      <section className="bg-white py-14 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center"><BookOpen className="w-6 h-6 mr-2 text-blue-600" /> En Yeni Rehberler</h2>
            <Link to="/rehberler" className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-transform duration-200 hover:scale-105">
              Tüm Rehberler <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
                          </div>
          <div className="h-1 w-10 bg-blue-100 rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {newGuides.map((guide: any) => (
                                <Link 
                key={guide.id}
                to={`/rehber/${guide.slug}`}
                className="group bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 flex flex-col overflow-hidden border border-gray-100"
              >
                <div className="h-40 w-full overflow-hidden relative bg-white">
                  <img
                    src={guide.image || 'https://via.placeholder.com/400x200?text=Rehber'}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{guide.category?.name}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{guide.overview ? guide.overview.replace(/<[^>]*>/g, '').slice(0, 120) : ''}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                    <span className="flex items-center"><Eye className="inline h-4 w-4 mr-1" />{guide.views}</span>
                    <span className="flex items-center"><Star className="inline h-4 w-4 mr-1 text-yellow-400" />{guide.rating}</span>
                  </div>
                </div>
                      </Link>
                    ))}
                  </div>
              </div>
      </section>

      {/* EN POPÜLER REHBERLER */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-500" /> En Popüler Rehberler</h2>
          </div>
          <div className="h-1 w-10 bg-yellow-100 rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {popularGuides.map((guide: any) => (
              <Link
                key={guide.id}
                to={`/rehber/${guide.slug}`}
                className="group bg-white rounded-2xl shadow hover:shadow-lg transition-transform duration-200 hover:scale-105 flex flex-col overflow-hidden border border-yellow-100"
              >
                <div className="h-40 w-full overflow-hidden relative bg-yellow-50">
                  <img
                    src={guide.image || 'https://via.placeholder.com/400x200?text=Rehber'}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{guide.category?.name}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-700 transition-colors">{guide.title}</h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{guide.overview ? guide.overview.replace(/<[^>]*>/g, '').slice(0, 120) : ''}</p>
                  <div className="flex items-center justify-between text-xs text-yellow-700 mt-auto">
                    <span className="flex items-center"><Eye className="inline h-4 w-4 mr-1" />{guide.views}</span>
                    <span className="flex items-center"><Star className="inline h-4 w-4 mr-1 text-yellow-400" />{guide.rating}</span>
          </div>
        </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARAMA SONUÇLARI MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col relative">
            <button
              onClick={() => { setIsSearchModalOpen(false); setSearch(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rehber, konu veya kategori ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                  className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg py-3"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {search && filteredGuides.length > 0 ? (
                <div className="space-y-3">
                  {filteredGuides.map((guide) => (
          <Link
                      key={guide.id}
                      to={`/rehber/${guide.slug}`}
                      onClick={() => setIsSearchModalOpen(false)}
                      className="block p-4 rounded-lg hover:bg-blue-50 transition border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={guide.image || 'https://via.placeholder.com/80x80?text=Rehber'}
                  alt={guide.title} 
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 text-left">
                          <div className="text-base font-semibold text-gray-900 line-clamp-1">{guide.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{guide.overview ? guide.overview.replace(/<[^>]*>/g, '').slice(0, 80) : ''}</div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>{guide.category?.name}</span>
                            <span>·</span>
                            <span>{guide.views} görüntüleme</span>
                  </div>
                </div>
              </div>
                    </Link>
          ))}
        </div>
              ) : search ? (
                <div className="text-center text-gray-500 py-10">Aradığınız kelimeyle eşleşen bir rehber bulunamadı.</div>
              ) : (
                <div className="text-center text-gray-400 py-10">Aramak için bir kelime yazın.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}