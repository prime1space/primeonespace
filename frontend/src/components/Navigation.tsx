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

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, refetch } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

      if (token) {
        // Call sign-out endpoint
        await fetch(`${API_URL}/auth/sign-out`, {
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
        <nav className="pointer-events-auto mx-auto max-w-6xl bg-background/80 backdrop-blur-xl border border-zinc-200/50 shadow-lg shadow-zinc-500/5 rounded-2xl md:rounded-full px-4 md:px-6 h-16 md:h-14 flex items-center justify-between transition-all duration-300">

          {/* Logo - Overlapping */}
          <Link href="/" className="flex items-center group relative z-20 mt-1 md:mt-2 -ml-2 md:-ml-4 transition-transform duration-300">
            <div className="p-3 md:p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <img src="/logo.png" alt="PrimeOne Logo" className="h-14 md:h-24 w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-zinc-200/50 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive(link.href)
                  ? "bg-white text-primary shadow-sm font-semibold"
                  : "text-zinc-500 hover:text-primary hover:bg-zinc-200/50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <>
                {(session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || session.user.email === 'prime1@gmail.com') && (
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-xs h-8 hover:text-primary hover:bg-primary/10">
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full h-8 border-zinc-200 bg-white hover:bg-zinc-50 hover:border-primary/50 hover:text-primary">
                      <User className="w-3.5 h-3.5 mr-2" />
                      <span className="max-w-[100px] truncate text-xs">{session.user.name?.split(' ')[0] || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer">
                      <Link href="/dashboard/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg hover:text-primary hover:bg-primary/5 cursor-pointer">
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="rounded-full text-zinc-600 hover:text-primary hover:bg-primary/5 h-8 text-xs font-medium">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 h-8 px-4 text-xs font-semibold">
                  <Link href="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 rounded-full text-zinc-600 hover:bg-zinc-100 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Full Screen Mobile Menu - Fixed to viewport */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-white/95 backdrop-blur-xl md:hidden flex flex-col pt-24 pb-8 px-6 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-semibold px-4 py-3 rounded-xl transition-colors ${isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-zinc-400 hover:text-primary hover:bg-primary/5"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-zinc-100 my-6 w-full" />

              {session?.user ? (
                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{session.user.name}</p>
                      <p className="text-xs text-zinc-500">{session.user.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 text-lg font-medium py-2 text-zinc-600 hover:text-primary transition-colors"
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
                  <Button asChild variant="outline" size="lg" className="rounded-xl h-12 text-base border-zinc-200 hover:border-primary hover:text-primary">
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
