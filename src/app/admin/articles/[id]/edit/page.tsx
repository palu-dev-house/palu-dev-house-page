'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

// Sample article data - in real app, fetch from API
const sampleArticles: Record<string, {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  read_time: string;
}> = {
  '1': {
    id: '1',
    title: 'Building Proper Apps',
    slug: 'building-proper-apps',
    excerpt: 'Pelajari prinsip-prinsip membangun aplikasi yang tepat untuk memecahkan masalah nyata.',
    content: '# Building Proper Apps\n\nKonten lengkap artikel di sini...',
    published_at: '2024-03-10',
    read_time: '5 menit',
  },
  '2': {
    id: '2',
    title: 'UMKM Digital Transformation',
    slug: 'umkm-digital-transformation',
    excerpt: 'Bagaimana teknologi dapat membantu UMKM berkembang di era digital.',
    content: '# UMKM Digital Transformation\n\nKonten lengkap artikel di sini...',
    published_at: '2024-03-05',
    read_time: '8 menit',
  },
};

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // In a real app, fetch article data based on params.id
  const articleId = '1'; // This would come from params
  const article = sampleArticles[articleId] || {
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published_at: '',
    read_time: '',
  };

  const [formData, setFormData] = useState({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    published_at: article.published_at,
    read_time: article.read_time,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would call an API to update the article
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Artikel berhasil diperbarui!');
      router.push('/admin');
    } catch {
      alert('Gagal memperbarui artikel. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    
    setIsDeleting(true);
    try {
      // In a real app, this would call an API to delete the article
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Artikel berhasil dihapus!');
      router.push('/admin');
    } catch {
      alert('Gagal menghapus artikel. Silakan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Artikel</h1>

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
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="contoh: artikel-baru"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier untuk artikel ini</p>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                id="published_at"
                name="published_at"
                required
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Baca
              </label>
              <input
                type="text"
                id="read_time"
                name="read_time"
                required
                value={formData.read_time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="contoh: 5 menit"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 ml-auto"
            >
              <Trash2 className="w-5 h-5" />
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
