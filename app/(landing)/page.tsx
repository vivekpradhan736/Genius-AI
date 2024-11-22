import LandingNavbar from "@/components/myComps/LandingNavbar";
import LandingHero from "@/components/myComps/LandingHero";
import LandingContent from "@/components/myComps/LandingContent";

export default function LandingPage() {
  return (
    <main className="h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </main>
  );
}