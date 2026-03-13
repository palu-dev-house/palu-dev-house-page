import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { getProjectsData } from '@/lib/api-client';

export const dynamic = 'force-static';

export default function ProjectsPage() {
  // Sample projects - in real implementation, this would use getProjects()
  const projects = [
    {
      id: 1,
      slug: 'umkm-manager',
      title: 'UMKM Manager',
      description: 'Tools manajemen bisnis sederhana untuk UMKM di Indonesia',
      long_description: 'UMKM Manager adalah solusi manajemen bisnis yang komprehensif namun sederhana, dirancang khusus untuk bisnis kecil (UMKM) di Indonesia. Fitur termasuk manajemen inventory, tracking penjualan, laporan keuangan, dan manajemen pelanggan—semua dalam satu platform yang mudah digunakan.',
      image: null,
      tags: 'SaaS,UMKM,Manajemen',
      link: '#',
      github_link: '#',
      is_featured: 1,
    },
    {
      id: 2,
      slug: 'content-kit',
      title: 'Content Kit',
      description: 'Tools pembuatan dan penjadwalan konten untuk kreator',
      long_description: 'Content Kit menyediakan kreator dengan tools yang powerful untuk merencanakan, membuat, dan menjadwalkan konten di berbagai platform. Fitur termasuk kalender konten, template post, dashboard analytics, dan tools kolaborasi tim.',
      image: null,
      tags: 'Tools,Konten,Produktivitas',
      link: '#',
      github_link: '#',
      is_featured: 1,
    },
    {
      id: 3,
      slug: 'dev-utils',
      title: 'Dev Utils',
      description: 'Kumpulan utilitas dan tools untuk developer',
      long_description: 'Dev Utils adalah koleksi gratis tools untuk developer termasuk JSON formatter, regex tester, code minifier, hash generator, dan banyak lagi. Dibuat oleh developer, untuk developer.',
      image: null,
      tags: 'Developer,Tools,Gratis',
      link: '#',
      github_link: '#',
      is_featured: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Proyek Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Jelajahi tools dan aplikasi yang kami bangun untuk menyelesaikan masalah nyata 
            dan membantu bisnis berkembang.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {project.title.charAt(0)}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {project.link && (
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </span>
                  )}
                  {project.github_link && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Github className="w-4 h-4" />
                      Kode
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
