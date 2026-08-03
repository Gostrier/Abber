import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Loader2,
} from "lucide-react";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const SYSTEM_PROMPT =
  "You are AbberAI, the AI assistant of Abber, an African startup innovation platform. " +
  "You help founders validate ideas, find mentors and funding, build MVPs, and grow ventures. " +
  "Be concise, practical, and encouraging. Format lists with simple bullet points.";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm AbberAI — powered by Google Gemini. I can help you validate ideas, refine strategies, find funding opportunities, and more. What would you like to explore?",
  },
];

const quickPrompts = [
  "Help me validate my business idea",
  "How do I find co-founders?",
  "What grants are available?",
  "How do I build an MVP?",
];

const callGemini = async (history: Message[]) => {
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("The model returned an empty response.");
  }

  return text.trim();
};

const AbberAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    if (!GEMINI_API_KEY) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "AbberAI isn't configured yet. The developer needs to add the Gemini API key to the environment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
      setInput("");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);

    try {
      const reply = await callGemini(nextMessages);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Something went wrong.");
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I couldn't reach Gemini: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-2xl transition-all hover:scale-110 hover:shadow-blue-500/30"
      >
        {open ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] rounded-3xl border border-white/20 bg-slate-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AbberAI</h3>
                <p className="text-sm text-blue-200">Powered by Google Gemini</p>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-base leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-tr-sm"
                        : "bg-white/10 text-blue-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-white/10 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-blue-400" />
                      <span className="text-sm text-blue-200">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="mt-4">
                  <p className="text-xs text-blue-300 mb-3 font-medium uppercase tracking-wider">
                    Quick Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          setInput(prompt);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-base text-blue-200 transition-all hover:bg-white/20 hover:text-white"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <div className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/5 px-6 py-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your startup idea..."
                  className="flex-1 bg-transparent text-center text-lg text-white placeholder-blue-300 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || typing}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white transition-all hover:opacity-90 disabled:opacity-40"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AbberAI;
