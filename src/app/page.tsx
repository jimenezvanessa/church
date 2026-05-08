'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Song {
  _id: string;
  title: string;
  lyrics: string;
  createdAt: string;
  category: string;
}

function SongCard({ song, onDelete }: { song: Song; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 shadow-lg hover:bg-white/15 transition-all duration-200">
      <h3 className="text-lg font-bold mb-2 truncate">{song.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {song.lyrics.substring(0, 80)}...
      </p>
      <div className="flex gap-2">
        <Link
          href={`/present/${song._id}`}
          className="flex-1 bg-blue hover:bg-light-blue py-2 rounded-xl text-center font-medium text-sm transition-all duration-200"
        >
          Present
        </Link>
        <Link
          href={`/songs/edit/${song._id}`}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-all duration-200"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(song._id)}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl text-sm transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'title' | 'A-Z' | '0-9'>('title');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        
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
  }, [search]);

  const deleteSong = async (id: string) => {
    if (!confirm('Delete this song?')) return;
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      setSongs(songs.filter(s => s._id !== id));
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  const searchLower = search.toLowerCase();

  const filterBySort = (songs: Song[]) => {
    return songs.filter(song => {
      const firstChar = song.title.charAt(0).toUpperCase();
      if (sort === 'A-Z') return /[A-Z]/.test(firstChar);
      if (sort === '0-9') return /[0-9]/.test(firstChar);
      return true;
    });
  };

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

        <div className="flex gap-3 mb-4 bg-white/10 p-4 rounded-2xl border border-white/10">
          <input
            type="text"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-light-blue"
          />
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSort('title')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sort === 'title' ? 'bg-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSort('A-Z')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sort === 'A-Z' ? 'bg-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            A-Z
          </button>
          <button
            onClick={() => setSort('0-9')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sort === '0-9' ? 'bg-blue text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            0-9
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Hymnal Songs</h2>
              <div className="space-y-4">
                {filterBySort(songs.filter(s => (!s.category || s.category === 'hymnal') && s.title.toLowerCase().includes(searchLower))).length === 0 ? (
                  <p className="text-gray-400">No hymnal songs</p>
                ) : (
                  filterBySort(songs.filter(s => (!s.category || s.category === 'hymnal') && s.title.toLowerCase().includes(searchLower))).map((song) => (
                    <SongCard key={song._id} song={song} onDelete={deleteSong} />
                  ))
                )}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Praise & Worship</h2>
              <div className="space-y-4">
                {filterBySort(songs.filter(s => s.category === 'praise' && s.title.toLowerCase().includes(searchLower))).length === 0 ? (
                  <p className="text-gray-400">No praise & worship songs</p>
                ) : (
                  filterBySort(songs.filter(s => s.category === 'praise' && s.title.toLowerCase().includes(searchLower))).map((song) => (
                    <SongCard key={song._id} song={song} onDelete={deleteSong} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}