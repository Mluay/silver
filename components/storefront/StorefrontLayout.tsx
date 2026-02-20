"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search } from "lucide-react";
import { ThemeToggle } from "@/components/storefront/ThemeToggle";
import { useCart } from "@/lib/store/cart-store";
import { SITE_NAME_AR } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/cart", label: "السلة" },
];

export function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121214]">
      <header className="sticky top-0 z-50 border-b border-silver-200 dark:border-silver-800 bg-white/95 dark:bg-[#1a1a1d]/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-silver-900 dark:text-silver-100">
            {SITE_NAME_AR}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent dark:hover:text-accent-light ${
                  pathname === link.href
                    ? "text-accent dark:text-accent-light"
                    : "text-silver-600 dark:text-silver-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/shop">
              <Button variant="ghost" size="icon" aria-label="بحث">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="السلة">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-silver-200 dark:border-silver-800 bg-silver-50 dark:bg-[#1a1a1d] py-8">
        <div className="container mx-auto px-4 text-center text-silver-600 dark:text-silver-400 text-sm">
          <p>© {new Date().getFullYear()} {SITE_NAME_AR}. فضة أصيلة في بغداد.</p>
        </div>
      </footer>
    </div>
  );
}
