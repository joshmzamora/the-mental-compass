
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyB17JuToU6iWzFk6qHrEuPO18rGT_QMMZ4";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt with persona and website context
const SYSTEM_PROMPT = `
You are "The Mental Compass," an empathetic, warm, and professional AI mental health assistant.
Your goal is to guide users on their mental health journey using the metaphor of a compass (finding direction, bearing, navigating rough waters).

WEBSITE CONTEXT:
You are embedded in "The Mental Compass" website, which offers:
1. Disorders Info: Detailed guides on Anxiety, Depression, Bipolar, PTSD, OCD, and Eating Disorders.
2. Helplines: Immediate crisis support and national resources (Crisis Text Line, 988, etc.).
3. Appointments: A directory to book sessions with licensed "Navigators" (therapists).
4. Community: Support groups, forums, and chat rooms to connect with peers.
5. Blog: Educational articles, coping strategies, and success stories.

YOUR INSTRUCTIONS:
- Tone: Compassionate, non-judgmental, calming, and hopeful. Use navigational metaphors naturally.
- Content: Provide supportive information, coping strategies, and listening.
- CRITICAL: You are NOT a doctor or therapist. DO NOT diagnose or prescribe.
- Referrals: actively suggest relevant parts of the website (e.g., "You might find our Community section helpful," or "Our Disorders page has more details on this").
- Crisis: If a user mentions self-harm or suicide, IMMEDIATELY provide the 988 Suicide & Crisis Lifeline and encourage seeking urgent help.

If you cannot access external information, use your internal knowledge to provide the best possible support within these constraints.
`;

export interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

/**
 * Sends a message to the AI and gets a response.
 * Uses Gemini API primarily, with a silent fallback to simulated responses.
 */
export async function sendMessageToAI(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    try {
        // 1. Try Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct chat history for the API
        // Note: Gemini 'chat' format requires specific structure. For simplicity in a single-turn or simple accumulation,
        // we can prepend the system prompt and history to the user message or use the chat session.
        // Let's use a simple prompt construction for robustness.

        let fullPrompt = `${SYSTEM_PROMPT}\n\nExisting Conversation:\n`;

        history.forEach(msg => {
            fullPrompt += `${msg.sender === 'user' ? 'User' : 'The Mental Compass'}: ${msg.text}\n`;
        });

        fullPrompt += `\nUser: ${userMessage}\nThe Mental Compass:`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        if (text) return text;
        throw new Error("Empty response from AI");

    } catch (error) {
        console.warn("AI Service Error (falling back to mock):", error);
        // 2. Fallback Mock Response
        return await getMockResponse(userMessage);
    }
}

/**
 * Simulates an AI response if the API fails or is unavailable.
 */
async function getMockResponse(message: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMsg = message.toLowerCase();

    // Crisis Check
    if (lowerMsg.includes("suicide") || lowerMsg.includes("kill myself") || lowerMsg.includes("die") || lowerMsg.includes("hurt myself")) {
        return "I hear that you're in a lot of pain right now. Please, your life matters. If you are in immediate danger, please call 911 or go to the nearest emergency room. You can also call or text 988 to reach the Suicide & Crisis Lifeline anytime. We have a 'Get Help' page in the menu with more crisis resources. You don't have to navigate this darkness alone.";
    }

    // Topic-based responses
    if (lowerMsg.includes("anxiety") || lowerMsg.includes("worry") || lowerMsg.includes("panic")) {
        return "Anxiety can feel like a storm that never ends. It's completely valid to feel this way. Have you checked our 'Mental Health Info' section? We have specific guides on Anxiety Disorders that might offer some clarity. In the meantime, taking slow, deep breaths can sometimes help steady your internal compass.";
    }

    if (lowerMsg.includes("depression") || lowerMsg.includes("sad") || lowerMsg.includes("hopeless")) {
        return "I'm sorry you're feeling this weight. Depression can make the journey feel impossible, but even small steps count. specialized 'Navigators' (therapists) in our Appointments section can walk with you. You might also find comfort in our Community stories from others who have found their way through similar fog.";
    }

    if (lowerMsg.includes("lonely") || lowerMsg.includes("alone")) {
        return "Loneliness is a heavy burden to carry. Please know that Connection is one of our cardinal directions for a reason. Our Community page serves to bring people together so no one has to travel alone. Would you be open to exploring the forums there?";
    }

    if (lowerMsg.includes("thank")) {
        return "You're very welcome. I'm here to help you find your bearing whenever you need. Take care.";
    }

    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        return "Hello! I am The Mental Compass assistant. I'm here to help guide you to resources, listen to your concerns, or just chat. How is your journey going today?";
    }

    // Generic fallback - indicate this is a mock response if we want transparency, or keep it generic
    if (lowerMsg.includes("sleep") || lowerMsg.includes("insomnia") || lowerMsg.includes("tired")) {
        return "Sleep struggles can be exhausting. Creating a routine and limiting screen time might help, but persistent issues deserve professional attention. Our Blog has tips on 'Sleep Hygiene' that might offer some relief.";
    }

    if (lowerMsg.includes("stress") || lowerMsg.includes("overwhelmed") || lowerMsg.includes("pressure")) {
        return "It sounds like you're carrying a heavy load. Remember, you don't have to carry it all at once. Breaking things down into smaller steps can help. We also have stress management resources in our Community section.";
    }

    if (lowerMsg.includes("eat") || lowerMsg.includes("food") || lowerMsg.includes("appetite")) {
        return "Our relationship with food can be complex. If you're struggling, please know you aren't alone. We have resources specifically for Eating Disorders on our 'Mental Health Info' page that provide compassionate guidance.";
    }

    if (lowerMsg.includes("ptsd") || lowerMsg.includes("trauma") || lowerMsg.includes("flashback")) {
        return "Trauma leaves deep imprints, but healing is possible. You are safe here. Our 'Mental Health Info' section has a dedicated guide on PTSD, and our Appointments page can connect you with trauma-informed specialists.";
    }

    if (lowerMsg.includes("bipolar") || lowerMsg.includes("mood") || lowerMsg.includes("swing")) {
        return "Navigating the highs and lows of Bipolar Disorder is challenging. Stability is a journey. Our resources on Bipolar Disorder might help you map out strategies, and connecting with a therapist is often a vital part of that path.";
    }

    if (lowerMsg.includes("ocd") || lowerMsg.includes("obsession") || lowerMsg.includes("compulsion")) {
        return "OCD can feel like a loop you can't exit. But there are ways to break the cycle. Exposure and Response Prevention (ERP) is a common treatment—our provider directory lists specialists who can guide you through this.";
    }

    if (lowerMsg.includes("therapist") || lowerMsg.includes("doctor") || lowerMsg.includes("counseling")) {
        return "Finding the right guide is a great step. Our 'Appointments' page allows you to browse licensed professionals by specialty. You deserve someone who understands your unique map.";
    }

    if (lowerMsg.includes("helpline") || lowerMsg.includes("number") || lowerMsg.includes("call")) {
        return "If you need immediate support, please check our 'Helplines' page for a list of crisis numbers. You can always call or text 988 for the Suicide & Crisis Lifeline in the US.";
    }

    if (lowerMsg.includes("friend") || lowerMsg.includes("family") || lowerMsg.includes("relationship")) {
        return "Relationships are a huge part of our mental landscape. Setting boundaries and communicating needs are skills we can learn. Our Blog often covers navigating these waters.";
    }

    if (lowerMsg.includes("work") || lowerMsg.includes("job") || lowerMsg.includes("career")) {
        return "Workplace stress is very real. It's okay to prioritize your well-being over productivity. Taking small breaks to recalibrate your compass can make a difference.";
    }

    if (lowerMsg.includes("medicine") || lowerMsg.includes("medication") || lowerMsg.includes("pill")) {
        return "I cannot provide medical advice about medications. It's best to discuss this with a psychiatrist or your primary care provider. They can help you navigate the right treatment plan.";
    }

    if (lowerMsg.includes("cost") || lowerMsg.includes("price") || lowerMsg.includes("insurance")) {
        return "Mental health care should be accessible. Many of our listed providers accept insurance or offer sliding scale fees. You can filter for this in our Appointments section.";
    }

    const fallbacks = [
        "I hear you, and it takes courage to share that. I'm here to help navigate you to resources—would you like to explore our Disorders guide or perhaps find a therapist?",
        "Thank you for sharing your thoughts. Mental wellness is a journey, and you don't have to walk it alone. How can I best support you right now?",
        "I'm listening. Sometimes just getting things off your chest helps clear the fog. Is there a specific resource on our site I can help you find?",
        "Your feelings are valid. I'm a compass here to point you toward support like our Community forums or professional help. Where would you like to go next?",
        "That sounds important. Remember, 'The Mental Compass' is designed to help you find your bearing. Check out our Blog for articles that might resonate with what you're going through."
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
