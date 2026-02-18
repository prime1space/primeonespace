"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Album, CheckCircle, Users, Target, Heart, Zap, Shield, Sparkles, Rocket, ArrowRight, Award, Building2, Clock, Star, Handshake, Gem, TrendingUp, Lightbulb, Wifi } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  const values = [
    {
      icon: Users,
      title: "Better Together",
      description: "Build your network in a space designed for professional connection and growth.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Built Right",
      description: "Focus on your goals while we maintain a high-standard, distraction-free environment.",
      color: "text-primary"
    },
    {
      icon: Heart,
      title: "Helping You Win",
      description: "We provide the quiet, steady support needed for you to reach every milestone.",
      color: "text-primary"
    },
    {
      icon: Wifi,
      title: "Stay Connected",
      description: "Work at the speed of your ideas with reliable, high-end Starlink infrastructure.",
      color: "text-primary"
    }
  ];



  const stats = [
    { value: "500+", label: "Happy Members", icon: Users },
    { value: "50+", label: "Partner Companies", icon: Building2 },
    { value: "10K+", label: "Hours of Focus", icon: Clock },
    { value: "4.9", label: "Average Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-[#14212B] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
              <Rocket className="w-3.5 h-3.5 mr-2 text-primary fill-primary" />
              Our Mission
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Professional. <span className="text-primary">Refined.</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Your environment defines your results. We offer a curated space that balances utility with a calm, focused setting.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {/* Our Story / Vision Split */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
            <motion.div variants={itemVariants} className="bg-[#1A2733] relative rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/5 overflow-hidden h-full flex flex-col justify-center text-white isolate">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

              <div className="relative z-10">
                <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest border-primary/30 text-primary bg-primary/5 backdrop-blur-sm w-fit flex items-center gap-2">
                  <Target className="w-3 h-3" /> Our Origin Story
                </Badge>

                <h2 className="text-3xl lg:text-4xl font-black mb-8 leading-tight">
                  Built for <span className="text-primary">Focus.</span>
                </h2>

                <div className="space-y-6 text-zinc-300 leading-relaxed text-lg font-light">
                  <p>
                    PrimeOneSpace was founded on a simple belief: that quality work requires a quality environment.
                  </p>
                  <p>
                    We saw a need for professional infrastructure that balances focus with high-end utility.
                  </p>

                  <div className="pt-4 flex items-center gap-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
                    <p className="font-medium text-white text-xl italic">
                      "Our focus is simple: providing the perfect setting for your best work."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative h-[400px] lg:h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Collaboration"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-bold uppercase tracking-wider text-sm">Our Philosophy</span>
                </div>
                <p className="text-lg font-light opacity-90">"Innovation happens when diverse minds connect in an inspiring environment."</p>
              </div>
            </motion.div>
          </div>

          {/* Core Values */}
          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#14212B] dark:text-white mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The non-negotiable principles that drive our every decision.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="h-full group p-8 bg-background border border-primary rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary/10 transition-transform duration-300 group-hover:scale-110`}>
                      <value.icon className={`w-6 h-6 text-primary`} />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>



          {/* Stats Section - Renovated */}
          <motion.div variants={itemVariants} className="rounded-3xl overflow-hidden bg-[#14212B] text-white relative py-16 px-6 md:px-12">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { value: 500, label: "Happy Members", icon: Users, suffix: "+" },
                { value: 50, label: "Partner Companies", icon: Building2, suffix: "+" },
                { value: 10000, label: "Hours of Focus", icon: Clock, suffix: "+" },
                { value: 4.9, label: "Average Rating", icon: Star, suffix: "", decimals: 1 }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-center mb-2 text-primary opacity-80">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black tracking-tight flex justify-center items-center">
                    <Counter value={stat.value} decimals={stat.decimals} />{stat.suffix}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-zinc-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience It Yourself?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Don't take our word for it. Come visit us, grab a coffee, and feel the energy of our community.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/contact">Book a Free Tour</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/spaces">View Memberships</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Counter({ value, decimals = 0 }: { value: number, decimals?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState<string | number>(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (decimals > 0) {
        setDisplayValue(latest.toFixed(decimals));
      } else {
        setDisplayValue(Math.round(latest).toLocaleString());
      }
    });
  }, [springValue, decimals]);

  return <span ref={ref}>{displayValue}</span>;
}


