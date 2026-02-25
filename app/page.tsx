"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Square, User, Loader2, ArrowUp } from "lucide-react";
import { ModelProviders, AllModels } from "@/lib/providers";
import ModelSelector from "@/components/model-selector";
import { ChatMessage } from "@/lib/chat";
import BotIcon from "@/components/bot-icon";
import Messages from "@/components/messages";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<ModelProviders>("openai");
  const [model, setModel] = useState<AllModels>("gpt-4.1-mini");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    console.log(model, provider);
  }, [model, provider]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log(messages);
  }, [messages]);

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user)
    return <p className="text-center mt-8 text-white">Redirecting...</p>;

  const { user } = session;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch(`/api/chat/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          model: model,
          provider: provider,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantContent += text;
        const current = assistantContent;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: current },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="w-full flex flex-1 flex-col h-full items-center mx-auto">
          {/* Header */}
          <header className="flex sticky bg-background top-0 w-full items-center justify-between px-4 py-3 border-b border-white/10">
            <h1 className="text-lg font-bold text-white">Sambasa Chat</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </header>

          {/* Messages */}
          <Messages
            messages={messages}
            provider={provider}
            messagesEndRef={messagesEndRef}
          />
        </div>
        <div className="sticky bottom-0 w-full flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="min-w-3xl bg-secondary rounded-2xl mb-4"
          >
            <div className="w-full flex flex-1 flex-col gap-3 px-5 py-4">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  messages.length > 0 ? "Reply..." : "How can I help you today?"
                }
                // type="text"
                disabled={isStreaming}
                className="flex-1 focus:outline-none field-sizing-content overflow-y-auto max-h-96 resize-none"
              />
              <div className="w-full flex justify-end gap-3">
                <ModelSelector
                  model={model}
                  setModel={setModel}
                  provider={provider}
                  setProvider={setProvider}
                  isStreaming={isStreaming}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  disabled={isStreaming || !input.trim()}
                  className="rounded-full"
                >
                  {isStreaming ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
