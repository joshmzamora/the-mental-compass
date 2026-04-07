const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const BUILD_DIR = path.join(__dirname, "build");

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

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".manifest": "application/manifest+json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function buildMessages(userMessage, history) {
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

function extractText(responseBody) {
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

function getGroqErrorMessage(status, responseBody) {
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

function appendCrisisResources(responseText, userMessage) {
  if (!CRISIS_PATTERN.test(userMessage)) {
    return responseText;
  }

  const includes988 = /\b988\b/.test(responseText);
  const includesHelpLink = responseText.includes("](/helplines)");

  if (includes988 && includesHelpLink) {
    return responseText;
  }

  const additions = [];

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

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.text === "string" &&
        (item.sender === "user" || item.sender === "ai"),
    )
    .slice(-12)
    .map((item) => ({
      text: item.text,
      sender: item.sender,
    }));
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

async function handleAIChat(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = normalizeHistory(body.history);

    if (!message) {
      sendJson(res, 400, { error: "Please provide a message to send." });
      return;
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";

    if (!apiKey) {
      sendJson(res, 503, {
        error:
          "AI chat is not configured on this server yet. Set GROQ_API_KEY and redeploy.",
      });
      return;
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

    const responseBody = await response.json();

    if (!response.ok) {
      sendJson(res, response.status, {
        error: getGroqErrorMessage(response.status, responseBody),
      });
      return;
    }

    const text = appendCrisisResources(extractText(responseBody), message);
    sendJson(res, 200, { text });
  } catch (error) {
    console.error("Render AI chat API failed", error);
    sendJson(res, 500, {
      error: "The AI request failed. Please try again in a moment.",
    });
  }
}

function getSafeFilePath(urlPath) {
  const normalizedPath = decodeURIComponent(urlPath.split("?")[0]);
  const relativePath =
    normalizedPath === "/" ? "/index.html" : normalizedPath;
  const resolvedPath = path.normalize(path.join(BUILD_DIR, relativePath));

  if (!resolvedPath.startsWith(BUILD_DIR)) {
    return null;
  }

  return resolvedPath;
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      const indexPath = path.join(BUILD_DIR, "index.html");

      fs.readFile(indexPath, (indexError, indexBuffer) => {
        if (indexError) {
          sendJson(res, 500, { error: "Build output is missing." });
          return;
        }

        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        res.end(indexBuffer);
      });

      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    });
    res.end(fileBuffer);
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Invalid request." });
    return;
  }

  if (req.url.startsWith("/api/ai-chat")) {
    void handleAIChat(req, res);
    return;
  }

  const filePath = getSafeFilePath(req.url);

  if (!filePath) {
    sendJson(res, 403, { error: "Forbidden." });
    return;
  }

  serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`Mental Compass server listening on port ${PORT}`);
});
