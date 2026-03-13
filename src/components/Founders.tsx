'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Github, Twitter, ArrowUpRight, Globe } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from './animations';
import { useLightbox } from '@/context/LightboxContext';

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

interface Founder {
  name: string;
  location: string;
  image: string;
  background: string[];
  experience: string;
  website?: string;
  medium?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

interface FoundersProps {
  title: string;
  subtitle: string;
  founders: Founder[];
}

export function Founders({ title, subtitle, founders }: FoundersProps) {
  const { openLightbox } = useLightbox();

  const handleImageClick = (index: number) => {
    const images = founders.map(f => ({ src: f.image, alt: f.name }));
    openLightbox(images, index);
  };

  return (
    <section id="founders" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch" staggerDelay={0.2}>
          {founders.map((founder, index) => (
            <StaggerItem key={founder.name} className="h-full">
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 h-full flex flex-col">
                <ScaleIn>
                  <div 
                    className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-blue-50 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </ScaleIn>

                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {founder.name}
                </h3>
                <p className="text-blue-600 font-medium mb-5">
                  {founder.location}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {founder.background.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {founder.experience}
                </p>

                <div className="mt-auto flex justify-center gap-3">
                  {founder.website && (
                    <a
                      href={founder.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-all hover:scale-110"
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
                      className="p-2.5 bg-gray-900 rounded-full text-white hover:bg-gray-800 transition-all hover:scale-110"
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
                      className="p-2.5 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-all hover:scale-110"
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
                      className="p-2.5 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all hover:scale-110"
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
                      className="p-2.5 bg-gray-50 rounded-full text-gray-500 hover:text-blue-400 hover:bg-blue-50 transition-all hover:scale-110"
                      aria-label={`${founder.name}'s Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/founders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors hover:shadow-lg hover:-translate-y-1 transform"
            >
              Baca Latar Belakang Lengkap
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
