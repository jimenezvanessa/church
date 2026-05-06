import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Presentation from '@/models/Presentation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const presentation = await Presentation.findById(id).populate('songId', 'title lyrics').lean();
    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }
    return NextResponse.json(presentation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch presentation' }, { status: 500 });
  }
}