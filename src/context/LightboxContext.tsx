'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Lightbox } from '@/components/Lightbox';

interface LightboxContextType {
  openLightbox: (images: { src: string; alt: string }[], startIndex?: number) => void;
  closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((newImages: { src: string; alt: string }[], startIndex = 0) => {
    setImages(newImages);
    setCurrentIndex(startIndex);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      <Lightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (context === undefined) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return context;
}
