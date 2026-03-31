import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";

const mockUsers = [
  { id: 1, pseudo: "Hiro", avatar: "🎮", status: "En ligne" },
  { id: 2, pseudo: "Yuki", avatar: "❄️", status: "Hors ligne" },
  { id: 3, pseudo: "Zen", avatar: "🧘", status: "En ligne" },
  { id: 4, pseudo: "Mika", avatar: "🎵", status: "En ligne" },
  { id: 5, pseudo: "Taro", avatar: "🍵", status: "Hors ligne" },
  { id: 6, pseudo: "Hana", avatar: "🌺", status: "En ligne" },
  { id: 7, pseudo: "Sora", avatar: "☁️", status: "En ligne" },
  { id: 8, pseudo: "Ren", avatar: "🎭", status: "Hors ligne" },
];

const FriendsPage = () => {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());

  const filtered = mockUsers.filter((u) =>
    u.pseudo.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAdd = (id: number) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">Ajouter des amis</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Trouvez vos amis par pseudo</p>
      </div>

      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un pseudo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <BannerAd className="mx-5 mb-4" />

      <div className="px-5 space-y-2">
        {filtered.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
              {user.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{user.pseudo}</p>
              <p className={`text-xs ${user.status === "En ligne" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {user.status}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleAdd(user.id)}
              className={`p-2.5 rounded-xl transition-all shadow-sm ${
                added.has(user.id)
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "gradient-primary text-primary-foreground glow-primary"
              }`}
            >
              {added.has(user.id) ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </motion.button>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FriendsPage;
