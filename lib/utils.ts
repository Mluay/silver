import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIqd(amount: number): string {
  return new Intl.NumberFormat("ar-IQ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " د.ع";
}

export function formatWeight(grams: number): string {
  return `${grams} غ`;
}
