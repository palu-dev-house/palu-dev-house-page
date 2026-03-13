'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './animations';
import { useLightbox } from '@/context/LightboxContext';

interface Project {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface ProjectsProps {
  title: string;
  subtitle: string;
  viewAll: string;
  projects?: Project[];
}

export function Projects({ title, subtitle, viewAll, projects = [] }: ProjectsProps) {
  const { openLightbox } = useLightbox();

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    // Open lightbox with project screenshots when available
    const projectImages = projects.map(p => ({ 
      src: p.images?.[0] || `/images/projects/${p.slug}.webp`, 
      alt: p.title 
    }));
    openLightbox(projectImages, index);
  };

  return (
    <section id="projects" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <FadeIn>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {subtitle}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              {viewAll}
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch" staggerDelay={0.15}>
          {projects.map((project, index) => (
            <StaggerItem key={project.id} className="h-full">
              <Link
                href={`/projects/${project.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col"
              >
                <div 
                  className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={(e) => handleImageClick(e, index)}
                >
                  <span className="text-white text-4xl font-bold">
                    {project.title.charAt(0)}
                  </span>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
