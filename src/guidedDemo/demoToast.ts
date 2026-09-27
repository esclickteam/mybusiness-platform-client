import { toast, type ToastOptions } from "react-toastify";

/** Isolated from the default toast bus so automations keeps a single toast. */
export const DEMO_ACTION_TOAST_CONTAINER = "guided-demo-actions";

function withDemoContainer(options?: ToastOptions): ToastOptions {
  return { containerId: DEMO_ACTION_TOAST_CONTAINER, ...options };
}

export function demoToastSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, withDemoContainer(options));
}

export function demoToastError(message: string, options?: ToastOptions) {
  return toast.error(message, withDemoContainer(options));
}
