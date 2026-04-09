
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("order_id");

    useEffect(() => {
        // Clear any cached booking data to force refresh on dashboard
        if (typeof window !== 'undefined') {
            // Trigger a storage event to notify other tabs/components
            window.dispatchEvent(new Event('bookingUpdated'));
        }
    }, []);

    return (
        <div className="min-h-screen pt-20 pb-12 bg-muted/30 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Payment received. Your booking is confirmed and a receipt has been sent to your email.
                    </p>
                    {orderId && (
                        <p className="font-mono text-sm bg-muted p-2 rounded">
                            Order ID: {orderId}
                        </p>
                    )}
                    <div className="pt-4 space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/dashboard/bookings">View My Bookings</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
