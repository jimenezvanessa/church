'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Song {
  _id: string;
  title: string;
  lyrics: string;
  createdAt: string;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);
        
        const res = await fetch(`/api/songs?${params}`);
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSongs();
  }, [search, sort]);

  const deleteSong = async (id: string) => {
    if (!confirm('Delete this song?')) return;
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      setSongs(songs.filter(s => s._id !== id));
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  const filterSongs = (songs: Song[]) => {
    const filtered = songs.filter(song => {
      const firstChar = song.title.charAt(0).toUpperCase();
      if (sort === 'A-Z') return /[A-Z]/.test(firstChar);
      if (sort === '0-9') return /[0-9]/.test(firstChar);
      return true;
    });
    return filtered;
  };

  const filteredSongs = filterSongs(songs);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Song Library</h1>
          <Link 
            href="/songs/new"
            className="bg-blue hover:bg-light-blue px-6 py-3 rounded-2xl font-medium transition-all duration-200"
          >
            + Add Song
          </Link>
        </div>

        <div className="flex gap-3 mb-8 bg-white/10 p-4 rounded-2xl border border-white/10">
          <input
            type="text"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-light-blue"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-light-blue [&>option]:text-black [&>option]:bg-white"
          >
            <option value="title">All</option>
            <option value="A-Z">A-Z</option>
            <option value="0-9">0-9</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No songs found. Add your first song!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <div
                key={song._id}
                className="bg-white/10 rounded-2xl p-6 shadow-lg hover:bg-white/15 transition-all duration-200"
              >
                <h3 className="text-xl font-bold mb-2 truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {song.lyrics.substring(0, 100)}...
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/present/${song._id}`}
                    className="flex-1 bg-blue hover:bg-light-blue py-2 rounded-xl text-center font-medium transition-all duration-200"
                  >
                    Present
                  </Link>
                  <Link
                    href={`/songs/edit/${song._id}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSong(song._id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}