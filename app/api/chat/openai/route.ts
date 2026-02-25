import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import openai from "@/lib/providers/openai";
import { AllModels, ModelProviders } from "@/lib/providers";
import BotIcon from "@/components/bot-icon";
import { ChatRequest } from "@/lib/chat";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, model, provider }: ChatRequest = await request.json();

  console.log(model, provider);

  if (!messages || !Array.isArray(messages)) {
    return new Response("Messages array is required", { status: 400 });
  }

  const userName = session.user.name || "User";

  const stream = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system" as const,
        content: `The user's name is ${userName}. Greet them by name when appropriate.`,
      },
      ...messages,
    ],
    stream: true,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
