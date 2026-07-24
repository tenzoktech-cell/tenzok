"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleCheck, CircleX } from "lucide-react";

interface Toast {
  id: number;
  kind: "success" | "error";
  text: string;
}

const ToastContext = createContext<(kind: Toast["kind"], text: string) => void>(
  () => {},
);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex flex-col items-center gap-3 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`fade-up pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-ink shadow-2xl shadow-black/50 backdrop-blur-xl ${
              toast.kind === "success"
                ? "border-cool/30 bg-surface-overlay/95"
                : "border-red-400/30 bg-surface-overlay/95"
            }`}
          >
            {toast.kind === "success" ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cool/10 text-cool">
                <CircleCheck size={16} />
              </span>
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <CircleX size={16} />
              </span>
            )}
            <span className="leading-5">{toast.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
