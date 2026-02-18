"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white text-zinc-950 pt-16 pb-10 border-t border-zinc-200 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-16 mb-20">
          {/* Brand Column - Large */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block group">
              <img src="/logo.png" alt="PrimeOne Logo" className="h-16 md:h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
              Vavuniya's premium coworking space. We provide a professional environment for innovators, entrepreneurs, and teams to focus, collaborate, and grow.
            </p>
            <div className="flex gap-4 pt-4">
              {[
                { name: 'Facebook', href: 'https://facebook.com/primeonespace', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { name: 'Instagram', href: 'https://instagram.com/primeonespace', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01' },
                { name: 'LinkedIn', href: 'https://linkedin.com/company/prime-one-space', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z' },
                { name: 'YouTube', href: 'https://youtube.com/@primeonespace', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z M9.75 15.02V8.98L15.3 12l-5.55 3.02z' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={social.icon} />
                    {social.name === 'Instagram' && <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />}
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest pt-2">
              <span>Owned by <a href="https://www.primeone.global/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">Prime One Global</a></span>
              <div className="flex gap-1.5 grayscale hover:grayscale-0 transition-all duration-300 text-xl">
                <span title="Sri Lanka">🇱🇰</span>
                <span title="United States">🇺🇸</span>
                <span title="United Kingdom">🇬🇧</span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="max-w-xs space-y-3">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Stay in the loop</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-50 border-zinc-200 focus:border-primary h-11 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 transition-all shadow-sm hover:border-zinc-300"
                />
                <Button className="h-11 w-11 p-0 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">Platform</h4>
              <ul className="space-y-4">
                {['Spaces', 'Events', 'Offers'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-zinc-500 hover:text-primary transition-all duration-200 text-sm font-medium block hover:translate-x-1 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">Company</h4>
              <ul className="space-y-4">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Sign In', href: '/login' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-zinc-500 hover:text-primary transition-all duration-200 text-sm font-medium block hover:translate-x-1 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">Legal</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Refund Policy', href: '/refund-policy' },
                  { label: 'IT Access Policy', href: '/policies/it-policy' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-zinc-500 hover:text-primary transition-all duration-200 text-sm font-medium block hover:translate-x-1 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">Visit Us</h4>
              <div className="space-y-6 text-sm text-zinc-500">
                <div className="group flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <p className="leading-relaxed font-medium pt-1">
                    146B, Goodshed Road,<br />
                    Thonikkal, Vavuniya, NP, Sri Lanka.
                  </p>
                </div>
                <div className="space-y-4">
                  <a href="tel:+94706233612" className="group flex items-center gap-4 hover:text-primary transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <span className="font-medium whitespace-nowrap">+94 70 623 3612</span>
                  </a>
                  <a href="mailto:hello@primeone.space" className="group flex items-center gap-4 hover:text-primary transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <span className="font-medium">hello@primeone.space</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Text Bottom - Interactive */}
        <div className="border-t border-zinc-200 pt-8 mt-10 flex flex-col items-center">
          <motion.div
            className="flex flex-wrap justify-center cursor-default pt-4"
            initial="initial"
            whileHover="hover"
          >
            {"PRIMEONE SPACE".split("").map((char, i) => (
              <motion.span
                key={i}
                className={`text-5xl md:text-7xl font-black leading-none tracking-tighter inline-block ${char === " " ? "w-4 md:w-6" : ""}`}
                variants={{
                  initial: { y: 0, color: "#e4e4e7" }, // zinc-200
                  hover: {
                    y: -15,
                    color: "#ff4917", // primary
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                      delay: i * 0.03 // Stagger effect
                    }
                  }
                }}
                transition={{ duration: 0.2 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center mt-6 w-full text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <div className="flex flex-col items-center gap-1 text-center">
              <div>© {new Date().getFullYear()} PrimeOne Space. All rights reserved.</div>
              <div className="text-[13px] text-zinc-400 font-medium flex justify-center items-center gap-2">
                <span>Owned & Operated by <a href="https://www.primeone.global/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">Prime One Global</a> |</span>
                <span className="text-base flex gap-1">
                  <span title="Sri Lanka">🇱🇰</span>
                  <span title="United States">🇺🇸</span>
                  <span title="United Kingdom">🇬🇧</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
