"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "Sri Lanka",
    password: "",
    confirmPassword: ""
  });

  type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;
  const errorCodes = {
    USER_ALREADY_EXISTS: "An account with this email already exists",
  } satisfies ErrorTypes;

  const getErrorMessage = (code: string) => {
    if (code in errorCodes) {
      return errorCodes[code as keyof typeof errorCodes];
    }
    return "Registration failed. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    // Dynamic Validation based on Country
    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (formData.country === "Sri Lanka") {
      // Sri Lankan numbers are usually 9-10 digits without country code, or 11-12 with 94
      if (phoneClean.length < 9) {
        toast.error("Sri Lankan phone numbers should be at least 9-10 digits.");
        return;
      }
    } else {
      // Global validation
      if (phoneClean.length < 7 || phoneClean.length > 15) {
        toast.error("Please enter a valid international phone number.");
        return;
      }
    }


    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      console.log("Registering with API:", API_URL);

      const response = await fetch(`${API_URL}/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          country: formData.country,
          password: formData.password,
        })
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        if (data.error?.code === 'USER_ALREADY_EXISTS') {
          toast.error("An account with this email already exists");
        } else {
          toast.error(data.error?.message || "Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Store the token
      const token = response.headers.get("set-auth-token") || data.token;
      if (token) {
        console.log("Storing token:", token.substring(0, 10) + "...");
        localStorage.setItem("bearer_token", token);
      }

      // Trigger Welcome Email (don't await to avoid slowing down UI)
      fetch(`${API_URL}/auth/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      }).catch(() => { }); // Ignore email errors

      toast.success("Account created successfully!");

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">P1</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join PrimeOne Space today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => {
                    const country = countries.find(c => c.name === value);
                    setFormData({
                      ...formData,
                      country: value,
                      phone: formData.phone || country?.dial || ""
                    });
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Street, City, Country"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
