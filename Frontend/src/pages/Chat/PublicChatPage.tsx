import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Send, UsersRound, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  time: string;
}

const STORAGE_KEY = "abber_public_chat";
const MAX_MESSAGES = 200;

const loadMessages = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // storage unavailable
  }
};

const toDisplayName = (email?: string) => {
  if (!email) return "Founder";
  const base = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!base) return "Founder";
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PublicChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayName = toDisplayName(user?.email);

  useEffect(() => {
    const sync = () => setMessages(loadMessages());
    window.addEventListener("storage", sync);
    const timer = setInterval(sync, 2000);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: displayName,
      text: trimmed,
      time: new Date().toISOString(),
    };

    const next = [...loadMessages(), msg].slice(-MAX_MESSAGES);
    saveMessages(next);
    setMessages(next);
    setText("");
  };

  const participants = new Set(messages.map((m) => m.name)).size;

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-6 overflow-hidden p-6 lg:p-10">
      {/* Header */}
      <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-4 text-white shrink-0">
              <MessagesSquare size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Community Chat</h1>
              <p className="mt-1.5 text-base text-blue-200">
                Share ideas, ask questions, and connect with fellow innovators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3.5">
              <UsersRound size={22} className="text-blue-300" />
              <div>
                <p className="text-sm font-medium text-blue-300">Participants</p>
                <p className="text-lg font-bold text-white">{participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3.5">
              <Sparkles size={22} className="text-amber-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">Messages</p>
                <p className="text-lg font-bold text-white">{messages.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex flex-1 flex-col overflow-hidden border-white/10 bg-white/10 backdrop-blur-xl shadow-xl min-h-0">
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-white/10 p-5">
                <MessagesSquare size={32} className="text-blue-300" />
              </div>
              <p className="mt-6 text-xl font-semibold text-white">
                No messages yet
              </p>
              <p className="mt-2 max-w-md text-base text-blue-200">
                Be the first to share an idea, a question, or something you're
                building with the Abber community.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-4">
                <Avatar name={msg.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-semibold text-white">
                      {msg.name}
                    </span>
                    <span className="text-sm text-blue-300/70">
                      {formatTime(msg.time)}
                    </span>
                  </div>
                  <div className="mt-2 inline-block max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/10 px-5 py-3 text-base leading-relaxed text-blue-100">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <form
          onSubmit={sendMessage}
          className="border-t border-white/10 p-5 lg:p-6"
        >
          <div className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/5 px-6 py-4 focus-within:border-blue-400">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Share your idea as ${displayName}...`}
              className="flex-1 bg-transparent text-center text-lg text-white placeholder-blue-300 outline-none"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white transition-all hover:opacity-90 disabled:opacity-40"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PublicChatPage;
