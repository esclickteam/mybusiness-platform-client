import { useEffect, useRef } from "react";
import { useAuth } from "../../../../context/AuthContext";
import type { PublicWhatsAppMessage, PublicWhatsAppThread } from "./whatsAppWebMessages";

type SocketLike = {
  connected?: boolean;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
};

type Handlers = {
  onMessage?: (payload: {
    message?: PublicWhatsAppMessage;
    thread?: PublicWhatsAppThread | null;
    adminCustomerId?: string | null;
  }) => void;
  onStatus?: (payload: {
    id?: string;
    providerMessageId?: string;
    status?: string;
    error?: string;
    thread?: PublicWhatsAppThread | null;
    adminCustomerId?: string | null;
  }) => void;
  onThread?: (payload: {
    thread?: PublicWhatsAppThread | null;
    adminCustomerId?: string | null;
  }) => void;
  onReconnect?: () => void;
};

export function useAdminCrmWhatsAppRealtime(handlers: Handlers) {
  const { socket } = useAuth() as { socket: SocketLike | null };
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!socket) return;

    const join = () => {
      socket.emit("joinRoom", "admin-crm");
    };

    const onMessage = (payload: any) => handlersRef.current.onMessage?.(payload);
    const onStatus = (payload: any) => handlersRef.current.onStatus?.(payload);
    const onThread = (payload: any) => handlersRef.current.onThread?.(payload);
    const onConnect = () => {
      join();
      handlersRef.current.onReconnect?.();
    };

    if (socket.connected) join();
    socket.on("connect", onConnect);
    socket.on("adminCrm:whatsapp_message", onMessage);
    socket.on("adminCrm:whatsapp_status", onStatus);
    socket.on("adminCrm:whatsapp_thread", onThread);

    return () => {
      socket.off("connect", onConnect);
      socket.off("adminCrm:whatsapp_message", onMessage);
      socket.off("adminCrm:whatsapp_status", onStatus);
      socket.off("adminCrm:whatsapp_thread", onThread);
    };
  }, [socket]);
}
