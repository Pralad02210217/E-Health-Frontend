"use client";

import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Import Button
import { BellIcon, CheckCircle, XCircle } from "./icons"; // Import Icons
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import TanStack Query
import { fetchNotificationFn, updateNotificationFn } from '@/lib/api';
import { useNotificationSocket } from '@/hooks/use-notification';
// import { fetchNotificationFn, updateNotificationFn } from '@/lib/api'; // Import API functions - adjust the path if needed




interface NotificationType {
  id: string;
  type: string;
  medicine_id?: string;
  batch_id?: string;
  message: string;
  for_role: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: notificationData, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotificationFn,
    // refetchInterval: 60000, // Optional: Refetch every 60 seconds
  });
  useNotificationSocket();

  const mutation = useMutation({
    mutationFn: updateNotificationFn,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications: NotificationType[] = notificationData?.data.notifications || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const [isDotVisible, setIsDotVisible] = useState(unreadCount > 0);


  const handleMarkAsRead = (id: string) => {
    mutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    // Use Promise.all to wait for all mutations to complete
    Promise.all(unreadIds.map(id => mutation.mutateAsync(id))).then(() => {
      // After all are marked as read.
      setIsDotVisible(false); //remove the dot
    });
  };

  // Update isDotVisible when unreadCount changes
    useEffect(() => {
      setIsDotVisible(unreadCount > 0);
    }, [unreadCount]);

  if (isLoading) {
    return (
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger
          className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
          aria-label="View Notifications"
        >
          <span className="relative">
            <BellIcon />
            <span className="absolute inset-0 -z-1 animate-spin rounded-full bg-red-light opacity-75" />
          </span>
        </DropdownTrigger>
        <DropdownContent>
          <div className="flex items-center justify-center p-4">
             <span className="animate-spin">Loading...</span>
          </div>
        </DropdownContent>
      </Dropdown>
    );
  }

  if (error) {
    return (
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger
          className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
          aria-label="View Notifications"
        >
          <span className="relative">
            <BellIcon />
          </span>
        </DropdownTrigger>
        <DropdownContent>
          <div className="p-4">
            Error fetching notifications.
          </div>
        </DropdownContent>
      </Dropdown>
    );
  }

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
        // setIsDotVisible(false); // Removed: Don't hide on dropdown open.  Handled by mark as read
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {isDotVisible && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
            {unreadCount} new
          </span>
        </div>

        <ScrollArea className="h-72">
          <ul className="space-y-1.5">
            {notifications.map((item) => (
              <li key={item.id} role="menuitem" className="relative">
                <div
                  className={cn(
                    "flex items-start gap-4 rounded-lg px-2 py-1.5 outline-none  dark:hover:bg-dark-3",
                    item.is_read
                      ? "bg-gray-100 dark:bg-dark-2/5"
                      : "hover:bg-gray-2 dark:hover:bg-dark-3"
                  )}
                >
                  {/* Use a generic icon, or a different icon based on item.type */}
                  {item.is_read ? (
                    <CheckCircle className="mt-1 size-6 text-green-500" />
                  ) : (
                    <XCircle className="mt-1 size-6 text-red-500" />
                  )}

                  <div className="flex-1">
                    <strong className={cn(
                      "block text-sm font-medium",
                      item.is_read ? "text-gray-500 dark:text-gray-400" : "text-dark dark:text-white"
                    )}>
                      {item.type}
                    </strong>
                    <p className={cn(
                      "text-sm",
                      item.is_read ? "text-gray-500 dark:text-gray-400" : "text-dark-5 dark:text-dark-6"
                    )}>
                      {item.message}
                    </p>
                    <span className={cn(
                      "block text-xs",
                      item.is_read ? "text-gray-400" : "text-gray-500"
                    )}>
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!item.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="absolute bottom-1 right-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark as Read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>

        {notifications.filter(n => !n.is_read).length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="w-full mt-3 text-sm"
          >
            Mark all as read
          </Button>
        )}
      </DropdownContent>
    </Dropdown>
  );
}
