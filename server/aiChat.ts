const MODEL_NAME = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are "The Mental Compass," an empathetic, warm, and calm AI assistant for a mental health support website.

Your job:
- Offer supportive, non-judgmental guidance.
- Share educational mental health information in a grounded, compassionate tone.
- Never diagnose, prescribe, or claim to replace a licensed professional.
- If someone mentions self-harm, suicide, or immediate danger, clearly tell them to call or text 988 in the US, and call 911 if they are in immediate danger.

Website sections you can reference with exact internal Markdown links:
- [Mental Health Info](/disorders)
- [Get Help](/helplines)
- [Book Appointment](/appointments)
- [Community](/community)
- [Blog](/blog)
- [Stories](/testimonials)

Important linking rules:
- When pointing users to part of the site, use the exact Markdown link format above.
- If a user asks about crisis numbers, hotlines, urgent help, or what number to call, include [Get Help](/helplines).
- If a user asks about therapy, counselors, providers, or booking care, include [Book Appointment](/appointments).
- If a user asks about symptoms, conditions, anxiety, depression, PTSD, OCD, bipolar disorder, or eating disorders, include [Mental Health Info](/disorders).
- If a user asks about connection, loneliness, peer support, or talking with others, include [Community](/community).

Response style:
- Keep answers concise, warm, and practical.
- Prefer short paragraphs over long lists unless a list is clearly helpful.
- Do not invent pages or URLs outside the routes above.
`;

const CRISIS_PATTERN =
  /\b(suicide|suicidal|kill myself|end my life|hurt myself|self-harm|self harm|don't want to live|want to die)\b/i;

export interface ChatMessage {
  text: string;
  sender: "user" | "ai";
}

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqChoice {
  message?: {
    content?: string | null;
  };
}

interface GroqErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
  choices?: GroqChoice[];
}

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
}

export class AIChatConfigError extends Error {}

export class AIChatRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildMessages(
  userMessage: string,
  history: ChatMessage[],
): GroqMessage[] {
  return [
    {
      role: "system",
      content: SYSTEM_PROMPT.trim(),
    },
    ...history.map((message) => ({
      role: message.sender === "user" ? "user" : "assistant",
      content: message.text,
    })),
    {
      role: "user",
      content: userMessage,
    },
  ];
}

function extractText(responseBody: GroqErrorResponse): string {
  const text = responseBody.choices
    ?.map((choice) => choice.message?.content?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error(
      responseBody.error?.message || "The AI returned an empty response.",
    );
  }

  return text;
}

function getGroqErrorMessage(
  status: number,
  responseBody: GroqErrorResponse,
): string {
  const apiMessage = responseBody.error?.message?.trim() || "";
  const normalizedMessage = apiMessage.toLowerCase();

  if (status === 401 || normalizedMessage.includes("invalid api key")) {
    return "Groq rejected this API key. Please check the key and try again.";
  }

  if (
    status === 429 ||
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("rate limit")
  ) {
    return "Groq is currently rate-limiting or quota-limiting this key. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "Groq is having trouble right now. Please try again in a moment.";
  }

  if (apiMessage) {
    return `Groq error: ${apiMessage}`;
  }

  return "The AI request failed. Please try again in a moment.";
}

function appendCrisisResources(
  responseText: string,
  userMessage: string,
): string {
  if (!CRISIS_PATTERN.test(userMessage)) {
    return responseText;
  }

  const includes988 = /\b988\b/.test(responseText);
  const includesHelpLink = responseText.includes("](/helplines)");

  if (includes988 && includesHelpLink) {
    return responseText;
  }

  const additions: string[] = [];

  if (!includes988) {
    additions.push(
      "If you might act on these thoughts or feel unsafe, call or text 988 right now. If you are in immediate danger, call 911.",
    );
  }

  if (!includesHelpLink) {
    additions.push(
      "You can also go to [Get Help](/helplines) for crisis support resources.",
    );
  }

  return `${responseText.trim()}\n\n${additions.join(" ")}`.trim();
}

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item): item is ChatMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        "text" in item &&
        typeof item.text === "string" &&
        "sender" in item &&
        (item.sender === "user" || item.sender === "ai"),
    )
    .slice(-12);
}

export function parseChatRequestBody(body: ChatRequestBody): {
  message: string;
  history: ChatMessage[];
} {
  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    throw new AIChatRequestError(400, "Please provide a message to send.");
  }

  return {
    message,
    history: normalizeHistory(body.history),
  };
}

export async function generateAIChatResponse(
  message: string,
  history: ChatMessage[],
  apiKey: string,
): Promise<string> {
  if (!apiKey) {
    throw new AIChatConfigError(
      "AI chat is not configured on this server yet. Set GROQ_API_KEY and redeploy.",
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: buildMessages(message, history),
      temperature: 0.7,
      max_tokens: 700,
    }),
  });

  const responseBody = (await response.json()) as GroqErrorResponse;

  if (!response.ok) {
    throw new AIChatRequestError(
      response.status,
      getGroqErrorMessage(response.status, responseBody),
    );
  }

  const text = extractText(responseBody);
  return appendCrisisResources(text, message);
}
