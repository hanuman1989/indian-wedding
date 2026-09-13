"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Photo } from '@/components/Icons';
import { getCoupleName, getSortedWeddingImages } from './weddingDetailUtils';

export default function WeddingImageCarousel({ wedding }) {
  const images = getSortedWeddingImages(wedding?.images);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(images.length > 0);
  const imageCount = images.length;
  const selectedIndex = imageCount ? activeIndex % imageCount : 0;
  const activeImage = images[selectedIndex];
  const activeImageId = String(activeImage?.id ?? selectedIndex);
  const isImageFailed = failedImageIds.includes(activeImageId);

  const selectImage = (nextIndex) => {
    setIsImageLoading(true);
    setActiveIndex((nextIndex + imageCount) % imageCount);
  };

  const showPrevious = () => selectImage(selectedIndex - 1);
  const showNext = () => selectImage(selectedIndex + 1);

  const handleKeyDown = (event) => {
    if (imageCount < 2) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  if (!imageCount) {
    return (
      <div className="flex aspect-[5/4] items-center justify-center rounded-lg border border-gold-200 bg-cream-100 text-center">
        <div className="px-6 text-ink-soft">
          <Photo className="mx-auto h-11 w-11 text-gold-500" />
          <p className="mt-3 text-sm font-medium">Wedding images will be shared soon.</p>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Wedding photos" className="relative aspect-[5/4] overflow-hidden rounded-lg border border-gold-200 bg-cream-100 shadow-[0_16px_36px_-24px_rgba(108,10,34,0.45)]" tabIndex={0} onKeyDown={handleKeyDown}>
      {isImageFailed ? (
        <div className="flex h-full items-center justify-center text-center text-ink-soft">
          <div className="px-6">
            <Photo className="mx-auto h-11 w-11 text-gold-500" />
            <p className="mt-3 text-sm font-medium">This wedding image is unavailable.</p>
          </div>
        </div>
      ) : (
        <>
          <Image
            key={activeImageId}
            src={activeImage.url || activeImage.image_url}
            alt={`${getCoupleName(wedding)} wedding photo ${selectedIndex + 1}`}
            fill
            unoptimized
            priority={selectedIndex === 0}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover transition-opacity duration-500"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              setFailedImageIds((currentIds) => [...new Set([...currentIds, activeImageId])]);
            }}
          />
          {isImageLoading && <div className="absolute inset-0 animate-pulse bg-cream-200" />}
        </>
      )}

      {imageCount > 1 && (
        <>
          <button type="button" onClick={showPrevious} aria-label="Previous wedding photo" className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-wine-700 shadow-md transition-colors hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-wine-300">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={showNext} aria-label="Next wedding photo" className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-wine-700 shadow-md transition-colors hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-wine-300">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2" aria-label="Wedding photo selection">
            {images.map((image, index) => (
              <button key={image.id ?? index} type="button" onClick={() => selectImage(index)} aria-label={`Show wedding photo ${index + 1}`} aria-current={index === selectedIndex ? 'true' : undefined} className={`h-2.5 w-2.5 rounded-full border border-white/80 transition-colors ${index === selectedIndex ? 'bg-wine-700' : 'bg-white/80 hover:bg-gold-300'}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}