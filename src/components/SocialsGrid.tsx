import { motion } from "framer-motion";
import { Youtube, Twitch, MessageCircle, ExternalLink } from "lucide-react";

const socials = [
  {
    name: "YouTube",
    description: "Watch PrimeFis content, Hostile Smp and FisPvP updates.",
    icon: Youtube,
    url: "https://youtube.com/@PrimeFis",
    color: "from-red-600 to-red-800",
    label: "Subscribe",
  },
  {
    name: "Twitch",
    description: "Catch live streams and stuff.",
    icon: Twitch,
    url: "https://twitch.tv/PrimeFis",
    color: "from-purple-600 to-purple-800",
    label: "Follow",
  },
  {
    name: "Fis Empire Discord",
    description: "Join the Empire — chat, compete, and rise through the ranks.",
    icon: MessageCircle,
    url: "https://discord.gg/M6bfSgh3sw",
    color: "from-indigo-600 to-indigo-800",
    label: "Join Server",
  },
  {
    name: "FisPvP Discord",
    description: "The competitive PvP arena — find matches, track stats, and dominate.",
    icon: MessageCircle,
    url: "https://discord.gg/zAS2jAbGHy",
    color: "from-fuchsia-600 to-purple-800",
    label: "Join Server",
  },
];

const SocialsGrid = () => {
  return (
    <section id="socials" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-3">
            Stay <span className="text-primary text-glow">Connected</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Stay up-to-date across all Empire platforms
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass border-glow rounded-xl p-6 flex flex-col items-center text-center group cursor-pointer transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <social.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{social.name}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4 flex-1">{social.description}</p>
              <span className="flex items-center gap-2 text-primary font-display text-xs font-bold uppercase tracking-wider">
                {social.label} <ExternalLink className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialsGrid;
