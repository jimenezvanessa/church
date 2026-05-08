'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Song {
  _id: string;
  title: string;
  lyrics: string;
  category: string;
}

export default function EditSong() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [category, setCategory] = useState('hymnal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch(`/api/songs/${params.id}`);
        if (res.ok) {
          const data: Song = await res.json();
          setTitle(data.title);
          setLyrics(data.lyrics);
          setCategory(data.category || 'hymnal');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [params.id, router]);

  const handleSave = async () => {
    if (!title.trim() || !lyrics.trim()) return;
    setSaving(true);
    
    try {
      await fetch(`/api/songs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lyrics, category }),
      });
      
      router.push('/');
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <Link href="/" className="self-start px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200 absolute left-4 top-4 md:left-8 md:top-8 z-10">
            ← Back
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold pt-8 md:pt-0">Edit Song</h1>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Song Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-soft-gray/20 text-white focus:outline-none focus:ring-2 focus:ring-light-blue"
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
              rows={8}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-soft-gray/20 text-white focus:outline-none focus:ring-2 focus:ring-light-blue resize-none font-mono"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !lyrics.trim()}
            className="w-full bg-blue hover:bg-light-blue disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-2xl font-medium text-lg transition-all duration-200"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}