"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default" }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => dismiss(id), 4000);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-lg bg-card text-card-foreground animate-in slide-in-from-bottom-2",
              t.variant === "destructive" && "border-destructive/50 bg-destructive text-destructive-foreground",
              t.variant === "success" && "border-success/50"
            )}
          >
            {t.variant === "destructive" ? (
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
            ) : t.variant === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-success" />
            ) : (
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              {t.title && <p className="font-medium text-sm">{t.title}</p>}
              {t.description && (
                <p className="text-sm opacity-90 mt-0.5">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
