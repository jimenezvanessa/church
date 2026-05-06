import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Presentation from '@/models/Presentation';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const songId = request.nextUrl.searchParams.get('songId');
    
    if (songId) {
      const presentation = await Presentation.findOne({ songId })
        .populate('songId', 'title lyrics')
        .lean();
      if (!presentation) {
        return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
      }
      return NextResponse.json(presentation);
    }
    
    const presentations = await Presentation.find()
      .populate('songId', 'title lyrics')
      .sort({ createdAt: -1 })
      .lean();
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