import React, { useState, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

interface ImageData {
  path: string;
  name: string;
  size: number;
  type: string;
}

export default function ImageSelector({
  value,
  onChange,
  placeholder = "Select images",
  multiple = false,
  maxImages = 10,
  className = ""
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>(
    multiple && value ? value.split(',').map(img => img.trim()).filter(img => img) : 
    value ? [value] : []
  );

  // Load images from API
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  // Update selected images when value changes
  useEffect(() => {
    const newSelected = multiple && value ? 
      value.split(',').map(img => img.trim()).filter(img => img) : 
      value ? [value] : [];
    setSelectedImages(newSelected);
  }, [value, multiple]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assets/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      // Fallback to common image paths
      const fallbackImages = [
        { path: '/images/logo.svg', name: 'logo.svg', size: 0, type: 'image/svg+xml' },
        { path: '/images/hero-bg.jpg', name: 'hero-bg.jpg', size: 0, type: 'image/jpeg' },
        { path: '/images/stiven.webp', name: 'stiven.webp', size: 0, type: 'image/webp' },
        { path: '/images/ferdy.webp', name: 'ferdy.webp', size: 0, type: 'image/webp' },
        { path: '/images/projects/umkm-manager-1.jpg', name: 'umkm-manager-1.jpg', size: 0, type: 'image/jpeg' },
        { path: '/images/projects/umkm-manager-2.jpg', name: 'umkm-manager-2.jpg', size: 0, type: 'image/jpeg' },
        { path: '/images/projects/content-kit-1.jpg', name: 'content-kit-1.jpg', size: 0, type: 'image/jpeg' },
        { path: '/images/projects/content-kit-2.jpg', name: 'content-kit-2.jpg', size: 0, type: 'image/jpeg' },
        { path: '/images/projects/dev-utils-1.jpg', name: 'dev-utils-1.jpg', size: 0, type: 'image/jpeg' },
      ];
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleImageSelection = (imagePath: string) => {
    if (multiple) {
      const newSelection = selectedImages.includes(imagePath)
        ? selectedImages.filter(img => img !== imagePath)
        : [...selectedImages, imagePath];
      
      if (newSelection.length <= maxImages) {
        setSelectedImages(newSelection);
        onChange(newSelection.join(', '));
      }
    } else {
      setSelectedImages([imagePath]);
      onChange(imagePath);
      setIsOpen(false);
    }
  };

  const removeImage = (imagePath: string) => {
    const newSelection = selectedImages.filter(img => img !== imagePath);
    setSelectedImages(newSelection);
    onChange(multiple ? newSelection.join(', ') : '');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Selected Images Display */}
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((imagePath) => (
            <div key={imagePath} className="relative group">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePath}
                  alt={imagePath.split('/').pop()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23f3f4f6"/%3E%3Ctext x="32" y="32" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <button
                onClick={() => removeImage(imagePath)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {imagePath.split('/').pop()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={multiple ? selectedImages.join(', ') : selectedImages[0] || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
          readOnly
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Image Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Images</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search images..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              {multiple && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {selectedImages.length} / {maxImages} images
                </p>
              )}
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading images...
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No images found' : 'No images available'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.path}
                      onClick={() => toggleImageSelection(image.path)}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImages.includes(image.path)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={image.path}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      
                      {/* Selection Indicator */}
                      {selectedImages.includes(image.path) && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs font-medium truncate px-2">{image.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                {filteredImages.length} images available
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {multiple ? `Select ${selectedImages.length} Images` : 'Select Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
