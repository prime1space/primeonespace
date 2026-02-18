"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, baseURL } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, RefreshCw } from "lucide-react";

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

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Auto-refresh when page becomes visible
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

  const fetchBookings = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("bearer_token");
      if (!token) {
        console.log("No token found");
        setError("Please log in to view your bookings");
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
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setError(error.message || "Failed to load bookings");
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

  const upcomingBookings = bookings.filter(
    b => new Date(b.bookingDate) >= new Date()
  );

  const pastBookings = bookings.filter(
    b => new Date(b.bookingDate) < new Date()
  );

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="overflow-hidden">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="aspect-video md:aspect-square overflow-hidden">
          <img
            src={booking.spaceImage || "/api/placeholder/300/200"}
            alt={booking.spaceName}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/api/placeholder/300/200";
            }}
          />
        </div>
        <div className="md:col-span-3 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{booking.spaceName}</h3>
              <p className="text-muted-foreground">
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge variant={getStatusColor(booking.bookingStatus)}>
                {booking.bookingStatus}
              </Badge>
              <Badge variant="outline">{booking.paymentStatus}</Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-muted-foreground">
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Duration</div>
                <div className="text-muted-foreground capitalize">
                  {booking.durationType}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Amount</div>
                <div className="text-muted-foreground">
                  ${booking.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (error) {
    return (
      <div className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-4">
                <Calendar className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchBookings} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isPending || loading) {
    return (
      <div className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Button
            variant="outline"
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({bookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">Your future bookings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(renderBookingCard)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">Your booking history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(renderBookingCard)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">Start booking workspaces today</p>
                </CardContent>
              </Card>
            ) : (
              bookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}