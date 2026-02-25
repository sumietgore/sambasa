import { ModelProviders } from "@/lib/providers";
import { Claude, OpenAI } from "@lobehub/icons";
import { Bot } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface BotIconProps {
  provider: ModelProviders;
  className?: string;
}

export default function BotIcon(props: BotIconProps) {
  const { provider, className } = props;
  if (provider === "anthropic") {
    return <Claude className={twMerge("w-4 h-4 fill-[#D97757]", className)} />;
  } else if (provider === "openai") {
    return <OpenAI className={twMerge("w-4 h-4", className)} />;
  } else {
    return <Bot className={twMerge("w-4 h-4", className)} />;
  }
}
