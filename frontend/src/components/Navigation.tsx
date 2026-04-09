"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Auth pages where the navbar should be hidden
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, refetch } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Hide navigation on full-screen auth pages
  if (AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const { baseURL } = await import("@/lib/auth-client");

      if (token) {
        // Call sign-out endpoint
        await fetch(`${baseURL}/auth/sign-out`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Clear token and redirect
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear token and redirect even if API call fails
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/spaces", label: "Spaces" },
    { href: "/offers", label: "Offers" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 right-0 z-[100] container mx-auto px-4 pointer-events-none">
        <nav className="pointer-events-auto mx-auto max-w-7xl bg-black/20 md:bg-background/80 backdrop-blur-2xl md:backdrop-blur-xl border border-white/10 md:border-zinc-200/50 shadow-lg shadow-black/10 md:shadow-zinc-500/5 rounded-2xl md:rounded-full px-6 md:px-8 h-20 flex items-center justify-between transition-all duration-300">

          {/* Logo - Overlapping */}
          <Link href="/" className="flex items-center group relative z-20 mt-1 md:mt-2 -ml-2 md:-ml-4 transition-transform duration-300">
            <div className="p-3 md:p-4 transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <img src="/logo2.webp" alt="PrimeOne Logo Mobile" className="h-20 w-auto object-contain drop-shadow-2xl md:hidden" />
              <img src="/logo.png" alt="PrimeOne Logo" className="hidden md:block h-40 w-auto object-contain drop-shadow-2xl" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-100/50 p-1.5 rounded-full border border-zinc-200/50 ml-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-300 ${isActive(link.href)
                  ? "bg-white text-primary shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border border-zinc-100 font-semibold"
                  : "text-zinc-600 hover:text-primary hover:bg-zinc-200/30"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                {(session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session.user.email === 'prime1@gmail.com') && (
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-sm h-10 hover:text-primary hover:bg-primary/10">
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full h-10 px-4 border-zinc-200 bg-white hover:bg-zinc-50 hover:border-primary/50 hover:text-primary">
                      <User className="w-4 h-4 mr-2" />
                      <span className="max-w-[120px] truncate text-sm">{session.user.name?.split(' ')[0] || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer py-2">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer py-2">
                      <Link href="/dashboard/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer py-2">
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-2">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="rounded-full text-zinc-600 hover:text-primary hover:bg-primary/5 h-10 px-6 text-sm font-medium">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 h-10 px-6 text-sm font-semibold">
                  <Link href="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 rounded-full text-white hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Full Screen Mobile Menu - Fixed to viewport */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-black/95 backdrop-blur-2xl md:hidden flex flex-col pt-24 pb-8 px-6 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-semibold px-4 py-3 rounded-xl transition-colors ${isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-white/10 my-6 w-full" />

              {session?.user ? (
                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{session.user.name}</p>
                      <p className="text-xs text-zinc-400">{session.user.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 text-lg font-medium py-2 text-zinc-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-lg font-medium py-2 text-red-500 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button asChild variant="outline" size="lg" className="rounded-xl h-12 text-base border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild size="lg" className="rounded-xl h-12 text-base bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Join Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-[10px] text-zinc-400 font-mono uppercase tracking-[0.2em] space-y-1">
            <div>PrimeOne Space © {new Date().getFullYear()}</div>
            <div className="opacity-60 text-[8px]">Owned by Prime One Global</div>
          </div>
        </div>
      )}
    </>
  );
}
