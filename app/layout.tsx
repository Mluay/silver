import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "فضة بغداد | فضة أصيلة في بغداد",
  description: "مجوهرات فضية أصلية للرجال والنساء - خواتم، سلاسل، أساور، إكسسوارات بحجارة طبيعية. بغداد، العراق.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <StorefrontLayout>{children}</StorefrontLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
