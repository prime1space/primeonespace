"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, baseURL } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Sri Lanka",
    image: "",
  });
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });
  const [showPassDialog, setShowPassDialog] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${baseURL}/user_profile.php`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.country || "Sri Lanka",
          image: data.image || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate phone based on country
    if (formData.phone) {
      const phoneClean = formData.phone.replace(/[^0-9]/g, '');
      if (formData.country === "Sri Lanka") {
        if (phoneClean.length < 9) {
          toast.error("Sri Lankan phone numbers should be at least 9-10 digits.");
          setLoading(false);
          return;
        }
      } else {
        if (phoneClean.length < 7 || phoneClean.length > 15) {
          toast.error("Please enter a valid international phone number.");
          setLoading(false);
          return;
        }
      }
    }

    try {
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        image: formData.image
      };

      if (passwords.new) {
        if (passwords.new !== passwords.confirm) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        payload.new_password = passwords.new;
      }

      const res = await fetch(`${baseURL}/user_profile.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Profile updated successfully!");
      setPasswords({ new: "", confirm: "" });
      setShowPassDialog(false);

      // Force a reload to refresh session data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const initials = session?.user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="relative group">
                  <Avatar className="w-20 h-20 border-2 border-primary/10">
                    <AvatarImage src={formData.image || session?.user?.image || ""} />
                    <AvatarFallback className="text-2xl bg-primary/5">{initials}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px] font-bold uppercase"
                  >
                    Change
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                  <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
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
                      disabled={loading}
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
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPassDialog ? (
                <Button variant="outline" className="w-full" onClick={() => setShowPassDialog(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => {
                      setShowPassDialog(false);
                      setPasswords({ new: "", confirm: "" });
                    }}>
                      Cancel
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={handleSubmit} disabled={!passwords.new || loading}>
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
