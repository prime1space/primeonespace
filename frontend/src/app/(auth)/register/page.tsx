"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, Loader2, Users, Zap, Shield, Wifi, Coffee, Clock, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "Sri Lanka",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (formData.country === "Sri Lanka") {
      if (phoneClean.length < 9) {
        toast.error("Sri Lankan phone numbers should be at least 9-10 digits.");
        return;
      }
    } else {
      if (phoneClean.length < 7 || phoneClean.length > 15) {
        toast.error("Please enter a valid international phone number.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const { baseURL: API_URL } = await import("@/lib/auth-client");
      const response = await fetch(`${API_URL}/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          country: formData.country,
          password: formData.password,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'USER_ALREADY_EXISTS') {
          toast.error("An account with this email already exists");
        } else {
          toast.error(data.error?.message || "Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      const token = response.headers.get("set-auth-token") || data.token;
      if (token) localStorage.setItem("bearer_token", token);

      fetch(`${API_URL}/auth/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      }).catch(() => { });

      toast.success("Account created successfully!");
      setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: image ── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80"
          alt="PrimeOne Space"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14212B]/95 via-[#14212B]/75 to-primary/30" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <img src="/logo.png" alt="PrimeOne Space" className="h-12 w-auto drop-shadow-lg" />
          </Link>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white leading-tight mb-3">
                Start working smarter<br /><span className="text-primary">today.</span>
              </h2>
              <p className="text-zinc-400 text-base font-light leading-relaxed">
                Join hundreds of professionals at Vavuniya's best co-working space.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Zap, title: "Instant Access", desc: "Book and start working the same day", color: "text-primary", bg: "bg-primary/20 border-primary/30" },
                { icon: Users, title: "Grow Your Network", desc: "Connect with like-minded professionals", color: "text-blue-400", bg: "bg-blue-400/20 border-blue-400/30" },
                { icon: Shield, title: "Secure & Reliable", desc: "CCTV, lockers and 24/7 security", color: "text-green-400", bg: "bg-green-400/20 border-green-400/30" },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} PrimeOne Space · Vavuniya, Sri Lanka
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

        {/* Blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-12 w-56 h-56 rounded-full bg-[#14212B]/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#14212B" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots2)" />
        </svg>

        {/* Decorative arcs / rings */}
        <div className="absolute top-6 left-6 w-16 h-16 rounded-full border-2 border-primary/20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full border border-primary/10 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full border-2 border-[#14212B]/10 pointer-events-none" />
        <div className="absolute bottom-14 right-14 w-10 h-10 rounded-full border border-[#14212B]/05 pointer-events-none" />

        {/* Diagonal dashed line accent */}
        <svg className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none" viewBox="0 0 200 200" fill="none">
          <path d="M200 0 L0 200" stroke="#ff4917" strokeWidth="1" strokeDasharray="8 8" />
          <path d="M200 40 L40 200" stroke="#ff4917" strokeWidth="1" strokeDasharray="8 8" />
          <path d="M200 80 L80 200" stroke="#ff4917" strokeWidth="1" strokeDasharray="8 8" />
        </svg>

        {/* Floating icon circles */}
        <div className="absolute top-10 right-10 hidden xl:flex w-14 h-14 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Wifi className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute top-1/3 right-10 hidden xl:flex w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Users className="w-4 h-4 text-blue-500" />
        </div>
        <div className="absolute bottom-20 left-10 hidden xl:flex w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-xl items-center justify-center pointer-events-none">
          <Coffee className="w-5 h-5 text-orange-500" />
        </div>
        <div className="absolute bottom-10 right-20 hidden xl:flex w-10 h-10 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 shadow-lg items-center justify-center pointer-events-none">
          <Clock className="w-4 h-4 text-primary" />
        </div>

        {/* Rotated diamond shapes */}
        <div className="absolute top-20 left-20 hidden xl:block w-10 h-10 rotate-45 rounded-lg bg-primary/10 border border-primary/20 pointer-events-none" />
        <div className="absolute top-1/2 left-10 hidden xl:block w-7 h-7 rotate-45 rounded-md bg-primary/8 border border-primary/15 pointer-events-none" />
        <div className="absolute bottom-20 right-16 hidden xl:block w-9 h-9 rotate-45 rounded-lg bg-[#14212B]/8 border border-[#14212B]/10 pointer-events-none" />

        {/* Hexagon SVG accents */}
        <svg className="absolute top-10 left-1/3 hidden xl:block w-10 h-10 opacity-15 pointer-events-none" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#ff4917" strokeWidth="6" fill="none" />
        </svg>
        <svg className="absolute bottom-10 left-1/3 hidden xl:block w-8 h-8 opacity-12 pointer-events-none" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="#14212B" strokeWidth="6" fill="none" />
        </svg>

        {/* Giant watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[18rem] font-black text-[#14212B]/[0.025] leading-none tracking-tighter">P1</span>
        </div>

        {/* ── Form card ── */}
        <div className="w-full max-w-md relative z-10 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
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
              <CardTitle className="text-2xl font-black text-[#14212B]">Create Account</CardTitle>
              <CardDescription className="text-zinc-500">
                Join PrimeOne Space today — it's free
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5">
                <GoogleAuthButton redirectTo="/dashboard" />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-zinc-400 font-medium uppercase tracking-wider">
                    or register with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Your Name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required disabled={isLoading} className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required disabled={isLoading} className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country}
                      onValueChange={(value) => {
                        const country = countries.find(c => c.name === value);
                        setFormData({ ...formData, country: value, phone: formData.phone || country?.dial || "" });
                      }}
                      disabled={isLoading}>
                      <SelectTrigger id="country" className="rounded-xl">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+94 77 123 4567" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required disabled={isLoading} className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-zinc-400 font-normal text-xs">(optional)</span></Label>
                  <Input id="address" type="text" placeholder="Street, City" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isLoading} className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required disabled={isLoading} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required disabled={isLoading} className="rounded-xl" />
                  </div>
                </div>

                <p className="text-xs text-zinc-400">Password must be at least 8 characters</p>

                <Button type="submit" className="w-full rounded-xl h-11 mt-2" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" />Create Account</>
                  )}
                </Button>
              </form>

              <div className="mt-5 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
