import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IngredientsSection } from "@/components/home/IngredientsSection";
import { VideoSection } from "@/components/home/VideoSection";
import { ProductUsageCarousel } from "@/components/home/ProductUsageCarousel";
import { HowToUseSection } from "@/components/home/HowToUseSection";
import { ConcernsSection } from "@/components/home/ConcernsSection";

const Index = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <IngredientsSection />
      <VideoSection />
      <ProductUsageCarousel />
      <HowToUseSection />
      <ConcernsSection />
    </>
  );
};

export default Index;
