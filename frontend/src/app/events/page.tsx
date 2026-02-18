"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Users, UserCheck, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { baseURL } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  imageUrl: string;
  published: boolean;
}

interface EventRegistration {
  isRegistered: boolean;
  registrationCount: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Record<number, EventRegistration>>({});
  const [registering, setRegistering] = useState<Record<number, boolean>>({});

  // New state for booking dialog
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const resp = await fetch(`${baseURL}/events`);
      const data = await resp.json();
      const eventsData = Array.isArray(data) ? data : [];
      setEvents(eventsData);

      const regData: Record<number, EventRegistration> = {};
      for (const event of eventsData) {
        try {
          const regResponse = await fetch(`${baseURL}/event-registrations?eventId=${event.id}`);
          const regInfo = await regResponse.json();
          regData[event.id] = regInfo;
        } catch {
          regData[event.id] = { isRegistered: false, registrationCount: 0 };
        }
      }
      setRegistrations(regData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleRegister = async (eventId: number) => {
    const token = localStorage.getItem("bearer_token");
    if (!token) {
      toast.error("Please login to register for events");
      return;
    }

    setRegistering(prev => ({ ...prev, [eventId]: true }));

    try {
      const response = await fetch(`${baseURL}/event-registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId,
          phone: bookingForm.phone
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      toast.success("Successfully registered for event!");
      setShowBookingDialog(false);

      setRegistrations(prev => ({
        ...prev,
        [eventId]: {
          isRegistered: true,
          registrationCount: prev[eventId]?.registrationCount + 1 || 1
        }
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
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
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
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
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-primary fill-primary" />
              Connect & Grow
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Community <span className="text-primary">Events</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Join our curated workshops, networking nights, and learning sessions tailored for Vavuniya's innovators.
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
          {events.length === 0 ? (
            <div className="col-span-full">
              <Card className="max-w-xl mx-auto border-dashed border-2 shadow-none bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border">
                    <Calendar className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">No Upcoming Events</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    We're currently curating our next series of events. Stay tuned for exciting workshops and meetups!
                  </p>
                  <Button asChild className="rounded-full">
                    <Link href="/contact">Get Notified When Events Drop</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            events.map((event) => {
              const dateInfo = formatEventDate(event.eventDate);
              const regInfo = registrations[event.id] || { isRegistered: false, registrationCount: 0 };
              const isRegistering = registering[event.id] || false;

              return (
                <motion.div key={event.id} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card group flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <img
                        src={fixImageUrl(event.imageUrl) || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format"}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-white/90 text-black shadow-sm backdrop-blur-sm border-0 font-bold px-3 py-1">
                          Upcoming
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                          <div className="flex flex-col px-2 border-r border-white/20">
                            <span className="text-xs uppercase tracking-wider opacity-80">{dateInfo.month}</span>
                            <span className="text-2xl font-black leading-none">{dateInfo.day}</span>
                          </div>
                          <div className="flex items-center px-3">
                            <span className="text-sm font-medium">{dateInfo.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-6 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-4 mt-auto">
                        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">PrimeOne Space</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{regInfo.registrationCount} Joining</span>
                          </div>
                        </div>

                        {regInfo.isRegistered ? (
                          <Button className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white" disabled>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Registered Successfully
                          </Button>
                        ) : (
                          <Button
                            className="w-full rounded-full group/btn"
                            onClick={() => {
                              if (!session?.user) {
                                toast.error("Please login to register for events");
                                return;
                              }
                              setSelectedEvent(event);
                              setBookingForm({
                                name: session.user.name || "",
                                email: session.user.email || "",
                                phone: ""
                              });
                              setShowBookingDialog(true);
                            }}
                            disabled={isRegistering}
                            size="lg"
                          >
                            {isRegistering ? "Registering..." : "Reserve Your Spot"}
                            {!isRegistering && <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Your Reservation</DialogTitle>
              <DialogDescription>
                Please confirm your details to reserve a spot for <strong>{selectedEvent?.title}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled // Email usually shouldn't change for logged in user to avoid mismatch
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>Cancel</Button>
              <Button onClick={() => selectedEvent && handleRegister(selectedEvent.id)} disabled={registering[selectedEvent?.id || 0]}>
                {registering[selectedEvent?.id || 0] ? "Confirming..." : "Confirm Reservation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
}
