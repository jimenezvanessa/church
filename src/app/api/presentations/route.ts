import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Presentation from '@/models/Presentation';
import Song from '@/models/Song';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const songId = request.nextUrl.searchParams.get('songId');
    
    if (songId) {
      const song = await Song.findById(songId).select('title lyrics').lean();
      if (!song) {
        return NextResponse.json({ error: 'Song not found' }, { status: 404 });
      }
      const presentation = await Presentation.findOne({ songId }).lean();
      if (!presentation) {
        return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
      }
      return NextResponse.json({ ...presentation, songId: { title: song.title, lyrics: song.lyrics } });
    }
    
    const presentations = await Presentation.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(presentations);
  } catch (error) {
    console.error('Presentations API error:', error);
    return NextResponse.json({ error: 'Failed to fetch presentations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const presentation = await Presentation.create(body);
    return NextResponse.json(presentation, { status: 201 });
  } catch (error) {
    console.error('Create presentation error:', error);
    return NextResponse.json({ error: 'Failed to create presentation' }, { status: 500 });
  }
}