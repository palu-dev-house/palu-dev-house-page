'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X, Upload, FolderOpen } from 'lucide-react';
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
  };
}

interface ImageSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  category?: 'images' | 'icons' | 'all';
}

export default function ImageSelector({ 
  value, 
  onChange, 
  placeholder = "Pilih gambar...", 
  className = "",
  category = 'images'
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use ISR caching for assets
  const { data: assetsData, isLoading, etag, revalidate } = useISRData('assets', async () => {
    const response = await fetch('/api/assets');
    if (!response.ok) {
      throw new Error('Failed to load assets');
    }
    const data = await response.json();
    return {
      data: data.selection || [],
      etag: data.etag || ''
    };
  });

  const assets = Array.isArray(assetsData) ? assetsData : [];

  const filteredAssets = assets.filter((asset: Asset) =>
    asset.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAsset = assets.find((asset: Asset) => asset.value === value);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file
      // For now, just show the file name
      const fileName = `${Date.now()}-${file.name}`;
      onChange(`/uploads/${fileName}`);
      alert(`File "${file.name}" selected. In production, this would upload to: /uploads/${fileName}`);
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    onChange(asset.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Asset Preview */}
      {selectedAsset && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{selectedAsset.label}</p>
              <p className="text-sm text-gray-600">{selectedAsset.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{selectedAsset.category}</span>
                <span>•</span>
                <span>{formatFileSize(selectedAsset.metadata.size)}</span>
                <span>•</span>
                <span>{selectedAsset.metadata.extension}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selector Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 flex-1">
            {selectedAsset ? (
              <>
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{selectedAsset.label}</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">{placeholder}</span>
              </>
            )}
          </div>
          <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {/* Dropdown Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Pilih Gambar</h3>
                    <div className="flex items-center gap-3">
                      {/* Upload Button */}
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari gambar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Assets List */}
                  <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-600">Memuat...</span>
                        </div>
                      </div>
                    ) : filteredAssets.length === 0 ? (
                      <div className="p-8 text-center">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada gambar yang ditemukan</p>
                        <p className="text-sm text-gray-400">Coba kata kunci lain atau upload gambar baru</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {filteredAssets.map((asset) => (
                          <button
                            key={asset.value}
                            type="button"
                            onClick={() => handleAssetSelect(asset)}
                            className={`p-3 border rounded-lg transition-all duration-200 text-left ${
                              value === asset.value
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {/* Preview */}
                            <div className="mb-3">
                              <div className="w-full h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                {asset.metadata.extension === '.svg' ? (
                                  <div className="w-8 h-8">
                                    <ImageIcon className="w-full h-full text-gray-400" />
                                  </div>
                                ) : (
                                  <img
                                    src={asset.value}
                                    alt={asset.label}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder.webp';
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            
                            {/* Info */}
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 truncate">{asset.label}</p>
                              <p className="text-xs text-gray-500 truncate">{asset.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <span className="px-2 py-1 bg-gray-100 rounded">{asset.category}</span>
                                <span>{formatFileSize(asset.metadata.size)}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{filteredAssets.length} gambar tersedia</span>
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden overlay for when dropdown is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
