"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, X, Tag } from "lucide-react";
import Image from "next/image"; // Added missing import
import { toast } from "sonner";
import { baseURL } from "@/lib/auth-client";

interface Offer {
    id: number;
    title: string;
    description: string;
    code: string | null;
    discountPercentage: number | null;
    imageUrl: string | null;
    validUntil: string | null;
}

interface OffersPopupProps {
    offers: Offer[];
}

export function OffersPopup({ offers }: OffersPopupProps) {
    const [open, setOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

    useEffect(() => {
        if (offers.length > 0) {
            setCurrentOffer(offers[0]);
            const seenOfferId = localStorage.getItem("seen_offer_id");
            if (seenOfferId !== String(offers[0].id)) {
                const timer = setTimeout(() => setOpen(true), 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [offers]);

    const handleClose = () => {
        setOpen(false);
        if (currentOffer) {
            localStorage.setItem("seen_offer_id", String(currentOffer.id));
        }
    };

    const copyCode = () => {
        if (currentOffer?.code) {
            navigator.clipboard.writeText(currentOffer.code);
            toast.success("Promo code copied to clipboard!");
        }
    };

    if (!currentOffer) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
                <div className="relative h-48 w-full bg-muted">
                    {currentOffer.imageUrl ? (
                        <div className="w-full h-full relative">
                            <img
                                src={currentOffer.imageUrl.startsWith('/') ? `${baseURL.replace(/\/$/, '')}${currentOffer.imageUrl}` : currentOffer.imageUrl}
                                alt={currentOffer.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.log('Image failed to load:', currentOffer.imageUrl);
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.parentElement?.nextElementSibling;
                                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                }}
                            />
                        </div>
                    ) : null}
                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-primary/10" style={{ display: currentOffer.imageUrl ? 'none' : 'flex', pointerEvents: 'none' }}>
                        <Tag className="w-16 h-16 text-primary/40" />
                    </div>

                    <div className="absolute top-2 right-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                            onClick={handleClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {currentOffer.discountPercentage && (
                        <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {currentOffer.discountPercentage}% OFF
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl">{currentOffer.title}</DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            {currentOffer.description}
                        </DialogDescription>
                    </DialogHeader>

                    {currentOffer.code && (
                        <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg border border-dashed border-primary/30">
                            <div className="flex-1 text-center font-mono font-bold text-lg tracking-wider text-primary">
                                {currentOffer.code}
                            </div>
                            <Button size="icon" variant="ghost" onClick={copyCode} title="Copy Code">
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {currentOffer.validUntil && (
                        <p className="text-xs text-muted-foreground text-center mt-4">
                            Valid until {new Date(currentOffer.validUntil).toLocaleDateString()}
                        </p>
                    )}

                    <DialogFooter className="mt-6">
                        <Button className="w-full" onClick={handleClose}>
                            Got it!
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
