'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const dayNight = useAppStore((state) => state.dayNight);

  useEffect(() => {
    const base = 'font-sans overflow-x-hidden transition-colors duration-500';
    const theme = dayNight === 'day' ? 'bg-slate-50 text-slate-900' : 'bg-slate-800 text-slate-100';
    document.body.className = `${base} ${theme}`;
  }, [dayNight]);

  return <div id="root">{children}</div>;
}
