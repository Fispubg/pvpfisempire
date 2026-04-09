import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Globe, Sword, Shield, Cpu, Wind } from "lucide-react";

// I'm using a placeholder for the logo so the code CANNOT crash on import
const LOGO_URL = "https://mc-heads.net/avatar/PrimeFis/100"; 

const SKILL_CATEGORIES = {
  weapons: { label: "Weapons", icon: Sword, skills: [{ name: "Mace", max: 20 }, { name: "Sword", max: 15 }, { name: "Axe", max: 10 }, { name: "Cart", max: 15 }, { name: "Crystals/Anchor", max: 20 }, { name: "Trident", max: 10 }, { name: "Spear", max: 15 }], total: 105 },
  tyrant: { label: "Tyrant Skill", icon: Shield, skills: [{ name: "Crit Combos", max: 15 }, { name: "Sweep Combo", max: 10 }, { name: "Back Stab", max: 10 }, { name: "Shield Disabling", max: 10 }, { name: "Calmness In Any Situation", max: 10 }, { name: "Attack Cooldown", max: 10 }, { name: "Stun Slam", max: 20 }, { name: "KnockBack Hits", max: 15 }, { name: "Spam Hits (Bedwars)", max: 10 }, { name: "Attribute Swapping", max: 15 }], total: 125 },
  survivor: { label: "Survivor Skill", icon: Wind, skills: [{ name: "Elytra Swapping", max: 10 }, { name: "Infinite Elytra Flying", max: 15 }, { name: "MLGS (All)", max: 40 }, { name: "Wind Charge Elytra", max: 10 }, { name: "Spear Lunge Escape", max: 15 }], total: 90 },
  mechanics: { label: "Mechanics Skill", icon: Cpu, skills: [{ name: "Redstone", max: 30 }, { name: "Building", max: 20 }, { name: "Farms", max: 15 }, { name: "Base Game Mechanics", max: 20 }, { name: "F3 Menu", max: 15 }], total: 100 },
};

// SAFETY: Added checks to ensure 'skills' exists before totaling
const calculateTotalPoints = (skills: any) => {
  if (!skills) return 0;
  let total = 0;
  ['weapons', 'tyrant', 'survivor', 'mechanics'].forEach(cat => {
    const arr = skills[cat];
    if (Array.isArray(arr)) {
      total += arr.reduce((a: number, b: any) => a + (Number(b) || 0), 0);
    }
  });
  return total;
};

const findBestSkill = (playerSkills: any) => {
  if (!playerSkills) return "Warrior";
  let maxVal = -1;
  let bestName = "PvP";
  Object.keys(SKILL_CATEGORIES).forEach((catKey) => {
    const info = SKILL_CATEGORIES[catKey as keyof typeof SKILL_CATEGORIES];
    const scores = playerSkills[catKey];
    if (Array.isArray(scores)) {
      scores.forEach((val, i) => {
        if (Number(val) > maxVal) {
          maxVal = Number(val);
          bestName = info.skills[i]?.name || "PvP";
        }
      });
    }
  });
  return bestName;
};

const Leaderboard = () => {
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching from Worker...");
    fetch("https://fis-api.saifbinaqeel154.workers.dev/")
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => calculateTotalPoints(b.skills) - calculateTotalPoints(a.skills));
          setPlayers(sorted);
        } else {
          setDebugError("Data is not an array");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setDebugError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">LOADING WARRIORS...</div>;
  if (debugError) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">ERROR: {debugError}</div>;

  return (
    <section className="py-20 px-4 bg-[#0a0a0a] min-h-screen text-white font-sans">
      <div className="container mx-auto max-w-5xl">
        
        <div className="flex flex-col items-center mb-12">
          <img src={LOGO_URL} className="w-16 h-16 rounded-full border-2 border-purple-500 mb-4" alt="logo" />
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-center">
            FISPVP <span className="text-purple-500">LEADERBOARD</span>
          </h1>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-8 py-4 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-center">Points</div>
            <div className="col-span-2 text-center">Wins</div>
            <div className="col-span-3 text-center">Best At</div>
          </div>

          {/* Player List */}
          {players.map((player, index) => (
            <div key={index} className="border-t border-white/5">
              <div 
                onClick={() => setExpandedPlayer(expandedPlayer === index ? null : index)}
                className="grid grid-cols-12 gap-2 px-8 py-6 items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-1 font-black text-gray-600">#{index + 1}</div>
                <div className="col-span-4 flex items-center gap-3">
                  <img src={`https://mc-heads.net/avatar/${player.mcName}/100`} className="w-10 h-10 rounded" alt="skin" />
                  <span className="font-bold text-lg">{player.name}</span>
                </div>
                <div className="col-span-2 text-center font-black text-xl text-purple-400">
                  {calculateTotalPoints(player.skills)}
                </div>
                <div className="col-span-2 text-center text-gray-400">{player.wins || 0}</div>
                <div className="col-span-3 text-center text-xs uppercase tracking-widest text-gray-500">
                  {findBestSkill(player.skills)}
                </div>
              </div>

              {/* Expansion */}
              <AnimatePresence>
                {expandedPlayer === index && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden bg-black/40 border-t border-white/5 p-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex justify-center bg-white/5 rounded-3xl p-6">
                        <img src={`https://mc-heads.net/body/${player.mcName}/right`} className="h-64 object-contain" alt="body" />
                      </div>
                      <div className="space-y-4">
                        {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => {
                          const scores = player.skills?.[key] || [];
                          return (
                            <div key={key} className="bg-white/5 p-4 rounded-xl">
                              <h4 className="text-xs font-black uppercase text-purple-400 mb-2">{cat.label}</h4>
                              <div className="space-y-2">
                                {cat.skills.map((s, i) => (
                                  <div key={s.name} className="flex justify-between text-[10px] uppercase">
                                    <span className="text-gray-400">{s.name}</span>
                                    <span className="font-bold">{scores[i] || 0}/{s.max}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
