import { useState, useCallback } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement;

interface ToasterToast extends ToastProps {
  id: string;
  open: boolean;
}

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

const listeners: Array<(toasts: ToasterToast[]) => void> = [];
let memoryToasts: ToasterToast[] = [];

function dispatch(toasts: ToasterToast[]) {
  memoryToasts = toasts;
  listeners.forEach((listener) => listener(toasts));
}

export function toast({ title, description, variant = "default" }: ToastProps) {
  const id = genId();
  const newToast: ToasterToast = {
    id,
    title,
    description,
    variant,
    open: true,
  };

  const updatedToasts = [newToast, ...memoryToasts];
  dispatch(updatedToasts);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    const filtered = memoryToasts.filter((t) => t.id !== id);
    dispatch(filtered);
  }, 5000);

  return {
    id,
    dismiss: () => {
      const filtered = memoryToasts.filter((t) => t.id !== id);
      dispatch(filtered);
    },
    update: (props: Partial<ToastProps>) => {
      const updated = memoryToasts.map((t) =>
        t.id === id ? { ...t, ...props } : t
      );
      dispatch(updated);
    },
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>(memoryToasts);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      const filtered = memoryToasts.filter((t) => t.id !== toastId);
      dispatch(filtered);
    } else {
      dispatch([]);
    }
  }, []);

  // Subscribe to toast updates
  useState(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  return {
    toasts,
    toast,
    dismiss,
  };
}
