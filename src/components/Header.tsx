import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import fisLogo from "@/assets/fis-logo.png";

const navLinks = [
  { label: "Home", href: "https://fis-empire.pages.dev", isExternal: true },
  { label: "Leaderboard", href: "https://pvp-fisempire.pages.dev", isExternal: true },
  { label: "Socials", href: "#socials" },
  // Updated this line to point to your Discord link
  { label: "Apply for Staff", href: "https://discord.gg/M6bfSgh3sw", isExternal: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <img src={fisLogo} alt="Fis Empire" className="w-9 h-9" />
          <span className="font-display text-lg font-bold tracking-wider text-foreground">
            FIS <span className="text-primary">EMPIRE</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              // Added target="_blank" logic for external links
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://discord.gg/M6bfSgh3sw"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display text-xs font-bold uppercase tracking-wider glow-magenta-sm hover:scale-105 transition-transform duration-200"
          >
            Join Discord
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="flex flex-col items-center gap-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://discord.gg/M6bfSgh3sw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-display text-xs font-bold uppercase tracking-wider glow-magenta-sm"
            >
              Join Discord
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
