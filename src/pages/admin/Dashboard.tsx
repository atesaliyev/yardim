import React, { useState, useEffect } from 'react';
import { BookOpen, FolderTree, Eye, TrendingUp, Star, Activity, Bell, FileText, ChevronRight, ArrowUp, ArrowDown, Download, LayoutTemplate, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageHeader from '../../components/panel/PageHeader';
import { useStatsStore } from '../../store/statsStore';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useCategoryStore } from '../../store/categoryStore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const stats = [
  {
    title: 'Toplam Rehber',
    value: '0',
    change: '0%',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    title: 'Toplam Kategori',
    value: '0',
    change: '0',
    icon: FolderTree,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    title: 'Toplam Görüntülenme',
    value: '0',
    change: '0%',
    icon: Eye,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    title: 'Aktif Reklam',
    value: '0',
    change: '0',
    icon: LayoutTemplate,
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  }
];

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Panel', icon: Activity },
  { key: 'ai', label: 'AI Asistanı', icon: MessageSquare },
];

function generateSeoSlug(str: string) {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    'é': 'e', 'â': 'a', 'î': 'i', 'û': 'u', 'ô': 'o',
    '&': '', '@': '', '#': '', '$': '', '%': '', '^': '', '*': '', '(': '', ')': '', '=': '', '?': '', '!': '', ',': '', '.': '', ':': '', ';': '', '"': '', '\'': '', '[': '', ']': '', '{': '', '}': '', '|': '', '<': '', '>': '', '/': '', '\\': '', '`': '', '~': '', '+': '', '–': '-', '—': '-', '’': '', '“': '', '”': '', '…': '', ' ': '-', '_': '-',
  };
  return (
    str
      .replace(/[çÇğĞıİöÖşŞüÜéâîûô&@#$%^*()=?!,.:;"'\[\]{}|<>/\\`~+–—’"”… _]/g, (match) => trMap[match] || '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/(^-|-$)/g, '')
  );
}

function addRandomToSlug(slug: string) {
  return slug + '-' + Math.random().toString(36).substring(2, 8);
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^|\s|[-/])([a-zçğıöşü])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

async function fetchOpenAIContent(prompt: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Aşağıdaki anahtar kelimeyle ilgili, SEO uyumlu ve kullanıcıya değer katan bir rehber üret:\n- Genel Bakış: 2-3 paragraf, anahtar kelimelerle dolu, özgün ve bilgilendirici.\n- Önemli Hatırlatma: Konu ile ilgili gerçek ve önemli bir uyarı veya ipucu.\n- Adım Adım: Konu hakkında 3-5 adımda yapılacaklar veya süreç.\n- Sıkça Sorulan Sorular: 3 adet, okuyucunun gerçekten sorabileceği sorular ve kısa, net cevaplar.\nCevabı aşağıdaki formatta JSON olarak ver:\n{\n  \\"overview\\": \\\"...Genel Bakış...\\",\n  \\"important_notes\\": \\\"...Önemli Hatırlatma...\\",\n  \\"steps\\": [\n    { \\"title\\": \\"Adım 1\\", \\"content\\": \\"...\\" },\n    { \\"title\\": \\"Adım 2\\", \\"content\\": \\"...\\" }\n  ],\n  \\"faq\\": [\n    { \\"question\\": \\"...\\", \\"answer\\": \\"...\\" },\n    { \\"question\\": \\"...\\", \\"answer\\": \\"...\\" }\n  ]\n}\nAnahtar kelime: [KULLANICI GİRDİSİ]` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  if (!data.choices || !data.choices[0]?.message?.content) throw new Error('OpenAI API yanıtı alınamadı');
  return JSON.parse(data.choices[0].message.content);
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('weekly');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai'>('dashboard');
  const { stats: dashboardStats, loading, error, fetchStats } = useStatsStore();
  const { categories, fetchCategories, loading: catLoading } = useCategoryStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // AI Assistant State
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [addedTopics, setAddedTopics] = useState<number[]>([]);

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, [fetchStats, fetchCategories]);

  const handleDownloadReport = () => {
    toast.success('Rapor indirme başladı');
  };

  // Update stats with real data
  stats[0].value = `${dashboardStats.guides.total}+`;
  stats[0].change = `+${Math.floor((dashboardStats.guides.published / dashboardStats.guides.total) * 100)}%`;
  
  stats[1].value = dashboardStats.categories.total.toString();
  stats[1].change = `+${dashboardStats.categories.distribution.length}`;
  
  stats[2].value = `${(dashboardStats.guides.views / 1000).toFixed(1)}K`;
  stats[2].change = '+18%'; // Example calculation
  
  stats[3].value = dashboardStats.ads.active.toString();
  stats[3].change = `+${dashboardStats.ads.active - Math.floor(dashboardStats.ads.active * 0.8)}`; // Example calculation

  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      // Her satırı başlık olarak al
      const topics = aiInput.split('\n').map(t => t.trim()).filter(Boolean);
      if (topics.length === 0) {
        toast.error('Lütfen en az bir başlık girin.');
        setAiLoading(false);
        return;
      }
      const results: any[] = [];
      for (const topic of topics) {
        try {
          const result = await fetchOpenAIContent(topic);
          results.push({
            topic,
            topicDesc: topic + ' hakkında rehber',
            guides: [
              {
                title: topic,
                desc: result.overview,
                overview: result.overview,
                important_notes: result.important_notes,
                steps: result.steps,
                faq: result.faq
              }
            ]
          });
        } catch (e: any) {
          results.push({ topic, error: e.message || 'OpenAI API hatası' });
        }
      }
      setAiResults(results);
    } catch (e: any) {
      toast.error('OpenAI API hatası: ' + (e.message || e.toString()));
    }
    setAiLoading(false);
  };

  const handleAddAllTopicsAndGuides = async () => {
    if (!selectedCategoryId) {
      toast.error('Lütfen bir kategori seçin!');
      return;
    }
    setAiLoading(true);
    let successCount = 0;
    for (let idx = 0; idx < aiResults.length; idx++) {
      const res = aiResults[idx];
      if (addedTopics.includes(idx) || res.error) continue;
      try {
        // 1. Konu ekle (önce SEO slug, çakışırsa random ekle)
        let topicSlug = generateSeoSlug(res.topic);
        let topicData, topicError;
        {
          const result = await supabase
            .from('topics')
            .insert({
              title: res.topic,
              description: res.topicDesc,
              slug: topicSlug,
              category_id: selectedCategoryId,
            })
            .select('*')
            .single();
          topicData = result.data;
          topicError = result.error;
          if (topicError && topicError.code === '23505') { // unique violation
            topicSlug = addRandomToSlug(topicSlug);
            const retry = await supabase
              .from('topics')
              .insert({
                title: res.topic,
                description: res.topicDesc,
                slug: topicSlug,
                category_id: selectedCategoryId,
              })
              .select('*')
              .single();
            topicData = retry.data;
          }
        }
        // 2. Guide ekle
        for (const g of res.guides) {
          await supabase.from('guides').insert({
            title: toTitleCase(g.title),
            overview: g.overview,
            content: g.overview, // veya daha detaylı içerik
            meta_description: g.desc,
            slug: addRandomToSlug(generateSeoSlug(g.title)),
            topic_id: topicData.id,
            category_id: selectedCategoryId,
            important_notes: g.important_notes,
            steps: g.steps,
            faq: g.faq,
            status: 'published',
          });
        }
        successCount++;
        setAddedTopics(prev => [...prev, idx]);
      } catch (e) {
        // Hata olursa devam et
      }
    }
    toast.success(`${successCount} rehber başarıyla eklendi!`);
    setAiLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p>Bir hata oluştu: {error}</p>
          <button
            onClick={() => fetchStats()}
            className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-4 space-y-2">
        {SIDEBAR_ITEMS.map(item => (
          <button
            key={item.key}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors mb-1 ${activeTab === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab(item.key as 'dashboard' | 'ai')}
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <PageHeader
              title="Yönetim Paneli"
              description="Rehber, içerik ve reklam istatistiklerini görüntüleyin"
            >
              <div className="flex items-center space-x-4">
                <select
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
                <button
                  onClick={handleDownloadReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Rapor İndir
                </button>
              </div>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span className={`text-sm font-medium flex items-center ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change.startsWith('+') ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic and Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Site Trafiği ve Reklam Geliri</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardStats.traffic}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Ziyaretçi"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                      <Area
                        type="monotone"
                        dataKey="ads"
                        name="Reklam Gösterimi"
                        stroke="#F59E0B"
                        fillOpacity={1}
                        fill="url(#colorAds)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Kategori Dağılımı ve Performans</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardStats.categories.distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardStats.categories.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Popular Guides */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Popüler Rehberler</h2>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {dashboardStats.popularGuides.map((guide, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{guide.title}</h3>
                        <span className="text-sm text-green-600">
                          <ArrowUp className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">{guide.category}</span>
                        <span className="text-sm text-emerald-600">Reklam Geliri: ₺{guide.adRevenue}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{guide.views}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        <span>{guide.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center"><MessageSquare className="h-6 w-6 mr-2" /> AI Asistanı ile Konu & Rehber Oluştur</h2>
            <p className="mb-6 text-gray-600">Bir anahtar kelime veya kategori gir, AI sana yeni konu ve rehber başlıkları önersin. (Demo modunda fake veriyle çalışır)</p>
            <div className="flex gap-2 mb-6 items-center">
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                disabled={catLoading}
              >
                <option value="">Kategori Seç</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <textarea
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
                placeholder="Her satıra bir başlık yazın...\nÖrn:\nLGS ve YKS Sınav Kayıt İşlemleri\nÜniversite Tercihleri İçin 2025 Bölüm Puanları\n..."
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiInput.trim()}
              >
                {aiLoading ? 'Oluşturuluyor...' : 'Önerileri Getir'}
              </button>
              {aiResults.length > 1 && (
                <button
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  onClick={handleAddAllTopicsAndGuides}
                  disabled={aiLoading || !selectedCategoryId}
                >
                  {aiLoading ? 'Ekleniyor...' : 'Tümünü Otomatik Ekle'}
                </button>
              )}
            </div>
            {aiResults.length > 0 && (
              <div className="space-y-8">
                {aiResults.map((res, idx) => (
                  <div key={idx} className="border border-blue-100 rounded-xl p-6 bg-blue-50/50">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Konu: {res.topic}</h3>
                    <p className="mb-3 text-blue-700">{res.topicDesc}</p>
                    <div className="space-y-2">
                      {res.guides.map((g: any, i: number) => (
                        <div key={i} className="bg-white rounded-lg px-4 py-3 flex items-center justify-between border border-blue-100">
                          <div>
                            <div className="font-semibold text-gray-900">{g.title}</div>
                            <div className="text-gray-500 text-sm">{g.desc}</div>
                          </div>
                          <button
                            className="text-blue-600 hover:underline text-sm font-medium"
                            onClick={() => handleAddAllTopicsAndGuides()}
                            disabled={addedTopics.includes(idx)}
                          >
                            {addedTopics.includes(idx) ? 'Eklendi' : 'Ekle'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                      onClick={() => handleAddAllTopicsAndGuides()}
                      disabled={addedTopics.includes(idx)}
                    >
                      {addedTopics.includes(idx) ? 'Eklendi' : 'Konuyu ve Rehberleri Ekle'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}