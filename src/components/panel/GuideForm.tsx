import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Category, Topic } from '../../types';
import { X, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTopicStore } from '../../store/topicStore';

interface GuideFormProps {
  categories: Category[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function GuideForm({ categories, initialData, onSubmit, onCancel }: GuideFormProps) {
  const { user } = useAuthStore();
  const { topics, fetchTopics } = useTopicStore();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category_id || '');
  
  // Parse steps/faq if they are string (JSON) in initialData
  const normalizedInitialData = initialData ? {
    ...initialData,
    steps: typeof initialData.steps === 'string' ? (() => { try { return JSON.parse(initialData.steps); } catch { return [{ title: '', content: '' }]; } })() : (Array.isArray(initialData.steps) ? initialData.steps : [{ title: '', content: '' }]),
    faq: typeof initialData.faq === 'string' ? (() => { try { return JSON.parse(initialData.faq); } catch { return [{ question: '', answer: '' }]; } })() : (Array.isArray(initialData.faq) ? initialData.faq : [{ question: '', answer: '' }]),
  } : undefined;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: normalizedInitialData || {
      title: '',
      content: '',
      category_id: '',
      topic_id: '',
      status: 'draft',
      meta_description: '',
      meta_keywords: '',
      overview: '',
      steps: [{ title: '', content: '' }],
      important_notes: '',
      faq: [{ question: '', answer: '' }],
      image: ''
    }
  });

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const watchedContent = watch();

  const filteredTopics = topics.filter(topic => topic.category_id === selectedCategory);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  const addStep = () => {
    const steps = watch('steps');
    setValue('steps', [...steps, { title: '', content: '' }]);
  };

  const removeStep = (index: number) => {
    const steps = watch('steps');
    setValue('steps', steps.filter((_: any, i: number) => i !== index));
  };

  const addFAQ = () => {
    const faq = watch('faq');
    setValue('faq', [...faq, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    const faq = watch('faq');
    setValue('faq', faq.filter((_: any, i: number) => i !== index));
  };

  const handleFormSubmit = (data: any) => {
    if (!user?.id) {
      throw new Error('User must be logged in to create a guide');
    }
    
    onSubmit({
      ...data,
      author_id: user.id,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setValue('category_id', categoryId);
    setValue('topic_id', '');
  };

  if (showPreview) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{watchedContent.title}</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="prose max-w-none">
          <h3>Genel Bakış</h3>
          <div dangerouslySetInnerHTML={{ __html: watchedContent.overview }} />

          <h3>Adımlar</h3>
          {watchedContent.steps.map((step: any, index: number) => (
            <div key={index} className="mb-6">
              <h4>{step.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: step.content }} />
            </div>
          ))}

          <h3>Önemli Noktalar</h3>
          <div dangerouslySetInnerHTML={{ __html: watchedContent.important_notes }} />

          <h3>Sıkça Sorulan Sorular</h3>
          {watchedContent.faq.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowPreview(false)}
          className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Düzenlemeye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-lg flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{initialData ? 'Rehberi Düzenle' : 'Yeni Rehber'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 w-full px-2 sm:px-4 md:px-6 lg:px-8 overflow-y-auto flex-1"
          style={{ boxSizing: 'border-box', maxHeight: 'calc(95vh - 56px)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Başlık zorunludur' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Görsel URL
              </label>
              <input
                type="url"
                id="image"
                {...register('image')}
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {watch('image') && (
                <div className="mt-2">
                  <img
                    src={watch('image')}
                    alt="Önizleme"
                    className="h-32 w-full object-cover rounded-lg"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/800x400?text=Görsel+Bulunamadı';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id.message as string}</p>
              )}
            </div>

            {selectedCategory && (
              <div className="md:col-span-2">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Konu
                </label>
                <select
                  id="topic"
                  {...register('topic_id', { required: 'Konu seçimi zorunludur' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Konu Seçin</option>
                  {filteredTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
                {errors.topic_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.topic_id.message as string}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              SEO Bilgileri
            </label>
            <input
              type="text"
              placeholder="Meta Açıklama"
              {...register('meta_description')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Anahtar Kelimeler (virgülle ayırın)"
              {...register('meta_keywords')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genel Bakış
            </label>
            <div className="min-w-[300px]">
              <ReactQuill
                theme="snow"
                value={watch('overview')}
                onChange={(content) => setValue('overview', content)}
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adımlar
            </label>
            <div className="min-w-[300px]">
              {(Array.isArray(watch('steps')) ? watch('steps') : []).map((step: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <input
                      type="text"
                      placeholder="Adım Başlığı"
                      {...register(`steps.${index}.title`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-700 mt-2 sm:mt-0 sm:ml-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={watch(`steps.${index}.content`)}
                    onChange={(content) => setValue(`steps.${index}.content`, content)}
                    modules={modules}
                    formats={formats}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              + Adım Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Önemli Noktalar
            </label>
            <div className="min-w-[300px]">
              <ReactQuill
                theme="snow"
                value={watch('important_notes')}
                onChange={(content) => setValue('important_notes', content)}
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sıkça Sorulan Sorular
            </label>
            <div className="min-w-[300px]">
              {(Array.isArray(watch('faq')) ? watch('faq') : []).map((item: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Soru"
                        {...register(`faq.${index}.question`)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <textarea
                        placeholder="Cevap"
                        {...register(`faq.${index}.answer`)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-600 hover:text-red-700 mt-2 sm:mt-0 sm:ml-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFAQ}
              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              + Soru Ekle
            </button>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Durum
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              Önizle
            </button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                {initialData ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}