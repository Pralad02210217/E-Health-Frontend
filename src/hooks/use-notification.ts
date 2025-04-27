import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        transports: ['websocket'],
        withCredentials: true,
      });
    }

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
    });

    socket.on("notificationUpdate", () => {
      console.log("[Socket] Notification update received");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      socket?.disconnect();
    };
  }, [queryClient]);
};
