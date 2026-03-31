import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Video, Send, Smile, Camera, Mic, Heart, ThumbsUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  reactions: string[];
}

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<{ pseudo: string; avatar_url: string | null } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatUserId = searchParams.get("user");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !chatUserId) return;
    loadOtherUser();
    loadMessages();
    markAsRead();

    const channel = supabase
      .channel("chat-realtime")
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `sender_id=eq.${chatUserId}`,
      }, (payload) => {
        const newMsg = payload.new as any;
        if (newMsg.receiver_id === user.id) {
          setMessages(prev => [...prev, { ...newMsg, reactions: [] }]);
          supabase.from("messages").update({ read: true }).eq("id", newMsg.id).then();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, chatUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadOtherUser = async () => {
    if (!chatUserId) return;
    const { data } = await supabase.from("profiles").select("pseudo, avatar_url").eq("user_id", chatUserId).single();
    if (data) setOtherUser(data);
  };

  const loadMessages = async () => {
    if (!user || !chatUserId) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chatUserId}),and(sender_id.eq.${chatUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (!data) return;

    // Load reactions
    const msgIds = data.map(m => m.id);
    const { data: reactions } = msgIds.length > 0
      ? await supabase.from("message_reactions").select("*").in("message_id", msgIds)
      : { data: [] };

    const reactionMap = new Map<string, string[]>();
    reactions?.forEach(r => {
      const arr = reactionMap.get(r.message_id) || [];
      arr.push(r.emoji);
      reactionMap.set(r.message_id, arr);
    });

    setMessages(data.map(m => ({ ...m, reactions: reactionMap.get(m.id) || [] })));
  };

  const markAsRead = async () => {
    if (!user || !chatUserId) return;
    await supabase.from("messages").update({ read: true })
      .eq("sender_id", chatUserId).eq("receiver_id", user.id).eq("read", false);
  };

  const handleSend = async () => {
    if (!message.trim() || !user || !chatUserId) return;
    const content = message.trim();
    setMessage("");

    const { data } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: chatUserId,
      content,
    }).select().single();

    if (data) {
      setMessages(prev => [...prev, { ...data, reactions: [] }]);
    }
  };

  const toggleReaction = async (msgId: string, emoji: string) => {
    if (!user) return;
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    const hasReaction = msg.reactions.includes(emoji);
    if (hasReaction) {
      await supabase.from("message_reactions").delete()
        .eq("message_id", msgId).eq("user_id", user.id).eq("emoji", emoji);
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, reactions: m.reactions.filter(r => r !== emoji) } : m
      ));
    } else {
      await supabase.from("message_reactions").insert({ message_id: msgId, user_id: user.id, emoji });
      setMessages(prev => prev.map(m =>
        m.id === msgId ? { ...m, reactions: [...m.reactions, emoji] } : m
      ));
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col pb-20">
      {/* Header */}
      <div className="glass border-b border-border/40 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/inbox")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-primary overflow-hidden">
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            (otherUser?.pseudo || "?").charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{otherUser?.pseudo || "..."}</p>
          <p className="text-[10px] text-primary font-medium">En ligne</p>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Phone className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Aucun message. Dites bonjour ! 👋
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%]">
                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "gradient-primary text-primary-foreground rounded-br-md glow-primary"
                    : "bg-card border border-border/60 text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.reactions.map((r, j) => <span key={j} className="text-xs">{r}</span>)}
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
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-border/40 px-3 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Écrire un message..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all shadow-sm" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
            className="p-2.5 rounded-xl gradient-primary text-primary-foreground glow-primary shadow-md">
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatPage;
