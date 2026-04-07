import {
  AIChatConfigError,
  AIChatRequestError,
  generateAIChatResponse,
  parseChatRequestBody,
} from "../server/aiChat";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { message, history } = parseChatRequestBody(req.body ?? {});
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
    const text = await generateAIChatResponse(message, history, apiKey);

    return res.status(200).json({ text });
  } catch (error) {
    if (error instanceof AIChatRequestError) {
      return res.status(error.status).json({ error: error.message });
    }

    if (error instanceof AIChatConfigError) {
      return res.status(503).json({ error: error.message });
    }

    console.error("AI chat API failed", error);
    return res
      .status(500)
      .json({ error: "The AI request failed. Please try again in a moment." });
  }
}
