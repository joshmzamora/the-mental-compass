const MISSING_API_KEY_MESSAGE =
  "AI chat is not configured on this server yet. Add GROQ_API_KEY to your local `.env.local` or your Vercel project settings, then restart or redeploy and try again.";

const MESSAGE_ERROR_TEXT =
  "The AI request failed. Please try again in a moment.";

export interface ChatMessage {
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatApiResponse {
  error?: string;
  text?: string;
}

export async function sendMessageToAI(
  userMessage: string,
  history: ChatMessage[] = [],
): Promise<string> {
  const response = await fetch("/api/ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
      history,
    }),
  });

  const responseBody = (await response.json()) as AIChatApiResponse;

  if (!response.ok) {
    throw new Error(responseBody.error || MESSAGE_ERROR_TEXT);
  }

  if (!responseBody.text) {
    throw new Error(MESSAGE_ERROR_TEXT);
  }

  return responseBody.text;
}

export { MISSING_API_KEY_MESSAGE };
