import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import MemberLookup from "@/components/MemberLookup";
import SocialsGrid from "@/components/SocialsGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <Leaderboard />
      <MemberLookup />
      <SocialsGrid />
      <Footer />
    </div>
  );
};

export default Index;
