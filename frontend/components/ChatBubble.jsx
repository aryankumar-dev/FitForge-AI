"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={isUser ? "bubble-user" : "bubble-ai"}>
        <p className="whitespace-pre-wrap text-sm">{text}</p>
      </div>
    </div>
  );
}
