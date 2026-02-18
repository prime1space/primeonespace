"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { baseURL } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${baseURL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to send reset link");
            }

            setIsSubmitted(true);
            toast.success("Reset link sent successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-32 pb-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Mail className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/login">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </Link>
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">
                                We've sent a password reset link to <span className="font-semibold text-zinc-900">{email}</span>.
                                Please check your inbox and follow the instructions.
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/login">
                                    Return to Login
                                </Link>
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
