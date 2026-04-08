'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const FloatingAiAssistant = dynamic(
  () => import('./glowing-ai-chat-assistant').then((mod) => mod.FloatingAiAssistant),
  { ssr: false },
);

export function ClientFloatingAssistant() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <FloatingAiAssistant />;
}
