import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Sword, Cpu, Wind, Zap, AlertTriangle, UserQuestion } from "lucide-react";

const SKILL_CATEGORIES = {
  weapons: { label: "Weapons", icon: Sword, skills: [{ name: "Mace", max: 20 }, { name: "Sword", max: 15 }, { name: "Axe", max: 10 }, { name: "Cart", max: 15 }, { name: "Crystals/Anchor", max: 20 }, { name: "Trident", max: 10 }, { name: "Spear", max: 15 }], total: 105 },
  tyrant: { label: "Tyrant Skill", icon: Shield, skills: [{ name: "Crit Combos", max: 15 }, { name: "Sweep Combo", max: 10 }, { name: "Back Stab", max: 10 }, { name: "Shield Disabling", max: 10 }, { name: "Calmness In Any Situation", max: 10 }, { name: "Attack Cooldown", max: 10 }, { name: "Stun Slam", max: 20 }, { name: "KnockBack Hits", max: 15 }, { name: "Spam Hits (Bedwars)", max: 10 }, { name: "Attribute Swapping", max: 15 }], total: 125 },
  survivor: { label: "Survivor Skill", icon: Wind, skills: [{ name: "Elytra Swapping", max: 10 }, { name: "Infinite Elytra Flying", max: 15 }, { name: "MLGS (All)", max: 40 }, { name: "Wind Charge Elytra", max: 10 }, { name: "Spear Lunge Escape", max: 15 }], total: 90 },
  mechanics: { label: "Mechanics Skill", icon: Cpu, skills: [{ name: "Redstone", max: 30 }, { name: "Building", max: 20 }, { name: "Farms", max: 15 }, { name: "Base Game Mechanics", max: 20 }, { name: "F3 Menu", max: 15 }], total: 100 },
};

const mockMembers: Record<string, any> = {
  primefis: { rank: 1, name: "PrimeFis", mcName: "PrimeFis", skills: { weapons: [20, 15, 10, 15, 20, 10, 15], tyrant: [15, 10, 10, 10, 10, 10, 20, 15, 10, 15], survivor: [10, 15, 40, 10, 15], mechanics: [30, 20, 15, 20, 15] } },
  dream: { rank: 2, name: "Dream", mcName: "Dream", skills: { weapons: [12, 10, 6, 8, 12, 5, 8], tyrant: [8, 6, 6, 6, 7, 6, 12, 9, 7, 9], survivor: [6, 9, 28, 6, 9], mechanics: [18, 12, 9, 12, 9] } },
};

// Create empty skills for unknown players
const emptySkills = {
  weapons: [0, 0, 0, 0, 0, 0, 0],
  tyrant: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  survivor: [0, 0, 0, 0, 0],
  mechanics: [0, 0, 0, 0, 0],
};

const calculateTotalPoints = (skills: any) => Object.values(skills).flat().reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0);

const SkillBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-primary shadow-[0_0_8px_rgba(255,0,255,0.4)]" />
    </div>
  );
};

const MemberLookup = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [isUnknown, setIsUnknown] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const key = query.toLowerCase().trim();
    const found = mockMembers[key];

    if (found) {
      setResult(found);
      setIsUnknown(false);
    } else {
      // Create a "ghost" profile for the unknown player
      setResult({
        name: query,
        mcName: query,
        rank: "???",
        skills: emptySkills
      });
      setIsUnknown(true);
    }
    setSearched(true);
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="font-display text-5xl font-black italic uppercase tracking-tighter mb-3">
            <span className="text-white">CHECK </span>
            <span className="text-primary text-glow">MEMBER STATS</span>
          </h2>
        </motion.div>

        {/* Search Input */}
        <div className="flex gap-3 mb-12 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter username..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-display focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button onClick={handleSearch} className="px-8 py-4 rounded-xl bg-primary text-white font-display font-black uppercase tracking-widest hover:scale-105 transition-all">
            SEARCH
          </button>
        </div>

        <AnimatePresence mode="wait">
          {searched && result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visual Section */}
                <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] rounded-3xl border border-white/5 relative">
                  <img src={`https://mc-heads.net/body/${result.mcName}/right`} className={`h-80 object-contain drop-shadow-2xl ${isUnknown ? 'grayscale opacity-50' : ''}`} alt="Skin" />
                  <h3 className={`mt-6 font-black italic text-3xl uppercase tracking-tighter ${isUnknown ? 'text-gray-500' : 'text-white'}`}>{result.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-3 w-full mt-6">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Total Points</p>
                      <p className="text-lg font-black text-primary italic">{isUnknown ? "0" : calculateTotalPoints(result.skills)}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Ranking</p>
                      <p className="text-lg font-black text-white italic">{isUnknown ? "N/A" : `#${result.rank}`}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Best Skill</p>
                      <p className="text-[10px] font-black text-white uppercase truncate mt-1">{isUnknown ? "UNKNOWN" : "DETECTED"}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 custom-scrollbar">
                  {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => {
                    const scores = (result.skills as any)[key];
                    return (
                      <div key={key} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4 text-left">
                          <div className="flex items-center gap-2">
                            <cat.icon className={`w-4 h-4 ${isUnknown ? 'text-gray-600' : 'text-primary'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${isUnknown ? 'text-gray-600' : 'text-white'}`}>{cat.label}</span>
                          </div>
                          <span className="text-[10px] font-black text-gray-500 italic">0/{cat.total}</span>
                        </div>
                        <div className="space-y-3">
                          {cat.skills.map((s, i) => (
                            <div key={s.name}>
                              <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground mb-1">
                                <span>{s.name}</span>
                                <span>{isUnknown ? "0" : scores[i]}/{s.max}</span>
                              </div>
                              <SkillBar value={isUnknown ? 0 : scores[i]} max={s.max} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* UNKNOWN PERSON WARNING BOTTOM BAR */}
              {isUnknown && (
                <div className="bg-red-950/20 border-t border-red-500/20 p-4 flex items-center justify-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-[10px] font-display font-bold text-red-500 uppercase tracking-[0.2em]">
                    Warning: These exact results are for an unknown person. Identity not found in Empire Database.
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
