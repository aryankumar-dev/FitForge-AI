"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import ChatBubble from "@/components/ChatBubble";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

function ChatContent() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI fitness coach. Ask me anything about workouts, diet, or recovery.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/users/chat", { message: text });
      const reply =
        res.data?.reply || res.data?.message || (typeof res.data === "string" ? res.data : JSON.stringify(res.data));
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      toast({
        title: "Message failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground">Chat with your AI health &amp; fitness coach.</p>
      </div>
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-base">FitForge Coach</CardTitle>
          <CardDescription>Online</CardDescription>
        </CardHeader>
        <CardContent
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto py-6"
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}
        </CardContent>
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-4">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <RequireAuth allowedRoles={["user"]}>
      <ChatContent />
    </RequireAuth>
  );
}
