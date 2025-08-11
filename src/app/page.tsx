'use client';

import { useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Welcome } from '@/components/Welcome';
import RouteLineSection from '@/components/RouteLineSection';
import { GlobeSection } from '@/components/GlobeSection';
import { TransitionParallax } from '@/components/TransitionParallax';
import { DestinationPanels } from '@/components/DestinationPanels';
import { MiniPlayer } from '@/components/MiniPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  const setScene = useAppStore(state => state.setScene);
  const welcomeRef = useRef<HTMLElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (id === "welcome") setScene("welcome");
        if (id === "route-line") setScene("route");
        if (id === "globe") setScene("globe-intro");
      });
    }, { threshold: 0.6 });
    
    [welcomeRef, routeRef, globeRef].forEach(ref => {
      if (ref.current) io.observe(ref.current);
    });
    
    return () => io.disconnect();
  }, [setScene]);

  return (
    <main className="relative">
      {/* Welcome Section - Original boarding pass */}
      <section id="welcome" ref={welcomeRef} className="min-h-screen">
        <Welcome />
      </section>

      {/* Route Line + Background Section */}
      <section id="route-line" ref={routeRef}>
        <RouteLineSection />
      </section>

      {/* Globe Section - Sticky 3D globe */}
      <section id="globe" ref={globeRef} className="relative">
        <div className="sticky top-0 h-screen">
          <Suspense fallback={<LoadingSpinner />}>
            <GlobeSection />
          </Suspense>
        </div>
        {/* Create trailing space so sticky globe can release */}
        <div className="h-[50vh]" />
      </section>

      {/* Parallax Transition between Globe and Destinations */}
      <TransitionParallax />

      {/* Destinations Section - Scroll-snap panels */}
      <section id="destinations" className="relative min-h-[500vh]">
        <DestinationPanels />
      </section>

      {/* Global Mini Player */}
      <Suspense fallback={null}>
        <MiniPlayer />
      </Suspense>
    </main>
  );
}