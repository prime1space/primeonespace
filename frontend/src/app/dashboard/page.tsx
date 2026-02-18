"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, baseURL } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, DollarSign, MapPin, Plus, TrendingUp, RefreshCw } from "lucide-react";
import Link from "next/link";

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
  spaceType: string;
  spaceImage: string;
}

interface EventRegistration {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  imageUrl: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventRegs, setEventRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0,
    totalEvents: 0
  });

  useEffect(() => {
    if (!isPending) {
      console.log("Session check:", session);
      // Check if we have a token in localStorage - if so, wait for session to load
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('bearer_token');

      if (!session?.user) {
        console.log("No user session, redirecting to login");
        // If we have a token, give more time for session to load
        const delay = hasToken ? 3000 : 1000;
        const timer = setTimeout(() => {
          if (!session?.user) {
            router.push("/login");
          }
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
      fetchEventRegistrations();
    }
  }, [session]);

  // Auto-refresh when page becomes visible (user returns from booking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user) {
        console.log("Page visible, refreshing bookings...");
        fetchBookings();
      }
    };

    const handleBookingUpdate = () => {
      if (session?.user) {
        console.log("Booking updated, refreshing...");
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('bookingUpdated', handleBookingUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, [session]);

  const fetchEventRegistrations = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      if (!token) return;

      const response = await fetch(`${baseURL}/event-registrations`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEventRegs(Array.isArray(data) ? data : []);
        setStats(prev => ({ ...prev, totalEvents: Array.isArray(data) ? data.length : 0 }));
      }
    } catch (error) {
      console.error("Error fetching event registrations:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Fetching bookings from:", `${baseURL}/bookings`);
      const response = await fetch(`${baseURL}/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Bookings fetch error:", errorData);
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("Bookings response:", data);
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);

      // Calculate stats
      const total = bookingsArray.length;
      const upcoming = bookingsArray.filter((b: Booking) =>
        new Date(b.bookingDate) >= new Date() && b.bookingStatus === "confirmed"
      ).length;
      const spent = bookingsArray
        .filter((b: Booking) => b.paymentStatus === "completed" || b.paymentStatus === "paid")
        .reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);

      setStats(prev => ({
        ...prev,
        totalBookings: total,
        upcomingBookings: upcoming,
        totalSpent: spent,
      }));
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isPending || loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookingsList = bookings
    .filter(b => new Date(b.bookingDate) >= new Date())
    .slice(0, 3);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your bookings</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={fetchBookings}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button asChild size="lg">
              <Link href="/spaces">
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Space reservations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LKR {stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
            <Button asChild variant="outline">
              <Link href="/dashboard/bookings">View All</Link>
            </Button>
          </div>

          {upcomingBookingsList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                <p className="text-muted-foreground mb-4">Book a workspace to get started</p>
                <Button asChild>
                  <Link href="/spaces">Browse Spaces</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookingsList.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={booking.spaceImage || ""}
                      alt={booking.spaceName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{booking.spaceName}</CardTitle>
                      <Badge variant={getStatusColor(booking.bookingStatus)}>
                        {booking.bookingStatus}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">LKR {booking.totalAmount.toLocaleString()}</span>
                      <Badge variant="outline" className="ml-auto">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">My Events</h2>
          {eventRegs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No joined events yet</h3>
                <p className="text-muted-foreground mb-4">Join workshops and meetups to connect</p>
                <Button asChild variant="outline">
                  <Link href="/events">Explore Events</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventRegs.slice(0, 3).map((reg) => (
                <Card key={reg.eventId} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={reg.imageUrl || ""}
                      alt={reg.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{reg.title}</CardTitle>
                    <CardDescription>
                      {new Date(reg.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">{reg.description}</p>
                    <div className="mt-4 flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Registered on</span>
                      <span className="text-[10px] font-mono">{new Date(reg.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Member Benefits</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Exclusive perks for PrimeOne Space members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 10% discount on monthly bookings</li>
                <li>✓ Priority access to meeting rooms</li>
                <li>✓ Free printing credits</li>
                <li>✓ Exclusive networking events</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/policies/terms">View Policies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
