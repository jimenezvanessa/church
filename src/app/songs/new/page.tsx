'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateSlides } from '@/lib/slideGenerator';

export default function NewSong() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [category, setCategory] = useState('hymnal');
  const [slides, setSlides] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!lyrics.trim()) return;
    const generated = generateSlides(lyrics);
    setSlides(generated);
    setShowPreview(true);
    setGenerated(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setTimeout(() => setGenerated(false), 3000);
  };

  const handleSave = async () => {
    if (!title.trim() || slides.length === 0) return;
    setSaving(true);
    
    try {
      const songRes = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lyrics, category }),
      });
      
      if (!songRes.ok) {
        const err = await songRes.json();
        throw new Error(err.error || 'Failed to save song');
      }
      
      const song = await songRes.json();
      
      const presRes = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: song._id,
          title: song.title,
          slides,
        }),
      });
      
      if (!presRes.ok) {
        const err = await presRes.json();
        throw new Error(err.error || 'Failed to save presentation');
      }
      
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <Link href="/" className="self-start px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200 absolute left-4 top-4 md:left-8 md:top-8 z-10">
            ← Back
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold pt-8 md:pt-0">Add New Song</h1>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title..."
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-soft-gray/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('hymnal')}
                className={`py-3 md:py-4 rounded-2xl font-medium transition-all duration-200 ${
                  category === 'hymnal'
                    ? 'bg-blue text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Hymnal
              </button>
              <button
                type="button"
                onClick={() => setCategory('praise')}
                className={`py-3 md:py-4 rounded-2xl font-medium transition-all duration-200 ${
                  category === 'praise'
                    ? 'bg-blue text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Praise
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lyrics</label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paste lyrics here..."
              rows={8}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-soft-gray/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-blue resize-none font-mono"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!lyrics.trim()}
            className="w-full bg-blue hover:bg-light-blue disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-2xl font-medium text-lg transition-all duration-200"
          >
            Generate Slides
          </button>

          {generated && (
            <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-xl shadow-lg font-medium text-sm md:text-base">
              ✓ Slides generated ({slides.length})
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300">
              {error}
            </div>
          )}

          {showPreview && slides.length > 0 && (
            <div ref={previewRef} className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Slide Preview ({slides.length})</h2>
              <div className="grid gap-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-2xl p-4 md:p-6 border border-soft-gray/20"
                  >
                    <span className="text-sm text-gray-400 mb-2 block">Slide {index + 1}</span>
                    <p className="whitespace-pre-wrap text-sm md:text-base">{slide}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="w-full mt-4 md:mt-6 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-2xl font-medium text-lg transition-all duration-200"
              >
                {saving ? 'Saving...' : 'Save Song & Presentation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}