'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash2, Plus, X } from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  url: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ArticleEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<Article>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Ferdy',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '5 min',
    url: '',
    tags: [],
    featured: false,
    status: 'draft',
    image: ''
  });

  const [newTag, setNewTag] = useState('');

  // Load article data if editing
  useEffect(() => {
    if (isEditing && id) {
      loadArticle(id);
    }
  }, [id, isEditing]);

  const loadArticle = async (articleId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.data);
      } else {
        console.error('Failed to load article');
        alert('Failed to load article');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Error loading article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!article.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!article.excerpt.trim()) {
      alert('Excerpt is required');
      return;
    }
    if (!article.content.trim()) {
      alert('Content is required');
      return;
    }
    if (!article.url.trim()) {
      alert('URL is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/articles/${id}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        // Trigger ISR revalidation
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            secret: process.env.REVALIDATE_SECRET || 'palu-dev-house-secret',
            paths: ['/articles', '/'],
            invalidateAll: true
          }),
        });

        alert(`Article ${isEditing ? 'updated' : 'created'} successfully!`);
        router.push('/admin/dashboard?tab=articles');
      } else {
        const error = await response.json();
        alert(`Failed to save article: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !id) return;
    
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Trigger ISR revalidation
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            secret: process.env.REVALIDATE_SECRET || 'palu-dev-house-secret',
            paths: ['/articles', '/'],
            invalidateAll: true
          }),
        });

        alert('Article deleted successfully!');
        router.push('/admin/dashboard?tab=articles');
      } else {
        const error = await response.json();
        alert(`Failed to delete article: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePreview = () => {
    if (article.url) {
      window.open(article.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard?tab=articles')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Article' : 'Add New Article'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                disabled={!article.url}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              {isEditing && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={article.author}
                  onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                  Published Date
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  value={article.publishedAt}
                  onChange={(e) => setArticle(prev => ({ ...prev, publishedAt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  id="readTime"
                  name="readTime"
                  type="text"
                  value={article.readTime}
                  onChange={(e) => setArticle(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="e.g., 5 min"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={article.status}
                  onChange={(e) => setArticle(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={article.url}
                onChange={(e) => setArticle(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://medium.com/@username/article-title"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Content</h2>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={article.excerpt}
                onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                placeholder="Brief description of the article"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={article.content}
                onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                placeholder="Full article content"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 resize-none"
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Media</h2>
            
            <ImageSelector
              value={article.image}
              onChange={(value) => setArticle(prev => ({ ...prev, image: value }))}
              placeholder="Select featured image"
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
                <button
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Options</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={article.featured}
                onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                Featured article
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
