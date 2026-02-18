"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { baseURL } from "@/lib/auth-client";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
    amount: number;
    bookingId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

function CheckoutForm({ amount, bookingId, onSuccess, onError }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/booking/success?booking_id=${bookingId}`,
                },
            });

            if (error) {
                setErrorMessage(error.message || "An error occurred during payment");
                onError(error.message || "Payment failed");
                setIsProcessing(false);
            } else {
                // Payment succeeded
                onSuccess();
            }
        } catch (err) {
            setErrorMessage("An unexpected error occurred");
            onError("An unexpected error occurred");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">
                            LKR {amount.toLocaleString()}
                        </p>
                    </div>
                    <CreditCard className="w-8 h-8 text-primary" />
                </div>
            </div>

            <div className="space-y-4">
                <PaymentElement />
            </div>

            {errorMessage && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full h-12 text-lg"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay LKR {amount.toLocaleString()}
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                Secured by Stripe • Your payment information is encrypted
            </p>
        </form>
    );
}

interface StripeCheckoutProps {
    amount: number;
    bookingId: string;
    userId: string;
    email: string;
    description?: string;
    onSuccess: () => void;
    onError?: (error: string) => void;
}

export default function StripeCheckout({
    amount,
    bookingId,
    userId,
    email,
    description = "PrimeOne Space Booking",
    onSuccess,
    onError = () => { },
}: StripeCheckoutProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Create Payment Intent
        const createPaymentIntent = async () => {
            try {
                const apiBase = baseURL.replace(/\/$/, "");
                let fetchUrl = `${apiBase}/create-payment-intent.php`;

                // If baseURL ends in router.php, append via PATH_INFO
                if (apiBase.includes('router.php')) {
                    fetchUrl = `${apiBase}/create-payment-intent.php`;
                }

                const response = await fetch(fetchUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount,
                        bookingId,
                        userId,
                        email,
                        description,
                    }),
                });

                const data = await response.json();

                if (data.success && data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    setError(data.error || "Failed to create payment session");
                }
            } catch (err) {
                setError("Failed to connect to payment server");
            } finally {
                setLoading(false);
            }
        };

        createPaymentIntent();
    }, [amount, bookingId, userId, email, description]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Preparing Payment</CardTitle>
                    <CardDescription>Setting up secure payment...</CardDescription>
                </CardHeader>
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Please wait...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full mt-4"
                        variant="outline"
                    >
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!clientSecret) {
        return null;
    }

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#ff4917',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Complete Payment
                </CardTitle>
                <CardDescription>
                    Secure payment powered by Stripe
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        appearance,
                    }}
                >
                    <CheckoutForm
                        amount={amount}
                        bookingId={bookingId}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </Elements>
            </CardContent>
        </Card>
    );
}
