const API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";

async function test() {
  try {
    if (!API_KEY) {
      throw new Error("Set GROQ_API_KEY or VITE_GROQ_API_KEY before running this script.");
    }

    console.log("Testing Groq chat completions...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a concise assistant.",
          },
          {
            role: "user",
            content: "Explain how AI works in a few words.",
          },
        ],
        temperature: 0.2,
        max_tokens: 40,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error:", data);
      return;
    }

    console.log("Success:", data.choices?.[0]?.message?.content ?? "No response text");
  } catch (error) {
    console.error("Request Error:", error);
  }
}

test();
