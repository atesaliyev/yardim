import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFrontendStore } from '../store/frontendStore';
import { BookOpen, Search, ChevronRight, FolderOpen, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function GuidesPage() {
  const { categories, guides, loading, fetchCategories, fetchGuides } = useFrontendStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchGuides();
    // eslint-disable-next-line
  }, []);

  // Filter topics and guides
  const filteredCategories = selectedCategory === 'all' ? categories : categories.filter(c => c.id === selectedCategory);

  const getFilteredTopics = (cat: any) => {
    let topics = cat.topics || [];
    if (selectedTopic !== 'all') topics = topics.filter((t: any) => t.id === selectedTopic);
    return topics;
  };

  const filterGuides = (guides: any[]) => {
    if (!search) return guides;
    const q = search.toLowerCase();
    return guides.filter(g =>
      g.title?.toLowerCase().includes(q) ||
      g.overview?.toLowerCase().includes(q) ||
      g.content?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <Helmet>
        <title>Tüm Rehberler | YardımRehberi.com</title>
        <meta name="description" content={`Tüm rehberler, kategorilere ve konulara göre listelenmiştir. ${guides.length}+ rehber, ${categories.length}+ kategori.`} />
        <meta name="keywords" content="rehber, konu, kategori, YardımRehberi, bilgi, yardım" />
        <link rel="canonical" href="https://yardimrehberi.com/rehberler" />
        <meta property="og:title" content="Tüm Rehberler | YardımRehberi.com" />
        <meta property="og:description" content={`Tüm rehberler, kategorilere ve konulara göre listelenmiştir. ${guides.length}+ rehber, ${categories.length}+ kategori.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yardimrehberi.com/rehberler" />
        <meta property="og:image" content="https://yardimrehberi.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tüm Rehberler | YardımRehberi.com" />
        <meta name="twitter:description" content={`Tüm rehberler, kategorilere ve konulara göre listelenmiştir. ${guides.length}+ rehber, ${categories.length}+ kategori.`} />
        <meta name="twitter:image" content="https://yardimrehberi.com/og-default.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Tüm Rehberler",
          "description": `Tüm rehberler, kategorilere ve konulara göre listelenmiştir. ${guides.length}+ rehber, ${categories.length}+ kategori.`,
          "url": "https://yardimrehberi.com/rehberler",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": guides.map((g: any, idx: number) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": g.title,
              "url": `https://yardimrehberi.com/rehber/${g.slug}`
            }))
          }
        })}</script>
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setSelectedTopic('all');
              }}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              disabled={selectedCategory === 'all'}
            >
              <option value="all">Tüm Konular</option>
              {selectedCategory !== 'all' &&
                categories.find(cat => cat.id === selectedCategory)?.topics?.map((topic: any) => (
                  <option key={topic.id} value={topic.id}>{topic.title}</option>
                ))}
            </select>
          </div>
          <div className="flex items-center bg-white rounded-full shadow px-4 py-2 border border-gray-200 max-w-md w-full md:w-auto">
            <Search className="h-5 w-5 text-blue-400 mr-2" />
            <input
              type="text"
              placeholder="Rehber veya konu ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-900 text-base placeholder-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Yükleniyor...</div>
        ) : (
          filteredCategories.length === 0 ? (
            <div className="text-center text-gray-400 py-20">Hiç kategori veya rehber bulunamadı.</div>
          ) : (
            filteredCategories.map(cat => (
              <div key={cat.id} className="mb-12">
                <div className="flex items-center mb-4">
                  <FolderOpen className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">{cat.name}</h2>
                </div>
                <div className="space-y-10">
                  {getFilteredTopics(cat).length === 0 ? (
                    <div className="text-gray-400 ml-8">Bu kategoride konu yok.</div>
                  ) : (
                    getFilteredTopics(cat).map((topic: any) => {
                      const topicGuides = filterGuides(topic.guides || []);
                      return (
                        <div key={topic.id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
                          <div className="flex items-center mb-2">
                            <FileText className="w-5 h-5 text-blue-400 mr-2" />
                            <h3 className="text-lg font-semibold text-blue-900">{topic.title}</h3>
                          </div>
                          {topicGuides.length === 0 ? (
                            <div className="text-gray-400 ml-7">Bu konuda rehber yok.</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                              {topicGuides.map((guide: any) => (
                                <Link
                                  key={guide.id}
                                  to={`/rehber/${guide.slug}`}
                                  className="block bg-gray-50 rounded-lg shadow hover:shadow-md transition p-4 border border-gray-100"
                                >
                                  <div className="font-bold text-gray-900 mb-1 line-clamp-1">{guide.title}</div>
                                  <div className="text-gray-600 text-sm line-clamp-2 mb-2">{guide.overview ? guide.overview.replace(/<[^>]*>/g, '').slice(0, 80) : ''}</div>
                                  <div className="flex items-center text-xs text-gray-400 gap-3">
                                    <span>Okunma: {guide.views}</span>
                                    <span>Puan: {guide.rating}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
} 