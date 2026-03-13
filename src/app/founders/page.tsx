'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Linkedin, Github, Twitter, Mail, MapPin, Briefcase, GraduationCap, Globe } from 'lucide-react';
import { useLightbox } from '@/context/LightboxContext';
import { getCopywriting } from '@/lib/copywriting-client';

export const dynamic = 'force-static';

// Custom Medium Icon
const MediumIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

export default function FoundersPage() {
  const { openLightbox } = useLightbox();
  const copywriting = getCopywriting();
  const { founders, story } = copywriting.landingPage;

  const handleImageClick = (index: number) => {
    const images = founders.items.map(f => ({ src: f.image, alt: f.name }));
    openLightbox(images, index);
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{founders.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {founders.subtitle}
          </p>
        </div>

        <div className="space-y-16">
          {founders.items.map((founder, index) => (
            <div
              key={founder.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Sidebar */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                  <div 
                    className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white/30 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-center mb-2">{founder.name}</h2>
                  <p className="text-blue-200 text-center mb-6">{founder.location}</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-blue-300" />
                      <span className="text-sm">Computer Science</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-300" />
                      <span className="text-sm">{founder.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-300" />
                      <span className="text-sm">Co-Founder</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    {founder.website && (
                      <a
                        href={founder.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={`${founder.name}'s personal website`}
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {founder.medium && (
                      <a
                        href={founder.medium}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={`${founder.name}'s Medium profile`}
                      >
                        <MediumIcon className="w-5 h-5" />
                      </a>
                    )}
                    {founder.social?.linkedin && (
                      <a
                        href={founder.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={`${founder.name}'s LinkedIn`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {founder.social?.github && (
                      <a
                        href={founder.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={`${founder.name}'s GitHub`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {founder.social?.twitter && (
                      <a
                        href={founder.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={`${founder.name}'s Twitter`}
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    <a
                      href={`mailto:paludevhouse@gmail.com`}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      aria-label={`Email ${founder.name}`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 p-8 lg:p-12">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bidang Keahlian</h3>
                    <div className="flex flex-wrap gap-2">
                      {founder.background.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Latar Belakang</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {founder.experience}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Kontak
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <strong>Email:</strong> paludevhouse@gmail.com
                      </p>
                      <p className="text-gray-700">
                        <strong>Location:</strong> {founder.location}
                      </p>
                      {founder.website && (
                        <p className="text-gray-700">
                          <strong>Website:</strong>{' '}
                          <a 
                            href={founder.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {founder.website}
                          </a>
                        </p>
                      )}
                      {founder.medium && (
                        <p className="text-gray-700">
                          <strong>Medium:</strong>{' '}
                          <a 
                            href={founder.medium} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {founder.medium}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-blue-500 pl-6 py-2">
                    <p className="text-lg text-gray-700 italic">
                      &ldquo;Teknologi harus melayani manusia, bukan sebaliknya. Setiap baris kode harus menyelesaikan masalah nyata.&rdquo;
                    </p>
                    <footer className="text-sm text-gray-500 mt-2">— Filosofi {founder.name}</footer>
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">{story.title}</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            {story.content.map((paragraph, index) => (
              <p key={index} className="text-blue-100 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
