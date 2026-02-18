
"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from 'react';

function CancelContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");

    return (
        <div className="min-h-screen pt-20 pb-12 bg-muted/30 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl text-red-700">Payment Cancelled</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Your payment was cancelled or failed. No charges were made.
                    </p>
                    <div className="pt-4 space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/bookings/new">Try Again</Link>
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

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CancelContent />
        </Suspense>
    );
}
