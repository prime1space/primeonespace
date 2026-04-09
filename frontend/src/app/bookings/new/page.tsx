"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, addHours, startOfHour, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { baseURL, useSession } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";
import { Loader2, ArrowLeft, Armchair, Info, Monitor, CheckCircle2, CreditCard, Lock, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RefreshmentSelector } from "@/components/bookings/RefreshmentSelector";
import { countries } from "@/lib/countries";

// Helper for search params
function BookingContents() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const spaceId = searchParams.get("spaceId");

  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking State
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00:00");
  const [duration, setDuration] = useState("1");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  // Guest Details
  const [guestName, setGuestName] = useState("");
  const [guestCountry, setGuestCountry] = useState("Sri Lanka");
  const [guestPhone, setGuestPhone] = useState("");
  const [nicPassport, setNicPassport] = useState("");

  // Refreshments
  const [selectedRefreshments, setSelectedRefreshments] = useState<{ id: number; quantity: number; price: number; name: string }[]>([]);

  const [showLogin, setShowLogin] = useState(false);

  // Payment State
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [bookingData, setBookingData] = useState<any>(null);

  // Card Payment State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Calculated totals (shared between steps)
  const calcTotal = () => {
    if (!space) return 0;
    let r = space.pricing?.hourlyRate || 0;
    const d = parseInt(duration);
    if (d === 2 && space.pricing?.rate2h) r = space.pricing.rate2h;
    else if (d === 3 && space.pricing?.rate3h) r = space.pricing.rate3h;
    else if (d > 3 && space.pricing?.rate4hPlus) r = space.pricing.rate4hPlus;
    const isMeeting = space.name.toLowerCase().includes("meeting");
    const qty = isMeeting ? 1 : (selectedSeats.length || 1);
    const spaceCost = Math.round(r * d * qty);
    const addonsCost = selectedRefreshments.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return spaceCost + addonsCost;
  };

  useEffect(() => {
    fetchOccupiedSeats();
  }, [space, date, startTime, duration]);

  const fetchOccupiedSeats = async () => {
    if (!space || !date || !startTime) return;

    const [h, m] = startTime.split(':').map(Number);

    // Clear seats immediately to prevent stale state blocking the UI
    setOccupiedSeats([]);

    const startD = new Date(date);
    startD.setHours(h, m, 0);
    const endD = addHours(startD, parseInt(duration));

    const dStr = format(date, "yyyy-MM-dd");
    const sStr = startTime;
    const eStr = format(endD, "HH:mm:ss");

    try {
      const res = await fetch(`${baseURL}/occupied-seats?spaceId=${space.id}&date=${dStr}&startTime=${sStr}&endTime=${eStr}`);
      if (res.ok) {
        const data = await res.json();
        setOccupiedSeats(data);
        // Deselect if currently selected is now occupied
        setSelectedSeats(prev => prev.filter(s => !data.includes(s)));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!spaceId) {
      toast.error("Invalid space");
      router.push("/spaces");
      return;
    }
    fetchSpace();
  }, [spaceId]);

  const fetchSpace = async () => {
    try {
      const res = await fetch(`${baseURL}/spaces`);
      const spaces = await res.json();
      const found = spaces.find((s: any) => s.id == spaceId);
      if (found) {
        setSpace(found);
      } else {
        toast.error("Space not found");
        router.push("/spaces");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load space");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!date || !startTime) {
      toast.error("Please select a date and time");
      return;
    }

    const isSeatedSpace = space.name.toLowerCase().includes("lobby") || space.name.toLowerCase().includes("high table") || space.name.toLowerCase().includes("meeting");
    if (isSeatedSpace && selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    if (space.name.toLowerCase().includes("high table") && selectedSeats.length > 4 && selectedSeats.length < 6) {
      toast.error("For the High Table: If booking more than 4 seats, you must book the entire table (6 seats).");
      return;
    }

    if (space.name.toLowerCase().includes("meeting") && selectedSeats.length !== 5) {
      toast.error("The Meeting Area must be booked as a whole (All 5 seats).");
      return;
    }

    if (!guestName || !guestPhone || !nicPassport) {
      toast.error("Please fill in all guest details.");
      return;
    }

    // Validate Phone based on Country
    const phoneClean = guestPhone.replace(/[^0-9]/g, '');
    if (guestCountry === "Sri Lanka") {
      if (phoneClean.length < 9) {
        toast.error("Sri Lankan phone numbers should be at least 9-10 digits.");
        return;
      }
    } else {
      if (phoneClean.length < 7 || phoneClean.length > 15) {
        toast.error("Please enter a valid international phone number.");
        return;
      }
    }

    // Validate ID (simple length check)
    if (nicPassport.length < 5) {
      toast.error("Please enter a valid ID or Passport number.");
      return;
    }

    // Check Session (Last Step)
    if (!session?.user) {
      toast.info("Please log in to complete your booking.");
      setShowLogin(true);
      return;
    }

    setSubmitting(true);

    try {
      // Validate complete — move to payment step
      setStep("payment");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Submit booking to server after card payment ───
  const handlePayment = async () => {
    if (paymentProcessing) return;

    if (!cardNumber.replace(/\s/g, "") || cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid 16-digit card number."); return;
    }
    if (!cardName.trim()) { toast.error("Please enter the name on card."); return; }
    if (!cardExpiry || cardExpiry.length < 5) { toast.error("Please enter a valid expiry date."); return; }
    if (!cardCvv || cardCvv.length < 3) { toast.error("Please enter a valid CVV."); return; }

    setPaymentProcessing(true);

    // Calculate End Time
    const [hours, mins] = startTime.split(':').map(Number);
    const startDate = new Date(date!);
    startDate.setHours(hours, mins, 0);
    const endDate = addHours(startDate, parseInt(duration));
    const endTimeStr = format(endDate, "HH:mm:ss");
    const totalAmount = calcTotal();

    try {
      const res = await fetch(`${baseURL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
        },
        body: JSON.stringify({
          spaceId: space.id,
          bookingDate: format(date!, "yyyy-MM-dd"),
          startTime,
          endTime: endTimeStr,
          durationType: "hourly",
          totalAmount,
          seatNumber: selectedSeats.join(", "),
          guestName,
          guestPhone,
          country: guestCountry,
          nicPassport,
          refreshments: selectedRefreshments,
          paymentMethod: "card",
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");

      setBookingData({ ...result, id: result.bookingId || result.id });
      setStep("success");
      toast.success("Payment successful! Booking confirmed.");
    } catch (error: any) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ─── Card formatting helpers ───
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };
  const getCardBrand = () => {
    const n = cardNumber.replace(/\s/g, "");
    if (n.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(n)) return "MASTERCARD";
    if (/^3[47]/.test(n)) return "AMEX";
    return "";
  };

  // Custom Seat Selector
  const renderSeatMap = () => {
    const isLobby = space && space.name.toLowerCase().includes("lobby");
    const isHighTable = space && space.name.toLowerCase().includes("high table");
    const isMeeting = space && space.name.toLowerCase().includes("meeting");

    if (!isLobby && !isHighTable && !isMeeting) return null;

    const toggleSeat = (seat: string) => {
      // Meeting Area: Toggle All Logic
      if (isMeeting) {
        const allMeetingSeats = ['M1', 'M2', 'M3', 'M4', 'M5'];

        // Check if any seat is blocked
        const blocked = allMeetingSeats.some(s => isSeatRestricted(s) || occupiedSeats.includes(s));
        if (blocked) {
          toast.error("The Meeting Area is partially or fully unavailable.");
          return;
        }

        if (selectedSeats.length > 0) {
          setSelectedSeats([]);
        } else {
          setSelectedSeats(allMeetingSeats);
        }
        return;
      }

      // Check restrictions and occupancy
      if (isSeatRestricted(seat)) {
        toast.error("This seat is reserved during these hours.");
        return;
      }
      if (occupiedSeats.includes(seat)) {
        toast.error("This seat is already booked.");
        return;
      }
      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter(s => s !== seat));
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    };

    const isSeatRestricted = (seat: string) => {
      const restrictedSeats = ["A1", "A5", "B1", "B3", "B4", "B5", "B6", "H1", "H4"];
      if (!restrictedSeats.includes(seat)) return false;
      if (!date) return false;

      const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      if (day === 0) return false; // Sunday is fully open

      const [startHour, startMin] = startTime.split(':').map(Number);
      const bookingStart = startHour + (startMin / 60);
      const bookingEnd = bookingStart + parseInt(duration);

      let restrictedEnd = 0;
      const restrictedStart = 6.0; // 6 AM

      if (day >= 1 && day <= 5) { // Mon-Fri
        restrictedEnd = 18.0; // 6 PM
      } else if (day === 6) { // Sat
        restrictedEnd = 15.0; // 3 PM
      }

      return (bookingStart < restrictedEnd && bookingEnd > restrictedStart);
    };

    if (isMeeting) {
      return (
        <div className="mt-6 p-6 bg-muted/30 rounded-xl border-2 border-dashed">
          <div className="text-center mb-16">
            <h3 className="font-bold text-lg mb-1">Select Meeting Seat</h3>
            <p className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-white border flex items-center justify-center text-[8px] font-bold">M1</span> Available</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-primary border flex items-center justify-center text-[8px] font-bold text-white">M1</span> Selected</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-zinc-300 border flex items-center justify-center text-[8px] font-bold text-zinc-500">M1</span> Occupied</span>
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-12 pt-12 -my-8 scrollbar-hide">
            <div className="flex justify-center items-center min-w-[350px] mx-auto pb-4">
              {/* Table Structure */}
              <div className="relative bg-[#e5d5c5] dark:bg-[#5a4838] text-orange-900/30 rounded-xl p-2 w-64 h-32 flex items-center justify-center shadow-sm border border-orange-900/10">
                <span className="font-bold uppercase tracking-widest text-2xl">MEETING</span>

                {/* Monitor Side */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/20 rounded-r flex items-center justify-center">
                </div>
                <div className="absolute -right-10 flex flex-col items-center text-muted-foreground text-xs font-bold">
                  <Monitor className="w-6 h-6 mb-1" />
                  <span>TV</span>
                </div>

                {/* Top Seats (M1, M2) */}
                <div className="absolute -top-10 left-0 right-0 flex justify-around px-12">
                  {['M1', 'M2'].map(seat => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                          (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                    >
                      <div className="flex flex-col items-center leading-none">
                        <Armchair className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[7px] font-bold uppercase">{seat}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bottom Seats (M3, M4) */}
                <div className="absolute -bottom-10 left-0 right-0 flex justify-around px-12">
                  {['M3', 'M4'].map(seat => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                          (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                    >
                      <div className="flex flex-col items-center leading-none">
                        <Armchair className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[7px] font-bold uppercase">{seat}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Left Seat (M5) */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center -left-12">
                  <button
                    key="M5"
                    onClick={() => toggleSeat("M5")}
                    disabled={isSeatRestricted("M5") || occupiedSeats.includes("M5")}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes("M5") ? 'bg-primary border-primary text-white scale-110' :
                        (isSeatRestricted("M5") || occupiedSeats.includes("M5")) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <Armchair className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[7px] font-bold uppercase">M5</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center text-sm text-muted-foreground">
            Selected Seats: {selectedSeats.length > 0 ? <span className="font-bold text-primary">{selectedSeats.join(", ")}</span> : "None"}
          </div>
        </div>
      );
    }

    if (isHighTable) {
      return (
        <div className="mt-6 p-6 bg-muted/30 rounded-xl border-2 border-dashed">
          <div className="text-center mb-16">
            <h3 className="font-bold text-lg mb-1">Select High Table Seat</h3>
            <p className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-white border flex items-center justify-center text-[8px] font-bold">H1</span> Available</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-primary border flex items-center justify-center text-[8px] font-bold text-white">H1</span> Selected</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-zinc-300 border flex items-center justify-center text-[8px] font-bold text-zinc-500">H1</span> Occupied</span>
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-12 pt-12 -my-8 scrollbar-hide">
            <div className="flex justify-center items-center min-w-[320px] mx-auto pb-4">
              {/* Table Structure */}
              <div className="relative bg-[#e5d5c5] dark:bg-[#5a4838] text-orange-900/30 rounded-xl p-2 w-64 h-32 flex items-center justify-center shadow-sm border border-orange-900/10">
                <span className="font-bold uppercase tracking-widest text-2xl">HIGH TABLE</span>

                {/* Monitor Side */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/20 rounded-r flex items-center justify-center">
                </div>
                <div className="absolute -right-10 flex flex-col items-center text-muted-foreground text-xs font-bold">
                  <Monitor className="w-6 h-6 mb-1" />
                  <span>TV</span>
                </div>

                {/* Top Seats */}
                <div className="absolute -top-10 left-0 right-0 flex justify-around px-4">
                  {['H1', 'H2', 'H3'].map(seat => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                          (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                    >
                      <div className="flex flex-col items-center leading-none">
                        <Armchair className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[7px] font-bold uppercase">{seat}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bottom Seats */}
                <div className="absolute -bottom-10 left-0 right-0 flex justify-around px-4">
                  {['H4', 'H5', 'H6'].map(seat => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-100' :
                          (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                    >
                      <div className="flex flex-col items-center leading-none">
                        <Armchair className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[7px] font-bold uppercase">{seat}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center text-sm text-muted-foreground">
            Selected Seats: {selectedSeats.length > 0 ? <span className="font-bold text-primary">{selectedSeats.join(", ")}</span> : "None"}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 p-6 bg-muted/30 rounded-xl border-2 border-dashed">
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg mb-1">Select Your Seat</h3>
          <p className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-white border flex items-center justify-center text-[8px] font-bold">S1</span> Available</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-primary border flex items-center justify-center text-[8px] font-bold text-white">S1</span> Selected</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-zinc-300 border flex items-center justify-center text-[8px] font-bold text-zinc-500">S1</span> Occupied</span>
          </p>
        </div>

        <div className="w-full overflow-x-auto pb-12 pt-12 -my-8 scrollbar-hide">
          <div className="flex flex-col md:flex-row gap-24 justify-center items-center min-w-[280px] mx-auto pb-4">
            {/* Table A */}
            <div className="bg-[#e5d5c5] dark:bg-[#5a4838] w-32 h-64 rounded-xl relative flex flex-col justify-between items-center py-4 shadow-sm border border-orange-900/10">
              <div className="absolute inset-x-0 h-full flex flex-col justify-around -left-12 py-2">
                {['A1', 'A2', 'A3'].map(seat => (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                        (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <Armchair className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[7px] font-bold uppercase">{seat}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute inset-x-0 h-full flex flex-col justify-around -right-12 py-2 items-end">
                {['A4', 'A5', 'A6'].map(seat => (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                        (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <Armchair className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[7px] font-bold uppercase">{seat}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-orange-900/30 font-bold uppercase tracking-widest text-[10px] h-full flex items-center justify-center [writing-mode:vertical-lr] rotate-180">Table A</div>
            </div>

            {/* Table B */}
            <div className="bg-[#e5d5c5] dark:bg-[#5a4838] w-32 h-64 rounded-xl relative flex flex-col justify-between items-center py-4 shadow-sm border border-orange-900/10 mb-8 md:mb-0">
              <div className="absolute inset-x-0 h-full flex flex-col justify-around -left-12 py-2">
                {['B1', 'B2', 'B3'].map(seat => (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                        (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <Armchair className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[7px] font-bold uppercase">{seat}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute inset-x-0 h-full flex flex-col justify-around -right-12 py-2 items-end">
                {['B4', 'B5', 'B6'].map(seat => (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={isSeatRestricted(seat) || occupiedSeats.includes(seat)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                                ${selectedSeats.includes(seat) ? 'bg-primary border-primary text-white scale-110' :
                        (isSeatRestricted(seat) || occupiedSeats.includes(seat)) ? 'bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed opacity-50' : 'bg-white hover:border-primary hover:text-primary'}`}
                  >
                    <div className="flex flex-col items-center leading-none">
                      <Armchair className="w-3.5 h-3.5 mb-0.5" />
                      <span className="text-[7px] font-bold uppercase">{seat}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-orange-900/30 font-bold uppercase tracking-widest text-[10px] h-full flex items-center justify-center [writing-mode:vertical-lr] rotate-180">Table B</div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Selected Seats: {selectedSeats.length > 0 ? <span className="font-bold text-primary">{selectedSeats.join(", ")}</span> : "None"}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-4 w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Spaces
        </Button>

        <div className="grid md:grid-cols-3 gap-8 w-full min-w-0">
          {step === "details" && (
            <div className="md:col-span-2 space-y-6 min-w-0 w-full overflow-x-hidden sm:overflow-visible">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Confirm Booking</CardTitle>
                  <CardDescription>Complete the details below to secure your space.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date & Time */}
                  <div className="space-y-4">
                    <Label>Select Date</Label>
                    <div className="border rounded-lg p-1 sm:p-2 bg-card w-full flex justify-center overflow-x-auto max-w-full">
                      <div className="min-w-fit max-w-full">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date > addDays(today, 30);
                          }}
                          className="rounded-md border-0 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i; // 0 to 23

                            // Filter out past hours if today
                            if (date) {
                              const now = new Date();
                              const isToday =
                                date.getDate() === now.getDate() &&
                                date.getMonth() === now.getMonth() &&
                                date.getFullYear() === now.getFullYear();

                              if (isToday && hour <= now.getHours()) {
                                return null;
                              }
                            }

                            const time = `${hour.toString().padStart(2, '0')}:00:00`;
                            const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
                            const ampm = hour < 12 ? 'AM' : 'PM';
                            const display = `${displayHour}:00 ${ampm}`;
                            return (
                              <SelectItem key={time} value={time}>{display}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            // Calculate max allowed duration to prevent overnight booking (except for Full Day)
                            const [startH] = startTime.split(':').map(Number);
                            const maxDuration = 24 - startH;

                            const options = [
                              ...Array.from({ length: 12 }, (_, i) => ({ val: (i + 1).toString(), label: (i + 1) + " Hour" + (i > 0 ? "s" : "") })),
                              { val: "24", label: "Full Day (24 Hours)" }
                            ];

                            return options.map(opt => (
                              <SelectItem
                                key={opt.val}
                                value={opt.val}
                                disabled={opt.val !== "24" && parseInt(opt.val) > maxDuration}
                              >
                                {opt.label}
                              </SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Seat Map (Conditional) */}
                  {renderSeatMap()}

                  <div className="pt-4 border-t">
                    <RefreshmentSelector onSelectionChange={setSelectedRefreshments} />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Guest Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Full Name <span className="text-destructive">*</span></Label>
                        <Input placeholder="Enter full name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label>Country <span className="text-destructive">*</span></Label>
                        <Select
                          value={guestCountry}
                          onValueChange={(val) => {
                            setGuestCountry(val);
                            const country = countries.find(c => c.name === val);
                            if (!guestPhone || guestPhone === "") {
                              setGuestPhone(country?.dial || "");
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(c => (
                              <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Phone Number <span className="text-destructive">*</span></Label>
                        <Input placeholder="+1 234 567 8900" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>ID / Passport Number <span className="text-destructive">*</span></Label>
                        <Input placeholder="Passport or National ID" value={nicPassport} onChange={(e) => setNicPassport(e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleBooking} disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
                      <><ChevronRight className="w-4 h-4 mr-1" />Continue to Payment</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}




          {/* ─── Payment Step ─── */}
          {step === "payment" && (
            <div className="md:col-span-2 space-y-6 min-w-0 w-full overflow-x-hidden sm:overflow-visible">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep("details")} className="text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <CardTitle className="text-2xl">Secure Payment</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3" /> 256-bit SSL encrypted
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Animated Card Preview */}
                  <div className="flex justify-center">
                    <div
                      className="relative w-full max-w-[320px] h-48 cursor-pointer"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}
                      >
                        {/* Card Front */}
                        <div
                          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            background: "linear-gradient(135deg, #14212B 0%, #ff4917 100%)"
                          }}
                        >
                          {/* Watermark circles */}
                          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
                          <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/5" />
                          <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full bg-white/5" />

                          <div className="flex justify-between items-start relative z-10">
                            <div className="w-10 h-7 rounded bg-yellow-400/80" />
                            <span className="font-black text-sm tracking-widest opacity-90">{getCardBrand() || "CARD"}</span>
                          </div>
                          <div className="relative z-10">
                            <p className="font-mono tracking-[0.2em] text-lg font-bold">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </p>
                          </div>
                          <div className="flex justify-between items-end relative z-10">
                            <div>
                              <p className="text-white/50 text-[10px] uppercase tracking-wider">Card Holder</p>
                              <p className="font-semibold text-sm uppercase tracking-wider">
                                {cardName || "YOUR NAME"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/50 text-[10px] uppercase tracking-wider">Expires</p>
                              <p className="font-semibold text-sm">{cardExpiry || "MM/YY"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Card Back */}
                        <div
                          className="absolute inset-0 rounded-2xl text-white shadow-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            background: "linear-gradient(135deg, #14212B 0%, #ff4917 100%)"
                          }}
                        >
                          <div className="w-full h-12 bg-black/60 mt-6" />
                          <div className="px-6 mt-4">
                            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">CVV</p>
                            <div className="bg-white text-[#14212B] font-mono font-bold px-3 py-2 rounded text-right tracking-widest">
                              {cardCvv || "•••"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total due */}
                  <div className="bg-muted/40 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-medium">Total Due</span>
                    <span className="text-2xl font-black text-primary">LKR {calcTotal().toLocaleString()}</span>
                  </div>

                  {/* Card fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-9 font-mono tracking-widest"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Name on Card</Label>
                      <Input
                        placeholder="As shown on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="uppercase tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          placeholder="•••"
                          type="password"
                          value={cardCvv}
                          maxLength={4}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accepted cards */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Accepted Cards</p>
                    <div className="flex items-center gap-3">

                      {/* Visa */}
                      <div className="h-9 px-3 rounded-md border border-zinc-200 bg-white flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 780 500" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                          <path d="M290 350L330 150H390L350 350H290Z" fill="#00579F" />
                          <path d="M510 155C498 150 480 145 458 145C398 145 356 175 356 218C356 251 386 269 409 280C432 291 440 299 440 310C440 326 421 334 403 334C378 334 365 330 343 321L334 317L325 368C340 375 368 381 397 381C461 381 502 351 502 305C502 280 487 261 455 245C434 234 421 227 421 215C421 204 434 192 462 192C485 192 501 197 514 202L521 205L510 155Z" fill="#00579F" />
                          <path d="M600 150H554C541 150 531 154 526 167L435 350H499L512 314H589L597 350H654L600 150ZM530 268C535 255 556 198 556 198C556 198 562 182 566 172L571 197C571 197 584 258 587 268H530Z" fill="#00579F" />
                          <path d="M246 150L188 290L182 260C172 228 147 194 119 177L172 350H237L339 150H246Z" fill="#00579F" />
                          <path d="M152 150H52L51 155C127 174 178 216 199 270L178 168C174 155 165 151 152 150Z" fill="#FAA61A" />
                        </svg>
                      </div>

                      {/* Mastercard */}
                      <div className="h-9 px-3 rounded-md border border-zinc-200 bg-white flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 131.39 86.9" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="45.5" cy="43.45" r="27" fill="#EB001B" />
                          <circle cx="85.89" cy="43.45" r="27" fill="#F79E1B" />
                          <path d="M65.7 20.8a27 27 0 0 1 0 45.3A27 27 0 0 1 65.7 20.8z" fill="#FF5F00" />
                        </svg>
                      </div>

                      {/* American Express */}
                      <div className="h-9 px-3 rounded-md border border-zinc-200 bg-[#2E77BC] flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 200 60" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                          <text x="10" y="44" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="38" fill="white" letterSpacing="-1">AMEX</text>
                        </svg>
                      </div>

                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>Your card details are encrypted and never stored.</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-bold"
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing Payment...</>
                    ) : (
                      <><Lock className="w-4 h-4 mr-2" />Pay LKR {calcTotal().toLocaleString()}</>
                    )}
                  </Button>

                </CardContent>
              </Card>
            </div>
          )}

          {step === "success" && (
            <div className="md:col-span-2 space-y-6 flex flex-col items-center justify-center p-12 text-center min-w-0">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-700">Payment Successful!</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Your booking is confirmed and payment has been received. A confirmation receipt has been sent to your email.
              </p>
              <Button size="lg" onClick={() => router.push("/dashboard")} className="mt-8">
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Summary Sidebar */}
          <div className="min-w-0 w-full">
            <Card className="border sticky top-24">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {space.imageUrl && <img src={fixImageUrl(space.imageUrl)} alt={space.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{space.name}</h3>
                  <p className="text-sm text-muted-foreground">{space.type.replace('_', ' ')}</p>
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hourly Rate</span>
                    <span className="font-semibold">LKR {space.pricing?.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Duration</span>
                    <span>{duration} Hour{parseInt(duration) > 1 && 's'}</span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Seats</span>
                      <span>{selectedSeats.length}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>
                      LKR {(() => {
                        let r = space.pricing?.hourlyRate || 0;
                        const d = parseInt(duration);
                        if (d === 2 && space.pricing?.rate2h) r = space.pricing.rate2h;
                        else if (d === 3 && space.pricing?.rate3h) r = space.pricing.rate3h;
                        else if (d > 3 && space.pricing?.rate4hPlus) r = space.pricing.rate4hPlus;

                        const isMeeting = space.name.toLowerCase().includes("meeting");
                        const qty = isMeeting ? 1 : (selectedSeats.length || 1);

                        const spaceCost = Math.round(r * d * qty);
                        const addonsCost = selectedRefreshments.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                        return spaceCost + addonsCost;
                      })()}
                    </span>
                  </div>
                  {selectedRefreshments.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1 bg-muted/40 p-2 rounded">
                      <div className="font-semibold mb-1">Add-ons:</div>
                      {selectedRefreshments.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>LKR {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


              </CardContent>
            </Card>
          </div>
          <Dialog open={showLogin} onOpenChange={setShowLogin}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log In Required</DialogTitle>
                <DialogDescription>Please log in or sign up to continue your booking.</DialogDescription>
              </DialogHeader>
              <LoginForm onSuccess={() => {
                setShowLogin(false);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }} />
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>

  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <BookingContents />
    </Suspense>
  );
}
