"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Copy, Calendar, Clock, Sparkles, ArrowRight, Percent } from "lucide-react";
import { toast } from "sonner";
import { baseURL, useSession } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Offer {
    id: number;
    title: string;
    description: string;
    code: string;
    discountPercentage: number;
    imageUrl: string | null;
    validUntil: string;
    isActive: boolean;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [showClaimDialog, setShowClaimDialog] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [claimForm, setClaimForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await fetch(`${baseURL}/offers`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setOffers(data);
            } else {
                console.warn("Offers data is not an array:", data);
                setOffers([]);
            }
        } catch (error) {
            console.error("Error fetching offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Promo code copied to clipboard!");
    };

    const handleClaimClick = (offer: Offer) => {
        setSelectedOffer(offer);
        setClaimForm({
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            phone: ""
        });
        setShowClaimDialog(true);
    };

    const submitClaim = async () => {
        if (!selectedOffer) return;
        setClaiming(true);

        console.log("Submitting claim to:", `${baseURL}/offer-claims`);

        try {
            const response = await fetch(`${baseURL}/offer-claims`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("bearer_token") ? `Bearer ${localStorage.getItem("bearer_token")}` : ""
                },
                body: JSON.stringify({
                    offerId: selectedOffer.id,
                    ...claimForm
                })
            });

            console.log("Response status:", response.status);

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    toast.info(result.error || "You have already claimed this offer.");
                } else {
                    throw new Error(result.error || `Failed to claim offer (${response.status})`);
                }
            } else {
                toast.success(result.message || "Offer claimed successfully!");
            }
            setShowClaimDialog(false);
        } catch (error: any) {
            console.error("Claim error:", error);
            toast.error(error.message || "Network error. Please try again.");
        } finally {
            setClaiming(false);
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
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="container relative mx-auto px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
                            <Percent className="w-3.5 h-3.5 mr-2 text-primary fill-primary" />
                            Strictly Limited Time
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Exclusive <span className="text-primary">Offers</span>
                        </h1>
                        <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                            Take advantage of special desk pricing and seasonal deals designed to give you a high-end workspace for a lot less than you’d expect.
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
                    {offers.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="max-w-xl mx-auto border-dashed border-2 shadow-none bg-muted/30">
                                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border">
                                        <Tag className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-foreground">No Current Offers</h3>
                                    <p className="text-muted-foreground mb-8 max-w-md">
                                        We're currently crafting new deals just for you. Check back soon for exciting promotions!
                                    </p>
                                    <Button asChild className="rounded-full">
                                        <Link href="/contact">Join Waitlist</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        offers.map((offer) => (
                            <motion.div key={offer.id} variants={itemVariants}>
                                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card group flex flex-col relative">
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        {offer.imageUrl ? (
                                            <img
                                                src={fixImageUrl(offer.imageUrl)}
                                                alt={offer.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <Tag className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        {offer.discountPercentage && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <Badge className="bg-red-600 text-white border-0 font-bold px-3 py-1 shadow-lg text-lg">
                                                    {offer.discountPercentage}% OFF
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="flex-1 p-6 flex flex-col">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="space-y-1">
                                                {offer.validUntil && (
                                                    <div className="flex items-center text-xs font-medium text-primary uppercase tracking-wider">
                                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                                        Ends {new Date(offer.validUntil).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {offer.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                                            {offer.description}
                                        </p>

                                        <div className="mt-auto space-y-4">
                                            {offer.code ? (
                                                <div className="bg-muted/50 p-4 rounded-xl border border-dashed border-primary/20">
                                                    <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide">Use Promo Code</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-background border rounded-lg py-2 px-3 text-center font-mono font-bold text-lg text-primary tracking-wider shadow-sm select-all">
                                                            {offer.code}
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() => copyCode(offer.code!)}
                                                            className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                                                            title="Copy Code"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    className="w-full rounded-full group/btn"
                                                    onClick={() => handleClaimClick(offer)}
                                                >
                                                    Claim Offer
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Bottom CTA */}
                <div className="mt-24">
                    <div className="relative rounded-3xl overflow-hidden bg-[#001F3F] text-white p-12 text-center">
                        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent" />
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-black mb-6">Stay in the Loop</h2>
                            <p className="text-lg text-zinc-300 mb-8">
                                Stay in the loop on price drops and special offers. Join our list to get the latest savings delivered right to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-[#14212B] hover:bg-zinc-200 rounded-full font-bold">
                                    <Link href="/register">Create Account</Link>
                                </Button>
                                <Button asChild size="lg" className="bg-white text-[#14212B] hover:bg-zinc-200 rounded-full font-bold">
                                    <Link href="/contact">Contact Sales</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Claim Dialog */}
            <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Claim Offer: {selectedOffer?.title}</DialogTitle>
                        <DialogDescription>
                            Please confirm your details to claim this exclusive offer. We will contact you shortly to activate it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={claimForm.name}
                                onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={claimForm.email}
                                onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={claimForm.phone}
                                onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                                placeholder="+94 77 123 4567"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowClaimDialog(false)}>Cancel</Button>
                        <Button onClick={submitClaim} disabled={claiming}>
                            {claiming ? "Processing..." : "Confirm & Claim"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
