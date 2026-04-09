"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { Wifi, Coffee, Clock, Shield, Zap, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: workspace image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
          alt="PrimeOne Space workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14212B]/90 via-[#14212B]/70 to-primary/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <img src="/logo.png" alt="PrimeOne Space" className="h-12 w-auto drop-shadow-lg" />
          </Link>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                Your workspace,<br />
                <span className="text-primary">your community.</span>
              </h2>
              <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-sm">
                Join PrimeOne Space and work smarter in Vavuniya's premier co-working hub.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Wifi, label: "Starlink WiFi" },
                { icon: Coffee, label: "Free Coffee" },
                { icon: Clock, label: "24/7 Access" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} PrimeOne Space · Owned by Prime One Global Group of Companies
          </p>
        </div>
      </div>

      {/* ── Right Panel: decorative bg + form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F0F1F3] relative overflow-hidden">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 bg-white/80 hover:bg-white backdrop-blur-sm border border-zinc-200 hover:border-zinc-300 px-3 py-2 rounded-xl shadow-sm transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </button>

        {/* ── Decorative layer ── */}

        {/* Large blurred blob — top right */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        {/* Large blurred blob — bottom left */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#14212B]/10 blur-3xl pointer-events-none" />
        {/* Medium blob — center-right */}
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

        {/* Dot-grid pattern (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#14212B" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Decorative ring — top left */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-primary/20 pointer-events-none" />
        <div className="absolute top-14 left-14 w-12 h-12 rounded-full border border-primary/10 pointer-events-none" />

        {/* Decorative ring — bottom right */}
        <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border-2 border-[#14212B]/10 pointer-events-none" />

        {/* Floating icon circles */}
        <div className="absolute top-10 right-10 hidden xl:flex w-14 h-14 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Wifi className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute bottom-16 left-10 hidden xl:flex w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Coffee className="w-5 h-5 text-orange-500" />
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:flex w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Shield className="w-4 h-4 text-blue-500" />
        </div>
        <div className="absolute bottom-10 right-24 hidden xl:flex w-11 h-11 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 shadow-lg items-center justify-center pointer-events-none">
          <Zap className="w-4.5 h-4.5 text-primary" />
        </div>

        {/* Rotated diamond square */}
        <div className="absolute top-16 left-24 hidden xl:block w-10 h-10 rotate-45 rounded-lg bg-primary/10 border border-primary/20 pointer-events-none" />
        <div className="absolute bottom-24 right-16 hidden xl:block w-8 h-8 rotate-45 rounded-md bg-[#14212B]/8 border border-[#14212B]/10 pointer-events-none" />

        {/* Hexagon SVG accent */}
        <svg className="absolute bottom-8 left-24 hidden xl:block w-12 h-12 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#ff4917" strokeWidth="6" fill="none" />
        </svg>
        <svg className="absolute top-24 right-28 hidden xl:block w-8 h-8 opacity-15 pointer-events-none" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#14212B" strokeWidth="6" fill="none" />
        </svg>

        {/* Giant faint "P1" watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[22rem] font-black text-[#14212B]/[0.025] leading-none tracking-tighter">P1</span>
        </div>

        {/* ── Form card ── */}
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="PrimeOne Space" className="h-14 w-auto" />
            </Link>
          </div>

          <Card className="shadow-2xl shadow-zinc-300/40 border-white/80 bg-white/85 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-white font-black text-xl">P1</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-black text-[#14212B]">Welcome Back</CardTitle>
              <CardDescription className="text-zinc-500">
                Sign in to your PrimeOne Space account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
