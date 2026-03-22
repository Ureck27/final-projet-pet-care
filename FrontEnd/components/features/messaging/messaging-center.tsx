"use client"

import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@/context/auth-context"
import { chatApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreVertical, Check, CheckCheck, Plus } from "lucide-react"

export default function MessagingCenter() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    fetchConversations()

    // Init Socket
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    })

    socketRef.current.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
      setConversations((prev) => 
        prev.map(c => c._id === newMessage.conversationId 
          ? { ...c, lastMessage: newMessage, updatedAt: new Date() } 
          : c
        ).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      )
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const data = await chatApi.getConversations()
      setConversations(data || [])
      if (data && data.length > 0 && !selectedConversation) {
        handleSelectConversation(data[0])
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const handleSelectConversation = async (conv: any) => {
    setSelectedConversation(conv)
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', conv._id)
    }
    try {
      const msgs = await chatApi.getMessages(conv._id)
      setMessages(msgs || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !user) return

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: user._id || user.id,
      senderModel: user.role === 'admin' ? 'Admin' : user.role === 'trainer' ? 'Trainer' : 'User',
      text: messageText,
    }

    if (socketRef.current) {
      socketRef.current.emit('send_message', messageData)
    }
    setMessageText("")
  }

  const getOtherUser = (conv: any) => {
    if (!user) return null
    return user.role === 'trainer' ? conv.userId : conv.trainerId
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const otherUser = getOtherUser(conv)
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Determine if it's my message
  const isMessageOwn = (messageSenderId: string) => {
    if (!user) return false;
    return messageSenderId === String(user._id) || messageSenderId === String(user.id);
  }

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Conversations List */}
      <Card className="w-full sm:w-96 flex flex-col border-0 shadow-lg h-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <Button size="icon" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {filteredConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No conversations found
              </p>
            ) : (
              filteredConversations.map((conv) => {
                const otherUser = getOtherUser(conv)
                const isSelected = selectedConversation && conv._id === selectedConversation._id
                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isSelected
                        ? "bg-primary/10 border-2 border-primary/30"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {otherUser?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    {conv.updatedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(conv.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      {selectedConversation ? (
        <Card className="flex-1 flex flex-col border-0 shadow-lg h-full">
          <CardHeader className="border-b py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{getOtherUser(selectedConversation)?.name || "Chat"}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role === 'trainer' ? 'Client' : 'Trainer'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = isMessageOwn(message.senderId)
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-lg ${
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-slate-200 dark:bg-slate-700 text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap flex-wrap break-words">{message.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${
                          isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {message.createdAt && (
                          <span>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {isOwn && (
                          <CheckCheck className="w-3 h-3 ml-1 opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <Button type="button" variant="ghost" size="icon" className="shrink-0" title="Attach file">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center border-0 shadow-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </Card>
      )}
    </div>
  )
}
