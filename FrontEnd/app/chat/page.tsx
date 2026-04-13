'use client';

import { useEffect, useState, useRef, useOptimistic } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { io, Socket } from 'socket.io-client';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Smile, Phone, Video, Users, Search, MessageCircle } from 'lucide-react';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderModel: 'Owner' | 'Trainer' | 'Admin';
  text: string;
  image?: string;
  video?: string;
  read: boolean;
  createdAt: Date;
  sender?: {
    name: string;
    avatar?: string;
  };
  isPending?: boolean;
}

interface Conversation {
  _id: string;
  participants: Array<{
    userId: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  lastMessage?: string;
  updatedAt: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // Typing debounce timer ref
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React 19 Optimistic UI hook
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[], Message>(
    messages,
    (state, newMessage) => [...state, newMessage],
  );

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const petId = searchParams.get('petId');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      initializeSocket();
      fetchConversations();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('petcare_token'),
        userId: (user as any)?.id || (user as any)?._id,
      },
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('receive_message', (message: Message) => {
      // Always add to the selected conversation if it matches
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages((prev) => {
          // Prevent duplicates incase we are the sender and Optimistic UI already kicked in
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });

        // Emit that we've read it (since we are actively in the conversation)
        if (message.senderId !== ((user as any)?.id || (user as any)?._id)) {
          socketInstance.emit('message_read', {
            conversationId: message.conversationId,
            userId: (user as any)?.id || (user as any)?._id,
          });
        }
      }
      updateConversationLastMessage(message.conversationId, message._id);
    });

    socketInstance.on('sync_unread', (unreadMessages: Message[]) => {
      // When offline messages arrive, append them if matching current conversation
      if (selectedConversation && unreadMessages.length > 0) {
        const relevant = unreadMessages.filter(
          (m) => m.conversationId === selectedConversation._id,
        );
        if (relevant.length > 0) {
          setMessages((prev) => [...prev, ...relevant]);
          // Mark as read
          socketInstance.emit('message_read', {
            conversationId: selectedConversation._id,
            userId: (user as any)?.id || (user as any)?._id,
          });
        }
      }
    });

    socketInstance.on('message_read_receipt', ({ conversationId, readBy }) => {
      if (selectedConversation && conversationId === selectedConversation._id) {
        setMessages((prev) =>
          prev.map((msg) => (msg.senderId !== readBy ? { ...msg, read: true } : msg)),
        );
      }
    });

    socketInstance.on('user_typing', (data: { userId: string; conversationId: string }) => {
      if (selectedConversation && data.conversationId === selectedConversation._id) {
        setTypingUsers((prev) => (prev.includes(data.userId) ? prev : [...prev, data.userId]));
      }
    });

    socketInstance.on('user_stop_typing', (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
    });

    setSocket(socketInstance);
  };

  const fetchConversations = async () => {
    try {
      // Mock data - replace with actual API call
      const mockConversations: Conversation[] = [
        {
          _id: '1',
          participants: [
            { userId: '1', name: 'John Doe', avatar: '', role: 'owner' },
            { userId: '2', name: 'Jane Smith', avatar: '', role: 'trainer' },
          ],
          lastMessage: 'Hi, how can I help with your pet?',
          updatedAt: new Date(),
        },
      ];
      setConversations(mockConversations);

      // Auto-select conversation if petId is provided
      if (petId) {
        const conv = mockConversations[0]; // Find conversation related to pet
        selectConversation(conv);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // Mock data - replace with actual API call
      const mockMessages: Message[] = [
        {
          _id: '1',
          conversationId,
          senderId: '1',
          senderModel: 'Owner',
          text: 'Hi, I need help with my dog',
          read: true,
          createdAt: new Date(Date.now() - 3600000),
          sender: { name: 'John Doe' },
        },
        {
          _id: '2',
          conversationId,
          senderId: '2',
          senderModel: 'Trainer',
          text: "Hello! I'd be happy to help. What seems to be the issue?",
          read: true,
          createdAt: new Date(Date.now() - 1800000),
          sender: { name: 'Jane Smith' },
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);

    if (socket) {
      socket.emit('join_conversation', conversation._id);

      // Mark messages as read since we just opened it
      socket.emit('message_read', {
        conversationId: conversation._id,
        userId: (user as any)?.id || (user as any)?._id,
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedConversation || !user) return;

    const tempId = `temp-${Date.now()}`;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: (user as any).id || (user as any)._id,
      senderModel: user?.role === 'trainer' ? 'Trainer' : 'Owner',
      text: newMessage.trim(),
    };

    const optimisticMsg: Message = {
      _id: tempId,
      ...messageData,
      senderModel: messageData.senderModel as 'Owner' | 'Trainer' | 'Admin',
      read: false,
      createdAt: new Date(),
      sender: {
        name: (user as any).name || (user as any).fullName || 'You',
      },
      isPending: true,
    };

    // Immediately update UI
    addOptimisticMessage(optimisticMsg);

    // Execute API request with acknowledgment
    try {
      socket.emit('send_message', messageData, (response: any) => {
        if (response?.success) {
          // Replace optimistic message with actual
          setMessages((prev) => prev.filter((m) => m._id !== tempId).concat(response.message));
        }
      });
    } catch (err) {
      console.error('Message failed to send:', err);
    }

    setNewMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Handle file upload logic here
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateConversationLastMessage = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversationId
          ? { ...conv, lastMessage: messageId, updatedAt: new Date() }
          : conv,
      ),
    );
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? 'bg-primary/10 border-primary/20'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.participants[1]?.avatar} />
                    <AvatarFallback>{conversation.participants[1]?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.participants[1]?.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {conversation.participants[1]?.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.participants[1]?.avatar} />
                    <AvatarFallback>{selectedConversation.participants[1]?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.participants[1]?.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedConversation.participants[1]?.role}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {isConnected ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {optimisticMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderId === ((user as any)?.id || (user as any)?._id)
                        ? 'justify-end'
                        : 'justify-start'
                    } ${message.isPending ? 'opacity-70' : ''}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.senderId === ((user as any)?.id || (user as any)?._id)
                          ? 'order-2'
                          : 'order-1'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.senderId !== ((user as any)?.id || (user as any)?._id) && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.sender?.avatar} />
                            <AvatarFallback className="text-xs">
                              {message.sender?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {message.sender?.name}
                        </span>
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.senderId === ((user as any)?.id || (user as any)?._id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.text && <p className="text-sm">{message.text}</p>}
                        {message.image && (
                          <img
                            src={message.image}
                            alt="Shared image"
                            className="rounded max-w-full h-auto mt-2"
                          />
                        )}
                        {message.video && (
                          <video
                            src={message.video}
                            controls
                            className="rounded max-w-full h-auto mt-2"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1 flex items-center gap-1">
                        {message.createdAt.toLocaleTimeString()}
                        {message.senderId === ((user as any)?.id || (user as any)?._id) &&
                          !message.isPending && (
                            <span
                              className={`${message.read ? 'text-blue-500' : 'text-muted-foreground'}`}
                            >
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                      </p>
                    </div>
                  </div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                    <span>Someone is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);

                    if (socket && selectedConversation && user) {
                      socket.emit('start_typing', {
                        conversationId: selectedConversation._id,
                        senderId: (user as any).id || (user as any)._id,
                      });

                      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                      typingTimeoutRef.current = setTimeout(() => {
                        socket.emit('stop_typing', {
                          conversationId: selectedConversation._id,
                          senderId: (user as any).id || (user as any)._id,
                        });
                      }, 1000);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
