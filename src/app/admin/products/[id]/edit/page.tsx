'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import { ICategory } from '@/types';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const paramsHook = useParams();
  const id = paramsHook?.id as string;
  const router = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    categoryName: '',
    stock: '0',
    sku: '',
    tags: '',
    featured: false,
    bestSeller: false,
    onSale: false,
    active: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [cloudinaryPublicIds, setCloudinaryPublicIds] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch(`/api/products/${id}`).then((res) => res.json()),
    ])
      .then(([catData, prodData]) => {
        if (catData.success) {
          setCategories(catData.data || []);
        }
        if (prodData.success && prodData.data) {
          const p = prodData.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price !== undefined ? p.price.toString() : '',
            originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
            categoryId: p.categoryId || '',
            categoryName: p.categoryName || '',
            stock: p.stock !== undefined ? p.stock.toString() : '0',
            sku: p.sku || '',
            tags: p.tags ? p.tags.join(', ') : '',
            featured: Boolean(p.featured),
            bestSeller: Boolean(p.bestSeller),
            onSale: Boolean(p.onSale),
            active: Boolean(p.active),
          });
          setImages(p.images || []);
          setCloudinaryPublicIds(p.cloudinaryPublicIds || []);
        }
      })
      .catch((err) => console.error('Data load error:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // STRICT 4 IMAGE MAXIMUM ENFORCEMENT
    if (images.length >= 4) {
      toast.error('Maximum 4 images are allowed per product.');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsUploading(true);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            currentCount: images.length,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Image upload failed');
        }

        setImages((prev) => [...prev, data.data.url]);
        setCloudinaryPublicIds((prev) => [...prev, data.data.publicId]);
        toast.success(`Image uploaded (${images.length + 1}/4)`);
      } catch (err) {
        console.error('Upload error:', err);
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setCloudinaryPublicIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product Name is required.');
      return;
    }

    if (formData.name.length > 100) {
      toast.error('Product Name cannot exceed 100 characters.');
      return;
    }

    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid positive price greater than 0.');
      return;
    }

    if (parsedPrice > 99999) {
      toast.error('Price cannot exceed £99,999.00.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Product Description is required.');
      return;
    }

    if (formData.description.length > 2000) {
      toast.error('Product Description cannot exceed 2000 characters.');
      return;
    }

    const parsedStock = parseInt(formData.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error('Stock quantity must be a non-negative integer.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least 1 image for the product');
      return;
    }

    if (images.length > 4) {
      toast.error('Maximum 4 images are allowed per product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        price: parsedPrice,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        images,
        cloudinaryPublicIds,
        stock: parsedStock,
        sku: formData.sku.trim(),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured: formData.featured,
        bestSeller: formData.bestSeller,
        onSale: formData.onSale,
        active: formData.active,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product');
      }

      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading product details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products List
        </Link>
        <h1 className="text-xl font-black text-slate-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-700">Product Name *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => {
                const cat = categories.find((c) => c._id === e.target.value);
                if (cat) {
                  setFormData({ ...formData, categoryId: cat._id!, categoryName: cat.name });
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 outline-none focus:border-purple-700"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Price (£ GBP) *</label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9.]/g, '') })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Stock Quantity *</label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value.replace(/[^0-9]/g, '') })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Description *</label>
          <textarea
            rows={4}
            required
            maxLength={2000}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
          />
        </div>

        {/* CLOUDINARY IMAGES (STRICT <= 4 ENFORCEMENT) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Product Images ({images.length}/4)
            </h3>
            {images.length >= 4 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Max Limit Reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-md hover:bg-rose-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-purple-700 mb-1" />
                <span className="text-xs font-bold text-purple-900">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Status & Visibility Toggles */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Product Badges & Visibility Settings
          </h3>
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer select-none bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-purple-900 rounded focus:ring-purple-700 cursor-pointer"
              />
              <span className="text-purple-950 font-extrabold flex items-center gap-1">
                ⭐ Featured Item (Shows on Today&apos;s Favourites)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.bestSeller}
                onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                className="w-4 h-4 text-amber-900 rounded focus:ring-amber-700 cursor-pointer"
              />
              <span className="text-amber-950 font-extrabold">🔥 Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-emerald-900 rounded focus:ring-emerald-700 cursor-pointer"
              />
              <span className="text-emerald-950 font-extrabold">Active (Visible in Store)</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
