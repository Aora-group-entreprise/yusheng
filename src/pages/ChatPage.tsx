import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Video, Send, Smile, Camera, Mic, Heart, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const mockMessages = [
  { id: 1, text: "Salut ! Comment ça va ? 😊", sender: "other", time: "14:30", reactions: ["❤️"] },
  { id: 2, text: "Hey ! Ça va super bien, et toi ?", sender: "me", time: "14:31", reactions: [] },
  { id: 3, text: "Trop bien ! Tu fais quoi ce soir ?", sender: "other", time: "14:32", reactions: ["👍"] },
  { id: 4, text: "Rien de prévu, pourquoi ?", sender: "me", time: "14:33", reactions: [] },
  { id: 5, text: "On pourrait regarder un film ensemble 🎬", sender: "other", time: "14:34", reactions: [] },
  { id: 6, text: "Grave ! On fait ça 🔥", sender: "me", time: "14:35", reactions: ["❤️", "🔥"] },
];

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), text: message, sender: "me", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), reactions: [] },
    ]);
    setMessage("");
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessages(msgs =>
      msgs.map(m => {
        if (m.id !== msgId) return m;
        const has = m.reactions.includes(emoji);
        return { ...m, reactions: has ? m.reactions.filter(r => r !== emoji) : [...m.reactions, emoji] };
      })
    );
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col pb-20">
      {/* Header */}
      <div className="glass border-b border-border/50 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/inbox")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg">🧑‍💻</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Akira</p>
          <p className="text-[10px] text-primary">En ligne</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
          <Phone className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%]">
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === "me"
                    ? "gradient-primary text-primary-foreground rounded-br-md"
                    : "glass text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                {msg.reactions.map((r, j) => (
                  <span key={j} className="text-xs">{r}</span>
                ))}
                <div className="flex gap-0.5 ml-1">
                  <button onClick={() => toggleReaction(msg.id, "❤️")} className="hover:scale-125 transition-transform">
                    <Heart className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </button>
                  <button onClick={() => toggleReaction(msg.id, "👍")} className="hover:scale-125 transition-transform">
                    <ThumbsUp className="w-3 h-3 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="glass border-t border-border/50 px-3 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écrire un message..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="p-2.5 rounded-xl gradient-primary text-primary-foreground glow-primary"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatPage;
