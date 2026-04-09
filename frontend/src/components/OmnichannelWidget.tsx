"use client"

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, Phone, MessageSquare, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export const OmnichannelWidget = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! 👋 Welcome to PrimeOne Space! I'm here to help you learn about our spaces, pricing, amenities, and booking process. How can I assist you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isChatOpen) {
            inputRef.current?.focus();
        }
    }, [isChatOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to get response");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, data.message]);
        } catch (error: any) {
            console.error("Chat error:", error);
            toast.error(error.message || "Failed to send message. Please try again.");
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at /contact. 😊",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const contactOptions = [
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: <FaWhatsapp className="w-5 h-5" />,
            color: 'bg-[#25D366]',
            href: 'https://wa.me/94772228507',
        },
        {
            id: 'phone',
            name: 'Call Us',
            icon: <Phone className="w-5 h-5" />,
            color: 'bg-blue-500',
            href: 'tel:+94772228507',
        },
        {
            id: 'ai-chat',
            name: 'AI Assistant',
            icon: <Bot className="w-5 h-5" />,
            color: 'bg-primary',
            onClick: () => {
                setIsChatOpen(true);
                setIsMenuOpen(false);
            },
        },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">

            {/* Contact Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        className="flex flex-col items-end gap-3 mb-2"
                    >
                        {contactOptions.map((option) => (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    {option.name}
                                </div>
                                {option.href ? (
                                    <a
                                        href={option.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${option.color} h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all outline-none border-2 border-white dark:border-zinc-800`}
                                    >
                                        {option.icon}
                                    </a>
                                ) : (
                                    <button
                                        onClick={option.onClick}
                                        className={`${option.color} h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all outline-none border-2 border-white dark:border-zinc-800`}
                                    >
                                        {option.icon}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Trigger Button */}
            <motion.button
                onClick={() => {
                    if (isChatOpen) {
                        setIsChatOpen(false);
                    } else {
                        setIsMenuOpen(!isMenuOpen);
                    }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`h-14 w-14 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 border-2 border-white dark:border-zinc-800 relative z-[110] ${isMenuOpen || isChatOpen ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rotate-180' : 'bg-primary text-white'
                    }`}
            >
                {isMenuOpen || isChatOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}

                {/* Pulsing notification dot */}
                {!isMenuOpen && !isChatOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white dark:border-zinc-900"></span>
                    </span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed bottom-24 right-6 w-[calc(100vw-48px)] sm:w-[380px] h-[600px] max-h-[calc(100vh-120px)] shadow-2xl z-[105] flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950"
                    >
                        {/* Header */}
                        <div className="bg-primary text-white p-5 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold tracking-tight">PrimeOne Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <p className="text-[10px] uppercase font-heavy tracking-widest opacity-80">AI Agent Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronUp className="w-5 h-5 rotate-180" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                            {messages.map((message, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={index}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === "user"
                                            ? "bg-primary text-white rounded-br-none"
                                            : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-none"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex gap-2 bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Tell me about memberships..."
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none disabled:opacity-50 text-zinc-800 dark:text-zinc-200"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className="rounded-xl h-9 w-9 flex-shrink-0 shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between mt-3 px-1">
                                <p className="text-[10px] text-zinc-400 font-mono tracking-tighter uppercase">
                                    Powered by PrimeOne AI
                                </p>
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse [animation-delay:200ms]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse [animation-delay:400ms]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @media (max-width: 640px) {
          .chat-fullscreen {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            max-height: 100vh !important;
          }
        }
      `}</style>
        </div>
    );
};
