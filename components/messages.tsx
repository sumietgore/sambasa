import BotIcon from "@/components/bot-icon";
import { User, Loader2, Copy } from "lucide-react";
import { ModelProviders } from "@/lib/providers";
import { ChatMessage } from "@/lib/chat";
import { RefObject } from "react";
import { Button } from "@/components/ui/button";

interface MessagesProps {
  messages: ChatMessage[];
  provider: ModelProviders;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function Messages({
  messages,
  provider,
  messagesEndRef,
}: MessagesProps) {
  return (
    <div className="flex-1 flex flex-col max-w-3xl gap-4 px-4 py-6 space-y-4">
      {messages.length === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center h-full text-white/50">
          <BotIcon provider={provider} className="w-12 h-12 mb-3" />
          {/*<Bot className="w-12 h-12 mb-3" />*/}
          <p className="text-lg">How can I help you today?</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex gap-1 group ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <BotIcon provider={provider} className="w-4 h-4" />
              {/*<Bot className="w-4 h-4" />*/}
            </div>
          )}
          <div
            className={`max-w-[75%] flex flex-col gap-2 rounded-lg px-4 py-2 whitespace-pre-wrap ${
              msg.role === "user" ? "bg-muted text-primary" : "text-primary"
            }`}
          >
            {msg.content || <Loader2 className="w-4 h-4 animate-spin" />}
            {msg.role === "assistant" && (
              <div className="flex flex-1 gap-2 invisible group-hover:visible">
                <Button variant="ghost">
                  <Copy className="w-3 h-3 stroke-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
          {/*{msg.role === "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          )}*/}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
