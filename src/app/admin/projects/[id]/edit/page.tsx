'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

// Sample project data - in real app, fetch from API
const sampleProjects: Record<string, {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description: string;
  tags: string;
  link: string;
  github_link: string;
  is_featured: boolean;
}> = {
  '1': {
    id: '1',
    title: 'UMKM Manager',
    slug: 'umkm-manager',
    description: 'Tools manajemen bisnis sederhana untuk UMKM di Indonesia',
    full_description: '# UMKM Manager\n\nDeskripsi lengkap proyek di sini...',
    tags: 'SaaS,UMKM,Manajemen',
    link: '#',
    github_link: '#',
    is_featured: true,
  },
  '2': {
    id: '2',
    title: 'Content Kit',
    slug: 'content-kit',
    description: 'Tools pembuatan dan penjadwalan konten untuk kreator',
    full_description: '# Content Kit\n\nDeskripsi lengkap proyek di sini...',
    tags: 'Tools,Konten,Produktivitas',
    link: '#',
    github_link: '#',
    is_featured: true,
  },
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // In a real app, fetch project data based on params.id
  const projectId = '1'; // This would come from params
  const project = sampleProjects[projectId] || {
    id: '',
    title: '',
    slug: '',
    description: '',
    full_description: '',
    tags: '',
    link: '',
    github_link: '',
    is_featured: false,
  };

  const [formData, setFormData] = useState({
    title: project.title,
    slug: project.slug,
    description: project.description,
    full_description: project.full_description,
    tags: project.tags,
    link: project.link,
    github_link: project.github_link,
    is_featured: project.is_featured,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would call an API to update the project
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Proyek berhasil diperbarui!');
      router.push('/admin');
    } catch {
      alert('Gagal memperbarui proyek. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    
    setIsDeleting(true);
    try {
      // In a real app, this would call an API to delete the project
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Proyek berhasil dihapus!');
      router.push('/admin');
    } catch {
      alert('Gagal menghapus proyek. Silakan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Proyek</h1>

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
              placeholder="Masukkan judul proyek"
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
              placeholder="contoh: proyek-baru"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier untuk proyek ini</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Singkat
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              placeholder="Deskripsi singkat proyek (akan muncul di halaman listing)"
            />
          </div>

          <div>
            <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Lengkap
            </label>
            <textarea
              id="full_description"
              name="full_description"
              required
              rows={10}
              value={formData.full_description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              placeholder="Deskripsi lengkap proyek (support Markdown)"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              required
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="contoh: SaaS,UMKM,Manajemen"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Link Demo (Opsional)
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="github_link" className="block text-sm font-medium text-gray-700 mb-2">
                Link GitHub (Opsional)
              </label>
              <input
                type="url"
                id="github_link"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
              Tampilkan sebagai Proyek Unggulan
            </label>
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
