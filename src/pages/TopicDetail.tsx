import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreditCard, ChevronRight, Search, Clock, Eye, Star, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 10;

const guides = [
  {
    title: 'Kredi Kartı Limit Artırımı Nasıl Yapılır?',
    description: 'Kredi kartı limitinizi artırmak için izlemeniz gereken adımlar ve dikkat edilmesi gereken noktalar.',
    category: 'Kredi Kartları',
    views: '15.3K',
    rating: 4.8,
    date: '2 gün önce',
    readTime: '6 dk',
    image: 'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg'
  },
  {
    title: 'Kredi Kartı Borç Yapılandırma',
    description: 'Kredi kartı borcunuzu yapılandırmak için bankalarla nasıl görüşebilir ve hangi seçenekleri değerlendirebilirsiniz?',
    category: 'Kredi Kartları',
    views: '12.8K',
    rating: 4.7,
    date: '4 gün önce',
    readTime: '8 dk',
    image: 'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg'
  },
  {
    title: 'Yurtdışı Kredi Kartı Kullanım Rehberi',
    description: 'Yurtdışı seyahatlerinizde kredi kartınızı güvenle kullanmak için önemli ipuçları ve öneriler.',
    category: 'Kredi Kartları',
    views: '9.5K',
    rating: 4.9,
    date: '1 hafta önce',
    readTime: '7 dk',
    image: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg'
  }
];

const faqs = [
  {
    question: 'Kredi kartı limitimi nasıl öğrenebilirim?',
    answer: 'Kredi kartı limitinizi mobil bankacılık uygulaması, internet bankacılığı veya müşteri hizmetlerini arayarak öğrenebilirsiniz.'
  },
  {
    question: 'Kredi kartı başvurum neden reddedilmiş olabilir?',
    answer: 'Başvurunuzun reddedilmesinin başlıca nedenleri düşük kredi notu, yetersiz gelir veya mevcut kredi yükü olabilir.'
  },
  {
    question: 'Kredi kartı aidatı iadesi alabilir miyim?',
    answer: 'Bankanızla görüşerek kart aidatı iadesini talep edebilirsiniz. Bazı bankalar belirli koşullar altında iade yapabilmektedir.'
  }
];

const quickLinks = [
  'Limit Artırma',
  'Kart İptali',
  'Borç Yapılandırma',
  'Kart Güvenliği',
  'Online Alışveriş',
  'Taksit Seçenekleri'
];

// Yardımcı fonksiyon: Tarih formatla
function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Rehberdeki tarihi bul
function getGuideDate(guide: any) {
  return guide.created_at || guide.updated_at || guide.published_at || guide.date || '';
}

export default function TopicDetail() {
  const { kategori, konu, sayfa } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [totalGuides, setTotalGuides] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(sayfa) || 1);

  useEffect(() => {
    setCurrentPage(Number(sayfa) || 1);
  }, [sayfa]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setCategory(null);
      setTopic(null);
      setGuides([]);
      setTotalGuides(0);
      try {
        // 1. Kategori id'sini bul
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', kategori)
          .single();
        if (catError || !catData) throw new Error('Kategori bulunamadı');
        setCategory(catData);

        // 2. Topic'i bul (kategori id ve konu slug ile)
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('*')
          .eq('slug', konu)
          .eq('category_id', catData.id)
          .single();
        if (topicError || !topicData) throw new Error('Konu bulunamadı');
        setTopic(topicData);

        // 3. Toplam rehber sayısını bul
        const { count: total, error: countError } = await supabase
          .from('guides')
          .select('*', { count: 'exact', head: true })
          .eq('topic_id', topicData.id)
          .eq('status', 'published');
        if (countError) throw new Error('Rehber sayısı alınamadı');
        setTotalGuides(total || 0);

        // 4. Rehberleri çek (sayfalama ile)
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data: guidesData, error: guidesError } = await supabase
          .from('guides')
          .select('*')
          .eq('topic_id', topicData.id)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .range(from, to);
        if (guidesError) {
          console.error(guidesError);
          throw new Error('Rehberler alınamadı');
        }
        setGuides(guidesData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [kategori, konu, currentPage]);

  // Sayfalama
  const totalPages = Math.ceil(totalGuides / PAGE_SIZE);
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate(`/kategori/${kategori}/${konu}/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>{topic ? `${topic.title} Rehberleri | YardımRehberi.com` : 'Konu Detayı'} </title>
        <meta name="description" content={topic?.description || ''} />
        <meta name="keywords" content={`${topic?.title || ''}, rehber, konu, YardımRehberi`} />
        <link rel="canonical" href={`https://yardimrehberi.com/kategori/${kategori}/${konu}`} />
        <meta property="og:title" content={topic ? `${topic.title} Rehberleri | YardımRehberi.com` : 'Konu Detayı'} />
        <meta property="og:description" content={topic?.description || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yardimrehberi.com/kategori/${kategori}/${konu}`} />
        <meta property="og:image" content={topic?.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={topic ? `${topic.title} Rehberleri | YardımRehberi.com` : 'Konu Detayı'} />
        <meta name="twitter:description" content={topic?.description || ''} />
        <meta name="twitter:image" content={topic?.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Kategoriler", "item": "https://yardimrehberi.com/kategoriler"},
            {"@type": "ListItem", "position": 2, "name": category?.name, "item": `https://yardimrehberi.com/kategori/${kategori}`},
            {"@type": "ListItem", "position": 3, "name": topic?.title, "item": `https://yardimrehberi.com/kategori/${kategori}/${konu}`}
          ]
        })}</script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-32 text-blue-600 text-xl font-semibold animate-pulse">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center py-32 text-red-600 text-lg font-semibold">{error}</div>
        ) : (
          <>
            {/* Topic Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <div className="flex items-center space-x-2 text-blue-100 mb-4">
                    <Link to={`/kategori/${kategori}`} className="hover:text-white">{category?.name}</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{topic?.title}</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{topic?.title}</h1>
                  </div>
                  <p className="text-lg md:text-xl text-blue-100 max-w-2xl">{topic?.description}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center min-w-[160px]">
                  <div className="text-4xl font-bold text-white mb-2">{totalGuides}</div>
                  <div className="text-blue-100">Güncel Rehber</div>
                </div>
              </div>
            </div>

            {/* Guides List */}
            <div className="space-y-8">
              {guides.length === 0 ? (
                <div className="text-center text-gray-500 py-16">Bu konuda henüz rehber eklenmemiş.</div>
              ) : (
                guides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 h-48 md:h-auto relative">
                        <img
                          src={guide.image || 'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg'}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                            {category?.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatDate(getGuideDate(guide))}</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{guide.readTime || '-'}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{guide.views}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="font-medium text-gray-700">{guide.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {guide.title}
                        </h3>
                        {guide.overview ? (
                          <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: guide.overview }} />
                        ) : guide.content ? (
                          <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: guide.content }} />
                        ) : null}
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/rehber/${guide.slug}`}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <span>Devamını Oku</span>
                            <ChevronRight className="h-5 w-5 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-l bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                >
                  Önceki
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'} rounded`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-r bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}