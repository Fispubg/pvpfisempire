import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Sword, Cpu, Wind, AlertTriangle } from "lucide-react";

const SKILL_CATEGORIES = {
  weapons: { label: "Weapons", icon: Sword, skills: [{ name: "Mace", max: 20 }, { name: "Sword", max: 15 }, { name: "Axe", max: 10 }, { name: "Cart", max: 15 }, { name: "Crystals/Anchor", max: 20 }, { name: "Trident", max: 10 }, { name: "Spear", max: 15 }], total: 105 },
  tyrant: { label: "Tyrant Skill", icon: Shield, skills: [{ name: "Crit Combos", max: 15 }, { name: "Sweep Combo", max: 10 }, { name: "Back Stab", max: 10 }, { name: "Shield Disabling", max: 10 }, { name: "Calmness In Any Situation", max: 10 }, { name: "Attack Cooldown", max: 10 }, { name: "Stun Slam", max: 20 }, { name: "KnockBack Hits", max: 15 }, { name: "Spam Hits (Bedwars)", max: 10 }, { name: "Attribute Swapping", max: 15 }], total: 125 },
  survivor: { label: "Survivor Skill", icon: Wind, skills: [{ name: "Elytra Swapping", max: 10 }, { name: "Infinite Elytra Flying", max: 15 }, { name: "MLGS (All)", max: 40 }, { name: "Wind Charge Elytra", max: 10 }, { name: "Spear Lunge Escape", max: 15 }], total: 90 },
  mechanics: { label: "Mechanics Skill", icon: Cpu, skills: [{ name: "Redstone", max: 30 }, { name: "Building", max: 20 }, { name: "Farms", max: 15 }, { name: "Base Game Mechanics", max: 20 }, { name: "F3 Menu", max: 15 }], total: 100 },
};

const emptySkills = {
  weapons: [0, 0, 0, 0, 0, 0, 0],
  tyrant: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  survivor: [0, 0, 0, 0, 0],
  mechanics: [0, 0, 0, 0, 0],
};

const calculateTotalPoints = (skills: any) => {
  if (!skills) return 0;
  return Object.values(skills).flat().reduce((a: any, b: any) => a + (Number(b) || 0), 0);
};

// FIXED SKILLBAR COMPONENT
const SkillBar = ({ value, max, isUnknown }: { value: number; max: number; isUnknown: boolean }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
        className="h-full" 
        style={{ 
          // Forced fallback color if var fails. Replace #a855f7 with your actual primary hex if different.
          backgroundColor: isUnknown ? '#374151' : 'var(--primary, #a855f7)', 
          boxShadow: isUnknown ? 'none' : '0 0 12px var(--primary, #a855f7)'
        }} 
      />
    </div>
  );
};

const MemberLookup = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [isUnknown, setIsUnknown] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fis-api.saifbinaqeel154.workers.dev/");
        const data = await response.json();
        const sorted = Array.isArray(data) 
          ? data.sort((a, b) => calculateTotalPoints(b.skills) - calculateTotalPoints(a.skills)) 
          : [];
        setAllPlayers(sorted);
      } catch (e) {
        console.error("Lookup fetch failed", e);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchKey = query.toLowerCase().trim();
    
    const foundIdx = allPlayers.findIndex(p => 
      p.name?.toLowerCase() === searchKey || (p.mcName && p.mcName.toLowerCase() === searchKey)
    );

    if (foundIdx !== -1) {
      setResult({ ...allPlayers[foundIdx], rank: foundIdx + 1 });
      setIsUnknown(false);
    } else {
      setResult({ name: query, mcName: query, rank: "???", skills: emptySkills });
      setIsUnknown(true);
    }
    setSearched(true);
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen text-white text-center font-display">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-10">
            CHECK <span className="text-primary text-glow" style={{ color: 'var(--primary)' }}>MEMBER STATS</span>
          </h2>
        </motion.div>

        <div className="flex gap-3 mb-12 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter username..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button onClick={handleSearch} className="px-8 py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all" style={{ backgroundColor: 'var(--primary)' }}>
            SEARCH
          </button>
        </div>

        <AnimatePresence mode="wait">
          {searched && result && (
            <motion.div 
              key={result.name + result.rank} // Key change triggers fresh animations
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] rounded-3xl border border-white/5 relative">
                  <img src={`https://mc-heads.net/body/${result.mcName || result.name}/right`} className={`h-80 object-contain drop-shadow-2xl transition-all duration-500 ${isUnknown ? 'grayscale opacity-50' : ''}`} alt="Skin" />
                  <h3 className="mt-6 font-black italic text-3xl uppercase tracking-tighter" style={{ color: isUnknown ? '#6b7280' : 'var(--primary)' }}>{result.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-3 w-full mt-6">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Total Points</p>
                      <p className="text-lg font-black italic" style={{ color: 'var(--primary)' }}>{isUnknown ? "0" : calculateTotalPoints(result.skills).toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Ranking</p>
                      <p className="text-lg font-black text-white italic">{isUnknown ? "N/A" : `#${result.rank}`}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Status</p>
                      <p className="text-[10px] font-black text-white uppercase mt-1">{isUnknown ? "UNKNOWN" : "VERIFIED"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 custom-scrollbar text-left">
                  {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => {
                    const scores = result.skills?.[key] || emptySkills[key as keyof typeof emptySkills];
                    const catTotal = Array.isArray(scores) ? scores.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                    return (
                      <div key={key} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4" style={{ color: isUnknown ? '#4b5563' : 'var(--primary)' }} />
                            <span className={`text-xs font-black uppercase tracking-widest ${isUnknown ? 'text-gray-500' : 'text-white'}`}>{cat.label}</span>
                          </div>
                          <span className="text-[10px] font-black italic" style={{ color: isUnknown ? '#4b5563' : 'var(--primary)' }}>{catTotal}/{cat.total}</span>
                        </div>
                        <div className="space-y-3">
                          {cat.skills.map((s, i) => {
                            const score = Number(scores[i]) || 0;
                            return (
                              <div key={s.name}>
                                <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground mb-1">
                                  <span>{s.name}</span>
                                  <span>{score}/{s.max}</span>
                                </div>
                                <SkillBar value={score} max={s.max} isUnknown={isUnknown} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isUnknown && (
                <div className="bg-red-950/20 border-t border-red-500/20 p-4 flex items-center justify-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">
                    Warning: Identity not found in Database.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MemberLookup;
