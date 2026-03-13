import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, User } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './animations';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  url: string;
  tags: string[];
  featured: boolean;
  status: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticlesProps {
  title: string;
  subtitle: string;
  viewAll: string;
  articles?: Article[];
}

export function Articles({ title, subtitle, viewAll, articles = [] }: ArticlesProps) {

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
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

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch" staggerDelay={0.15}>
          {articles.map((article, index) => (
            <StaggerItem key={article.id} className="h-full">
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full flex flex-col"
              >
                {/* Article Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  {article.featured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Article Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                {/* Article Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>

                {/* Article Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <FadeIn delay={0.3}>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {viewAll}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        )}

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
