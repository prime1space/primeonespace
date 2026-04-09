"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function Footer() {
  const pathname = usePathname();

  if (AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return null;
  }

  return (
    <footer className="bg-white text-zinc-950 pt-8 pb-4 border-t border-zinc-200 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 lg:gap-y-10 mb-8 lg:mb-12">
          {/* Brand Column - Large */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <img src="/logo.png" alt="PrimeOne Logo" className="h-24 md:h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium -mt-10 md:-mt-24 lg:-mt-20 relative z-10 mx-auto lg:mx-0">
              Vavuniya's premium coworking space. We provide a professional environment for innovators, entrepreneurs, and teams to focus, collaborate, and grow.
            </p>
            <div className="flex justify-center lg:justify-start gap-4 pt-2">
              {[
                { name: 'Facebook', href: 'https://www.facebook.com/primeone.space/', icon: Facebook },
                { name: 'Instagram', href: 'https://www.instagram.com/primeonespace/', icon: Instagram },
                { name: 'X', href: 'https://x.com/primeonespace', icon: Twitter },
                { name: 'YouTube', href: 'https://www.youtube.com/@PrimeOneSpace', icon: Youtube },
                { name: 'LinkedIn', href: 'https://www.linkedin.com/company/prime-one-space/', icon: Linkedin },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-110"
                >
                  <social.icon size={18} strokeWidth={2} />
                </a>
              ))}
            </div>

          </div>

          {/* Links Columns */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mt-6 lg:mt-16 text-center sm:text-left">
            <div className="space-y-4 lg:space-y-6 flex flex-col items-center sm:items-start">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 sm:after:left-0 sm:after:translate-x-0 after:w-8 after:h-0.5 after:bg-primary">Platform</h4>
              <ul className="space-y-4 pt-2 flex flex-col items-center sm:items-start">
                {['Spaces', 'Events', 'Offers'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-zinc-500 hover:text-primary transition-all duration-300 text-sm font-medium flex items-center gap-2.5 group sm:-ml-3.5">
                      <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200 group-hover:bg-primary group-hover:scale-125 transition-all" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 lg:space-y-6 flex flex-col items-center sm:items-start">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 sm:after:left-0 sm:after:translate-x-0 after:w-8 after:h-0.5 after:bg-primary">Company</h4>
              <ul className="space-y-4 pt-2 flex flex-col items-center sm:items-start">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Sign In', href: '/login' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-zinc-500 hover:text-primary transition-all duration-300 text-sm font-medium flex items-center gap-2.5 group sm:-ml-3.5">
                      <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200 group-hover:bg-primary group-hover:scale-125 transition-all" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 lg:space-y-6 flex flex-col items-center sm:items-start">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 sm:after:left-0 sm:after:translate-x-0 after:w-8 after:h-0.5 after:bg-primary">Legal</h4>
              <ul className="space-y-4 pt-2 flex flex-col items-center sm:items-start">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Refund Policy', href: '/refund-policy' },
                  { label: 'IT Access Policy', href: '/policies/it-policy' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-zinc-500 hover:text-primary transition-all duration-300 text-sm font-medium flex items-center gap-2.5 group sm:-ml-3.5">
                      <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200 group-hover:bg-primary group-hover:scale-125 transition-all" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 lg:space-y-6 flex flex-col items-center sm:items-start">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 sm:after:left-0 sm:after:translate-x-0 after:w-8 after:h-0.5 after:bg-primary">Visit Us</h4>
              <div className="space-y-4 pt-2 text-sm text-zinc-500 flex flex-col items-center sm:items-start text-center sm:text-left">
                <p className="leading-relaxed font-medium text-center sm:text-left">
                  146B, Goodshed Road,<br className="hidden sm:block" />
                  Thonikkal, Vavuniya, NP, Sri Lanka.
                </p>
                <div className="space-y-4 flex flex-col w-full items-center sm:items-start">
                  <a href="tel:+94772228507" className="hover:text-primary transition-colors font-medium whitespace-nowrap">
                    +94 77 222 8507
                  </a>
                  <a href="mailto:hello@primeone.space" className="hover:text-primary transition-colors font-medium">
                    hello@primeone.space
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Text Bottom - Interactive */}
        <div className="border-t border-zinc-200 pt-4 mt-4 flex flex-col items-center">
          <motion.div
            className="flex flex-wrap justify-center cursor-default pt-2"
            initial="initial"
            whileHover="hover"
          >
            {"PRIMEONE SPACE".split("").map((char, i) => (
              <motion.span
                key={i}
                className={`text-[9vw] lg:text-[7.5rem] font-black leading-none tracking-tighter inline-block ${char === " " ? "w-4 md:w-6 lg:w-8" : ""}`}
                variants={{
                  initial: { y: 0, color: "#e4e4e7" }, // zinc-200
                  hover: {
                    y: -10,
                    color: "#ff4917", // primary
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                      delay: i * 0.02 // Stagger effect
                    }
                  }
                }}
                transition={{ duration: 0.2 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 lg:mt-8 w-full text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider md:tracking-widest gap-3 text-center md:text-left">
            <div>© {new Date().getFullYear()} PrimeOne Space. All rights reserved.</div>
            <div className="text-zinc-400 flex items-center gap-2">
              <span className="text-sm font-bold">Owned & Operated by <a href="https://www.primeone.global/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Prime One Global Group of Companies</a></span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <span className="flex gap-1.5 grayscale hover:grayscale-0 transition-all duration-300">
                <span title="Sri Lanka">🇱🇰</span>
                <span title="United States">🇺🇸</span>
                <span title="United Kingdom">🇬🇧</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
