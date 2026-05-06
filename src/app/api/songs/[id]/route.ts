import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const song = await Song.findById(id).lean();
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const song = await Song.findByIdAndUpdate(id, body, { new: true });
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Song deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
  }
}