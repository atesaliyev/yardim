import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, FileText, Eye, Star } from 'lucide-react';
import { useFrontendStore } from '../store/frontendStore';
import AdDisplay from '../components/AdDisplay';

// Default images for categories with consistent theme and style
const defaultImages = {
  'egitim': 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
  'finans': 'https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg',
  'hukuk': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
  'psikoloji': 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
  'saglik': 'https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg',
  'teknoloji': 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
  'tuketici-haklari': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  'aile-iliskiler': 'https://images.pexels.com/photos/3893723/pexels-photo-3893723.jpeg',
  'is-kariyer': 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  'konut-emlak': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'yeme-icme-mutfak': 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
  'ev-yasam': 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
  'seyahat-ulasim': 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg',
  'dijital-guvenlik-sosyal-medya': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
  'cinsel-saglik-ureme': 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
  'psikolojik-destek-kisisel-gelisim': 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
  'finansal-yatirim-tasarruf': 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg',
  'saglikli-yasam-spor': 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg',
  'egitim-ogrenme': 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
  'teknoloji-elektronik': 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg',
  'cocuk-ogrenci': 'https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg',
  'hayvan-evcil-dostlar': 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg',
  'iklim-afet-durumlari': 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
  'hobiler-eglence': 'https://images.pexels.com/photos/3910073/pexels-photo-3910073.jpeg',
  'kisisel-haklar-sosyal-guvence': 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
  'cevre-yasam': 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
  'guncel-olay-haber-takibi': 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg'
};

// Hero section background images
const heroImages = [
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
];

export default function Categories() {
  const { categories, loading, error, fetchCategories } = useFrontendStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getGuideDescription = (guide: any) => {
    if (guide.overview) {
      return guide.overview.replace(/<[^>]*>/g, '').slice(0, 150) + '...';
    }
    if (guide.content) {
      return guide.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-4 gap-8">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map((k) => (
                              <div key={k} className="h-4 bg-gray-200 rounded w-full"></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>Tüm Kategoriler | YardımRehberi.com</title>
        <meta name="description" content={`Finans, sağlık, hukuk ve daha fazla konuda detaylı rehberler ve pratik çözümler. ${categories.length} kategori, ${categories.reduce((sum: any, cat: any) => sum + (cat.topics?.length || 0), 0)} konu, ${categories.reduce((sum: any, cat: any) => sum + cat.topics?.reduce((topicSum: any, topic: any) => topicSum + (topic.guides?.length || 0), 0) || 0, 0)} rehber.`} />
        <meta name="keywords" content="kategori, konu, rehber, YardımRehberi, finans, sağlık, hukuk, teknoloji, eğitim, yaşam" />
        <link rel="canonical" href="https://yardimrehberi.com/kategoriler" />
        <meta property="og:title" content="Tüm Kategoriler | YardımRehberi.com" />
        <meta property="og:description" content={`Finans, sağlık, hukuk ve daha fazla konuda detaylı rehberler ve pratik çözümler. ${categories.length} kategori, ${categories.reduce((sum: any, cat: any) => sum + (cat.topics?.length || 0), 0)} konu, ${categories.reduce((sum: any, cat: any) => sum + cat.topics?.reduce((topicSum: any, topic: any) => topicSum + (topic.guides?.length || 0), 0) || 0, 0)} rehber.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yardimrehberi.com/kategoriler" />
        <meta property="og:image" content="https://yardimrehberi.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tüm Kategoriler | YardımRehberi.com" />
        <meta name="twitter:description" content={`Finans, sağlık, hukuk ve daha fazla konuda detaylı rehberler ve pratik çözümler. ${categories.length} kategori, ${categories.reduce((sum: any, cat: any) => sum + (cat.topics?.length || 0), 0)} konu, ${categories.reduce((sum: any, cat: any) => sum + cat.topics?.reduce((topicSum: any, topic: any) => topicSum + (topic.guides?.length || 0), 0) || 0, 0)} rehber.`} />
        <meta name="twitter:image" content="https://yardimrehberi.com/og-default.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Tüm Kategoriler",
          "description": `Finans, sağlık, hukuk ve daha fazla konuda detaylı rehberler ve pratik çözümler. ${categories.length} kategori.`,
          "url": "https://yardimrehberi.com/kategoriler",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": categories.map((cat: any, idx: number) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "name": cat.name,
              "url": `https://yardimrehberi.com/kategori/${cat.slug}`
            }))
          }
        })}</script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden flex items-center">
        <div className="absolute inset-0 flex">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="w-1/3 h-full"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)'
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-900/90"></div>
        <div className="relative z-10 w-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
                Tüm Kategoriler
              </h1>
              <p className="text-lg md:text-2xl text-blue-100 mb-8">
                İhtiyacınız olan her konuda detaylı rehberler ve pratik çözümler. Uzman içeriklerle hayatınızı kolaylaştırın.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-lg text-white text-base font-medium">
                  {categories.length} Kategori
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-lg text-white text-base font-medium">
                  {categories.reduce((sum: any, cat: any) => sum + (cat.topics?.length || 0), 0)} Konu
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-lg text-white text-base font-medium">
                  {categories.reduce((sum: any, cat: any) => 
                    sum + cat.topics?.reduce((topicSum: any, topic: any) => 
                      topicSum + (topic.guides?.length || 0), 0) || 0, 0)} Rehber
                </span>
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

        <div className="space-y-16">
          {categories.filter((cat: any) => !cat.parent_id).map((category: any) => (
            <div key={category.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.04] transition-all duration-300 group">
              <div className="relative h-80 md:h-96">
                <img
                  src={category.image || defaultImages[category.slug as keyof typeof defaultImages] || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  {/* Kategori ikonu varsa göster */}
                  {category.icon && (
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow text-blue-700 text-xl">
                      <i className={category.icon}></i>
                    </span>
                  )}
                  <span className="bg-blue-600/90 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">{category.name}</h2>
                      <p className="text-base md:text-xl text-blue-100 max-w-2xl mb-4 md:mb-6 line-clamp-2">{category.description}</p>
                      <div className="flex items-center space-x-4 text-gray-200 text-sm md:text-base">
                        <span>{category.topics?.length || 0} Konu</span>
                        <span>•</span>
                        <span>
                          {category.topics?.reduce((sum: any, topic: any) => 
                            sum + (topic.guides?.length || 0), 0) || 0} Rehber
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/kategori/${category.slug}`}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full hover:scale-105 hover:shadow-xl transition-all flex items-center space-x-2 font-semibold shadow-md border-2 border-white/10"
                    >
                      <span>Tümünü Gör</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 md:p-8 bg-gradient-to-br from-blue-50/60 to-white">
                {category.topics?.map((topic: any) => (
                  <div key={topic.id} className="space-y-4 bg-white/80 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-lg truncate">{topic.title}</h3>
                    </div>
                    <ul className="space-y-4">
                      {topic.guides?.slice(0, 4).map((guide: any) => (
                        <li key={guide.id} className="space-y-2">
                          <Link
                            to={`/kategori/${category.slug}/${topic.slug}/${guide.slug}`}
                            className="block group rounded-lg hover:bg-blue-50/70 transition-colors p-2"
                          >
                            <div className="flex items-center justify-between text-gray-700 group-hover:text-blue-700 transition-colors">
                              <span className="font-medium truncate max-w-[180px] md:max-w-[220px]">{guide.title}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{getGuideDescription(guide)}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
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
                        </li>
                      ))}
                    </ul>
                    {topic.guides?.length > 4 && (
                      <Link
                        to={`/kategori/${category.slug}/${topic.slug}`}
                        className="text-blue-600 hover:text-blue-700 text-xs flex items-center font-medium mt-2"
                      >
                        <span>Tüm rehberleri gör</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Advertisement */}
        <div className="mt-16">
          <AdDisplay location="category_bottom" className="h-32" />
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Aradığınız rehberi bulamadınız mı?</h3>
          <p className="text-blue-100 mb-6">Yeni rehber önerilerinizi bizimle paylaşın</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors font-medium">
            Öneri Gönderin
          </button>
        </div>
      </div>
    </div>
  );
}