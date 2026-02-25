import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import openai from "@/lib/providers/openai";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("You should not access this route!", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
