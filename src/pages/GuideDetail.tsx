import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ThumbsUp, MessageSquare, Bookmark, Share2, Clock, Eye, Star, AlertCircle, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Yardımcı fonksiyon: Tarih formatla
function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Steps renk paleti
const stepColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-yellow-400',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-red-500',
];

export default function GuideDetail() {
  const { slug } = useParams();
  const [guide, setGuide] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGuide() {
      setLoading(true);
      setError(null);
      setGuide(null);
      setCategory(null);
      setTopic(null);
      setAuthor(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('guides')
          .select('*')
          .eq('slug', slug)
          .single();
        if (fetchError || !data) throw new Error('Rehber bulunamadı');
        setGuide(data);
        // Görüntüleme sayısını artır
        await supabase
          .from('guides')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
        // Kategori
        if (data.category_id) {
          const { data: catData } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', data.category_id)
            .single();
          setCategory(catData);
        }
        // Konu
        if (data.topic_id) {
          const { data: topicData } = await supabase
            .from('topics')
            .select('id, title, slug')
            .eq('id', data.topic_id)
            .single();
          setTopic(topicData);
        }
        // Yorumları çek
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('guide_id', data.id)
          .order('created_at', { ascending: false });
        if (!commentsError) setComments(commentsData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [slug]);

  useEffect(() => {
    if (guide && guide.id) {
      setLiked(!!localStorage.getItem(`liked_guide_${guide.id}`));
    }
  }, [guide]);

  useEffect(() => {
    if (guide) {
      // steps ve faq alanlarını array'e çevir
      if (typeof guide.steps === 'string') {
        try { guide.steps = JSON.parse(guide.steps); } catch {}
      }
      if (typeof guide.faq === 'string') {
        try { guide.faq = JSON.parse(guide.faq); } catch {}
      }
    }
  }, [guide]);

  const handleLike = async () => {
    if (!guide || liked) return;
    setLikeLoading(true);
    try {
      const { data, error } = await supabase
        .from('guides')
        .update({ likes: (guide.likes || 0) + 1 })
        .eq('id', guide.id)
        .select('*')
        .single();
      if (error) throw new Error('Beğenme işlemi başarısız');
      if (data) setGuide(data);
      setLiked(true);
      localStorage.setItem(`liked_guide_${guide.id}`, '1');
    } catch (err) {
      alert('Beğenme işlemi başarısız');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !guide) return;
    setCommentLoading(true);
    setCommentError(null);
    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([
          {
            guide_id: guide.id,
            name: commentName.trim(),
            text: commentText.trim(),
          }
        ]);
      if (insertError) throw new Error('Yorum eklenemedi');
      setCommentName('');
      setCommentText('');
      // Yorumları tekrar çek
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('guide_id', guide.id)
        .order('created_at', { ascending: false });
      if (!commentsError) setComments(commentsData || []);
    } catch (err: any) {
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Hata, yükleniyor ve rehber bulunamadı kontrolleri
  if (loading) {
    return <div className="pt-24 text-center text-gray-500">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="pt-24 text-center text-red-600">Hata: {error}</div>;
  }
  if (!guide) {
    return <div className="pt-24 text-center text-gray-500">Rehber bulunamadı.</div>;
  }

  const guideTitle = "Kredi Kartı Başvurusu Nasıl Yapılır?";
  const guideDescription = "Kredi kartı başvurusu yapmak için adım adım rehber. Başvuru sürecini kolaylaştıran ipuçları ve dikkat edilmesi gerekenler.";
  const publishDate = "2024-03-15";
  const modifiedDate = "2024-03-17";

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>{guide.title} | YardımRehberi.com</title>
        <meta name="description" content={guide.overview || guide.meta_description || guide.content?.slice(0, 160) || ''} />
        <meta name="keywords" content={guide.meta_keywords || `${guide.title}, rehber, ${category?.name || ''}, ${topic?.title || ''}`} />
        <link rel="canonical" href={`https://yardimrehberi.com/rehber/${guide.slug}`} />
        <meta property="og:title" content={`${guide.title} | YardımRehberi.com`} />
        <meta property="og:description" content={guide.overview || guide.meta_description || guide.content?.slice(0, 160) || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yardimrehberi.com/rehber/${guide.slug}`} />
        <meta property="og:image" content={guide.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${guide.title} | YardımRehberi.com`} />
        <meta name="twitter:description" content={guide.overview || guide.meta_description || guide.content?.slice(0, 160) || ''} />
        <meta name="twitter:image" content={guide.image || 'https://yardimrehberi.com/og-default.jpg'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": guide.title,
          "description": guide.overview || guide.meta_description || '',
          "image": guide.image || 'https://yardimrehberi.com/og-default.jpg',
          "author": author?.full_name || 'YardımRehberi',
          "datePublished": guide.created_at,
          "dateModified": guide.updated_at,
          "mainEntityOfPage": `https://yardimrehberi.com/rehber/${guide.slug}`
        })}</script>
      </Helmet>

      {/* Guide Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center space-x-2 text-emerald-50 mb-4">
                {category && (
                  <Link to={`/kategori/${category.slug}`} className="hover:text-white">{category.name}</Link>
                )}
                <ChevronRight className="h-4 w-4" />
                {topic && (
                  <Link to={`/kategori/${category?.slug}/${topic.slug}`} className="hover:text-white">{topic.title}</Link>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {guide?.title}
              </h1>
              <div className="flex items-center space-x-6 text-emerald-50">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Okuma Süresi: {guide?.readTime || `${Math.floor(Math.random() * 15) + 1} dk`} </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>{guide?.views} görüntülenme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>{guide?.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{formatDate(guide?.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Bookmark className="h-5 w-5" />
                <span>Kaydet</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Top Advertisement */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Reklam Alanı • Banner (728x90)</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="prose prose-emerald max-w-none">
                <h2 id="overview">Genel Bakış</h2>
                {guide?.overview && (
                  <div dangerouslySetInnerHTML={{ __html: guide.overview }} />
                )}
                {guide?.important_notes && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-emerald-800 font-medium mb-2">Önemli Hatırlatma</h4>
                        <div className="text-emerald-700 text-sm" dangerouslySetInnerHTML={{ __html: guide.important_notes }} />
                      </div>
                    </div>
                  </div>
                )}
                {guide?.content && (
                  <div className="mt-8" dangerouslySetInnerHTML={{ __html: guide.content }} />
                )}
                {guide?.steps && Array.isArray(guide.steps) && guide.steps.length > 0 && (
                  <>
                    <h2 className="mt-8">Adım Adım</h2>
                    <div className="mt-8 space-y-8">
                      {guide.steps.map((step: any, index: number) => (
                        <div key={index} className="relative" id={`step-${index}`}>
                          {index !== guide.steps.length - 1 && (
                            <div className="absolute left-8 top-14 h-full w-0.5 bg-gray-200"></div>
                          )}
                          <div className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${stepColors[index % stepColors.length]}`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: step.content }} />
                              {step.important && Array.isArray(step.important) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-900 mb-3">Önemli Noktalar:</h4>
                                  <ul className="space-y-2">
                                    {step.important.map((point: string, idx: number) => (
                                      <li key={idx} className="flex items-center space-x-2 text-gray-700">
                                        <ArrowRight className="h-4 w-4 text-emerald-500" />
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {step.duration && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>Tahmini süre: {step.duration}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {guide?.faq && Array.isArray(guide.faq) && guide.faq.length > 0 && (
                  <>
                    <h2 className="mt-8" id="faq">Sıkça Sorulan Sorular</h2>
                    <div className="mt-4 space-y-4">
                      {guide.faq.map((item: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="font-semibold text-gray-900 mb-2">{item.question}</div>
                          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* Yorumlar */}
                <div className="mt-16">
                  <h2 className="text-xl font-bold mb-4">Yorumlar</h2>
                  {Array.isArray(comments) && comments.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      {comments.map((c: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="font-semibold text-gray-900 mb-1">{c.name}</div>
                          <div className="text-gray-700 mb-1">{c.text}</div>
                          <div className="text-xs text-gray-400">{formatDate(c.created_at)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 mb-8">Henüz yorum yok. İlk yorumu sen yaz!</div>
                  )}
                  <form onSubmit={handleAddComment} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <div>
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Adınız"
                        value={commentName}
                        onChange={e => setCommentName(e.target.value)}
                        required
                        maxLength={32}
                      />
                    </div>
                    <div>
                      <textarea
                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Yorumunuz"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        required
                        maxLength={500}
                        rows={3}
                      />
                    </div>
                    {commentError && <div className="text-red-600 text-sm">{commentError}</div>}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                      disabled={commentLoading}
                    >
                      {commentLoading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
                <div className="flex items-center space-x-8">
                  <button
                    className={`flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors ${liked ? 'text-emerald-600 font-bold' : ''}`}
                    onClick={handleLike}
                    disabled={liked || likeLoading}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Faydalı ({guide?.likes || 0})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span>Yorum Yap (45)</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Son Güncelleme:</span>
                  <span>2 gün önce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İçindekiler</h3>
                <nav className="space-y-3">
                  <a href="#overview" className="block text-emerald-600 font-medium">Genel Bakış</a>
                  {guide?.steps && Array.isArray(guide.steps) && guide.steps.length > 0 && guide.steps.map((step: any, idx: number) => (
                    <a key={idx} href={`#step-${idx}`} className="block text-gray-600 hover:text-emerald-600 transition-colors">
                      {step.title}
                    </a>
                  ))}
                  {guide?.faq && Array.isArray(guide.faq) && guide.faq.length > 0 && (
                    <a href="#faq" className="block text-gray-600 hover:text-emerald-600 transition-colors">Sıkça Sorulan Sorular</a>
                  )}
                </nav>
              </div>

              {/* Advertisement */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Reklam Alanı • Skyscraper (300x600)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}