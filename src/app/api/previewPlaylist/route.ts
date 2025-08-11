import { NextRequest, NextResponse } from 'next/server';

// Mock Spotify API for demo purposes (in production, you'd need real Spotify Web API)
// This simulates search results for common artist names
const MOCK_SPOTIFY_DATA: { [key: string]: any } = {
  'billie eilish': {
    artist: 'Billie Eilish',
    tracks: [
      {
        title: 'bad guy',
        spotifyUrl: 'https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m',
        previewUrl: 'https://p.scdn.co/mp3-preview/...',
        image: 'https://i.scdn.co/image/...'
      }
    ]
  },
  'the weeknd': {
    artist: 'The Weeknd',
    tracks: [
      {
        title: 'Blinding Lights',
        spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
        previewUrl: 'https://p.scdn.co/mp3-preview/...',
        image: 'https://i.scdn.co/image/...'
      }
    ]
  },
  'dua lipa': {
    artist: 'Dua Lipa',
    tracks: [
      {
        title: 'Levitating',
        spotifyUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
        previewUrl: 'https://p.scdn.co/mp3-preview/...',
        image: 'https://i.scdn.co/image/...'
      }
    ]
  }
};

async function searchSpotifyArtist(artistName: string, limitPerArtist: number = 2) {
  // In a real implementation, you would:
  // 1. Get Spotify client credentials token
  // 2. Search for the artist
  // 3. Get their top tracks
  // 4. Return formatted results
  
  const normalizedName = artistName.toLowerCase().trim();
  
  // Check if we have mock data for this artist
  if (MOCK_SPOTIFY_DATA[normalizedName]) {
    const artistData = MOCK_SPOTIFY_DATA[normalizedName];
    return artistData.tracks.slice(0, limitPerArtist).map((track: any) => ({
      title: track.title,
      artist: artistData.artist,
      spotifyUrl: track.spotifyUrl,
      previewUrl: track.previewUrl,
      image: track.image
    }));
  }
  
  // For unknown artists, return a placeholder
  return [{
    title: `Top Track by ${artistName}`,
    artist: artistName,
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(artistName)}`,
    previewUrl: null,
    image: 'https://via.placeholder.com/300x300?text=No+Image'
  }];
}

export async function POST(request: NextRequest) {
  try {
    const { artists, limitPerArtist = 2 } = await request.json();
    
    if (!artists || !Array.isArray(artists)) {
      return NextResponse.json(
        { error: 'Artists array is required' },
        { status: 400 }
      );
    }
    
    if (artists.length === 0) {
      return NextResponse.json({
        tracks: []
      });
    }
    
    // Limit the number of artists to prevent abuse
    const limitedArtists = artists.slice(0, 20);
    
    console.log(`Searching for ${limitedArtists.length} artists...`);
    
    const allTracks: any[] = [];
    
    for (const artistName of limitedArtists) {
      if (typeof artistName !== 'string' || artistName.trim().length === 0) {
        continue;
      }
      
      try {
        const tracks = await searchSpotifyArtist(artistName.trim(), limitPerArtist);
        allTracks.push(...tracks);
      } catch (error) {
        console.warn(`Failed to search for artist: ${artistName}`, error);
        // Continue with other artists
      }
    }
    
    console.log(`Found ${allTracks.length} tracks total`);
    
    return NextResponse.json({
      tracks: allTracks
    });
    
  } catch (error) {
    console.error('Preview playlist error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview playlist' },
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