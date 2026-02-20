import { HeroSection } from "@/components/storefront/HeroSection";
import { FeaturedCategories } from "@/components/storefront/FeaturedCategories";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { TrustSection } from "@/components/storefront/TrustSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrustSection />
    </main>
  );
}
