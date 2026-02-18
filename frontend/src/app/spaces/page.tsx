"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Users, Wifi, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { baseURL } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Space {
  id: number;
  name: string;
  type: string;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  description: string;
  available: boolean;
  pricing: {
    hourlyRate: number;
    rate2h: number | null;
    rate3h: number | null;
    rate4hPlus: number | null;
    dailyRate: number;
    monthlyRate: number | null;
    features: string[];
  };
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await fetch(`${baseURL}/spaces`);
      const data = await response.json();
      const spacesData = Array.isArray(data) ? data : [];

      // Sanitize data to ensure amenities is always an array
      const sanitizedData = spacesData.map((space: any) => {
        let amenities = space.amenities;
        if (typeof amenities === 'string') {
          try {
            // Try parsing if it's a JSON string (double encoded case)
            const parsed = JSON.parse(amenities);
            if (Array.isArray(parsed)) amenities = parsed;
            else amenities = [amenities]; // Treat as single item
          } catch (e) {
            // If parse fails, treat as comma-separated or single item
            amenities = amenities.includes(',')
              ? amenities.split(',').map((s: string) => s.trim())
              : [amenities];
          }
        } else if (!Array.isArray(amenities)) {
          amenities = [];
        }
        return { ...space, amenities };
      });

      setSpaces(sanitizedData);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSpace = (spaceId: number) => {
    // Redirect directly to booking. The booking page handles auth requirements for "Confirm" action.
    router.push(`/bookings/new?spaceId=${spaceId}`);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[500px] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative py-24 lg:py-32 overflow-hidden bg-[#14212B] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
              <Building2 className="w-3.5 h-3.5 mr-2 text-primary fill-primary" />
              Choose Your Spot
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-white">
              Flexible <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Pick how you want to work from an open desk to a spot for team huddles. Everything is built to keep you comfortable while you work.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {spaces.map((space) => (
            <motion.div key={space.id} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={fixImageUrl(space.imageUrl)}
                    alt={space.name}

                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {space.available ? (
                      <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0 font-bold px-3 py-1">Available</Badge>
                    ) : (
                      <Badge variant="destructive" className="font-bold px-3 py-1">Unavailable</Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h3 className="text-2xl font-bold leading-tight">{space.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Suitable for {space.capacity} {space.capacity === 1 ? "person" : "people"}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 p-6 flex flex-col">
                  <p className="text-muted-foreground line-clamp-3 mb-6 text-sm leading-relaxed">
                    {space.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">Included Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {space.amenities?.map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-normal">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-dashed">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold block">LKR {space.pricing?.hourlyRate}</span>
                        <span className="text-xs text-muted-foreground uppercase font-medium">Per Hour</span>
                      </div>
                      <div className="text-right text-xs text-muted-foreground space-y-0.5">
                        {space.pricing?.rate2h && <div>2h: {space.pricing.rate2h}/hr</div>}
                        {space.pricing?.rate3h && <div>3h: {space.pricing.rate3h}/hr</div>}
                        {space.pricing?.rate4hPlus && <div>3h+: {space.pricing.rate4hPlus}/hr</div>}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBookSpace(space.id)}
                      className="w-full rounded-full group/btn"
                      size="lg"
                      disabled={!space.available}
                    >
                      {space.available ? "Book Space Now" : "Currently Unavailable"}
                      {space.available && <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {!session?.user && (
          <div className="mt-24">
            <div className="relative rounded-3xl overflow-hidden bg-[#14212B] text-white p-12 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 px-3 py-1 uppercase tracking-widest text-[10px] font-bold">
                  Get Started
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">A Place for You.</h2>
                <p className="text-lg text-zinc-400 font-light leading-relaxed">
                  We’ve made it easy to jump in whenever you’re ready. Setting up your account keeps you connected to our space and the special rates we have waiting for you.
                </p>
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-white text-white hover:text-[#14212B] rounded-full font-bold px-10 h-14 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
