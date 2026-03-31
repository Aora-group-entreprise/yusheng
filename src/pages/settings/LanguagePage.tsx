import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
];

const LanguagePage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  const setLanguage = (code: string) => {
    updateSettings.mutate({ language: code, translate_target: code } as any);
    toast.success("Langue mise à jour ✓");
  };

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="glass border-b border-border/40 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-bold font-display text-foreground">🌍 Langue</h1>
      </div>
      <div className="px-5 pt-4 space-y-2">
        {languages.map((lang, i) => (
          <motion.button key={lang.code} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            onClick={() => setLanguage(lang.code)}
            className={`w-full bg-card border rounded-xl p-3.5 flex items-center gap-3 shadow-sm transition-all ${
              settings?.language === lang.code ? "border-primary/50 ring-2 ring-primary/20" : "border-border/60"
            }`}>
            <span className="text-xl">{lang.flag}</span>
            <p className="text-sm font-medium text-foreground flex-1 text-left">{lang.label}</p>
            {settings?.language === lang.code && <Check className="w-4 h-4 text-primary" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePage;
