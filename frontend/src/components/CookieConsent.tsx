"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Show banner after 1 second delay
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "accepted");
        localStorage.setItem("cookie_consent_date", new Date().toISOString());
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie_consent", "declined");
        localStorage.setItem("cookie_consent_date", new Date().toISOString());
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
            <Card className="max-w-4xl mx-auto p-4 md:p-6 shadow-2xl border-2 pointer-events-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <Cookie className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold text-lg">We Value Your Privacy</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic.
                            By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more
                            in our{" "}
                            <Link href="/privacy" className="text-primary hover:underline font-medium">
                                Privacy Policy
                            </Link>
                            .
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                onClick={acceptCookies}
                                className="flex-1 sm:flex-initial"
                            >
                                Accept All
                            </Button>
                            <Button
                                onClick={declineCookies}
                                variant="outline"
                                className="flex-1 sm:flex-initial"
                            >
                                Decline
                            </Button>
                            <Link href="/privacy" className="flex-1 sm:flex-initial">
                                <Button variant="ghost" className="w-full">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={declineCookies}
                        className="flex-shrink-0 p-1 hover:bg-accent rounded-md transition-colors"
                        aria-label="Close cookie banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </Card>
        </div>
    );
}
