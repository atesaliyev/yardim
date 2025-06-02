import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, FileText, Eye, Star, Search, ArrowRight, Clock, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useFrontendStore } from '../store/frontendStore';
import AdDisplay from '../components/AdDisplay';

export default function CategoryDetail() {
  const { kategori } = useParams();
  const { categories, loading, error, fetchCategories } = useFrontendStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const category = categories.find((c: any) => c.slug === kategori);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-700">
            <p>Kategori bulunamadı.</p>
            <Link
              to="/kategoriler"
              className="mt-4 inline-block px-4 py-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              Tüm Kategorilere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>{category.name} Rehberleri | YardımRehberi.com</title>
        <meta name="description" content={category.description} />
        <meta name="keywords" content={`${category.name}, rehber, kategori, YardımRehberi`} />
        <link rel="canonical" href={`https://yardimrehberi.com/kategori/${category.slug}`} />
        <meta property="og:title" content={`${category.name} Rehberleri | YardımRehberi.com`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yardimrehberi.com/kategori/${category.slug}`} />
        <meta property="og:image" content={category.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${category.name} Rehberleri | YardımRehberi.com`} />
        <meta name="twitter:description" content={category.description} />
        <meta name="twitter:image" content={category.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Kategoriler", "item": "https://yardimrehberi.com/kategoriler"},
            {"@type": "ListItem", "position": 2, "name": category.name, "item": `https://yardimrehberi.com/kategori/${category.slug}`}
          ]
        })}</script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={category.image || `https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg`}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center space-x-2 text-blue-100 mb-4">
              <Link to="/kategoriler" className="hover:text-white">Kategoriler</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{category.name}</span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white">{category.name}</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mb-8">{category.description}</p>
            
            {/* Stats */}
            <div className="flex space-x-8 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {category.topics?.reduce((sum: any, topic: any) => sum + (topic.guides?.length || 0), 0)}+
                  </div>
                  <div className="text-sm text-blue-100">Rehber</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {category.topics?.length}
                  </div>
                  <div className="text-sm text-blue-100">Konu</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3">
                <Users className="h-6 w-6 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-blue-100">Okuyucu</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="flex items-center bg-white rounded-full shadow-lg p-2">
                <Search className="h-6 w-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder={`${category.name} rehberlerinde ara...`}
                  className="w-full px-4 py-3 focus:outline-none text-gray-800 text-lg rounded-full"
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium">
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Advertisement */}
        <div className="mb-8">
          <AdDisplay location="category_top" className="h-24" />
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.topics?.map((topic: any) => {
            const topicImage = topic.image || topic.guides?.[0]?.image || category.image || `https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg`;
            const totalViews = topic.guides?.reduce((sum: any, guide: any) => sum + (guide.views || 0), 0) || 0;
            const averageRating = topic.guides?.reduce((sum: any, guide: any) => sum + (guide.rating || 0), 0) / (topic.guides?.length || 1) || 0;

            return (
              <div key={topic.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <Link to={`/kategori/${category.slug}/${topic.slug}`}> 
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={topicImage}
                      alt={topic.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl font-bold text-white mb-1 drop-shadow">{topic.title}</h2>
                      <p className="text-white/80 text-sm line-clamp-2 drop-shadow">{topic.description}</p>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        <span>{averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{topic.guides?.length || 0} rehber</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {topic.guides?.slice(0, 3).map((guide: any) => (
                      <Link
                        key={guide.id}
                        to={`/rehber/${guide.slug}`}
                        className="block group/guide rounded-lg hover:bg-blue-50 px-3 py-2 transition-colors border border-transparent hover:border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            <h3 className="font-semibold text-gray-900 group-hover/guide:text-blue-700 transition-colors line-clamp-1">
                              {guide.title}
                            </h3>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover/guide:text-blue-600 transition-colors" />
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{guide.views}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{guide.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {topic.guides?.length > 3 && (
                    <Link
                      to={`/kategori/${category.slug}/${topic.slug}`}
                      className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <span>Tüm rehberleri gör</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Advertisement */}
        <div className="mt-16">
          <AdDisplay location="category_bottom" className="h-32" />
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {category.name} ile ilgili güncellemelerden haberdar olun
          </h3>
          <p className="text-blue-100 mb-6">
            Yeni rehberler ve güncellemeler için bültenimize abone olun
          </p>
          <div className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full border-2 border-transparent focus:border-blue-400 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-colors font-medium">
              Abone Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}