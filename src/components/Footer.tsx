import fisLogo from "@/assets/fis-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={fisLogo} alt="Fis Empire" className="w-7 h-7" loading="lazy" width={28} height={28} />
          <span className="text-sm text-muted-foreground font-body">
            © 2026 Fis Empire. All rights reserved. lol
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60 font-body">
          Powered by The Aura Of King Fis
        </p>
      </div>
    </footer>
  );
};

export default Footer;
