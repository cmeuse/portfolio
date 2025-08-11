'use client';

import { useAppStore } from '@/store/useAppStore';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const dayNight = useAppStore((state) => state.dayNight);

  return (
    <body className={`font-sans overflow-x-hidden transition-colors duration-500 ${
      dayNight === 'day' 
        ? 'bg-slate-50 text-slate-900'
        : 'bg-slate-800 text-slate-100'
    }`}>
      <div id="root">
        {children}
      </div>
    </body>
  );
}
