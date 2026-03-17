"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, ArrowRight } from "lucide-react"
import { mockConversations, mockMessages, mockUsers } from "@/lib/mock-data"
import type { Conversation, User } from "@/lib/types"

interface MessagesWidgetProps {
  userId?: string
}

export function MessagesWidget({ userId = "1" }: MessagesWidgetProps) {
  const userConversations = mockConversations.filter((conv) =>
    conv.participantIds.includes(userId)
  )

  const getOtherUser = (conv: Conversation): User | undefined => {
    const otherUserId = conv.participantIds.find((id) => id !== userId)
    return mockUsers.find((u) => u.id === otherUserId)
  }

  const unreadCount = userConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <CardTitle>Messages</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          <Link href="/messages">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {userConversations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-3">
              No messages yet
            </p>
            <Link href="/trainers">
              <Button size="sm">Find a Trainer</Button>
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3 pr-4">
              {userConversations.map((conv) => {
                const otherUser = getOtherUser(conv)
                return (
                  <Link key={conv.id} href={`/messages?conversation=${conv.id}`}>
                    <div className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {otherUser?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(
                              new Date(conv.lastMessageDate || conv.updatedAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
