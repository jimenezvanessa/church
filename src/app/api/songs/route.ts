import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const search = request.nextUrl.searchParams.get('search');
    const sort = request.nextUrl.searchParams.get('sort') || 'title';
    
    let query = {};
    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }

    let sortQuery = {};
    if (sort === 'title') {
      sortQuery = { title: 1 };
    } else if (sort === 'newest') {
      sortQuery = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    const songs = await Song.find(query).sort(sortQuery).lean();
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Songs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const song = await Song.create(body);
    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
  }
}