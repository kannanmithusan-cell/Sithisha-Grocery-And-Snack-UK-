'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit3, Trash2, Upload, X } from 'lucide-react';
import { ICategory } from '@/types';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: '1',
    active: true,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: ICategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        displayOrder: category.displayOrder ? category.displayOrder.toString() : '1',
        active: Boolean(category.active),
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        displayOrder: (categories.length + 1).toString(),
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleBrowseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsUploadingImage(true);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            currentCount: 0,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Image upload failed');
        }

        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success('Category image uploaded successfully!');
      } catch (err) {
        console.error('Upload error:', err);
        toast.error(err instanceof Error ? err.message : 'Image upload failed');
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    if (!name) {
      toast.error('Category Name is required.');
      return;
    }

    if (name.length > 60) {
      toast.error('Category Name cannot exceed 60 characters.');
      return;
    }

    if (formData.description.length > 200) {
      toast.error('Description cannot exceed 200 characters.');
      return;
    }

    const orderNum = parseInt(formData.displayOrder, 10);
    if (isNaN(orderNum) || orderNum < 1 || orderNum > 999) {
      toast.error('Display Order must be a number between 1 and 999.');
      return;
    }

    try {
      const payload = {
        name,
        description: formData.description.trim(),
        image: formData.image,
        displayOrder: orderNum,
        active: formData.active,
      };

      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save category');
      }

      toast.success(editingCategory ? 'Category updated!' : 'Category created!');
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Category save error:', err);
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category');
      }

      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err instanceof Error ? err.message : 'Cannot delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-xs text-slate-500 mt-1">Organize products into customer-facing categories.</p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category Datatable */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Product Count</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-400">#{cat.displayOrder}</td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={cat.image || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=100'}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-extrabold text-slate-900">{cat.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{cat.description || '—'}</td>

                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-900 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      {cat.productCount || 0} Products
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(cat)}
                        className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat._id!)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-purple-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-base font-black text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Category Name *</label>
              <input
                type="text"
                required
                maxLength={60}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Snacks & Savouries"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Description</label>
              <textarea
                rows={2}
                maxLength={200}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short summary of items in this category"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            {/* Local File Browser Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Category Image</label>

              {formData.image ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <Image src={formData.image} alt="Category preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-md hover:bg-rose-700 transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-28 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center p-3 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-purple-700 mb-1" />
                  <span className="text-xs font-bold text-purple-900">
                    {isUploadingImage ? 'Uploading Image...' : 'Browse Image File from Device'}
                  </span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP formats</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBrowseImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Display Order</label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploadingImage}
                className="px-5 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
