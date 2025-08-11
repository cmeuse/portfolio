import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PNG, JPG, or WebP images.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Tesseract
    console.log('Starting OCR processing...');
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log('OCR Progress:', m)
    });

    // Extract text and filter by confidence
    const lines = data.lines
      .filter(line => line.confidence > 50) // Filter low confidence lines
      .map(line => line.text.trim())
      .filter(text => text.length > 0);

    const allText = data.text.trim();

    console.log(`OCR completed. Extracted ${lines.length} lines of text.`);

    return NextResponse.json({
      text: allText,
      lines: lines,
      confidence: data.confidence
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}