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
import { GoogleAuthButton } from "./GoogleAuthButton";

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

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else if (redirectTo) {
                    window.location.href = redirectTo;
                } else {
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

    const handleSocialLogin = (provider: "github") => {
        toast.info(`GitHub sign-in coming soon!`, {
            description: "We're working on social login. Please use email & password for now.",
            duration: 4000,
        });
    };

    return (
        <div className="space-y-5">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <GoogleAuthButton onSuccess={onSuccess} redirectTo={redirectTo} />

                {/* GitHub */}
                <button
                    type="button"
                    onClick={() => handleSocialLogin("github")}
                    className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 shadow-sm group"
                >
                    {/* GitHub SVG Icon */}
                    <svg className="w-4 h-4 flex-shrink-0 text-zinc-800" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">GitHub</span>
                </button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-zinc-400 font-medium uppercase tracking-wider">
                        or continue with email
                    </span>
                </div>
            </div>

            {/* Email/Password Form */}
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
                <Button type="submit" className="w-full rounded-xl h-11" disabled={isLoading}>
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
                <div className="mt-5 text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
}
