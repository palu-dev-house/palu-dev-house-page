import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Static paths for sample projects
export function generateStaticParams() {
  return [
    { slug: 'umkm-manager' },
    { slug: 'content-kit' },
    { slug: 'dev-utils' },
  ];
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  // Sample project data - in real implementation, this would be fetched from database
  const projects: Record<string, {
    title: string;
    description: string;
    long_description: string;
    tags: string[];
    link: string;
    github_link: string;
  }> = {
    'umkm-manager': {
      title: 'UMKM Manager',
      description: 'Simple business management tool for small businesses in Indonesia',
      long_description: `UMKM Manager is a comprehensive yet simple business management solution designed specifically for small businesses (UMKM) in Indonesia.

Our platform addresses the unique challenges faced by Indonesian small business owners, providing them with enterprise-level tools at an accessible price point.

Key Features:
- Inventory Management: Track stock levels, manage suppliers, and get low-stock alerts
- Sales Tracking: Record sales transactions, generate invoices, and monitor daily revenue
- Financial Reporting: Simple reports for profits, expenses, and cash flow
- Customer Management: Store customer information and purchase history
- Multi-user Support: Allow employees to access with different permission levels

Built with our philosophy of "simple but impactful", UMKM Manager focuses on solving the 80% of problems that most businesses face daily, without overwhelming users with complex features they don't need.`,
      tags: ['SaaS', 'UMKM', 'Management', 'Inventory', 'Finance'],
      link: '#',
      github_link: '#',
    },
    'content-kit': {
      title: 'Content Kit',
      description: 'Content creation and scheduling tools for creators',
      long_description: `Content Kit empowers creators to streamline their content workflow from ideation to publication.

Whether you're a solo creator or managing a team, Content Kit provides the tools you need to maintain a consistent content presence across multiple platforms.

Key Features:
- Content Calendar: Visual calendar to plan and schedule content
- Post Templates: Reusable templates for consistent branding
- Analytics Dashboard: Track engagement and performance metrics
- Team Collaboration: Assign tasks, leave comments, and review content
- Multi-platform Publishing: Schedule posts for Instagram, Twitter, LinkedIn, and more
- Idea Bank: Store and organize content ideas for future use

Our goal is to help creators focus on what they do best—creating great content—while we handle the logistics of scheduling and organization.`,
      tags: ['Tools', 'Content', 'Productivity', 'Social Media', 'Analytics'],
      link: '#',
      github_link: '#',
    },
    'dev-utils': {
      title: 'Dev Utils',
      description: 'Collection of developer utilities and tools',
      long_description: `Dev Utils is a free, open-source collection of developer utilities designed to make your workflow more efficient.

We believe that developers shouldn't have to jump between multiple websites or install heavy applications for simple tasks. Dev Utils brings all essential developer tools into one clean, fast interface.

Available Tools:
- JSON Formatter & Validator
- Regex Tester
- Code Minifier (HTML, CSS, JS)
- Hash Generator (MD5, SHA-1, SHA-256)
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- Color Picker & Converter
- Lorem Ipsum Generator
- Password Generator
- Code Diff Viewer

All tools run entirely in your browser—no data is sent to our servers, ensuring your code and data remain private and secure.`,
      tags: ['Developer', 'Tools', 'Free', 'Open Source', 'Productivity'],
      link: '#',
      github_link: '#',
    },
  };

  const project = projects[params.slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">
              {project.title.charAt(0)}
            </span>
          </div>

          <div className="p-8 lg:p-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {project.link && (
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </a>
              )}
              {project.github_link && (
                <a
                  href={project.github_link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  View Source
                </a>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <div className="text-gray-600 whitespace-pre-line">
                {project.long_description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
