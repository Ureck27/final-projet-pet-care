'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/socket-context';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('send_notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('send_notification');
    };
  }, [socket, isConnected]);

  const markAllAsRead = () => {
    // In a real app, send a request to backend to mark all read
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 shadow-large rounded-xl overflow-hidden glass-panel"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/50">
          <h4 className="font-heading font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif, i) => (
                <div
                  key={notif._id || i}
                  className="flex flex-col gap-1 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium leading-tight">
                    {notif.title || 'New Notification'}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                  <span className="text-[10px] font-medium text-primary/70 mt-1">
                    {notif.createdAt
                      ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                      : 'Just now'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
