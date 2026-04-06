import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bot,
  Loader2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { ChatMessage, sendMessageToAI } from "../services/aiService";

const STARTER_PROMPTS = [
  "What numbers can I call if I need help?",
  "What are some coping strategies for anxiety?",
  "How can I find a therapist here?",
];

const MESSAGE_ERROR_TEXT =
  "I'm having trouble reaching the AI assistant right now. Please try again in a moment. If you need immediate support, visit [Get Help](/helplines) or call/text 988.";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInlineContent(
  text: string,
  linkClassName: string,
  onLinkClick?: () => void,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, label, href] = match;
    const key = `${href}-${match.index}`;

    if (href.startsWith("/")) {
      nodes.push(
        <Link
          key={key}
          to={href}
          className={linkClassName}
          onClick={onLinkClick}
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          onClick={onLinkClick}
        >
          {label}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMessageText(
  text: string,
  sender: ChatMessage["sender"],
  onLinkClick?: () => void,
) {
  const linkClassName =
    sender === "user"
      ? "font-medium underline underline-offset-4 text-white/95 hover:text-white"
      : "font-medium underline underline-offset-4 text-teal-700 hover:text-teal-900";

  const lines = text.split("\n");

  return (
    <div className="space-y-2 break-words">
      {lines.map((line, index) =>
        line ? (
          <p key={`${sender}-${index}`}>
            {renderInlineContent(line, linkClassName, onLinkClick)}
          </p>
        ) : (
          <div key={`${sender}-${index}`} className="h-2" />
        ),
      )}
    </div>
  );
}

export function AIChatSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  const handleSend = async (messageOverride?: string) => {
    const messageText = (messageOverride ?? input).trim();

    if (!messageText || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAI(userMessage.text, messages);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text: responseText,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text: MESSAGE_ERROR_TEXT,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleMessageLinkClick = () => {
    setIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              x: 42,
              y: 18,
              scale: 0.82,
              scaleY: 0.9,
              rotateY: -10,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              scaleY: 1,
              rotateY: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 28,
                mass: 0.9,
              },
            }}
            exit={{
              x: 18,
              y: 8,
              scale: 0.96,
              scaleY: 0.97,
              rotateY: -4,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            className="fixed"
            style={{
              zIndex: 2147483647,
              transformOrigin: "bottom right",
              perspective: 1600,
              right: "1rem",
              bottom: "6rem",
              width: "min(22rem, calc(100vw - 2rem))",
              height: "min(76vh, 42rem)",
            }}
            role="dialog"
            aria-label="Mental Compass AI chat"
          >
            <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden border-2 border-teal-50 bg-white shadow-2xl">
              <CardHeader
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-none px-4 py-4 text-white"
                style={{
                  background:
                    "linear-gradient(90deg, rgb(20 184 166) 0%, rgb(6 182 212) 50%, rgb(59 130 246) 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-teal-800 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-medium">
                      Mental Compass Assistant
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs text-teal-100">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      Online & Ready to Help
                    </CardDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Minimize chat</span>
                </Button>
              </CardHeader>

              <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
                <div
                  ref={scrollRef}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4"
                >
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="py-10 text-center text-sm text-gray-500">
                        <Bot className="mx-auto mb-3 h-9 w-9 text-teal-300" />
                        <p className="mx-auto max-w-xs leading-relaxed">
                          Ask about support options, coping strategies, or where to
                          find help on the site.
                        </p>
                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                          {STARTER_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => {
                                setInput(prompt);
                                inputRef.current?.focus();
                              }}
                              className="rounded-full border border-teal-200 bg-white px-3 py-2 text-xs text-teal-700 transition-colors hover:border-teal-400 hover:bg-teal-50"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <motion.div
                        key={`${message.sender}-${message.timestamp.getTime()}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <Avatar className="mt-1 h-8 w-8 border border-gray-200">
                          {message.sender === "user" ? (
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
                          className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            message.sender === "user"
                              ? "rounded-tr-none bg-teal-600 text-white"
                              : "rounded-tl-none border border-gray-100 bg-white text-gray-800"
                          }`}
                        >
                          {renderMessageText(
                            message.text,
                            message.sender,
                            handleMessageLinkClick,
                          )}
                          <div
                            className={`mt-2 text-[10px] ${
                              message.sender === "user"
                                ? "text-teal-100"
                                : "text-gray-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <Avatar className="mt-1 h-8 w-8 border border-gray-200">
                          <AvatarFallback className="bg-teal-100 text-teal-700">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center rounded-2xl rounded-tl-none border border-gray-100 bg-white px-4 py-3 shadow-sm">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-600" />
                          <span className="text-sm font-medium text-gray-500">
                            Thinking...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-white p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here..."
                      className="flex-1 focus-visible:ring-teal-600"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Note: AI can make mistakes. For medical advice, please consult a
                    professional.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.76, x: 24, y: 18 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 24, delay: 0.08 }}
        className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6"
        style={{ zIndex: 2147483647, transformOrigin: "bottom right" }}
      >
        <Button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="h-14 rounded-full px-5 text-white shadow-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgb(20 184 166) 0%, rgb(6 182 212) 50%, rgb(59 130 246) 100%)",
          }}
        >
          {isOpen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
          <span>AI Chat</span>
          {!isOpen && <Sparkles className="h-4 w-4" />}
        </Button>
      </motion.div>
    </>,
    document.body,
  );
}
