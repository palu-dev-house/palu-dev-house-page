'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';

interface Project {
  title: string;
  description: string;
  type: string;
  featured: boolean;
  technologies: string[];
  images: string[];
  status: string;
  slug: string;
  demoUrl: string;
  githubUrl: string;
  client: string;
  completedAt: string;
}

export default function AddProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    type: 'Tools',
    featured: false,
    technologies: [],
    images: [],
    status: 'active',
    slug: '',
    demoUrl: '',
    githubUrl: '',
    client: '',
    completedAt: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/projects', {
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
            paths: ['/projects', '/'],
            invalidateAll: true
          }),
        });

        alert('Proyek berhasil ditambahkan!');
        router.push('/admin/dashboard?tab=projects');
      } else {
        const error = await response.json();
        alert(`Gagal menambahkan proyek: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Gagal menambahkan proyek. Silakan coba lagi.');
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
          href="/admin/dashboard?tab=projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tambah Proyek Baru</h1>

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
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              placeholder="Deskripsi proyek (akan muncul di halaman listing)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Proyek
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="Tools">Tools</option>
                <option value="SaaS">SaaS</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Custom">Custom</option>
                <option value="Mobile">Mobile</option>
              </select>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="development">Development</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Link Demo (Opsional)
              </label>
              <input
                type="url"
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Link GitHub (Opsional)
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                Klien (Opsional)
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                placeholder="Nama klien"
              />
            </div>

            <div>
              <label htmlFor="completedAt" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai (Opsional)
              </label>
              <input
                type="date"
                id="completedAt"
                name="completedAt"
                value={formData.completedAt}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Proyek
            </label>
            <ImageSelector
              value={formData.images[0] || ''}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                images: value ? [value] : []
              }))}
              placeholder="Pilih gambar proyek..."
              category="images"
              className="mb-6"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
              Teknologi
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies.join(', ')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
              }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="contoh: React, Node.js, MongoDB"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
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
              {isLoading ? 'Menyimpan...' : 'Simpan Proyek'}
            </button>
            <Link
              href="/admin/dashboard?tab=projects"
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
