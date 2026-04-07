'use client'

import dynamic from 'next/dynamic'

const FloatingAiAssistant = dynamic(
  () => import('@/components/ui/glowing-ai-chat-assistant').then(mod => mod.FloatingAiAssistant),
  { ssr: false }
)
export default function AiAssistantDemo() {
  return <FloatingAiAssistant />
}

