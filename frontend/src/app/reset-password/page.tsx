"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { baseURL } from "@/lib/auth-client";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link. No token found.");
            router.push("/login");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${baseURL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to reset password");
            }

            setIsSuccess(true);
            toast.success("Password reset successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {isSuccess ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <KeyRound className="w-8 h-8" />}
                    </div>
                </div>
                <CardTitle className="text-2xl">
                    {isSuccess ? "Password Updated" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                    {isSuccess
                        ? "Your password has been changed successfully. You can now log in with your new password."
                        : "Enter a new secure password for your account."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="py-4">
                        <Button asChild className="w-full">
                            <Link href="/login">
                                Proceed to Login
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-32 pb-12 px-4">
            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
