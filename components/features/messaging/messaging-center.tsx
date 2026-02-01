"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockConversations, mockMessages, mockUsers } from "@/lib/mock-data"
import type { Conversation, Message, User } from "@/lib/types"

export default function MessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    mockConversations[0]?.id || null
  )
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages)

  const currentUserId = "1" // Assuming logged in user
  const conversation = conversations.find((c) => c.id === selectedConversation)
  const conversationMessages = messages.filter(
    (m) => m.conversationId === selectedConversation
  )

  const getOtherUserId = (conv: Conversation): string => {
    return conv.participantIds.find((id) => id !== currentUserId) || ""
  }

  const getUser = (userId: string): User | undefined => {
    return mockUsers.find((u) => u.id === userId)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation) return

    const otherUserId = getOtherUserId(conversation!)
    const newMessage: Message = {
      id: `msg-${messages.length + 1}`,
      conversationId: selectedConversation,
      senderId: currentUserId,
      receiverId: otherUserId,
      content: messageText,
      read: false,
      createdAt: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessageText("")

    // Update conversation
    setConversations(
      conversations.map((c) =>
        c.id === selectedConversation
          ? {
              ...c,
              lastMessage: messageText,
              lastMessageDate: new Date(),
              lastMessageSenderId: currentUserId,
              updatedAt: new Date(),
            }
          : c
      )
    )
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const otherUser = getUser(getOtherUserId(conv))
    return (
      otherUser?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser?.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex h-screen gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Conversations List */}
      <Card className="w-full sm:w-96 flex flex-col border-0 shadow-lg">
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
                const otherUser = getUser(getOtherUserId(conv))
                const isSelected = conv.id === selectedConversation
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {otherUser?.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(conv.lastMessageDate || conv.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      {selectedConversation && conversation ? (
        <Card className="flex-1 flex flex-col border-0 shadow-lg">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {getUser(getOtherUserId(conversation))?.fullName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getUser(getOtherUserId(conversation))?.role === "trainer"
                    ? "Professional Trainer"
                    : "Pet Owner"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Video className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Clear Chat History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversationMessages.map((message) => {
                const isOwn = message.senderId === currentUserId
                const sender = getUser(message.senderId)
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-slate-200 dark:bg-slate-700 text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${
                          isOwn ? "text-blue-100" : "text-muted-foreground"
                        }`}
                      >
                        <span>
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                        {isOwn && (
                          <>
                            {message.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Replies */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "That works for me!",
                "Thanks for the update!",
                "Can we schedule a time?",
                "Great to hear from you!",
              ].map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setMessageText(reply)
                  }}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center border-0 shadow-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a conversation to start messaging
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
