'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import { ICategory } from '@/types';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
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
    stock: '20',
    sku: '',
    tags: '',
    featured: false,
    bestSeller: false,
    onSale: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [cloudinaryPublicIds, setCloudinaryPublicIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data || []);
          if (data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: data.data[0]._id,
              categoryName: data.data[0].name,
            }));
          }
        }
      })
      .catch((err) => console.error('Categories load error:', err));
  }, []);

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = categories.find((c) => c._id === e.target.value);
    if (selectedCat) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedCat._id!,
        categoryName: selectedCat.name,
      }));
    }
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

    if (formData.shortDescription.length > 150) {
      toast.error('Short Description cannot exceed 150 characters.');
      return;
    }

    const parsedStock = parseInt(formData.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error('Stock quantity must be a non-negative integer.');
      return;
    }

    if (parsedStock > 999999) {
      toast.error('Stock quantity cannot exceed 999,999.');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least 1 image for the product');
      return;
    }

    // Double check strict 4 image limit
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
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Create product error:', err);
      toast.error(err instanceof Error ? err.message : 'Product creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products List
        </Link>
        <h1 className="text-xl font-black text-slate-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-700">Product Name *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jaffna Special Mixture 350g"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700">Category *</label>
            <select
              value={formData.categoryId}
              onChange={handleCategoryChange}
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
              placeholder="3.99"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Original Price (If Discounted)</label>
            <input
              type="text"
              inputMode="decimal"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value.replace(/[^0-9.]/g, '') })}
              placeholder="4.50"
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
              placeholder="25"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Tags (Comma Separated)</label>
            <input
              type="text"
              maxLength={200}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="spicy, mixture, snack, bestseller"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>
        </div>

        {/* Short & Full Description */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Short Description</label>
            <input
              type="text"
              maxLength={150}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Handcrafted spicy snack with roasted peanuts and curry leaves."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Full Description *</label>
            <textarea
              rows={4}
              required
              maxLength={2000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product story, ingredients, weight info..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>
        </div>

        {/* CLOUDINARY IMAGE UPLOADER SECTION (STRICT MAXIMUM 4 IMAGES) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Product Images ({images.length}/4)
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload up to a <strong className="font-bold text-purple-900">maximum of 4 images</strong> to Cloudinary.
              </p>
            </div>
            {images.length >= 4 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Max Limit Reached
              </span>
            )}
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {idx === 0 ? 'Primary' : `Image ${idx + 1}`}
                </span>
              </div>
            ))}

            {images.length < 4 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-purple-700 mb-1" />
                <span className="text-xs font-bold text-purple-900">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </span>
                <span className="text-[10px] text-slate-400">Max 4 total</span>
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

        {/* Feature Switches */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-purple-900 rounded focus:ring-purple-700"
            />
            <span className="text-xs font-bold text-slate-800">Featured Item</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bestSeller}
              onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              className="w-4 h-4 text-purple-900 rounded focus:ring-purple-700"
            />
            <span className="text-xs font-bold text-slate-800">Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.onSale}
              onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
              className="w-4 h-4 text-purple-900 rounded focus:ring-purple-700"
            />
            <span className="text-xs font-bold text-slate-800">On Sale / Discount</span>
          </label>
        </div>

        {/* Submit Buttons */}
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
            {isSubmitting ? 'Saving Product...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
