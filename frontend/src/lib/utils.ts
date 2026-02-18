import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImageUrl(url: string | undefined | null) {
  if (!url) return '';
  if (url.startsWith('http://localhost:8001')) {
    // Replace localhost with production API base if we are in production
    if (typeof window !== 'undefined' && window.location.hostname.includes('primeone.space')) {
      return url.replace('http://localhost:8001', 'https://primeone.space/backend/php/api');
    }
  }
  return url;
}
