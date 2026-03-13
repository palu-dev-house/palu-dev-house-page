'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';

interface Article {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  url: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  image: string;
}

export default function AddArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Article>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Ferdy',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '5 min',
    url: '',
    tags: [],
    featured: false,
    status: 'draft',
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Trigger ISR revalidation
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            secret: process.env.REVALIDATE_SECRET || 'palu-dev-house-secret',
            paths: ['/articles', '/'],
            invalidateAll: true
          }),
        });

        alert('Artikel berhasil ditambahkan!');
        router.push('/admin/dashboard?tab=articles');
      } else {
        const error = await response.json();
        alert(`Gagal menambahkan artikel: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Gagal menambahkan artikel. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin/dashboard?tab=articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tambah Artikel Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm p-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="Masukkan judul artikel"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Ringkasan
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              placeholder="Ringkasan singkat artikel (akan muncul di halaman listing)"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Konten
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              placeholder="Konten lengkap artikel (support Markdown)"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Artikel
            </label>
            <ImageSelector
              value={formData.image}
              onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
              placeholder="Pilih gambar artikel..."
              category="images"
              className="mb-6"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="Author name"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                id="publishedAt"
                name="publishedAt"
                required
                value={formData.publishedAt}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Baca
              </label>
              <input
                type="text"
                id="readTime"
                name="readTime"
                required
                value={formData.readTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="contoh: 5 min"
              />
            </div>
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL Artikel
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="https://medium.com/@username/article-title"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Artikel Unggulan
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
            <Link
              href="/admin/dashboard?tab=articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
