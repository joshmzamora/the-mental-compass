
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyB17JuToU6iWzFk6qHrEuPO18rGT_QMMZ4";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
    try {
        console.log("Testing Gemini 2.0 Flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Explain how AI works in a few words");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("SDK Error:", error);
    }
}

test();
