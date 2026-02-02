import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Read the JSON file from public directory
    const filePath = join(process.cwd(), 'public', 'data', 'mock-cms-data.json');
    const fileContents = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error: any) {
    console.error('Error reading mock-cms-data.json:', error);
    return NextResponse.json(
      { error: 'Failed to load CMS data', message: error.message },
      { status: 500 }
    );
  }
}
