'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Music, Loader2, Play, ExternalLink, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface Artist {
  name: string;
  confidence: number;
}

interface Track {
  title: string;
  artist: string;
  spotifyUrl?: string;
  previewUrl?: string;
  image?: string;
}

type ProcessingStep = 'idle' | 'uploading' | 'ocr' | 'normalizing' | 'generating' | 'complete' | 'error';

export function CopenhagenDemo() {
  const [step, setStep] = useState<ProcessingStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const dayNight = useAppStore((state) => state.dayNight);

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      setStep('uploading');

      // Step 1: OCR Processing
      setStep('ocr');
      const formData = new FormData();
      formData.append('file', file);

      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!ocrResponse.ok) {
        const errorData = await ocrResponse.json();
        throw new Error(errorData.error || 'OCR failed');
      }

      const ocrResult = await ocrResponse.json();

      // Step 2: Text Normalization
      setStep('normalizing');
      const normalizeResponse = await fetch('/api/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: ocrResult.text }),
      });

      if (!normalizeResponse.ok) {
        throw new Error('Text normalization failed');
      }

      const normalizeResult = await normalizeResponse.json();
      setArtists(normalizeResult.artists);

      // Step 3: Generate Preview Playlist
      setStep('generating');
      const artistNames = normalizeResult.artists.map((a: Artist) => a.name);
      
      const playlistResponse = await fetch('/api/previewPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artists: artistNames, limitPerArtist: 2 }),
      });

      if (!playlistResponse.ok) {
        throw new Error('Playlist generation failed');
      }

      const playlistResult = await playlistResponse.json();
      setTracks(playlistResult.tracks);

      setStep('complete');
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFile(imageFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const getStepMessage = () => {
    switch (step) {
      case 'uploading': return 'Uploading image...';
      case 'ocr': return 'Reading festival poster...';
      case 'normalizing': return 'Extracting artist names...';
      case 'generating': return 'Creating playlist...';
      case 'complete': return `Found ${tracks.length} tracks from ${artists.length} artists!`;
      case 'error': return error || 'Something went wrong';
      default: return 'Upload a festival poster to get started';
    }
  };

  const reset = () => {
    setStep('idle');
    setError(null);
    setArtists([]);
    setTracks([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-display mb-4 transition-colors duration-500 ${
          dayNight === 'day' ? 'text-slate-900/95' : 'text-slate-100'
        }`}>
          Festival Playlist Generator
        </h1>
        <p className={`text-xl transition-colors duration-500 ${
          dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
        }`}>
          Upload a festival poster and I'll create a Spotify playlist for you
        </p>
      </div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {(step === 'idle' || step === 'error') && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-500 ${
              dragActive
                ? 'border-primary-400 bg-primary-500/10'
                : dayNight === 'day' 
                  ? 'border-slate-300 hover:border-slate-400'
                  : 'border-slate-600 hover:border-slate-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-500 ${
              dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h3 className={`text-lg mb-2 transition-colors duration-500 ${
              dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
            }`}>
              Drop a festival poster here
            </h3>
            <p className={`mb-4 transition-colors duration-500 ${
              dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
            }`}>
              or click to browse your files
            </p>
            <p className={`text-sm transition-colors duration-500 ${
              dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Supports PNG, JPG, WebP up to 5MB
            </p>

            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center gap-2 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
                <button
                  onClick={reset}
                  className="ml-2 text-red-300 hover:text-red-200 underline"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Processing State */}
        {(step === 'uploading' || step === 'ocr' || step === 'normalizing' || step === 'generating') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <Loader2 className="w-8 h-8 text-primary-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {getStepMessage()}
            </h3>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-4 mt-6">
              {['OCR', 'Normalize', 'Generate'].map((label, index) => {
                const stepIndex = index + 1;
                const currentStepIndex = 
                  step === 'ocr' ? 1 : 
                  step === 'normalizing' ? 2 : 
                  step === 'generating' ? 3 : 0;
                
                return (
                  <div key={label} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stepIndex <= currentStepIndex
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {stepIndex}
                    </div>
                    <span className="ml-2 text-slate-300 text-sm">{label}</span>
                    {index < 2 && (
                      <div
                        className={`w-8 h-0.5 mx-4 ${
                          stepIndex < currentStepIndex ? 'bg-primary-500' : 'bg-slate-700'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {step === 'complete' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Message */}
            <div className="text-center">
              <Music className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Playlist Ready!
              </h3>
              <p className="text-slate-300">
                {getStepMessage()}
              </p>
            </div>

            {/* Artists Found */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Artists Detected ({artists.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {artists.slice(0, 12).map((artist, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700"
                  >
                    <div className="font-medium text-white text-sm truncate">
                      {artist.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {artist.confidence}% confidence
                    </div>
                  </div>
                ))}
              </div>
              {artists.length > 12 && (
                <p className="text-slate-400 text-sm mt-2">
                  and {artists.length - 12} more...
                </p>
              )}
            </div>

            {/* Track Previews */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Generated Playlist ({tracks.length} tracks)
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-slate-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {track.title}
                      </div>
                      <div className="text-sm text-slate-400 truncate">
                        {track.artist}
                      </div>
                    </div>

                    {track.spotifyUrl && (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                        title="Open in Spotify"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-medium transition-colors"
              >
                Try Another Poster
              </button>
              <button
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
                disabled
                title="Spotify auth not implemented in demo"
              >
                Save to Spotify
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}