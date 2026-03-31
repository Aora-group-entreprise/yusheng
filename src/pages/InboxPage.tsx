import { motion } from "framer-motion";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";

const mockConversations = [
  { id: 1, pseudo: "Akira", avatar: "🧑‍💻", lastMsg: "Salut, ça va ?", time: "14:32", unread: 3 },
  { id: 2, pseudo: "Luna", avatar: "🌙", lastMsg: "On se retrouve demain 😊", time: "13:10", unread: 0 },
  { id: 3, pseudo: "Kai", avatar: "⚡", lastMsg: "T'as vu le nouveau update ?", time: "12:05", unread: 1 },
  { id: 4, pseudo: "Sakura", avatar: "🌸", lastMsg: "Merci beaucoup !", time: "Hier", unread: 0 },
  { id: 5, pseudo: "Ryu", avatar: "🐉", lastMsg: "Let's go 🔥", time: "Hier", unread: 5 },
  { id: 6, pseudo: "Nova", avatar: "✨", lastMsg: "Envoyé une photo", time: "Lun", unread: 0 },
];

const InboxPage = () => {
  return (
    <div className="min-h-screen gradient-bg pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{mockConversations.length} conversations</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
      </div>

      <BannerAd className="mx-5 mb-4" />

      {/* Conversations */}
      <div className="px-5 space-y-2">
        {mockConversations.map((conv, i) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-secondary/30 active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl shrink-0">
              {conv.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">{conv.pseudo}</span>
                <span className="text-xs text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMsg}</p>
            </div>
            {conv.unread > 0 && (
              <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary-foreground">{conv.unread}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default InboxPage;
