import { useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

type SocketLike = {
  connected?: boolean;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
};

type Handlers = {
  onQueued?: (data: any) => void;
  onStarted?: (data: any) => void;
  onProgress?: (data: any) => void;
  onFinished?: (data: any) => void;
  onError?: (data: any) => void;
  onWorkerStatus?: (data: any) => void;
};

export function useGlobalPartnersRealtime(handlers: Handlers) {
  const { socket } = useAuth() as { socket: SocketLike | null };
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!socket) return;

    const join = () => {
      socket.emit("joinRoom", "global-partners");
    };

    const onQueued = (payload: any) => handlersRef.current.onQueued?.(payload);
    const onStarted = (payload: any) => handlersRef.current.onStarted?.(payload);
    const onProgress = (payload: any) => handlersRef.current.onProgress?.(payload);
    const onFinished = (payload: any) => handlersRef.current.onFinished?.(payload);
    const onError = (payload: any) => handlersRef.current.onError?.(payload);
    const onWorker = (payload: any) => handlersRef.current.onWorkerStatus?.(payload);
    const onConnect = () => join();

    // Re-join after disconnect/reconnect so Owner dashboard stays live without refresh.
    if (socket.connected) join();
    socket.on("connect", onConnect);
    socket.on("reconnect", onConnect);
    socket.on("gp:scan_queued", onQueued);
    socket.on("gp:scan_started", onStarted);
    socket.on("gp:scan_progress", onProgress);
    socket.on("gp:scan_finished", onFinished);
    socket.on("gp:scan_error", onError);
    socket.on("gp:worker_status", onWorker);

    return () => {
      socket.off("connect", onConnect);
      socket.off("reconnect", onConnect);
      socket.off("gp:scan_queued", onQueued);
      socket.off("gp:scan_started", onStarted);
      socket.off("gp:scan_progress", onProgress);
      socket.off("gp:scan_finished", onFinished);
      socket.off("gp:scan_error", onError);
      socket.off("gp:worker_status", onWorker);
    };
  }, [socket]);
}
