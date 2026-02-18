"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      console.log("Logging in with API:", API_URL);

      const response = await fetch(`${API_URL}/auth/sign-in/email`, {
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
      console.log("Login response:", data);

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
        console.log("Storing login token:", token.substring(0, 10) + "...");
        localStorage.setItem("bearer_token", token);
      }

      toast.success("Login successful! Redirecting...");

      // Small delay to ensure token is stored before redirect
      setTimeout(() => {
        // Check if user is admin
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'prime1@gmail.com';
        if (formData.email.toLowerCase() === adminEmail.toLowerCase()) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">P1</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your PrimeOne Space account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
