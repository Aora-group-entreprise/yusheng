import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon, Sparkles, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const themes = [
  { value: "light", label: "Clair", icon: Sun, desc: "Thème lumineux classique" },
  { value: "dark", label: "Sombre", icon: Moon, desc: "Thème nuit profond" },
  { value: "light-futuristic", label: "Light Futuriste", icon: Sparkles, desc: "Clair avec glow premium" },
];

const accents = [
  { value: "cyan", label: "Cyan", color: "bg-[hsl(200,85%,48%)]" },
  { value: "purple", label: "Violet", color: "bg-[hsl(265,55%,58%)]" },
  { value: "rose", label: "Rose", color: "bg-[hsl(340,75%,55%)]" },
  { value: "emerald", label: "Émeraude", color: "bg-[hsl(160,65%,45%)]" },
  { value: "amber", label: "Ambre", color: "bg-[hsl(38,92%,50%)]" },
];

const AppearancePage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  const setTheme = (value: string) => {
    updateSettings.mutate({ theme: value } as any);
    toast.success("Thème mis à jour ✓");
  };

  const setAccent = (value: string) => {
    updateSettings.mutate({ accent_color: value } as any);
    toast.success("Accent mis à jour ✓");
  };

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="glass border-b border-border/40 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold font-display text-foreground">🎨 Apparence</h1>
      </div>
      <div className="px-5 pt-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">Thème</p>
        {themes.map((t, i) => (
          <motion.button key={t.value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => setTheme(t.value)}
            className={`w-full bg-card border rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all ${
              settings?.theme === t.value ? "border-primary/50 ring-2 ring-primary/20" : "border-border/60"
            }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${settings?.theme === t.value ? "bg-primary/20" : "bg-muted"}`}>
              <t.icon className={`w-5 h-5 ${settings?.theme === t.value ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
          </motion.button>
        ))}

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 pt-4">Couleur d'accent</p>
        <div className="flex gap-3 flex-wrap">
          {accents.map((a) => (
            <motion.button key={a.value} whileTap={{ scale: 0.9 }} onClick={() => setAccent(a.value)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                settings?.accent_color === a.value ? "ring-2 ring-primary/40 bg-card" : ""
              }`}>
              <div className={`w-10 h-10 rounded-full ${a.color} shadow-md`} />
              <span className="text-[10px] font-medium text-muted-foreground">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;
