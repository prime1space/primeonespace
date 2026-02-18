"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/auth-client";

interface LoginFormProps {
    onSuccess?: () => void;
    redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${baseURL}/auth/sign-in/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error?.code === 'INVALID_CREDENTIALS') {
                    toast.error("Invalid email or password. Please try again.");
                } else {
                    toast.error(data.error?.message || "Login failed. Please try again.");
                }
                setIsLoading(false);
                return;
            }

            // Store the token
            const token = response.headers.get("set-auth-token") || data.token;
            if (token) {
                localStorage.setItem("bearer_token", token);
            }

            toast.success("Login successful!");

            // Small delay to ensure token is stored
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else if (redirectTo) {
                    window.location.href = redirectTo;
                } else {
                    // Default redirect logic
                    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'prime1@gmail.com';
                    if (formData.email.toLowerCase() === adminEmail.toLowerCase()) {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/dashboard";
                    }
                }
            }, 500);
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                        }
                        disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                        Remember me
                    </Label>
                </div>
                <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                >
                    Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                    </>
                )}
            </Button>
            <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/register" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
