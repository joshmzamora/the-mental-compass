
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, AlertCircle, Loader2, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { sendMessageToAI, ChatMessage } from "../services/aiService";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function AIChatSection() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const responseText = await sendMessageToAI(userMsg.text, messages);

            const aiMsg: ChatMessage = {
                text: responseText,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className="py-12 md:py-16 bg-transparent">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-teal-600 mr-2 md:mr-3" />
                        <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900">
                            Explore with AI
                        </h2>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
                        Have questions about other conditions or need guidance? Chat with our
                        Mental Compass AI assistant for supportive information.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <Bot className="h-5 w-5 text-teal-600" />
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                </div>

                <Card className="w-full border-2 border-teal-50 shadow-xl overflow-hidden bg-white">
                    {!user ? (
                        <div className="bg-gradient-to-r from-teal-500 to-blue-600 border-none shadow-xl p-6 md:p-8 text-center text-white">
                            <Bot className="h-12 w-12 md:h-16 md:w-16 text-white mx-auto mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold mb-3">
                                Chat with The Mental Compass AI
                            </h3>
                            <p className="text-teal-100 text-sm md:text-base mb-6 max-w-2xl mx-auto px-4">
                                Our advanced AI assistant is trained to help you navigate your mental health inquiries.
                                Log in to ask questions about disorders, get personalized guidance, and find resources tailored to your journey.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                                <Button asChild variant="secondary" size="lg">
                                    <Link to="/signup">
                                        Start Chatting
                                        <Sparkles className="h-5 w-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
                                    <Link to="/login">
                                        <LogIn className="h-5 w-5 mr-2" />
                                        Log In
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white/20">
                                        <AvatarImage src="/bot-avatar.png" />
                                        <AvatarFallback className="bg-teal-800 text-white">AI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg font-medium">
                                            Mental Compass Assistant
                                        </CardTitle>
                                        <CardDescription className="text-teal-100 text-xs flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            Online & Ready to Help
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0 flex flex-col h-[600px] max-h-[75vh]">
                                <div
                                    className="flex-1 overflow-y-auto p-4 bg-slate-50"
                                    ref={scrollRef}
                                >
                                    <div className="space-y-4">
                                        {messages.length === 0 && (
                                            <div className="text-center py-10 text-gray-400 text-sm">
                                                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>Start a conversation to get guidance.</p>
                                            </div>
                                        )}

                                        {messages.map((msg, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={index}
                                                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                                    }`}
                                            >
                                                <Avatar className="h-8 w-8 mt-1 border border-gray-200">
                                                    {msg.sender === "user" ? (
                                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                                            <User className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    ) : (
                                                        <AvatarFallback className="bg-teal-100 text-teal-700">
                                                            <Bot className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>

                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "user"
                                                        ? "bg-teal-600 text-white rounded-tr-none"
                                                        : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none"
                                                        }`}
                                                >
                                                    {msg.text}
                                                    <div className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-teal-100" : "text-gray-400"
                                                        }`}>
                                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Loading Indicator - Text Based */}
                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                <Avatar className="h-8 w-8 mt-1 border border-gray-200">
                                                    <AvatarFallback className="bg-teal-100 text-teal-700">
                                                        <Bot className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center">
                                                    <span className="text-gray-500 text-sm font-medium animate-pulse">
                                                        Thinking<span className="animate-[ping_1.5s_0.5s_infinite]">.</span><span className="animate-[ping_1.5s_1s_infinite]">.</span><span className="animate-[ping_1.5s_1.5s_infinite]">.</span>
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100 flex-none z-10">
                                    <div className="flex gap-2">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type your message here..."
                                            className="flex-1 focus-visible:ring-teal-600"
                                            disabled={isLoading}
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="bg-teal-600 hover:bg-teal-700 text-white"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Send</span>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2">
                                        Note: AI can make mistakes. For medical advice, please consult a professional.
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </section>
    );
}
