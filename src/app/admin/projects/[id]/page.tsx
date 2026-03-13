'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash2, Plus, X } from 'lucide-react';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/Input';
import ImageSelector from '@/components/ui/ImageSelector';

interface Project {
  id?: string;
  title: string;
  description: string;
  type: 'SaaS' | 'Tools' | 'Enterprise' | 'Custom';
  featured: boolean;
  technologies: string[];
  images: string[];
  status: 'active' | 'inactive' | 'development';
  slug?: string;
  demoUrl?: string;
  githubUrl?: string;
  client?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<Project>({
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

  const [newTechnology, setNewTechnology] = useState('');
  const [newImage, setNewImage] = useState('');

  // Load project data if editing
  useEffect(() => {
    if (isEditing && id) {
      loadProject(id as string);
    }
  }, [id, isEditing]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else {
        console.error('Failed to load project');
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!project.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!project.description.trim()) {
      alert('Description is required');
      return;
    }
    if (project.technologies.length === 0) {
      alert('At least one technology is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/projects/${id}` : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Generate slug from title if not provided
      const projectData = {
        ...project,
        slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
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

        alert(`Project ${isEditing ? 'updated' : 'created'} successfully!`);
        router.push('/admin/dashboard?tab=projects');
      } else {
        alert('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !id) return;
    
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
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

        alert('Project deleted successfully!');
        router.push('/admin/dashboard?tab=projects');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !project.technologies.includes(newTechnology.trim())) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !project.images.includes(newImage.trim())) {
      setProject(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    setProject(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const handlePreview = () => {
    if (project.slug) {
      window.open(`/projects/${project.slug}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
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
                onClick={() => router.push('/admin/dashboard?tab=projects')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Projects
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                disabled={!project.slug}
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
                {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
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
              <Input
                label="Title"
                value={project.title}
                onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                required
              />
              
              <Select
                label="Type"
                value={project.type}
                onChange={(e) => setProject(prev => ({ ...prev, type: e.target.value as any }))}
                options={[
                  { value: 'SaaS', label: 'SaaS' },
                  { value: 'Tools', label: 'Tools' },
                  { value: 'Enterprise', label: 'Enterprise' },
                  { value: 'Custom', label: 'Custom' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Slug"
                value={project.slug}
                onChange={(e) => setProject(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="project-slug (auto-generated from title)"
                helperText="Leave empty to auto-generate from title"
              />
              
              <Select
                label="Status"
                value={project.status}
                onChange={(e) => setProject(prev => ({ ...prev, status: e.target.value as any }))}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'development', label: 'Development' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Client"
                value={project.client}
                onChange={(e) => setProject(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Client name (optional)"
              />
              
              <Input
                label="Completed Date"
                type="date"
                value={project.completedAt}
                onChange={(e) => setProject(prev => ({ ...prev, completedAt: e.target.value }))}
              />
              
              <div className="flex items-center justify-end pt-6">
                <Checkbox
                  id="featured"
                  label="Featured project"
                  checked={project.featured}
                  onChange={(e) => setProject(prev => ({ ...prev, featured: e.target.checked }))}
                />
              </div>
            </div>

            <Textarea
              label="Description"
              value={project.description}
              onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Detailed project description"
              required
            />
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Demo URL"
                value={project.demoUrl}
                onChange={(e) => setProject(prev => ({ ...prev, demoUrl: e.target.value }))}
                placeholder="https://demo.example.com"
              />
              
              <Input
                label="GitHub URL"
                value={project.githubUrl}
                onChange={(e) => setProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Technologies</h2>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1"
                />
                <button
                  onClick={addTechnology}
                  disabled={!newTechnology.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                <ImageSelector
                  value={project.images.join(', ')}
                  onChange={(value) => setProject(prev => ({ 
                    ...prev, 
                    images: value.split(',').map((img: string) => img.trim()).filter((img: string) => img)
                  }))}
                  multiple={true}
                  maxImages={10}
                  placeholder="Select project images"
                />
              </div>
              
              {/* Manual image input for custom paths */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Or add custom image path"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    className="flex-1"
                  />
                  <button
                    onClick={addImage}
                    disabled={!newImage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23f3f4f6"/%3E%3Ctext x="100" y="75" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12" font-family="sans-serif"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <button
                        onClick={() => removeImage(image)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {image.split('/').pop()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
