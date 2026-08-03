import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Loader2,
  KeyRound,
  ExternalLink,
  Trash2,
} from "lucide-react";

const GEMINI_MODEL = "gemini-2.5-flash";
const KEY_STORAGE = "abber_gemini_api_key";
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

const getStoredKey = () => {
  try {
    return localStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

const saveKey = (key: string) => {
  try {
    if (key) {
      localStorage.setItem(KEY_STORAGE, key);
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }
  } catch {
    // storage unavailable
  }
};

const callGemini = async (history: Message[], apiKey: string) => {
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
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

const isKeyError = (error: Error) => {
  const msg = error.message.toLowerCase();
  return (
    msg.includes("api key") ||
    msg.includes("apikey") ||
    msg.includes("unauthorized") ||
    msg.includes("permission") ||
    msg.includes("403")
  );
};

const AbberAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => getStoredKey());
  const [keyInput, setKeyInput] = useState("");
  const [keyPanelOpen, setKeyPanelOpen] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, keyPanelOpen]);

  useEffect(() => {
    if (open) {
      if (!apiKey) {
        setKeyPanelOpen(true);
        setTimeout(() => keyInputRef.current?.focus(), 300);
      } else {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
  }, [open, apiKey]);

  const handleSaveKey = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setKeyError("Please paste your Gemini API key.");
      return;
    }
    setSavingKey(true);
    setKeyError("");
    await new Promise((r) => setTimeout(r, 400));
    saveKey(trimmed);
    setApiKey(trimmed);
    setKeyInput("");
    setKeyPanelOpen(false);
    setSavingKey(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleClearKey = () => {
    saveKey("");
    setApiKey("");
    setKeyPanelOpen(true);
    setKeyError("");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    if (!apiKey) {
      setKeyPanelOpen(true);
      setKeyError("Add your Google Gemini API key to start chatting.");
      setTimeout(() => keyInputRef.current?.focus(), 300);
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
      const reply = await callGemini(nextMessages, apiKey);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Something went wrong.");
      if (isKeyError(error)) {
        saveKey("");
        setApiKey("");
        setKeyPanelOpen(true);
        setKeyError("Your API key is invalid or expired. Please enter a new one.");
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I couldn't reach Gemini: ${error.message}`,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
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
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">AbberAI</h3>
                <p className="text-sm text-blue-200">Powered by Google Gemini</p>
              </div>
              <button
                onClick={() => {
                  setKeyPanelOpen((v) => !v);
                  setKeyError("");
                }}
                title={apiKey ? "Manage API key" : "Add API key"}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-blue-200 transition-all hover:bg-white/20 hover:text-white"
              >
                <KeyRound size={16} />
                {apiKey ? "Key set" : "Add key"}
              </button>
            </div>

            {keyPanelOpen ? (
              <form onSubmit={handleSaveKey} className="px-6 py-6 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <Sparkles size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-amber-100">
                    Enter your free Google Gemini API key to chat with AbberAI.
                    Your key is stored only in this browser.
                  </p>
                </div>

                <input
                  ref={keyInputRef}
                  type="password"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    setKeyError("");
                  }}
                  placeholder="Paste your API key"
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-center text-base text-white placeholder-blue-300 outline-none focus:border-blue-400"
                />

                {keyError && (
                  <p className="text-center text-sm text-red-400">{keyError}</p>
                )}

                <button
                  type="submit"
                  disabled={savingKey}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {savingKey ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <KeyRound size={18} />
                  )}
                  {apiKey ? "Update Key" : "Connect Key"}
                </button>

                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-blue-300 hover:text-white transition-colors"
                >
                  Get a free API key
                  <ExternalLink size={14} />
                </a>

                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-red-300 transition-all hover:bg-white/10 hover:text-red-200"
                  >
                    <Trash2 size={16} />
                    Remove API Key
                  </button>
                )}
              </form>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AbberAI;
