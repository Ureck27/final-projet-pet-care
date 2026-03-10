'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X } from 'lucide-react'

const FloatingAiAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [charCount, setCharCount] = useState(0)
  const maxChars = 2000
  const chatRef = useRef<HTMLDivElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, maxChars)
    setMessage(value)
    setCharCount(value.length)
  }

  const handleSend = () => {
    if (message.trim()) {
      // Replace this with your API call / AI backend integration
      console.log('Sending message:', message)
      setMessage('')
      setCharCount(0)
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
      {/* Floating 3D Glowing AI Logo */}
      <button
        className={`floating-ai-button relative flex h-16 w-16 transform items-center justify-center rounded-full transition-all duration-500 ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(168,85,247,0.8) 100%)',
          boxShadow:
            '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(124, 58, 237, 0.5), 0 0 60px rgba(109, 40, 217, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-label={isChatOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {/* 3D effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30" />

        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />

        {/* AI Icon */}
        <div className="relative z-10">
          {isChatOpen ? <X /> : <Bot className="h-8 w-8 text-white" />}
        </div>

        {/* Glowing animation */}
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500 opacity-20" />
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
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-500/50 bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 shadow-2xl backdrop-blur-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-2 pt-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-medium text-zinc-400">
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-2xl bg-zinc-800/60 px-2 py-1 text-xs font-medium text-zinc-300">
                  GPT-4
                </span>
                <span className="rounded-2xl border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                  Pro
                </span>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="rounded-full p-1.5 transition-colors hover:bg-zinc-700/50"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="relative overflow-hidden">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={4}
                className="min-h-[120px] w-full resize-none border-none bg-transparent px-6 py-4 text-base font-normal leading-relaxed text-zinc-100 outline-none placeholder-zinc-500 scrollbar-none"
                placeholder="What would you like to explore today? Ask anything, share ideas, or request assistance..."
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-800/5 to-transparent"
                style={{
                  background:
                    'linear-gradient(to top, rgba(39, 39, 42, 0.05), transparent)',
                }}
              />
            </div>

            {/* Controls Section */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Attachment Group */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-1">
                    {/* File Upload */}
                    <button className="group relative cursor-pointer rounded-lg border-none bg-transparent p-2.5 text-zinc-500 transition-all duration-300 hover:-rotate-3 hover:scale-105 hover:bg-zinc-800/80 hover:text-zinc-200">
                      <Paperclip className="h-4 w-4 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-125" />
                      <div className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                        Upload files
                        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95" />
                      </div>
                    </button>

                    {/* Link */}
                    <button className="group relative cursor-pointer rounded-lg border-none bg-transparent p-2.5 text-zinc-500 transition-all duration-300 hover:rotate-6 hover:scale-105 hover:bg-zinc-800/80 hover:text-red-400">
                      <Link className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125" />
                      <div className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                        Web link
                        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95" />
                      </div>
                    </button>

                    {/* Code */}
                    <button className="group relative cursor-pointer rounded-lg border-none bg-transparent p-2.5 text-zinc-500 transition-all duration-300 hover:rotate-3 hover:scale-105 hover:bg-zinc-800/80 hover:text-green-400">
                      <Code className="h-4 w-4 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-125" />
                      <div className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                        Code repo
                        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95" />
                      </div>
                    </button>

                    {/* Design (Figma-like icon) */}
                    <button className="group relative cursor-pointer rounded-lg border-none bg-transparent p-2.5 text-zinc-500 transition-all duration-300 hover:-rotate-6 hover:scale-105 hover:bg-zinc-800/80 hover:text-purple-400">
                      <svg
                        className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c-2.476 0-4.49 2.015-4.49 4.49s2.014 4.49 4.49 4.49 4.49-2.015 4.49-4.49-2.014-4.49-4.49-4.49zm0 7.509c-1.665 0-3.019-1.355-3.019-3.019s1.355-3.019 3.019-3.019 3.019 1.354 3.019 3.019-1.354 3.019-3.019 3.019zM8.148 24c-2.476 0-4.49-2.015-4.49-4.49s2.014-4.49 4.49-4.49h4.588V24H8.148zm3.117-1.471V16.49H8.148c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.02 3.019 3.02h3.117z" />
                      </svg>
                      <div className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                        Design file
                        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95" />
                      </div>
                    </button>
                  </div>

                  {/* Voice Button */}
                  <button className="group relative cursor-pointer transform rounded-lg border border-zinc-700/30 bg-transparent p-2.5 text-zinc-500 transition-all duration-300 hover:scale-110 hover:rotate-2 hover:border-red-500/30 hover:bg-zinc-800/80 hover:text-red-400">
                    <Mic className="h-4 w-4 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-125" />
                    <div className="pointer-events-none absolute -top-10 left-1/2 w-max -translate-x-1/2 transform whitespace-nowrap rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 text-xs text-zinc-200 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
                      Voice input
                      <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900/95" />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Character Counter */}
                  <div className="text-xs font-medium text-zinc-500">
                    <span>{charCount}</span>
                    <span className="text-zinc-400">/{maxChars}</span>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSend}
                    className="group relative transform cursor-pointer rounded-xl border-none bg-gradient-to-r from-red-600 to-red-500 p-3 text-white shadow-lg transition-all duration-300 hover:-rotate-2 hover:scale-110 hover:from-red-500 hover:to-red-400 hover:shadow-xl hover:shadow-red-500/30 active:scale-95"
                    style={{
                      boxShadow:
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    <Send className="h-5 w-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12 group-hover:scale-110" />

                    {/* Animated background glow */}
                    <div className="absolute inset-0 scale-110 rounded-xl bg-gradient-to-r from-red-600 to-red-500 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />

                    {/* Ripple effect on click */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 scale-0 rounded-xl bg-white/20 transition-transform duration-200 group-active:scale-100" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-3 flex items-center justify-between gap-6 border-t border-zinc-800/50 pt-3 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  <span>
                    Press{' '}
                    <kbd className="shadow-sm inline-flex items-center justify-center rounded border border-zinc-600 bg-zinc-800 px-1.5 py-1 font-mono text-xs text-zinc-400">
                      Shift + Enter
                    </kbd>{' '}
                    for new line
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>All systems operational</span>
                </div>
              </div>
            </div>

            {/* Floating Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.05), transparent, rgba(147, 51, 234, 0.05))',
              }}
            />
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

