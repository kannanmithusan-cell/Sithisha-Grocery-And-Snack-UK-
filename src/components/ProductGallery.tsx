'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  // Ensure maximum 4 images shown in gallery
  const galleryImages =
    images.length > 0
      ? images.slice(0, 4)
      : ['https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800'];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Large Display Image */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-purple-50 border border-purple-100 shadow-md">
        <Image
          src={galleryImages[selectedImageIndex] || galleryImages[0]}
          alt={productName}
          fill
          priority
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails Bar (Max 4 thumbnails) */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((imgUrl, index) => {
            const isSelected = selectedImageIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-purple-900 ring-2 ring-purple-400 scale-95'
                    : 'border-purple-100 opacity-70 hover:opacity-100 hover:border-purple-300'
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
