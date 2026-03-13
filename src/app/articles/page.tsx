import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-static';

export default function ArticlesPage() {
  const articles = [
    {
      slug: 'building-proper-apps',
      title: 'Seni Membangun Aplikasi yang Tepat',
      excerpt: 'Mengapa memahami masalah lebih penting daripada menulis kode, dan bagaimana kami mendekati software development di Palu Dev House.',
      content: 'Full article content here...',
      published_at: '2024-03-10',
      read_time: '5 menit',
    },
    {
      slug: 'umkm-digital-transformation',
      title: 'Transformasi Digital untuk UMKM di Indonesia',
      excerpt: 'Bagaimana bisnis kecil dapat memanfaatkan tools teknologi sederhana untuk bersaing dan berkembang di ekonomi digital.',
      content: 'Full article content here...',
      published_at: '2024-03-05',
      read_time: '8 menit',
    },
    {
      slug: 'from-sulawesi-to-global',
      title: 'Dari Sulawesi ke Global: Perjalanan Kami',
      excerpt: 'Kisah bagaimana dua teman dari berbagai penjuru Indonesia berkumpul untuk membangun sebuah tech house.',
      content: 'Full article content here...',
      published_at: '2024-02-28',
      read_time: '6 menit',
    },
    {
      slug: 'simplicity-in-tech',
      title: 'Kekuatan Kesederhanaan dalam Teknologi',
      excerpt: 'Mengapa kami percaya solusi sederhana sering lebih baik dari yang kompleks, dan bagaimana mencapai dampak yang berarti dengan kompleksitas minimal.',
      content: 'Full article content here...',
      published_at: '2024-02-20',
      read_time: '4 menit',
    },
    {
      slug: 'blockchain-for-business',
      title: 'Teknologi Blockchain untuk Bisnis Indonesia',
      excerpt: 'Menjelajahi aplikasi praktis teknologi blockchain yang dapat memberikan manfaat bagi bisnis di Indonesia.',
      content: 'Full article content here...',
      published_at: '2024-02-15',
      read_time: '7 menit',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Wawasan, pemikiran, dan cerita dari perjalanan kami membangun Palu Dev House
            dan membantu bisnis di seluruh Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.read_time}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>

              <p className="text-gray-600 line-clamp-3">
                {article.excerpt}
              </p>

              <div className="mt-4 flex items-center gap-1 text-blue-600 font-medium">
                Baca Selengkapnya
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
