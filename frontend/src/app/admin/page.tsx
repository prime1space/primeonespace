"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, baseURL, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Loader2
} from "lucide-react";
import { PricingManager } from "@/components/admin/PricingManager";
import { generateReceipt } from "@/lib/receipt-generator";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { SpacesManager } from "@/components/admin/SpacesManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { OffersManager } from "@/components/admin/OffersManager";
import { EventsManager } from "@/components/admin/EventsManager";

interface Booking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  spaceName: string;
  userName: string;
  userEmail: string;
  guestPhone: string;
  seatNumber?: string;
  nicPassport?: string;
  refreshments?: { name: string; quantity: number; price: number }[];
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activeMembers: 0,
  });

  useEffect(() => {
    if (!isPending) {
      // Check if we have a token in localStorage - if so, wait for session to load
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('bearer_token');

      if (!session?.user) {
        // If we have a token, give more time for session to load
        const delay = hasToken ? 3000 : 1000;
        const timer = setTimeout(() => {
          if (!session?.user) {
            router.push("/login");
          }
        }, delay);
        return () => clearTimeout(timer);
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'prime1@gmail.com';
      if (session?.user?.email !== adminEmail) {
        const timer = setTimeout(() => {
          if (session?.user?.email !== adminEmail) {
            router.push("/dashboard");
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'prime1@gmail.com';
    if (session?.user?.email === adminEmail) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${baseURL}/bookings`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);

      // Calculate stats
      const total = bookingsArray.length;
      const revenue = bookingsArray
        .filter((b: Booking) => b.paymentStatus === "completed")
        .reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);
      const pending = bookingsArray.filter((b: Booking) => b.bookingStatus === "pending").length;

      setStats({
        totalBookings: total,
        totalRevenue: revenue,
        pendingBookings: pending,
        activeMembers: 12, // Mock data
      });
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${baseURL}/bookings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error();

      fetchBookings();
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const handleEmailReceipt = async (booking: Booking) => {
    try {
      toast.info("Generating and sending receipt...");

      // 1. Generate PDF Blob
      const pdfBlob = generateReceipt(booking as any, true);

      // 2. Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob as Blob);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // 3. Send to Backend
        const res = await fetch(`${baseURL}/send-receipt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
          },
          body: JSON.stringify({
            bookingId: booking.id,
            pdfData: base64data
          })
        });

        if (res.ok) {
          toast.success("Receipt emailed successfully!");
        } else {
          toast.error("Failed to email receipt.");
        }
      }
    } catch (e) {
      toast.error("Error sending receipt.");
    }
  };

  if (isPending || loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.bookingDate) >= new Date()
  );
  const recentBookings = bookings.slice(0, 10);

  return (
    <div className="pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Community workspace</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard & Bookings</TabsTrigger>
            <TabsTrigger value="pricing">Manage Pricing</TabsTrigger>
            <TabsTrigger value="spaces">Spaces</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">LKR {stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeMembers}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings Management */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Complete list of all bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>NIC/Passport</TableHead>
                          <TableHead>Space</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Refreshments</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">#{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{booking.userName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.userEmail}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.guestPhone || "-"}</TableCell>
                            <TableCell>{booking.nicPassport || "-"}</TableCell>
                            <TableCell>{booking.spaceName}</TableCell>
                            <TableCell>{booking.seatNumber || "-"}</TableCell>
                            <TableCell>
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {booking.startTime} - {booking.endTime}
                            </TableCell>
                            <TableCell>LKR {booking.totalAmount}</TableCell>
                            <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{booking.paymentStatus}</Badge>
                            </TableCell>
                            <TableCell>
                              {booking.refreshments && booking.refreshments.length > 0 ? (
                                <div className="space-y-1">
                                  {booking.refreshments.map((r, idx) => (
                                    <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                                      {r.quantity}x {r.name}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 w-max">
                                <Button size="sm" variant="outline" onClick={() => generateReceipt(booking as any)}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Receipt
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEmailReceipt(booking)}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Email
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleBookingStatus(booking.id, "cancelled")}>
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Future scheduled bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>NIC/Passport</TableHead>
                          <TableHead>Space</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">#{booking.id}</TableCell>
                            <TableCell>{booking.userName}</TableCell>
                            <TableCell>{booking.guestPhone || "-"}</TableCell>
                            <TableCell>{booking.nicPassport || "-"}</TableCell>
                            <TableCell>{booking.spaceName}</TableCell>
                            <TableCell>{booking.seatNumber || "-"}</TableCell>
                            <TableCell>
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {booking.startTime} - {booking.endTime}
                            </TableCell>
                            <TableCell>LKR {booking.totalAmount}</TableCell>
                            <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="destructive" onClick={() => handleBookingStatus(booking.id, "cancelled")}>
                                Cancel
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Bookings</CardTitle>
                    <CardDescription>Bookings awaiting confirmation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>NIC/Passport</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Space</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .filter((b) => b.bookingStatus === "pending")
                          .map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">#{booking.id}</TableCell>
                              <TableCell>{booking.userName}</TableCell>
                              <TableCell>{booking.guestPhone || "N/A"}</TableCell>
                              <TableCell>{booking.nicPassport || "N/A"}</TableCell>
                              <TableCell>{booking.seatNumber || "-"}</TableCell>
                              <TableCell>{booking.spaceName}</TableCell>
                              <TableCell>
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>LKR {booking.totalAmount}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="default" onClick={() => handleBookingStatus(booking.id, "confirmed")}>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleBookingStatus(booking.id, "cancelled")}>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="pricing">
            <PricingManager />
          </TabsContent>

          <TabsContent value="spaces">
            <SpacesManager />
          </TabsContent>

          <TabsContent value="offers">
            <OffersManager />
          </TabsContent>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
