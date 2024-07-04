import { NextRequest, NextResponse } from 'next/server';
import { scrapeAmazonProduct } from '@/lib/scraeper/page';
import connectDb from '@/lib/databse/mongoose';

export const maxDuration = 40; // This function can run for a maximum of 40 seconds
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  connectDb();

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const data = await scrapeAmazonProduct(url);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
