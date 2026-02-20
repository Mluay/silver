import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-silver-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-l from-silver-800/90 to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600)",
        }}
      />
      <div className="container relative z-20 mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            فضة بغداد
          </h1>
          <p className="mt-4 text-lg text-silver-200 md:text-xl">
            مجوهرات فضية أصلية للرجال والنساء — خواتم، سلاسل، أساور وإكسسوارات بحجارة طبيعية. جودة عالية ووزن مضبوط.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-accent hover:bg-accent-light">
                تصفح المتجر
              </Button>
            </Link>
            <Link href="/shop?category=women">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                نساء
              </Button>
            </Link>
            <Link href="/shop?category=men">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                رجال
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
