import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import BannerAd from "@/components/BannerAd";

interface Room {
  id: string;
  name: string;
  icon: string;
  description: string | null;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      const { data } = await supabase.from("rooms").select("*").order("created_at");
      if (data) setRooms(data);
    };
    loadRooms();
  }, []);

  return (
    <div className="min-h-screen gradient-bg pb-20">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground">🌍 Rooms</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Salons de discussion publics</p>
      </div>

      <BannerAd className="mx-5 mb-4" />

      <div className="px-5 space-y-3">
        {rooms.map((room, i) => (
          <motion.button
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="w-full bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-primary/30 active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
              {room.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-foreground">{room.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{room.description}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.button>
        ))}

        {rooms.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Chargement des salons...
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default RoomsPage;
