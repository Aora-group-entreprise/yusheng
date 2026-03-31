import { motion } from "framer-motion";
import { Settings, LogOut, Shield, Bell, Moon, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pseudo = user?.user_metadata?.pseudo || "Utilisateur";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const menuItems = [
    { icon: Bell, label: "Notifications", desc: "Gérer les alertes" },
    { icon: Shield, label: "Confidentialité", desc: "Paramètres de sécurité" },
    { icon: Moon, label: "Apparence", desc: "Thème et affichage" },
    { icon: Settings, label: "Paramètres", desc: "Options avancées" },
  ];

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="px-5 pt-12 pb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center glow-primary shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h1 className="text-xl font-bold font-display text-foreground">{pseudo}</h1>
        <p className="text-sm text-primary font-medium mt-1">● En ligne</p>
        <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
      </div>

      <BannerAd className="mx-5 mb-4" />

      <div className="px-5 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="w-full bg-card border border-border/60 rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:border-primary/20 active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleSignOut}
          className="w-full bg-card border border-destructive/20 rounded-xl p-4 flex items-center gap-3 hover:bg-destructive/5 active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-sm font-medium text-destructive">Se déconnecter</p>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
