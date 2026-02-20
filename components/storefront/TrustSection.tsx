import { Shield, Scale, Sparkles } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "فضة أصلية",
    description: "ضمان نقاء الفضة وجودة الصناعة",
  },
  {
    icon: Scale,
    title: "وزن مضبوط",
    description: "الوزن بالغرام مدون بدقة على كل قطعة",
  },
  {
    icon: Sparkles,
    title: "صناعة راقية",
    description: "تشكيل واحترافية عالية في التصميم",
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-silver-200 dark:border-silver-800 bg-silver-50 dark:bg-[#1a1a1d] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-accent/10 dark:bg-accent-light/20 p-4 text-accent dark:text-accent-light mb-4">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-silver-900 dark:text-silver-100">{title}</h3>
              <p className="mt-1 text-sm text-silver-600 dark:text-silver-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
