import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import openai from "@/lib/openai";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response("Messages array is required", { status: 400 });
  }

  const userName = session.user.name || "User";

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
