import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Globe, Sword, Shield, Cpu, Wind } from "lucide-react";
import fispvpLogo from "@/assets/fispvp-logo.jpg";

const SKILL_CATEGORIES = {
  weapons: { label: "Weapons", icon: Sword, skills: [{ name: "Mace", max: 20 }, { name: "Sword", max: 15 }, { name: "Axe", max: 10 }, { name: "Cart", max: 15 }, { name: "Crystals/Anchor", max: 20 }, { name: "Trident", max: 10 }, { name: "Spear", max: 15 }], total: 105 },
  tyrant: { label: "Tyrant Skill", icon: Shield, skills: [{ name: "Crit Combos", max: 15 }, { name: "Sweep Combo", max: 10 }, { name: "Back Stab", max: 10 }, { name: "Shield Disabling", max: 10 }, { name: "Calmness In Any Situation", max: 10 }, { name: "Attack Cooldown", max: 10 }, { name: "Stun Slam", max: 20 }, { name: "KnockBack Hits", max: 15 }, { name: "Spam Hits (Bedwars)", max: 10 }, { name: "Attribute Swapping", max: 15 }], total: 125 },
  survivor: { label: "Survivor Skill", icon: Wind, skills: [{ name: "Elytra Swapping", max: 10 }, { name: "Infinite Elytra Flying", max: 15 }, { name: "MLGS (All)", max: 40 }, { name: "Wind Charge Elytra", max: 10 }, { name: "Spear Lunge Escape", max: 15 }], total: 90 },
  mechanics: { label: "Mechanics Skill", icon: Cpu, skills: [{ name: "Redstone", max: 30 }, { name: "Building", max: 20 }, { name: "Farms", max: 15 }, { name: "Base Game Mechanics", max: 20 }, { name: "F3 Menu", max: 15 }], total: 100 },
};

const calculateTotalPoints = (skills: any) => {
  if (!skills) return 0;
  return Object.values(skills).flat().reduce((a: any, b: any) => a + b, 0);
};

const findBestSkill = (playerSkills: any) => {
  if (!playerSkills) return "N/A";
  let maxVal = -1;
  let bestName = "PvP";
  Object.keys(SKILL_CATEGORIES).forEach((catKey) => {
    const skillsList = SKILL_CATEGORIES[catKey as keyof typeof SKILL_CATEGORIES].skills;
    const scores = playerSkills[catKey];
    if (scores && Array.isArray(scores)) {
      scores.forEach((val: number, idx: number) => {
        if (val > maxVal) {
          maxVal = val;
          bestName = skillsList[idx]?.name || "PvP";
        }
      });
    }
  });
  return bestName;
};

const SkillBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-primary" />
    </div>
  );
};

const Leaderboard = () => {
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // REPLACE THIS URL WITH YOUR CLOUDFLARE WORKER URL
        const response = await fetch("https://fis-api.YOUR_SUBDOMAIN.workers.dev");
        const data = await response.json();

        // Convert object to array and sort by total points if necessary
        // Assuming your scores.json is an array of player objects
        const sortedPlayers = Array.isArray(data) 
          ? data.sort((a, b) => calculateTotalPoints(b.skills) - calculateTotalPoints(a.skills))
          : [];

        setPlayers(sortedPlayers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="py-20 px-4 bg-[#0a0a0a] min-h-screen font-display text-center">
      <div className="container mx-auto max-w-5xl">
        
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <img src={fispvpLogo} alt="Logo" className="w-14 h-14 rounded-xl border border-primary/20" />
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
              FISPVP <span className="text-primary text-glow">LEADERBOARD</span>
            </h1>
          </div>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-12 gap-2 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5 bg-white/[0.02] rounded-t-2xl">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4 text-left px-4">Player</div>
          <div className="col-span-2 text-center text-primary flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Points</div>
          <div className="col-span-2 text-center flex items-center justify-center gap-1"><Trophy className="w-3 h-3" /> Wins</div>
          <div className="col-span-3 text-center flex items-center justify-center gap-1"><Globe className="w-3 h-3" /> Best At</div>
        </div>

        <div className="bg-[#111111] rounded-b-2xl border border-white/5 divide-y divide-white/5 overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="py-20 text-muted-foreground animate-pulse">CONNECTING TO DATABASE...</div>
          ) : players.length === 0 ? (
            <div className="py-20 text-muted-foreground italic">
              NO WARRIORS FOUND IN THE DATABASE
            </div>
          ) : (
            players.map((player, index) => (
              <div key={index} className="group">
                <div
                  onClick={() => setExpandedPlayer(expandedPlayer === index ? null : index)}
                  className={`grid grid-cols-12 gap-2 px-8 py-6 items-center cursor-pointer transition-all duration-300 hover:bg-white/[0.04] ${expandedPlayer === index ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                >
                  <div className="col-span-1 text-center font-black italic text-lg text-gray-500">#{index + 1}</div>
                  
                  {/* Player Face + Name */}
                  <div className="col-span-4 flex items-center gap-4 text-left">
                    <img 
                      src={`https://mc-heads.net/avatar/${player.mcName || player.name}/100`} 
                      className="w-10 h-10 rounded shadow-lg border border-white/10" 
                      alt="face" 
                    />
                    <span className="font-bold text-lg tracking-tight text-white">{player.name}</span>
                  </div>

                  <div className="col-span-2 text-center font-black text-xl text-primary text-glow italic">
                    {calculateTotalPoints(player.skills).toLocaleString()}
                  </div>
                  <div className="col-span-2 text-center font-bold text-gray-400">{player.wins || "0"}</div>
                  <div className="col-span-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-widest group-hover:text-white">
                    {findBestSkill(player.skills)}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedPlayer === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/50 border-t border-white/5">
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        
                        {/* Body Image */}
                        <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                           <img 
                             src={`https://mc-heads.net/body/${player.mcName || player.name}/right`} 
                             className="h-80 object-contain drop-shadow-[0_0_20px_rgba(255,0,255,0.2)]" 
                             alt="3d-skin" 
                           />
                           <h3 className="mt-4 text-primary font-black italic text-2xl uppercase tracking-tighter">{player.name}</h3>
                        </div>

                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar text-left">
                           {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => {
                             const scores = (player.skills as any)?.[key] || [];
                             const catTotal = Array.isArray(scores) ? scores.reduce((a: number, b: number) => a + b, 0) : 0;
                             return (
                               <div key={key} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <div className="flex justify-between items-center mb-3">
                                   <div className="flex items-center gap-2">
                                     <cat.icon className="w-4 h-4 text-primary" />
                                     <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                                   </div>
                                   <span className="text-[10px] font-black text-primary">{catTotal}/{cat.total}</span>
                                 </div>
                                 <div className="space-y-2">
                                   {cat.skills.map((s, i) => (
                                     <div key={s.name}>
                                       <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground mb-1">
                                         <span>{s.name}</span>
                                         <span>{(scores[i] || 0)}/{s.max}</span>
                                       </div>
                                       <SkillBar value={scores[i] || 0} max={s.max} />
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
