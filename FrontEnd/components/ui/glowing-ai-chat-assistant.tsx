'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Bot, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { aiService } from '@/lib/ai-service'
import type { UserRole } from '@/lib/types'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'text' | 'audio'
}

const FloatingAiAssistant: React.FC = () => {
  const { user } = useAuth()
  const effectiveRole: UserRole = user?.role ?? 'visitor'

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const chatRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    if (!isChatOpen) return
    if (messages.length > 0) return

    const welcomeByRole: Record<UserRole, string> = {
      visitor:
        "Hi! I’m PetCare AI. I can explain how the platform works and answer general pet-care questions. Sign in to get help connected to your pets, bookings, and routines.",
      user: "Hi! I’m PetCare AI. Ask me about pet care, bookings, routines, and how to use your dashboard.",
      trainer: "Hi! I’m PetCare AI. I can help you write session notes, care updates, and training plans for owners.",
      worker: "Hi! I’m PetCare AI. I can help you log care updates, summarize routine completion notes, and flag urgent issues.",
      admin: "Hi! I’m PetCare AI. I can help you manage users/roles, trainer approvals, and platform workflows.",
    }

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeByRole[effectiveRole],
        timestamp: new Date(),
      },
    ])
  }, [isChatOpen, messages.length, effectiveRole])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatOpen])

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || isSending) return

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
      type: 'text'
    }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setMessage('')
    setIsSending(true)

    try {
      const res = await aiService.chat({
        message: trimmed,
        userRole: effectiveRole,
        conversationHistory: nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      })

      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: res.success ? res.response : (res.error || 'Sorry, something went wrong.'),
        timestamp: new Date(),
        type: 'text'
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-e`,
          role: 'assistant',
          content: 'Sorry, I could not respond right now. Please try again.',
          timestamp: new Date(),
          type: 'text'
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false)
      }
      mediaRecorderRef.current.stop()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null

      if (
        chatRef.current &&
        target &&
        !chatRef.current.contains(target) &&
        !target.closest('.floating-ai-button')
      ) {
        setIsChatOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating AI Button */}
      <button
        className={`floating-ai-button relative flex h-14 w-14 transform items-center justify-center rounded-full transition-all duration-300 ${
          isChatOpen ? 'scale-110' : 'hover:scale-110'
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background:
            'linear-gradient(135deg, var(--primary), var(--accent))',
          boxShadow:
            '0 4px 12px rgba(168, 85, 247, 0.4)',
        }}
        aria-label={isChatOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {isChatOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-20 right-0 w-max max-w-[500px] origin-bottom-right transition-all duration-300"
          style={{
            animation:
              'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl min-w-[360px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/30 dark:border-zinc-700/30">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-medium text-foreground">
                  PetCare AI
                </span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
                aria-label="Close chat"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="max-h-[350px] overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="border-t border-zinc-700/30 dark:border-zinc-700/30 px-6 py-4 bg-card/50">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={3}
                className="w-full resize-none border border-input rounded-lg bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your message... (Shift+Enter for new line)"
              />
              
              {/* Controls */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`p-2.5 rounded-lg transition-all ${
                    isRecording
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <Mic className="h-5 w-5" />
                </button>

                <button
                  onClick={handleSend}
                  disabled={isSending || !message.trim()}
                  className="ml-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local CSS for animations */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .floating-ai-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.9),
            0 0 50px rgba(124, 58, 237, 0.7),
            0 0 70px rgba(109, 40, 217, 0.5);
        }
      `}</style>
    </div>
  )
}

export { FloatingAiAssistant }

