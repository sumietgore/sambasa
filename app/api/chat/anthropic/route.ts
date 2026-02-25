import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import anthropic from "@/lib/providers/anthropic";
import { ChatRequest } from "@/lib/chat";

export async function POST(request: Request) {
  console.log("asd");
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

  const stream = anthropic.messages.stream({
    model: model,
    max_tokens: 1024,
    system: `The user's name is ${userName}. Greet them by name when appropriate.`,
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
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
