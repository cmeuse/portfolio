'use client';

import { Suspense } from 'react';
import { Welcome } from '@/components/Welcome';
import { TransitionParallax } from '@/components/TransitionParallax';
import { GlobeSection } from '@/components/GlobeSection';
import { DestinationPanels } from '@/components/DestinationPanels';
import { MiniPlayer } from '@/components/MiniPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="relative">
      {/* Welcome Section - Full screen hero */}
      <section id="welcome" className="min-h-screen scroll-snap-start">
        <Welcome />
      </section>

      {/* Transition Section - Parallax bridge */}
      <section id="transition" className="min-h-[150vh] scroll-snap-start">
        <TransitionParallax />
      </section>

      {/* Globe Section - Sticky 3D globe */}
      <section id="globe" className="relative min-h-screen scroll-snap-start">
        <div className="sticky top-0 h-screen">
          <Suspense fallback={<LoadingSpinner />}>
            <GlobeSection />
          </Suspense>
        </div>
      </section>

      {/* Destinations Section - Scroll-snap panels */}
      <section id="destinations" className="relative min-h-[500vh] scroll-snap-y">
        <DestinationPanels />
      </section>

      {/* Global Mini Player */}
      <Suspense fallback={null}>
        <MiniPlayer />
      </Suspense>
    </main>
  );
}