"use client";

// Re-export the app's toast hook under the shadcn-style "sonner" import path
// so consuming components can `import { useToast } from "@/components/ui/sonner"`.
export { useToast, ToastProvider } from "@/context/ToastContext";
