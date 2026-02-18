
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Tag, Pencil } from "lucide-react";

import { baseURL } from "@/lib/auth-client";

interface Offer {
    id: number;
    title: string;
    description: string;
    code: string | null;
    discountPercentage: number | null;
    imageUrl: string | null;
    validUntil: string | null;
    isActive: boolean;
}

export function OffersManager() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Simple form state for creating
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        code: "",
        discountPercentage: 0,
        imageUrl: "",
        validUntil: ""
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await fetch(`${baseURL}/offers`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setOffers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load offers");
        } finally {
            setLoading(false);
        }
    };

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

    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            description: offer.description,
            code: offer.code || "",
            discountPercentage: offer.discountPercentage || 0,
            imageUrl: offer.imageUrl || "",
            validUntil: offer.validUntil || ""
        });
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingOffer ? `${baseURL}/offers` : `${baseURL}/offers`;
            const method = editingOffer ? "PUT" : "POST";
            const body = editingOffer ? { ...formData, id: editingOffer.id } : formData;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error();

            toast.success(editingOffer ? "Offer updated" : "Offer created");
            setIsOpen(false);
            setEditingOffer(null);
            setFormData({ title: "", description: "", code: "", discountPercentage: 0, imageUrl: "", validUntil: "" });
            fetchOffers();
        } catch {
            toast.error(editingOffer ? "Failed to update offer" : "Failed to create offer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`${baseURL}/offers?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            setOffers(offers.filter(o => o.id !== id));
            toast.success("Offer deleted");
        } catch {
            toast.error("Failed to delete offer");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Active Promotions</h2>
                <Button onClick={() => {
                    setEditingOffer(null);
                    setFormData({ title: "", description: "", code: "", discountPercentage: 0, imageUrl: "", validUntil: "" });
                    setIsOpen(true);
                }}><Plus className="w-4 h-4 mr-2" /> Create Offer</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingOffer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Offer Image</Label>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Promo Code (Optional)</Label>
                                <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Discount %</Label>
                                <Input type="number" value={formData.discountPercentage} onChange={e => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {editingOffer ? "Update Offer" : "Create Offer"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                    <Card key={offer.id}>
                        <CardHeader>
                            {offer.imageUrl && (
                                <div className="w-full h-32 mb-4 overflow-hidden rounded-md border">
                                    <img
                                        src={offer.imageUrl.startsWith('/') ? `${baseURL.replace(/\/$/, '')}${offer.imageUrl}` : offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <CardTitle className="flex justify-between">
                                <span>{offer.title}</span>
                                {offer.code && <span className="text-sm bg-muted px-2 py-1 rounded font-mono">{offer.code}</span>}
                            </CardTitle>
                            <CardDescription>{offer.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                                    <Tag className="w-4 h-4" />
                                    {offer.discountPercentage}% OFF
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(offer)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(offer.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
