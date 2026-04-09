
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { baseURL } from "@/lib/auth-client";

interface Pricing {
    id: number;
    spaceType: string;
    hourlyRate: number | null;
    rate2h: number | null;
    rate3h: number | null;
    rate4hPlus: number | null;
    dailyRate: number | null;
    monthlyRate: number | null;
}

export function PricingManager() {
    const [pricing, setPricing] = useState<Pricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const res = await fetch(`${baseURL}/pricing`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setPricing(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load pricing");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (item: Pricing) => {
        setSaving(item.id);
        try {
            const res = await fetch(`${baseURL}/pricing`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(item),
            });

            if (!res.ok) throw new Error();
            toast.success("Pricing updated successfully");
        } catch (error) {
            toast.error("Failed to update pricing");
        } finally {
            setSaving(null);
        }
    };

    const formatName = (name: string) => {
        return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading) return <div>Loading pricing...</div>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pricing.map((item) => (
                <Card key={item.id}>
                    <CardHeader>
                        <CardTitle>{formatName(item.spaceType)}</CardTitle>
                        <CardDescription>Edit rates for this space type</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hourly Rate (LKR)</Label>
                                <Input
                                    type="number"
                                    value={item.hourlyRate || ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : null;
                                        setPricing(pricing.map(p => p.id === item.id ? { ...p, hourlyRate: val } : p));
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>2 Hour Rate (LKR)</Label>
                                <Input
                                    type="number"
                                    value={item.rate2h || ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : null;
                                        setPricing(pricing.map(p => p.id === item.id ? { ...p, rate2h: val } : p));
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>3 Hour Rate (LKR)</Label>
                                <Input
                                    type="number"
                                    value={item.rate3h || ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : null;
                                        setPricing(pricing.map(p => p.id === item.id ? { ...p, rate3h: val } : p));
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>4h+ Rate (LKR)</Label>
                                <Input
                                    type="number"
                                    value={item.rate4hPlus || ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseFloat(e.target.value) : null;
                                        setPricing(pricing.map(p => p.id === item.id ? { ...p, rate4hPlus: val } : p));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Daily Rate (LKR)</Label>
                            <Input
                                type="number"
                                value={item.dailyRate || ""}
                                onChange={(e) => {
                                    const val = e.target.value ? parseFloat(e.target.value) : null;
                                    setPricing(pricing.map(p => p.id === item.id ? { ...p, dailyRate: val } : p));
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly Rate (LKR)</Label>
                            <Input
                                type="number"
                                value={item.monthlyRate || ""}
                                onChange={(e) => {
                                    const val = e.target.value ? parseFloat(e.target.value) : null;
                                    setPricing(pricing.map(p => p.id === item.id ? { ...p, monthlyRate: val } : p));
                                }}
                            />
                        </div>
                        <Button
                            onClick={() => handleUpdate(item)}
                            disabled={saving === item.id}
                            className="w-full"
                        >
                            {saving === item.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
