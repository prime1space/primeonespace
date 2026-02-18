
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { baseURL } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";

interface Space {
    id: number;
    name: string;
    type: string;
    capacity: number;
    amenities: string[] | null;
    imageUrl: string | null;
    description: string | null;
    available: boolean;
    pricing: {
        hourlyRate: number | null;
        rate2h: number | null;
        rate3h: number | null;
        rate4hPlus: number | null;
        dailyRate: number | null;
        monthlyRate: number | null;
        features: string[] | null;
    } | null;
}

export function SpacesManager() {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Space | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        capacity: 1,
        amenities: "", // comma separated for input
        imageUrl: "",
        description: "",
        available: true,
        hourlyRate: 0,
        rate2h: 0,
        rate3h: 0,
        rate4hPlus: 0,
        dailyRate: 0,
        monthlyRate: 0,
        pricingFeatures: ""
    });

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const res = await fetch(`${baseURL}/spaces`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setSpaces(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load spaces");
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (space?: Space) => {
        if (space) {
            setIsEditing(space);
            setFormData({
                name: space.name,
                type: space.type,
                capacity: space.capacity,
                amenities: Array.isArray(space.amenities) ? space.amenities.join(", ") : "",
                imageUrl: space.imageUrl || "",
                description: space.description || "",
                available: space.available ?? true,
                hourlyRate: space.pricing?.hourlyRate || 0,
                rate2h: space.pricing?.rate2h || 0,
                rate3h: space.pricing?.rate3h || 0,
                rate4hPlus: space.pricing?.rate4hPlus || 0,
                dailyRate: space.pricing?.dailyRate || 0,
                monthlyRate: space.pricing?.monthlyRate || 0,
                pricingFeatures: Array.isArray(space.pricing?.features) ? space.pricing.features.join(", ") : ""
            });
        } else {
            setIsEditing(null);
            setFormData({
                name: "",
                type: "dedicated_desk",
                capacity: 1,
                amenities: "",
                imageUrl: "",
                description: "",
                available: true,
                hourlyRate: 0,
                rate2h: 0,
                rate3h: 0,
                rate4hPlus: 0,
                dailyRate: 0,
                monthlyRate: 0,
                pricingFeatures: ""
            });
        }
        setIsOpen(true);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size on frontend (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("File too large. Maximum size allowed is 10MB.");
            return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Please upload JPG, PNG, WEBP, or GIF images only.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${baseURL}/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await res.json();

            // Construct full URL if it's relative
            let imageUrl = data.url;
            if (imageUrl && imageUrl.startsWith('/')) {
                // Remove trailing slash from baseURL if present
                const cleanBaseURL = baseURL.replace(/\/$/, '');
                imageUrl = `${cleanBaseURL}${imageUrl}`;
            }

            setFormData(prev => ({ ...prev, imageUrl: imageUrl }));
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                amenities: formData.amenities.split(",").map(s => s.trim()).filter(s => s),
                pricingFeatures: formData.pricingFeatures.split(",").map(s => s.trim()).filter(s => s),
                id: isEditing ? isEditing.id : undefined
            };

            const method = isEditing ? "PUT" : "POST";
            const res = await fetch(`${baseURL}/spaces`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            toast.success(isEditing ? "Space updated" : "Space created");
            setIsOpen(false);
            fetchSpaces();
        } catch {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        // Confirmation is now handled by AlertDialog
        try {
            const res = await fetch(`${baseURL}/spaces?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            if (!res.ok) throw new Error();
            setSpaces(spaces.filter(s => s.id !== id));
            toast.success("Space deleted");
        } catch {
            toast.error("Failed to delete space");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Space</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Space" : "Add New Space"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Type (key)</Label>
                                <Input value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="e.g. dedicated_desk" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Capacity</Label>
                                <Input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Space Image</Label>
                                <div className="flex gap-4 items-start">
                                    {formData.imageUrl && (
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                                        {!uploading && !formData.imageUrl && <p className="text-xs text-muted-foreground mt-1">Or paste URL below</p>}
                                    </div>
                                </div>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-2 pt-2 border-t">
                            <Label className="text-base font-semibold">Pricing (Applied to all spaces of type '{formData.type}')</Label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>1 Hour Rate (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.hourlyRate}
                                        onChange={e => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>2 Hours Rate (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.rate2h}
                                        onChange={e => setFormData({ ...formData, rate2h: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>3 Hours Rate (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.rate3h}
                                        onChange={e => setFormData({ ...formData, rate3h: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>&gt;3 Hours Rate (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.rate4hPlus}
                                        onChange={e => setFormData({ ...formData, rate4hPlus: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Daily (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.dailyRate}
                                        onChange={e => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Monthly (LKR)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthlyRate}
                                        onChange={e => setFormData({ ...formData, monthlyRate: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label>Pricing Features (Features shown under price)</Label>
                                <Input
                                    value={formData.pricingFeatures}
                                    onChange={e => setFormData({ ...formData, pricingFeatures: e.target.value })}
                                    placeholder="Power outlets, Printing access"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Amenities (comma separated)</Label>
                            <Input value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} placeholder="WiFi, Coffee, Lockers" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch checked={formData.available} onCheckedChange={c => setFormData({ ...formData, available: c })} id="available" />
                            <Label htmlFor="available">Available for booking</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow> :
                                spaces.map((space) => (
                                    <TableRow key={space.id}>
                                        <TableCell>
                                            {space.imageUrl ? (
                                                <img
                                                    src={fixImageUrl(space.imageUrl)}
                                                    alt={space.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : <div className="w-10 h-10 bg-muted rounded flex items-center justify-center"><ImageIcon className="w-5 h-5 opacity-20" /></div>}
                                        </TableCell>
                                        <TableCell className="font-medium">{space.name}</TableCell>
                                        <TableCell>{space.type}</TableCell>
                                        <TableCell>{space.capacity}</TableCell>
                                        <TableCell>{space.available ? <span className="text-green-600 font-medium">Available</span> : <span className="text-red-500">Unavailable</span>}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpen(space)}><Pencil className="w-4 h-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the space and potentially remove related booking history.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(space.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
