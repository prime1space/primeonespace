"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, baseURL } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, RefreshCw, XCircle, Loader2, Sparkles, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Booking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationType: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  spaceName: string;
  spaceImage: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user) {
        fetchBookings();
      }
    };
    const handleBookingUpdate = () => {
      if (session?.user) fetchBookings();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("bookingUpdated", handleBookingUpdate);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("bookingUpdated", handleBookingUpdate);
    };
  }, [session]);

  const fetchBookings = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("bearer_token");
      if (!token) {
        setError("Please log in to view your bookings");
        return;
      }
      const response = await fetch(`${baseURL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }
    setCancellingId(bookingId);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`${baseURL}/bookings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: bookingId, status: "cancelled" }),
      });
      if (!response.ok) throw new Error("Failed to cancel booking");
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Could not cancel booking. Please contact support.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const isUpcoming = (b: Booking) => new Date(b.bookingDate) >= new Date();

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(b => !isUpcoming(b));

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <motion.div variants={itemVariants}>
      <Card className="border-dashed border-2 bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/30 transition-colors duration-300">
        <CardContent className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">{description}</p>
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Link href="/spaces">
              Browse Spaces <span className="ml-2">→</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderBookingCard = (booking: Booking, showCancel = false) => (
    <motion.div
      key={booking.id}
      variants={itemVariants}
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative grid md:grid-cols-[280px_1fr] gap-0">
        {/* Image Section */}
        <div className="relative h-56 md:h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
          <img
            src={booking.spaceImage || "/placeholder-space.jpg"}
            alt={booking.spaceName}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-space.jpg"; }}
          />
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <Badge variant={getStatusColor(booking.bookingStatus)} className="shadow-sm backdrop-blur-md bg-background/80 text-foreground font-semibold px-3 py-1">
              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary/70" />
                  {booking.spaceName}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                  {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <Badge variant="outline" className="px-4 py-1.5 font-semibold border-primary/20 bg-primary/5 text-primary rounded-full">
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> Time
                </div>
                <div className="font-medium text-foreground text-sm md:text-base">
                  {booking.startTime} – {booking.endTime}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 hidden sm:flex">
                 <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Duration
                </div>
                <div className="font-medium text-foreground capitalize text-sm md:text-base">
                  {booking.durationType}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Amount
                </div>
                <div className="font-medium text-foreground text-sm md:text-base">
                  LKR {booking.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          {showCancel && booking.bookingStatus !== "cancelled" && (
            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled={cancellingId === booking.id}
                onClick={() => handleCancelBooking(booking.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors font-medium relative overflow-hidden group/btn"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                {cancellingId === booking.id ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin relative z-10" /> <span className="relative z-10">Cancelling…</span></>
                ) : (
                  <><XCircle className="w-4 h-4 mr-2 relative z-10" /> <span className="relative z-10">Cancel Reservation</span></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-background/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-destructive mb-6 bg-destructive/10 p-4 rounded-full ring-8 ring-destructive/5"><Calendar className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold mb-3 text-destructive">Error Loading Bookings</h3>
              <p className="text-muted-foreground mb-8 text-center max-w-md">{error}</p>
              <Button onClick={fetchBookings} disabled={loading} variant="outline" className="border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ── Loading state ── */
  if (isPending || loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
            <div>
              <Skeleton className="h-12 w-64 mb-3" />
              <Skeleton className="h-6 w-96 max-w-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-12 w-full sm:w-96 rounded-xl mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 md:h-56 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main view ── */
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 mix-blend-screen filter blur-[100px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-primary/5 mix-blend-screen filter blur-[100px] pointer-events-none rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Bookings</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Manage your workspace reservations, view history, and book new spaces.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex gap-3 w-full sm:w-auto"
          >
            <Button variant="outline" onClick={fetchBookings} disabled={loading} className="flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 transition-colors">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin text-primary" : ""}`} />
              Refresh
            </Button>
            <Button asChild className="flex-1 sm:flex-none shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Link href="/spaces">
                <Sparkles className="w-4 h-4 mr-2" />
                New Booking
              </Link>
            </Button>
          </motion.div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="bg-background/80 backdrop-blur-md border border-border/50 p-1.5 rounded-xl shadow-sm inline-flex h-auto w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="upcoming" className="rounded-lg py-2.5 px-6 data-[state=active]:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Upcoming <Badge variant="secondary" className="ml-2 bg-background/20 text-current hover:bg-background/20 font-semibold">{upcomingBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg py-2.5 px-6 data-[state=active]:shadow-md transition-all">
              Past <span className="ml-2 opacity-60 font-semibold">({pastBookings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg py-2.5 px-6 data-[state=active]:shadow-md transition-all">
              All <span className="ml-2 opacity-60 font-semibold">({bookings.length})</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="upcoming" className="m-0 border-0 outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {upcomingBookings.length === 0 ? (
                  <EmptyState 
                    icon={Calendar} 
                    title="No upcoming bookings" 
                    description="Your future reservations will appear here. Secure your spot today!" 
                  />
                ) : (
                  upcomingBookings.map(b => renderBookingCard(b, true))
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="past" className="m-0 border-0 outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {pastBookings.length === 0 ? (
                  <EmptyState 
                    icon={Clock} 
                    title="No past bookings" 
                    description="Your booking history will appear here once you've completed a reservation." 
                  />
                ) : (
                  pastBookings.map(b => renderBookingCard(b, false))
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="all" className="m-0 border-0 outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {bookings.length === 0 ? (
                  <EmptyState 
                    icon={Building2} 
                    title="No bookings yet" 
                    description="Start your journey with us by booking your first workspace." 
                  />
                ) : (
                  bookings.map(b => renderBookingCard(b, isUpcoming(b)))
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}