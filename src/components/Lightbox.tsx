'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev 
}: LightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef(1);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  // Reset zoom when image changes
  useEffect(() => {
    const resetTimeout = setTimeout(() => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }, 0);
    
    return () => clearTimeout(resetTimeout);
  }, [currentIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (scale === 1) onPrev();
        break;
      case 'ArrowRight':
        if (scale === 1) onNext();
        break;
      case '+':
      case '=':
        setScale(s => Math.min(s + 0.5, 4));
        break;
      case '-':
        setScale(s => Math.max(s - 0.5, 0.5));
        break;
      case '0':
        setScale(1);
        setPosition({ x: 0, y: 0 });
        break;
    }
  }, [isOpen, onClose, onNext, onPrev, scale]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mouse/Touch drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pinch and zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = distance;
      initialScale.current = scale;
    } else if (e.touches.length === 1) {
      // Drag start
      if (scale > 1) {
        lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2 && initialPinchDistance.current) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = distance / initialPinchDistance.current;
      setScale(Math.min(Math.max(initialScale.current * scaleFactor, 0.5), 4));
    } else if (e.touches.length === 1 && lastTouch.current && scale > 1) {
      // Pan
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistance.current = null;
    lastTouch.current = null;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.min(Math.max(s + delta, 0.5), 4));
  };

  // Zoom controls
  const zoomIn = () => setScale(s => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale(s => Math.max(s - 0.5, 0.5));
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Double click to zoom
  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      resetZoom();
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
      ref={containerRef}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
        aria-label="Tutup"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Perbesar"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Perkecil"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetZoom(); }}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Reset"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <span className="px-3 py-2 bg-white/10 rounded-full text-white text-sm">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Image counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation buttons (hidden when zoomed) */}
      {images.length > 1 && scale === 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Main image container with zoom/pan */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnail carousel */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-[80vw] overflow-x-auto px-4 py-2 bg-black/50 rounded-full">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => { 
                e.stopPropagation(); 
                const diff = index - currentIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) onNext();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) onPrev();
                }
              }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Lihat gambar ${index + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-white/50 text-xs text-center">
        <p>Double-click: Zoom • Scroll: Zoom • Drag: Pan • Pinch: Zoom</p>
      </div>
    </div>
  );
}
