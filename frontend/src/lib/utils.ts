import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImageUrl(url: string | undefined | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;

  // Since we don't have access to baseURL here directly easily without circular deps sometimes,
  // we can try to guess it from window.location or just use a generic strategy.
  // Better yet, let's just make it handle the prefixing if it's relative.
  
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname.includes('primeone.space') || window.location.hostname.includes('primeone.global');
    const apiBase = isProduction 
      ? `${window.location.origin}/php/api/router.php` 
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001').replace(/\/$/, '');

    // Handle legacy paths
    if (url.includes('/backend/php/api/')) {
      const parts = url.split('/backend/php/api/');
      const filename = parts[parts.length - 1];
      return `${apiBase}/uploads/${filename}`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');
    }

    // Prepend API base if it's a relative path starting with /uploads/
    if (url.startsWith('/uploads/')) {
        return `${apiBase}${url}`;
    }
  }

  return url;
}
