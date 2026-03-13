'use client';

import { useState } from 'react';
import { Image as ImageIcon, X, Plus, FolderOpen, Trash, RefreshCw } from 'lucide-react';
import { useISRData } from '@/lib/cache';

interface Asset {
  value: string;
  label: string;
  description: string;
  category: string;
  metadata: {
    size: string;
    lastModified: string;
    extension: string;
    fullUrl?: string;
  };
}

interface MultiImageSelectorProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  category?: 'images' | 'icons' | 'all';
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function MultiImageSelector({ 
  label,
  value, 
  onChange, 
  placeholder = "Pilih gambar...", 
  className = "",
  category = 'images',
  error,
  helperText,
  fullWidth = true
}: MultiImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Parse comma-separated values into array
  const selectedImages = value ? value.split(',').map(img => img.trim()).filter(img => img) : [];
  
  // Use ISR caching for assets
  const { data: assetsData, isLoading, revalidate } = useISRData('assets', async () => {
    console.log('🔄 Fetching assets from API...');
    const response = await fetch('/api/assets');
    if (!response.ok) {
      throw new Error('Failed to load assets');
    }
    const data = await response.json();
    console.log('📦 Assets data received:', data.selection?.length || 0, 'items');
    return {
      data: data.selection || [],
      etag: data.etag || ''
    };
  });

  const assets = Array.isArray(assetsData) ? assetsData : [];
  
  // Debug logging
  console.log('🎯 MultiImageSelector state:', { 
    isLoading, 
    assetsCount: assets.length,
    selectedCount: selectedImages.length 
  });

  const filteredAssets = assets.filter((asset: Asset) =>
    asset.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetSelect = (asset: Asset) => {
    if (selectedImages.includes(asset.value)) {
      // If already selected, remove it
      const newImages = selectedImages.filter(img => img !== asset.value);
      onChange(newImages.join(', '));
    } else {
      // If not selected, add it
      const newImages = [...selectedImages, asset.value];
      onChange(newImages.join(', '));
    }
  };

  const handleRemoveImage = (imagePath: string) => {
    const newImages = selectedImages.filter(img => img !== imagePath);
    onChange(newImages.join(', '));
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    // Force refresh assets when opening modal
    revalidate();
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const getSelectedAsset = (imagePath: string) => {
    return assets.find((asset: Asset) => asset.value === imagePath);
  };

  // Base input styles (matching Input component)
  const baseInputClasses = "px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 transition-colors duration-200";
  const errorInputClasses = "border-red-300 focus:ring-red-500 focus:border-red-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClasses = "text-red-600 text-sm mt-1";
  const helperTextClasses = "text-gray-500 text-sm mt-1";
  const containerClasses = "space-y-1";
  const fullWidthClasses = "w-full";

  const inputClasses = `
    ${baseInputClasses}
    ${error ? errorInputClasses : ''}
    ${fullWidth ? fullWidthClasses : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="space-y-2 mb-3">
          {selectedImages.map((imagePath, index) => {
            const asset = getSelectedAsset(imagePath);
            return (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                      <img
                        src={asset?.metadata?.fullUrl || imagePath}
                        alt={asset?.label || `Image ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiByeD0iMiIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNOCAxMkgyTDE2IDhMMjAgMTJMMTYgMTZIOFYxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {asset?.label || `Image ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {asset?.description || imagePath}
                    </p>
                    {asset && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{asset.category}</span>
                        <span>•</span>
                        <span>{formatFileSize(asset.metadata.size)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imagePath)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selector Button - Styled like Input */}
      <div className="relative">
        <button
          type="button"
          onClick={handleOpenModal}
          className={`${inputClasses} flex items-center justify-between group`}
        >
          <div className="flex items-center gap-3 flex-1">
            <ImageIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 text-left">
              {selectedImages.length > 0 
                ? `${selectedImages.length} gambar dipilih` 
                : placeholder
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedImages.length > 0 && (
              <span className="text-xs text-blue-600 font-medium">
                {selectedImages.length}
              </span>
            )}
            <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </button>

        {/* Dropdown Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal Content - Full Width */}
            <div className="relative bg-white w-full h-full max-h-screen flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Pilih Gambar</h3>
                  <p className="text-sm text-gray-600 mt-1">Pilih satu atau lebih gambar untuk proyek</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => revalidate()}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="Refresh images"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari gambar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Assets Grid - Full Width */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Memuat gambar...</span>
                      <button
                        type="button"
                        onClick={() => revalidate()}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada gambar yang ditemukan</h3>
                    <p className="text-gray-500">Coba kata kunci lain atau upload gambar baru</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedImages.includes(asset.value);
                      return (
                        <div
                          key={asset.value}
                          onClick={() => handleAssetSelect(asset)}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                          }`}
                        >
                          {/* Image Preview */}
                          <div className="aspect-square bg-white border border-gray-200">
                            <img
                              src={asset.metadata.fullUrl || asset.value}
                              alt={asset.label}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                console.log('Image failed to load:', asset.metadata.fullUrl || asset.value);
                                // Show placeholder on error
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiByeD0iMiIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNOCAxMkgyTDE2IDhMMjAgMTJMMTYgMTZIOFYxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', asset.metadata.fullUrl || asset.value);
                                console.log('Image dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                              }}
                            />
                            
                            {/* Selected Overlay */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                <div className="bg-blue-500 text-white rounded-full p-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            
                            {/* Hover/Action Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                              <div className={`${isSelected ? 'bg-red-600' : 'bg-blue-600'} text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                {isSelected ? (
                                  <Trash className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Info */}
                          <div className="p-2 bg-white">
                            <p className="font-medium text-xs text-gray-900 truncate">{asset.label}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {asset.category}
                              </span>
                              <span className="text-xs text-gray-400">{asset.metadata.size}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{filteredAssets.length}</span> gambar tersedia
                  {selectedImages.length > 0 && (
                    <span className="ml-3">
                      • <span className="font-medium text-blue-600">{selectedImages.length}</span> dipilih
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error and Helper Text */}
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
}
