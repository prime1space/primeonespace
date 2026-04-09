
"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Wifi,
    Coffee,
    Laptop,
    Building2,
    Users,
    Clock,
    Shield,
    Zap,
    Star,
    ArrowRight,
    Sparkles,
    Plus,
    MapPin,
    Navigation,
    Calendar,
    Phone,
    Mail
} from "lucide-react";
import Link from "next/link";
import { OffersPopup } from "@/components/OffersPopup";
import { useRef, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Define prop types matching the DB schema or logic from page.tsx
interface LandingPageProps {
    initialPricing: any[];
    announcements: any[];
    activeOffers: any[];
}

export function LandingPage({ initialPricing, announcements, activeOffers }: LandingPageProps) {
    useEffect(() => {
        // Force scroll to top on page load/refresh
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, []);

    const targetRef = useRef(null);
    const featuresRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const { scrollYProgress: featuresProgress } = useScroll({
        target: featuresRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const featuresY = useTransform(featuresProgress, [0, 1], [0, -100]);

    // Parallax Gallery Logic
    const galleryRef = useRef(null);
    const { scrollYProgress: galleryProgress } = useScroll({
        target: galleryRef,
        offset: ["start end", "end start"]
    });

    const col1Y = useTransform(galleryProgress, [0, 1], [0, -100]);
    const col2Y = useTransform(galleryProgress, [0, 1], [0, -250]);
    const col3Y = useTransform(galleryProgress, [0, 1], [0, -50]);

    const modernStagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariant = {
        hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        }
    };

    const features = [
        {
            icon: Wifi,
            title: "Starlink WiFi",
            description: "Fast Starlink WiFi backed by SLT Fiber. We use two different providers just to make sure you stay online",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
            color: "text-white"
        },
        {
            icon: Coffee,
            title: "Coffee & Refreshments",
            description: "Good coffee and fresh snacks on-site. Grab a quick caffeine fix here so you can stay in the zone.",
            image: "/refreshments_landing.png",
            color: "text-white"
        },
        {
            icon: Users,
            title: "Meeting Rooms",
            description: "Everything you need for a smooth meeting. Use the Smart TV for your slides and keep everyone charged up easily.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
            color: "text-white"
        },
        {
            icon: Clock,
            title: "24/7 Access",
            description: "Work whenever you need. Secure access 24/7 so you can stick to your own schedule, not ours.",
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop",
            color: "text-white"
        },
        {
            icon: Shield,
            title: "Secure Workspace",
            description: "Work without the worry. With CCTV and secure lockers, your gear stays safe while you’re away from your desk.",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
            color: "text-white"
        },
        {
            icon: Zap,
            title: "Premium Amenities",
            description: "Stay cool in our AC and get comfy while you work. We’ve got power outlets everywhere so you’re never hunting for a plug.",
            image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600&auto=format&fit=crop",
            color: "text-white"
        }
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "CEO, TechVision Solutions",
            content: "PrimeOne Space has been instrumental in growing my business. The professional environment and excellent amenities have helped us attract top talent.",
            rating: 5,
            image: "https://i.pravatar.cc/150?img=12"
        },
        {
            name: "Priya Senthil",
            role: "Graphic Designer",
            content: "As a freelancer, having a dedicated workspace at PrimeOne Space has improved my productivity tremendously. The Starlink WiFi is incredibly fast.",
            rating: 5,
            image: "https://i.pravatar.cc/150?img=45"
        },
        {
            name: "Arun Chandrasekaran",
            role: "Founder, DigitalHub Lanka",
            content: "Starting our company from PrimeOne Space was the best decision. The flexible pricing and professional atmosphere helped us focus on building our product.",
            rating: 5,
            image: "https://i.pravatar.cc/150?img=33"
        }
    ];

    const getPrice = (type: string) => initialPricing.find(p => p.spaceType === type);

    const displayPricing = [
        {
            name: "Dedicated Desk",
            type: "dedicated_desk",
            description: "Your own workspace with premium amenities",
            features: ["Starlink WiFi", "Power outlets", "Ergonomic chair", "Desk lamp"],
            hourly: getPrice("dedicated_desk")?.hourlyRate ?? 500,
            daily: getPrice("dedicated_desk")?.dailyRate ?? 3000,
            monthly: getPrice("dedicated_desk")?.monthlyRate ?? 45000,
            popular: false
        },
        {
            name: "Meeting Room",
            type: "meeting_room",
            description: "Professional meeting space for teams",
            features: ["Projector", "Whiteboard", "Video conferencing", "Refreshments"],
            hourly: getPrice("meeting_room")?.hourlyRate ?? 1500,
            daily: getPrice("meeting_room")?.dailyRate ?? 10000,
            monthly: getPrice("meeting_room")?.monthlyRate ?? null,
            popular: true
        },
        {
            name: "Private Office",
            type: "private_office",
            description: "Fully equipped private office for teams",
            features: ["Standing desk", "Private entrance", "Storage", "24/7 access"],
            hourly: getPrice("private_office")?.hourlyRate ?? 2000,
            daily: getPrice("private_office")?.dailyRate ?? 15000,
            monthly: getPrice("private_office")?.monthlyRate ?? 120000,
            popular: false
        }
    ];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // 3D Tilt Hook Logic for Hero Imagery
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden font-sans">
            <OffersPopup offers={activeOffers} />
            {/* Hero Section */}
            <section ref={targetRef} className="relative min-h-[100dvh] md:min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-background dark:bg-background">
                {/* Background Elements - Subtle monochrome Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100/50 via-background to-background dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 z-0" />
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-zinc-300/30 dark:bg-zinc-800/30 rounded-full blur-3xl opacity-50" />

                {/* Announcements Banner - Integrated into Hero Background */}
                {announcements.length > 0 && (
                    <div className="w-full flex justify-center py-6 relative z-10 mt-2 left-0 right-0 pointer-events-none">
                        <motion.div
                            initial={{ y: -20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            className="pointer-events-auto flex items-center gap-3 py-2 px-4 md:px-6 bg-[#14212B]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(255,107,0,0.2)] hover:border-primary/30 transition-all duration-300 cursor-pointer group max-w-[90vw]"
                        >
                            <span className="relative flex h-2 w-2 flex-shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>

                            <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-300 overflow-hidden">
                                <span className="font-bold text-white tracking-wide whitespace-nowrap">{announcements[0].title}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                                <span className="font-light truncate max-w-[150px] md:max-w-xs">{announcements[0].content}</span>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </motion.div>
                    </div>
                )}

                {/* Mobile Background Image */}
                <div className="absolute inset-0 z-0 md:hidden">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90 backdrop-blur-[2px]" />
                </div>

                <motion.div style={{ opacity, scale }} className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-4 md:space-y-6 relative z-20 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-0"
                    >

                        <div className="space-y-4 w-full">
                            <motion.h1
                                className="text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-zinc-900 dark:text-white"
                            >
                                {["Work", "Smarter."].map((word, i) => (
                                    <span key={i} className="block overflow-hidden pb-2">
                                        <motion.span
                                            initial={{ y: "100%", opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                duration: 1.2,
                                                delay: 0.2 + i * 0.15,
                                                ease: [0.16, 1, 0.3, 1] // Apple-style custom cubic bezier
                                            }}
                                            className={i === 1 ? "text-primary block font-black drop-shadow-lg md:drop-shadow-none" : "text-white md:text-[#14212B] md:dark:text-white block font-black drop-shadow-lg md:drop-shadow-none"}
                                        >
                                            {word}
                                        </motion.span>
                                    </span>
                                ))}
                            </motion.h1>
                        </div>

                        <motion.p
                            variants={fadeIn}
                            className="text-base md:text-xl text-zinc-200 md:text-zinc-600 md:dark:text-zinc-400 max-w-md leading-relaxed font-medium drop-shadow-md md:drop-shadow-none"
                        >
                            A shared workspace designed for the modern hustle. The perfect spot to stay sharp and the community to keep you inspired.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2 md:pt-4 w-full">
                            <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 text-base bg-primary hover:bg-primary/90 md:hover:bg-[#14212B] text-white md:dark:bg-white md:dark:text-black md:dark:hover:bg-[#14212B] md:dark:hover:text-white transition-all shadow-[0_8px_30px_rgba(255,107,0,0.3)] md:shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                <Link href="/spaces">
                                    Book Your Space <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base border-white/30 text-white hover:bg-white hover:text-black md:border-zinc-200 md:text-foreground md:dark:border-zinc-800 md:hover:bg-[#14212B] md:hover:text-white md:dark:hover:bg-white md:dark:hover:text-[#14212B] transition-all bg-white/5 backdrop-blur-md md:bg-transparent">
                                <Link href="/contact">Schedule Tour</Link>
                            </Button>

                            {/* Live Vibe Indicator */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full ml-2"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live: 8 desks active</span>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 pt-6">
                            {[
                                { label: "Starlink WiFi", icon: Wifi },
                                { label: "Italian Coffee", icon: Coffee },
                                { label: "One Click Away", icon: Calendar }
                            ].map((indicator, i) => (
                                <div key={i} className="flex items-center justify-center gap-2 group cursor-default">
                                    <div className="p-1.5 bg-white/10 md:bg-zinc-50 md:dark:bg-zinc-900 rounded-md backdrop-blur-sm md:backdrop-blur-none group-hover:bg-primary/20 md:group-hover:bg-primary/10 text-white md:text-zinc-600 md:dark:text-zinc-400 group-hover:text-primary transition-colors duration-300">
                                        <indicator.icon className="w-4 h-4" />
                                    </div>
                                    <div className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-300 md:text-zinc-500 font-bold group-hover:text-white md:group-hover:text-zinc-900 md:dark:group-hover:text-white transition-colors">
                                        {indicator.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative hidden md:block h-[400px] lg:h-[600px] w-full"
                    >
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] overflow-visible -z-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100 dark:bg-zinc-800 rounded-full blur-3xl opacity-60" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-200 dark:bg-primary rounded-full blur-3xl opacity-60" />
                        </div>

                        {/* Image 1: Main Large Vertical */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            style={{ translateZ: 50 }}
                            className="absolute top-0 left-0 w-2/3 h-full z-10"
                        >
                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl grayscale-0 hover:grayscale transition-all duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                                    alt="Main Workspace"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white z-20">
                                    <div className="text-xs font-bold uppercase tracking-widest mb-1">Main Hub</div>
                                    <div className="text-2xl font-serif">Open Space</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image 2: Top Right */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            style={{ translateZ: 100 }}
                            className="absolute top-8 right-0 w-1/3 h-[45%] z-20"
                        >
                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl grayscale-0 hover:grayscale transition-all duration-700 border-4 border-white dark:border-zinc-950">
                                <img
                                    src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80"
                                    alt="Detail"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </motion.div>

                        {/* Image 3: Bottom Right with Floating Card */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            style={{ translateZ: 150 }}
                            className="absolute bottom-8 -right-4 w-[40%] h-[40%] z-30"
                        >
                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl grayscale-0 hover:grayscale transition-all duration-700 border-4 border-white dark:border-zinc-950">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80"
                                    alt="Meeting"
                                    className="object-cover w-full h-full"
                                />
                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4 z-40">
                                    <div className="bg-black/90 text-white backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 shadow-lg text-[10px] uppercase tracking-wide">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Live
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative floating detail */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: "spring" }}
                            style={{ translateZ: 200 }}
                            className="absolute bottom-1/3 right-1/4 z-40 bg-primary text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20"
                        >
                            <div className="p-1 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src="/Starlink-Logo-White-PNG.png"
                                    alt="Starlink"
                                    className="w-16 h-auto"
                                />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-white/80">Starlink Network</div>
                                <div className="font-bold text-lg leading-none">500 Mbps</div>
                            </div>
                        </motion.div>

                    </motion.div>
                </motion.div>
            </section>

            {/* Unique Page Break - Velocity Tapes */}
            <div className="relative h-48 overflow-hidden z-20 -mt-24 pointer-events-none select-none">
                {/* Tape 1: RedPink - Left to Right */}
                <motion.div
                    className="absolute top-1/2 left-[-10%] w-[120%] bg-primary shadow-2xl origin-center -rotate-3 py-4 flex items-center justify-center border-y-2 border-white/20"
                >
                    <motion.div
                        className="flex whitespace-nowrap font-black text-2xl text-white uppercase tracking-widest gap-8"
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <span key={i} className="flex items-center gap-8">
                                ELEVATE YOUR WORK <span className="text-[#14212B]">★</span>
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Tape 2: Dark Blue - Right to Left */}
                <motion.div
                    className="absolute top-1/2 left-[-10%] w-[120%] bg-[#14212B] shadow-2xl origin-center rotate-2 py-4 flex items-center justify-center border-y-2 border-primary/50 mix-blend-hard-light dark:mix-blend-normal"
                >
                    <motion.div
                        className="flex whitespace-nowrap font-black text-2xl text-white uppercase tracking-widest gap-8"
                        animate={{ x: [-1000, 0] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <span key={i} className="flex items-center gap-8">
                                JOIN THE REVOLUTION <span className="text-primary">✦</span>
                            </span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Features Section - Premium */}
            <section ref={featuresRef} className="pt-20 pb-32 relative overflow-hidden bg-zinc-50 dark:bg-background">
                {/* Mobile Section Background */}
                <div className="absolute inset-0 z-0 md:hidden">
                    <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80"
                        alt="Office Essentials"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-[2px]" />
                </div>

                {/* Background Pattern with Parallax (Desktop) */}
                <motion.div
                    style={{ y: featuresY }}
                    className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none hidden md:block"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                </motion.div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0 }}
                        variants={modernStagger}
                        className="text-center mb-12 md:mb-24"
                    >
                        <motion.div variants={cardVariant} className="flex justify-center mb-4">
                            <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-medium uppercase tracking-widest border-zinc-500/50 text-zinc-700 dark:text-zinc-300 backdrop-blur-sm bg-white/50 dark:bg-black/50 md:bg-transparent">
                                Amenities
                            </Badge>
                        </motion.div>
                        <motion.h2 variants={cardVariant} className="text-4xl md:text-7xl font-black tracking-tighter mb-4 md:mb-8 text-primary">
                            <span className="text-[#14212B] dark:text-white">The</span> Essentials for Modern Work
                        </motion.h2>
                        <motion.p variants={cardVariant} className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed px-4">
                            Everything you need to stay focused, connected, and productive within a secure shared workplace.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1, margin: "0px 0px 300px 0px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 lg:block gap-4 lg:gap-0 lg:space-y-4"
                    >
                        {/* Row 1 */}
                        <div className="contents lg:flex lg:flex-row lg:gap-4 lg:h-[400px]">
                            {features.slice(0, 3).map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    className="relative flex-1 group hover:flex-[2] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] min-w-[140px] min-h-[160px] lg:min-h-full rounded-[1.25rem] lg:rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 shadow-lg lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-filter-none"
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-0 block">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 transform scale-100 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-3 lg:p-8 flex flex-col justify-end lg:justify-end items-start lg:items-start text-left">
                                        <div className="transform translate-y-0 lg:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 w-full">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 mb-1 lg:mb-3">
                                                <div className="p-1.5 lg:p-3 bg-white/20 lg:bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl text-white border border-white/30 lg:border-white/20 transition-opacity duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] lg:shadow-none">
                                                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                                                </div>
                                                <h3 className="text-[14px] md:text-2xl font-bold text-white leading-tight transition-opacity duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] w-full">
                                                    {feature.title}
                                                </h3>
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Row 2 */}
                        <div className="contents lg:flex lg:flex-row lg:gap-4 lg:h-[400px]">
                            {features.slice(3, 6).map((feature, index) => (
                                <motion.div
                                    key={index + 3}
                                    variants={fadeIn}
                                    className="relative flex-1 group hover:flex-[2] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] min-w-[140px] min-h-[160px] lg:min-h-full rounded-[1.25rem] lg:rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 shadow-lg lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-filter-none"
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-0 block">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 transform scale-100 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-3 lg:p-8 flex flex-col justify-end lg:justify-end items-start lg:items-start text-left">
                                        <div className="transform translate-y-0 lg:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 w-full">
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 mb-1 lg:mb-3">
                                                <div className="p-1.5 lg:p-3 bg-white/20 lg:bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl text-white border border-white/30 lg:border-white/20 transition-opacity duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] lg:shadow-none">
                                                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                                                </div>
                                                <h3 className="text-[14px] md:text-2xl font-bold text-white leading-tight transition-opacity duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] w-full">
                                                    {feature.title}
                                                </h3>
                                            </div>
                                            <p className="text-zinc-300 text-sm leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/*/ Find Your Space Section - Replacement for Pricing //*/}
            <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden" id="spaces-preview">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Content Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 space-y-8 text-left"
                        >
                            <div>
                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 rounded-full uppercase tracking-widest text-[10px] px-3 py-1 mb-6 inline-block">
                                    Workspaces
                                </Badge>
                                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-6">
                                    <span className="text-[#14212B] dark:text-white">Find Your</span> <br />
                                    <span className="text-primary">Perfect Space.</span>
                                </h2>
                                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
                                    Whether you’re working solo, visiting for a few hours, collaborating with internal teams, or hosting a meeting, PrimeOne Space offers flexible shared‑workplace access.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:gap-6 text-left">
                                <div className="space-y-1 md:space-y-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-primary">
                                        <Laptop className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <h3 className="font-bold text-[13px] md:text-lg text-zinc-900 dark:text-white leading-tight">Hot<br className="md:hidden" /> Space</h3>
                                    <p className="text-[11px] md:text-sm text-zinc-500 hidden md:block">Grab any seat in our open area.</p>
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-primary">
                                        <Users className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <h3 className="font-bold text-[13px] md:text-lg text-zinc-900 dark:text-white leading-tight">Shared<br className="md:hidden" /> Space</h3>
                                    <p className="text-[11px] md:text-sm text-zinc-500 hidden md:block">Work right alongside our own friendly team.</p>
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-primary">
                                        <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <h3 className="font-bold text-[13px] md:text-lg text-zinc-900 dark:text-white leading-tight">Meeting<br className="md:hidden" /> Area</h3>
                                    <p className="text-[11px] md:text-sm text-zinc-500 hidden md:block">Open huddle spots for your next presentation.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button asChild size="lg" className="rounded-full px-10 h-14 text-base bg-primary hover:bg-[#14212B] text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                    <Link href="/spaces">
                                        Explore All Spaces <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-1 w-full relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] blur-3xl opacity-50" />
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4 mt-8">
                                    <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl relative group">
                                        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                    </div>
                                    <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl relative group">
                                        <img src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Meeting Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl relative group">
                                        <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Lounge" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                    <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl relative group">
                                        <img src="https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Private Office" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Testimonials - Hidden as requested */}
            {/*
            <section className="py-24 bg-[#14212B] overflow-hidden relative border-y border-zinc-800">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border-zinc-700 text-zinc-300 bg-zinc-800/50 backdrop-blur-sm">
                            Community Voices
                        </Badge>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-primary mb-6">
                            <span className="text-white">Trusted by</span> Innovators.
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Join a network of visionary entrepreneurs and established companies building the future.
                        </p>
                    </div>

                   <div className="relative flex overflow-x-hidden mask-linear-fade py-10">
                        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#14212B] to-transparent z-10" />
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#14212B] to-transparent z-10" />

                        <motion.div
                            className="flex gap-8 whitespace-nowrap"
                            animate={{ x: [0, -1032] }} 
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 25
                            }}
                        >
                            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                                <div
                                    key={i}
                                    className="w-[400px] flex-shrink-0 group relative"
                                >
                                    <div className="relative h-full bg-[#1A2733] border border-zinc-700/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-all duration-300">
                                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.0547 14.3594 14.5449 15.0449 13.4707C15.7305 12.3965 17.0762 11.2324 19.082 9.97852L19.082 6.00781C16.8906 7.64844 15.2285 9.07422 14.0957 10.2852C12.9629 11.4961 12.3965 13.5684 12.3965 16.502L12.3965 21L14.017 21ZM4.98242 21L4.98242 18C4.98242 16.0547 5.32488 14.5449 6.01042 13.4707C6.69596 12.3965 8.04167 11.2324 10.0475 9.97852L10.0475 6.00781C7.85612 7.64844 6.19401 9.07422 5.0612 10.2852C3.92839 11.4961 3.36198 13.5684 3.36198 16.502L3.36198 21L4.98242 21Z" /></svg>
                                        </div>

                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-600 group-hover:border-primary transition-colors duration-300">
                                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#1A2733] flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{t.name}</h4>
                                                <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium mt-1">{t.role}</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex gap-1 mb-2">
                                                {[...Array(5)].map((_, starI) => (
                                                    <Star key={starI} className="w-4 h-4 fill-primary text-primary" />
                                                ))}
                                            </div>
                                        </div>

                                        <blockquote className="text-zinc-300 leading-relaxed text-sm whitespace-normal">
                                            "{t.content}"
                                        </blockquote>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
            */}

            {/* About Section - Unique Bento Layout */}
            <section className="py-24 bg-[#14212B] relative overflow-hidden text-foreground">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:h-[600px]">

                        {/* Box 1: Tall Vertical Image (Left) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative md:row-span-2 rounded-[2rem] overflow-hidden group shadow-2xl border border-white/5"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
                                alt="Modern Workspace"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <Badge variant="outline" className="mb-3 text-white border-white/30 backdrop-blur-sm">Since 2024</Badge>
                                <h3 className="text-3xl font-bold text-white leading-none">Redefining<br />Work.</h3>
                            </div>
                        </motion.div>

                        {/* Box 2: Main Content (Top Right) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-2 bg-gradient-to-br from-[#1d2d3d] to-[#14212B] border border-white/5 rounded-[2rem] p-8 md:p-12 flex flex-col justify-center relative shadow-xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                            <Badge variant="outline" className="w-fit mb-6 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border-primary/30 text-primary bg-primary/5 backdrop-blur-sm">
                                Our Vision
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
                                Built for work. <br />
                                Made for you.
                            </h2>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl">
                                We kept things simple so you can focus on what matters. No distractions or useless fluff just a solid workspace, fast internet, and a community of people working to make things happen.
                            </p>
                        </motion.div>

                        {/* Box 3: Small Detail Image (Bottom Center) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative rounded-[2rem] overflow-hidden group shadow-xl border border-white/5 min-h-[250px] md:min-h-0"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                                alt="Detail"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Box 4: Action Card (Bottom Right) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-full"
                        >
                            <Link href="/about" className="h-full bg-primary hover:bg-white text-white hover:text-[#14212B] rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl group min-h-[250px] md:min-h-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 transition-transform group-hover:scale-150" />

                                <div className="relative z-10">
                                    <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Explore</div>
                                    <div className="text-3xl font-black tracking-tight mb-4">Our Story</div>
                                    <p className="text-sm/relaxed opacity-90 font-medium max-w-[220px]">
                                        Discover the vision behind PrimeOne Space and how we're redefining the modern workspace.
                                    </p>
                                </div>
                                <div className="self-end mt-4 md:mt-0 p-3 bg-white/20 group-hover:bg-[#14212B]/10 rounded-full transition-colors relative z-10">
                                    <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Community Gallery - The Experience */}
            <section className="py-24 bg-white dark:bg-background overflow-hidden relative">
                <div className="container mx-auto px-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs font-medium uppercase tracking-widest border-primary dark:border-zinc-100 text-primary dark:text-zinc-100">
                                Community
                            </Badge>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-primary">
                                <span className="text-[#14212B] dark:text-white">The PrimeOne</span> <br />Experience.
                            </h2>
                        </div>
                        <p className="max-w-md text-zinc-500 text-lg leading-relaxed">
                            A glimpse into life at PrimeOne Space where ideas turn into action.
                        </p>
                    </motion.div>
                </div>

                {/* Parallax Masonry Grid */}
                <div ref={galleryRef} className="container mx-auto px-4 h-[600px] md:h-[800px] overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 items-start">
                        {/* Column 1 - Fast */}
                        <motion.div style={{ y: col1Y }} className="space-y-3 md:space-y-8">
                            {[
                                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
                                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                            ].map((img, i) => (
                                <div key={i} className="group relative h-[340px] md:h-[450px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                                    <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 hover:scale-105" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white font-mono text-[10px] md:text-xs uppercase tracking-widest drop-shadow-md">Collaborate</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 2 - Slow (Offset) */}
                        <motion.div style={{ y: col2Y }} className="space-y-3 md:space-y-8 pt-12 md:pt-24">
                            {[
                                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
                                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
                                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                            ].map((img, i) => (
                                <div key={i} className="group relative h-[280px] md:h-[380px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                                    <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 hover:scale-105" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white font-mono text-[10px] md:text-xs uppercase tracking-widest drop-shadow-md">Innovate</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 3 - Medium */}
                        <motion.div style={{ y: col3Y }} className="space-y-3 md:space-y-8 hidden lg:block">
                            {[
                                "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
                                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                            ].map((img, i) => (
                                <div key={i} className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
                                    <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 hover:scale-105" />
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white font-mono text-xs uppercase tracking-widest">Create</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section - Interactive Grid */}
            <section className="py-32 bg-[#14212B] border-t border-zinc-800 relative overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 mix-blend-screen" />
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30 mix-blend-screen" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                        {/* Left Col - Sticky Header */}
                        <div className="lg:col-span-4 self-start lg:sticky lg:top-32">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-medium uppercase tracking-widest border-primary dark:border-zinc-100 text-primary dark:text-zinc-100">
                                    Support
                                </Badge>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-primary leading-[0.9]">
                                    <span className="text-white">Common</span><br />Questions.
                                </h2>
                                <p className="text-xl text-zinc-300 font-light leading-relaxed">
                                    Providing clarity on your workspace journey. Can't find what you need?
                                </p>
                                <Button asChild variant="link" className="px-0 text-lg font-bold underline decoration-2 underline-offset-4 text-white hover:text-primary transition-colors">
                                    <Link href="/contact">Contact Support &rarr;</Link>
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Col - Accordion List */}
                        <div className="lg:col-span-8">
                            <div className="space-y-4">
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {[
                                        {
                                            question: "What are the opening hours?",
                                            answer: "Daily access with 24/7 availability for members."
                                        },
                                        {
                                            question: "Is parking available?",
                                            answer: "Yes, convenient parking options are nearby."
                                        },
                                        {
                                            question: "Can I bring guests?",
                                            answer: "Guests are welcome for Startup events."
                                        },
                                        {
                                            question: "How fast is the internet?",
                                            answer: "Enterprise‑grade high‑speed internet."
                                        },
                                        {
                                            question: "What's included with a desk booking?",
                                            answer: "Every booking includes high‑speed Starlink WiFi, Italian coffee, access to the shared workspace, and a welcoming community to keep you motivated."
                                        }
                                    ].map((faq, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-none bg-[#1A2733] border border-zinc-700/50 rounded-3xl px-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group">
                                            <AccordionTrigger className="hover:no-underline py-6 [&>svg]:hidden">
                                                <span className="text-xl font-bold text-white text-left">{faq.question}</span>
                                                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-black group-data-[state=open]:text-white dark:group-data-[state=open]:bg-white dark:group-data-[state=open]:text-black">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed pb-8">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Find Us Section */}
            <section className="py-24 bg-white dark:bg-background relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1 text-xs font-medium uppercase tracking-widest border-primary dark:border-zinc-100 text-primary dark:text-zinc-100">
                                Location
                            </Badge>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white mb-8">
                                Locate Us.
                            </h2>
                            <p className="text-xl text-zinc-500 font-light leading-relaxed mb-10 max-w-md">
                                PrimeOne Space is centrally located in Vavuniya.
                            </p>

                            <div className="space-y-8 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-primary flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-primary dark:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-zinc-900 dark:text-white mb-1">Address</div>
                                        <div className="text-zinc-500">146B, Goodshed Road,<br />Thonikkal, Vavuniya, NP, Sri Lanka.</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-primary flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-primary dark:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-zinc-900 dark:text-white mb-1">Phone</div>
                                        <div className="text-zinc-500 whitespace-nowrap">077 222 8507</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-primary flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-primary dark:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-zinc-900 dark:text-white mb-1">Email</div>
                                        <div className="text-zinc-500">hello@primeone.space</div>
                                    </div>
                                </div>
                            </div>

                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-[#14212B] text-white dark:bg-white dark:text-black dark:hover:bg-[#14212B] dark:hover:text-white transition-all shadow-xl hover:shadow-2xl">
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Plan Your Commute
                                </a>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800"
                        >
                            {/* Filter for dark mode map effect */}
                            <iframe
                                src="https://maps.google.com/maps?q=146B,%20Goodshed%20Road,%20Vavuniya,%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: "contrast(1.2) opacity(0.9)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="dark:invert dark:hue-rotate-180"
                            ></iframe>

                            {/* Overlay Card */}
                            <div className="absolute bottom-6 left-6 p-6 bg-white/90 dark:bg-primary/90 backdrop-blur-md rounded-2xl shadow-lg max-w-xs">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Open Now</div>
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Come visit us for a tour. No appointment needed.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Bold Dark Blue */}
            <section className="py-32 bg-[#14212B] text-white text-center relative overflow-hidden">
                {/* Unique Background: The Focus Target */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                    {/* Concentric Rings */}
                    <div className="absolute w-[600px] h-[600px] border border-zinc-500 rounded-full" />
                    <div className="absolute w-[800px] h-[800px] border border-zinc-600/50 rounded-full" />
                    <div className="absolute w-[1200px] h-[1200px] border border-zinc-700/30 rounded-full" />

                    {/* Crosshairs */}
                    <div className="absolute w-full h-px bg-zinc-500/50" />
                    <div className="absolute h-full w-px bg-zinc-500/50" />

                    {/* Decorative Ticks */}
                    <div className="absolute w-[620px] h-[20px] border-x border-primary" />
                    <div className="absolute h-[620px] w-[20px] border-y border-primary" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl mx-auto space-y-10"
                    >
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter relative inline-block">
                            GROW<br />TOGETHER.
                            {/* Small accent dot */}
                            <span className="absolute -top-6 -right-8 text-primary text-6xl animate-pulse">.</span>
                        </h2>
                        <p className="text-lg text-zinc-400 font-light">
                            Join a professionally operated shared workplace built for focus, collaboration, and real business productivity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button asChild size="lg" className="bg-primary hover:bg-[#14212B] text-white px-10 h-14 text-base font-bold rounded-none uppercase tracking-widest border-none transition-all shadow-lg hover:shadow-primary/50">
                                <Link href="/register">Join Now</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary px-10 h-14 text-base font-bold rounded-none uppercase tracking-widest">
                                <Link href="/contact">Visit Us</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div >
    );
}
