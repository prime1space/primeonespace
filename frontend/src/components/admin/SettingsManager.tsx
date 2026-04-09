
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { baseURL } from "@/lib/auth-client";

export function SettingsManager() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${baseURL}/settings`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setSettings(data && typeof data === 'object' ? data : {});
        } catch {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${baseURL}/settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(settings),
            });

            if (!res.ok) throw new Error();
            toast.success("Settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>General contact details displayed on the website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={settings["company_name"] || ""} onChange={e => updateSetting("company_name", e.target.value)} placeholder="PrimeOne Space" />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Phone</Label>
                            <Input value={settings["phone"] || ""} onChange={e => updateSetting("phone", e.target.value)} placeholder="+94 123 456 789" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={settings["address"] || ""} onChange={e => updateSetting("address", e.target.value)} placeholder="123 Main St, City" />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input value={settings["email"] || ""} onChange={e => updateSetting("email", e.target.value)} placeholder="info@example.com" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>Operating hours shown to visitors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Weekdays (Mon-Fri)</Label>
                            <Input value={settings["hours_weekdays"] || ""} onChange={e => updateSetting("hours_weekdays", e.target.value)} placeholder="8:00 AM - 8:00 PM" />
                        </div>
                        <div className="space-y-2">
                            <Label>Saturday</Label>
                            <Input value={settings["hours_saturday"] || ""} onChange={e => updateSetting("hours_saturday", e.target.value)} placeholder="9:00 AM - 6:00 PM" />
                        </div>
                        <div className="space-y-2">
                            <Label>Sunday</Label>
                            <Input value={settings["hours_sunday"] || ""} onChange={e => updateSetting("hours_sunday", e.target.value)} placeholder="Closed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Closed Days / Holidays</Label>
                            <Input value={settings["closed_days"] || ""} onChange={e => updateSetting("closed_days", e.target.value)} placeholder="Christmas, New Year" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save All Settings
                </Button>
            </div>
        </form>
    );
}
