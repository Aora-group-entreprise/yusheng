import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Trash2, RotateCcw, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdvancedSettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { updateSettings } = useSettings();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleResetPrefs = () => {
    updateSettings.mutate({
      notif_messages: true, notif_likes: true, notif_sounds: true, notif_vibration: true,
      profile_visibility: "everyone", theme: "light-futuristic", accent_color: "cyan",
      language: "fr", auto_translate: false, translate_target: "fr",
    } as any);
    toast.success("Préférences réinitialisées ✓");
  };

  const items = [
    { icon: Users, label: "Multi-comptes", desc: "Créez un nouveau compte ou changez de session", color: "primary", action: () => { signOut(); navigate("/auth"); } },
    { icon: RotateCcw, label: "Réinitialiser préférences", desc: "Restaurer les paramètres par défaut", color: "primary", action: handleResetPrefs },
    { icon: LogOut, label: "Se déconnecter", desc: "Quitter cette session", color: "destructive", action: handleSignOut },
    { icon: Trash2, label: "Supprimer mon compte", desc: "Action irréversible", color: "destructive", action: () => setShowDeleteConfirm(true) },
  ];

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="glass border-b border-border/40 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold font-display text-foreground">⚙️ Paramètres</h1>
      </div>
      <div className="px-5 pt-4 space-y-3">
        {items.map((item, i) => (
          <motion.button key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={item.action}
            className={`w-full bg-card border rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all active:scale-[0.98] ${
              item.color === "destructive" ? "border-destructive/20 hover:bg-destructive/5" : "border-border/60 hover:border-primary/20"
            }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              item.color === "destructive" ? "bg-destructive/10" : "bg-primary/10"
            }`}>
              <item.icon className={`w-5 h-5 ${item.color === "destructive" ? "text-destructive" : "text-primary"}`} />
            </div>
            <div className="text-left flex-1">
              <p className={`text-sm font-medium ${item.color === "destructive" ? "text-destructive" : "text-foreground"}`}>{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="text-base font-bold text-foreground">Supprimer le compte</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Cette action est irréversible. Toutes vos données, messages et amis seront supprimés.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Annuler
              </button>
              <button onClick={() => toast.error("Contactez le support pour supprimer votre compte")}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettingsPage;
