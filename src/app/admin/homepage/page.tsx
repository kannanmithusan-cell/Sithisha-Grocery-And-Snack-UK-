'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  ImageIcon,
  MessageCircle,
  RefreshCw,
  Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IHeroImage, ICtaImage, IEditorialImage } from '@/models/HomepageConfig';

// All 5 admin-controllable editorial sections mapped exactly to homepage order
const EDITORIAL_SECTIONS = [
  {
    key: 'todays-craving',
    label: "TODAY'S CRAVING (Product Spotlight)",
    desc: 'Set custom title, description and price for the homepage spotlight card.',
    hasPrice: true,
    showTextFields: true,
  },
  {
    key: 'brand-story',
    label: 'A TASTE OF HOME (Brand Story)',
    desc: 'Set custom title, story text & image for "FOOD THAT FEELS LIKE HOME".',
    hasPrice: false,
    showTextFields: true,
  },
  {
    key: 'ingredient-story',
    label: 'INGREDIENT STORY ("Where the Flavour Begins")',
    desc: 'Set custom headline, description & spice/ingredient photograph.',
    hasPrice: false,
    showTextFields: true,
  },
  {
    key: 'discover-new',
    label: 'DISCOVER SOMETHING NEW (Arrival Banner)',
    desc: 'Set title, description & full-width visual banner for fresh arrivals.',
    hasPrice: false,
    showTextFields: true,
  },
  {
    key: 'make-tonight',
    label: 'FOOD MOOD ("Make Tonight Delicious")',
    desc: 'Set title, description & lifestyle photograph for the dinner mood section.',
    hasPrice: false,
    showTextFields: true,
  },
];

export default function HomepageManagementPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'editorial' | 'cta'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [heroImages, setHeroImages] = useState<IHeroImage[]>([]);
  const [editorialImages, setEditorialImages] = useState<IEditorialImage[]>([]);
  const [ctaImage, setCtaImage] = useState<ICtaImage>({ url: '', publicId: '', active: true });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/homepage');
      const data = await res.json();
      if (data.success && data.config) {
        setHeroImages(data.config.heroImages || []);
        setEditorialImages(data.config.editorialImages || []);
        if (data.config.ctaImage) setCtaImage(data.config.ctaImage);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      toast.error('Failed to load homepage configuration');
    } finally {
      setLoading(false);
    }
  };

  const persistConfig = async (overrideData?: {
    heroImages?: IHeroImage[];
    editorialImages?: IEditorialImage[];
    ctaImage?: ICtaImage;
  }) => {
    try {
      setSaving(true);
      const payload = {
        heroImages: overrideData?.heroImages ?? heroImages,
        editorialImages: overrideData?.editorialImages ?? editorialImages,
        ctaImage: overrideData?.ctaImage ?? ctaImage,
      };

      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.config) {
        setHeroImages(data.config.heroImages || []);
        setEditorialImages(data.config.editorialImages || []);
        if (data.config.ctaImage) setCtaImage(data.config.ctaImage);
        toast.success('Saved to MongoDB ✓');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string } | null> => {
    try {
      setUploading(true);
      const loadingToast = toast.loading('Uploading to Cloudinary...');

      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success('Image uploaded to Cloudinary');
        return { url: data.url || data.data?.url || base64, publicId: data.publicId || data.public_id || data.data?.publicId || '' };
      } else {
        toast.error(data.message || 'Upload failed');
        return { url: base64, publicId: '' };
      }
    } catch {
      toast.error('Upload error');
      const base64Fallback: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
      });
      return { url: base64Fallback, publicId: '' };
    } finally {
      setUploading(false);
    }
  };

  const deleteFromCloudinary = async (publicId?: string) => {
    if (!publicId) return;
    try {
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
    } catch {}
  };

  // Hero handlers
  const handleAddHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploaded = await uploadToCloudinary(files[0]);
    if (uploaded) {
      const newHero: IHeroImage = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        badge: 'AUTHENTIC JAFFNA & INDIAN MASALA & SNACKS',
        title: 'A Little Taste of Home,',
        titleHighlight: 'Delivered to Your Door.',
        description: 'Discover quality masalas, snacks, and pure spices delivered to your door.',
        primaryCtaText: 'Explore Our Collection',
        primaryCtaHref: '/shop',
        active: true,
        displayOrder: heroImages.length + 1,
      };
      const updatedList = [...heroImages, newHero];
      setHeroImages(updatedList);
      await persistConfig({ heroImages: updatedList });
    }
  };

  const handleDeleteHeroImage = async (idx: number) => {
    if (!confirm('Delete this Hero slide permanently?')) return;
    const target = heroImages[idx];
    const updatedList = heroImages.filter((_, i) => i !== idx);
    setHeroImages(updatedList);
    await persistConfig({ heroImages: updatedList });
    if (target?.publicId) deleteFromCloudinary(target.publicId);
  };

  // Editorial handlers
  const handleUploadEditorialImage = async (sectionKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploaded = await uploadToCloudinary(files[0]);
    if (uploaded) {
      const existing = editorialImages.filter((img) => img.section !== sectionKey);
      const sectionInfo = EDITORIAL_SECTIONS.find((s) => s.key === sectionKey);
      const prevEntry = editorialImages.find((img) => img.section === sectionKey);
      const newEditorial: IEditorialImage = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        section: sectionKey as IEditorialImage['section'],
        title: prevEntry?.title || sectionInfo?.label || '',
        subtitle: prevEntry?.subtitle || '',
        price: prevEntry?.price || 0,
        link: prevEntry?.link || '/shop',
        tag: prevEntry?.tag || '',
        active: true,
        displayOrder: 0,
      };
      const updatedList = [...existing, newEditorial];
      setEditorialImages(updatedList);
      await persistConfig({ editorialImages: updatedList });
    }
    e.target.value = '';
  };

  const handleDeleteEditorialImage = async (sectionKey: string) => {
    const target = editorialImages.find((img) => img.section === sectionKey);
    if (!target) return;
    if (!confirm(`Remove the image for this section?`)) return;
    const updatedList = editorialImages.filter((img) => img.section !== sectionKey);
    setEditorialImages(updatedList);
    await persistConfig({ editorialImages: updatedList });
    if (target.publicId) deleteFromCloudinary(target.publicId);
  };

  // CTA handlers
  const handleUploadCtaImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploaded = await uploadToCloudinary(files[0]);
    if (uploaded) {
      const updatedCta = { url: uploaded.url, publicId: uploaded.publicId, active: true };
      setCtaImage(updatedCta);
      await persistConfig({ ctaImage: updatedCta });
    }
  };

  const handleDeleteCtaImage = async () => {
    if (!confirm('Remove custom CTA background image?')) return;
    const oldPublicId = ctaImage.publicId;
    const updatedCta = { url: '', publicId: '', active: true };
    setCtaImage(updatedCta);
    await persistConfig({ ctaImage: updatedCta });
    if (oldPublicId) deleteFromCloudinary(oldPublicId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-purple-900">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: 'hero', name: 'Hero Images', icon: ImageIcon, count: heroImages.length },
    { id: 'editorial', name: 'Editorial Sections', icon: Palette, count: editorialImages.length },
    { id: 'cta', name: 'CTA Background', icon: MessageCircle, count: ctaImage.url ? 1 : 0 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">DATABASE CONTROL CENTER</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Homepage Management</h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            All changes upload to Cloudinary and save permanently in MongoDB.
          </p>
        </div>
        <button
          type="button"
          onClick={() => persistConfig()}
          disabled={saving}
          className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-200 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-purple-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-900 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-amber-400 text-purple-950' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB: HERO IMAGES */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Hero Background Images</h2>
              <p className="text-xs text-slate-500">Full background images that auto-transform every 4 seconds on the hero banner. Upload up to 4.</p>
            </div>
            <label className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Upload Hero Image
              <input type="file" accept="image/*" className="hidden" onChange={handleAddHeroImage} />
            </label>
          </div>

          {heroImages.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-purple-200 space-y-4">
              <ImageIcon className="w-12 h-12 text-purple-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Custom Hero Images Uploaded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">The homepage uses 4 default food images. Upload your own to replace them — they will be stored in MongoDB.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {heroImages.map((hero, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative w-full md:w-64 h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image src={hero.url} alt={hero.title} fill className="object-cover" />
                      <span className="absolute top-2 left-2 bg-purple-950 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full">SLIDE {idx + 1}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Badge Text</label>
                        <input type="text" value={hero.badge} onChange={(e) => { const u = [...heroImages]; u[idx].badge = e.target.value; setHeroImages(u); }} onBlur={() => persistConfig()} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Title Main</label>
                        <input type="text" value={hero.title} onChange={(e) => { const u = [...heroImages]; u[idx].title = e.target.value; setHeroImages(u); }} onBlur={() => persistConfig()} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Title Highlight (Gold)</label>
                        <input type="text" value={hero.titleHighlight} onChange={(e) => { const u = [...heroImages]; u[idx].titleHighlight = e.target.value; setHeroImages(u); }} onBlur={() => persistConfig()} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Button Text</label>
                        <input type="text" value={hero.primaryCtaText} onChange={(e) => { const u = [...heroImages]; u[idx].primaryCtaText = e.target.value; setHeroImages(u); }} onBlur={() => persistConfig()} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">Description</label>
                        <textarea rows={2} value={hero.description} onChange={(e) => { const u = [...heroImages]; u[idx].description = e.target.value; setHeroImages(u); }} onBlur={() => persistConfig()} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button type="button" onClick={() => { const u = [...heroImages]; u[idx].active = !u[idx].active; setHeroImages(u); persistConfig({ heroImages: u }); }} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${hero.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                      {hero.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {hero.active ? 'Enabled' : 'Disabled'}
                    </button>
                    <button type="button" onClick={() => handleDeleteHeroImage(idx)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Slide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: EDITORIAL SECTIONS */}
      {activeTab === 'editorial' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Editorial Section Images</h2>
            <p className="text-xs text-slate-500">Upload a custom image for each homepage section below. Each card shows which section on the homepage it controls.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {EDITORIAL_SECTIONS.map((section) => {
              const existing = editorialImages.find((img) => img.section === section.key);
              return (
                <div key={section.key} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Image Preview — Fixed 4:3 Aspect Ratio */}
                    <div className="relative w-full md:w-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 aspect-[4/3] flex items-center justify-center">
                      {existing?.url ? (
                        <Image src={existing.url} alt={section.label} fill className="object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Palette className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                          <p className="text-[10px] text-slate-400 font-bold">Using default image</p>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-purple-950 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full">{section.key}</span>
                    </div>

                    {/* Info & Controls */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-black text-sm text-slate-900">{section.label}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{section.desc}</p>
                      </div>

                      {/* Show text fields when image is uploaded OR section always needs text fields */}
                      {(existing?.url || section.showTextFields) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Title</label>
                            <input
                              type="text"
                              value={existing?.title || ''}
                              placeholder="Enter section headline"
                              onChange={(e) => {
                                const updated = editorialImages.map((img) =>
                                  img.section === section.key ? { ...img, title: e.target.value } : img
                                );
                                // If no entry yet, create a placeholder entry
                                if (!editorialImages.find((img) => img.section === section.key)) {
                                  setEditorialImages([...editorialImages, {
                                    url: '', publicId: '', section: section.key as IEditorialImage['section'],
                                    title: e.target.value, subtitle: '', price: 0, link: '/shop', tag: '', active: true, displayOrder: 0,
                                  }]);
                                } else {
                                  setEditorialImages(updated);
                                }
                              }}
                              onBlur={() => persistConfig()}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                            />
                          </div>

                          {section.hasPrice && (
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Price (£)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={existing?.price || ''}
                                placeholder="e.g. 4.99"
                                onChange={(e) => {
                                  const updated = editorialImages.map((img) =>
                                    img.section === section.key ? { ...img, price: parseFloat(e.target.value) || 0 } : img
                                  );
                                  setEditorialImages(updated);
                                }}
                                onBlur={() => persistConfig()}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                              />
                            </div>
                          )}

                          <div className="sm:col-span-2">
                            <label className="font-bold text-slate-700 block mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={existing?.subtitle || ''}
                              placeholder="Enter section description"
                              onChange={(e) => {
                                const updated = editorialImages.map((img) =>
                                  img.section === section.key ? { ...img, subtitle: e.target.value } : img
                                );
                                if (!editorialImages.find((img) => img.section === section.key)) {
                                  setEditorialImages([...editorialImages, {
                                    url: '', publicId: '', section: section.key as IEditorialImage['section'],
                                    title: '', subtitle: e.target.value, price: 0, link: '/shop', tag: '', active: true, displayOrder: 0,
                                  }]);
                                } else {
                                  setEditorialImages(updated);
                                }
                              }}
                              onBlur={() => persistConfig()}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-medium"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <label className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" /> {existing?.url ? 'Replace Image' : 'Upload Image'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadEditorialImage(section.key, e)} />
                        </label>

                        {existing?.url && (
                          <button type="button" onClick={() => handleDeleteEditorialImage(section.key)} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}

                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${existing?.url ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {existing?.url ? '✓ Custom Image' : 'Default Image'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: CTA BACKGROUND */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Shopping CTA Section Background</h2>
            <p className="text-xs text-slate-500">Manage the background image for the &quot;WHAT&apos;S GOING IN YOUR BASKET?&quot; section at the bottom of the homepage.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl space-y-6">
            {ctaImage.url ? (
              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-purple-950 border border-purple-800">
                <Image src={ctaImage.url} alt="CTA Visual" fill className="object-cover" />
                <div className="absolute inset-0 bg-purple-950/60 flex items-center justify-center p-6 text-white text-center">
                  <div>
                    <h3 className="font-extrabold text-lg">What&apos;s Going In Your Basket?</h3>
                    <p className="text-xs text-purple-200 mt-1">Custom CTA Background Saved ✓</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[16/7] rounded-2xl bg-purple-50 border border-dashed border-purple-200 flex items-center justify-center text-center p-6">
                <p className="text-xs font-semibold text-purple-900">No Custom CTA Image — Using Default Purple Gradient</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Upload CTA Background Image
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadCtaImage} />
              </label>

              {ctaImage.url && (
                <button type="button" onClick={handleDeleteCtaImage} className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-100">
                  Remove Custom Image
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
