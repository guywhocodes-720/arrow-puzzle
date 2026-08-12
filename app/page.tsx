import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function HomePage() {
  const ctaText = "Play Now";

  return (
    <main className="flex-1 flex flex-col w-full">
      <HeroSection ctaText={ctaText} />
      <FeaturesSection />
      <ReviewsSection />
      <FinalCTASection ctaText={ctaText} />
    </main>
  );
}
