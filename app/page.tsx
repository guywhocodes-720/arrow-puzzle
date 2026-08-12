import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function HomePage() {
  const ctaText = "Play Now";

  return (
    <main 
      className="flex-1 flex flex-col w-full"
      style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 17V7h10\"/><path d=\"M17 17L7 7\"/></svg>') 7 7, auto" }}
    >
      <HeroSection ctaText={ctaText} />
      <FeaturesSection />
      <ReviewsSection />
      <FinalCTASection ctaText={ctaText} />
    </main>
  );
}
