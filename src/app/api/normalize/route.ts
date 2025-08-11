import { NextRequest, NextResponse } from 'next/server';

// Common words to filter out when extracting artist names
const NOISE_WORDS = [
  // Festival/venue terms
  'festival', 'music', 'stage', 'main', 'tent', 'arena', 'field', 'park',
  'presents', 'featuring', 'feat', 'ft', 'vs', 'with', 'and', 'the',
  
  // Time/date terms
  'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  'january', 'february', 'march', 'april', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  
  // Common festival words
  'lineup', 'tickets', 'doors', 'open', 'pm', 'am', 'price', 'sold', 'out',
  'buy', 'now', 'get', 'your', 'early', 'bird', 'vip', 'general', 'admission',
  
  // Location terms
  'downtown', 'center', 'venue', 'location', 'address', 'city', 'state',
  
  // Numbers and short words
  '2023', '2024', '2025', 'th', 'st', 'nd', 'rd'
];

// Artist name variations to normalize
const NORMALIZATIONS: { [key: string]: string } = {
  '&': 'and',
  '+': 'and',
  'ft.': 'featuring',
  'feat.': 'featuring',
  'w/': 'with',
  'vs.': 'versus',
  'v.': 'versus'
};

function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Apply normalizations
  Object.entries(NORMALIZATIONS).forEach(([from, to]) => {
    normalized = normalized.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
  });
  
  // Remove special characters but keep spaces, hyphens, and apostrophes
  normalized = normalized.replace(/[^\w\s\-']/g, ' ');
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

function isLikelyArtistName(text: string): boolean {
  const normalized = normalizeText(text);
  
  // Filter out noise words
  const words = normalized.split(' ');
  const filteredWords = words.filter(word => 
    !NOISE_WORDS.includes(word) && 
    word.length > 1 && 
    !/^\d+$/.test(word) // No standalone numbers
  );
  
  // Must have at least one meaningful word
  if (filteredWords.length === 0) return false;
  
  // Skip very long strings (likely descriptions)
  if (normalized.length > 50) return false;
  
  // Skip strings with too many numbers
  const numberCount = (normalized.match(/\d/g) || []).length;
  if (numberCount > normalized.length * 0.3) return false;
  
  return true;
}

function calculateConfidence(originalText: string, normalizedText: string): number {
  // Base confidence
  let confidence = 70;
  
  // Boost for reasonable length
  if (normalizedText.length >= 3 && normalizedText.length <= 30) {
    confidence += 10;
  }
  
  // Boost for proper capitalization in original
  if (/^[A-Z]/.test(originalText)) {
    confidence += 10;
  }
  
  // Penalize for too many special characters
  const specialCharCount = (originalText.match(/[^\w\s]/g) || []).length;
  if (specialCharCount > originalText.length * 0.2) {
    confidence -= 15;
  }
  
  // Boost for common artist patterns
  if (/\b(band|trio|quartet|group|collective|orchestra|choir)\b/i.test(normalizedText)) {
    confidence += 15;
  }
  
  return Math.max(0, Math.min(100, confidence));
}

export async function POST(request: NextRequest) {
  try {
    const { raw } = await request.json();
    
    if (!raw || typeof raw !== 'string') {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }
    
    // Split text into potential artist names
    const lines = raw.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const potentialArtists: { name: string; confidence: number }[] = [];
    const rejected: string[] = [];
    
    for (const line of lines) {
      // Skip very short or very long lines
      if (line.length < 2 || line.length > 100) {
        rejected.push(line);
        continue;
      }
      
      // Check if it looks like an artist name
      if (isLikelyArtistName(line)) {
        const normalized = normalizeText(line);
        const confidence = calculateConfidence(line, normalized);
        
        // Only include if confidence is above threshold
        if (confidence >= 60) {
          potentialArtists.push({
            name: normalized,
            confidence
          });
        } else {
          rejected.push(line);
        }
      } else {
        rejected.push(line);
      }
    }
    
    // Sort by confidence descending
    potentialArtists.sort((a, b) => b.confidence - a.confidence);
    
    // Remove duplicates
    const uniqueArtists = potentialArtists.filter((artist, index, arr) => 
      index === arr.findIndex(a => a.name.toLowerCase() === artist.name.toLowerCase())
    );
    
    console.log(`Processed ${lines.length} lines, found ${uniqueArtists.length} potential artists`);
    
    return NextResponse.json({
      artists: uniqueArtists,
      rejected: rejected.slice(0, 10) // Limit rejected list for debugging
    });
    
  } catch (error) {
    console.error('Normalization error:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    );
  }
}

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