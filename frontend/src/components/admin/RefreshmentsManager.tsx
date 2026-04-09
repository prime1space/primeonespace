"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Refreshment {
    id: number;
    name: string;
    category: string;
    price: number | string;
    image_url: string | null;
    is_available: number;
}

export function RefreshmentsManager() {
    const [refreshments, setRefreshments] = useState<Refreshment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Refreshment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        category: "coffee",
        price: 0,
        image_url: "",
        is_available: 1
    });

    useEffect(() => {
        fetchRefreshments();
    }, []);

    const fetchRefreshments = async () => {
        try {
            const res = await fetch(`${baseURL}/refreshments`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setRefreshments(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load refreshments");
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (item?: Refreshment) => {
        if (item) {
            setIsEditing(item);
            setFormData({
                name: item.name,
                category: item.category,
                price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
                image_url: item.image_url || "",
                is_available: item.is_available ?? 1
            });
        } else {
            setIsEditing(null);
            setFormData({
                name: "",
                category: "coffee",
                price: 0,
                image_url: "",
                is_available: 1
            });
        }
        setIsOpen(true);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("File too large. Maximum size allowed is 10MB.");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Please upload JPG, PNG, WEBP, or GIF images only.");
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch(`${baseURL}/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: uploadData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await res.json();
            let imageUrl = data.url;
            if (imageUrl && imageUrl.startsWith('/')) {
                const cleanBaseURL = baseURL.replace(/\/$/, '');
                imageUrl = `${cleanBaseURL}${imageUrl}`;
            }

            setFormData(prev => ({ ...prev, image_url: imageUrl }));
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
                id: isEditing ? isEditing.id : undefined
            };

            const method = isEditing ? "PUT" : "POST";
            const res = await fetch(`${baseURL}/refreshments`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            toast.success(isEditing ? "Refreshment updated" : "Refreshment created");
            setIsOpen(false);
            fetchRefreshments();
        } catch {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${baseURL}/refreshments`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify({ id })
            });
            if (!res.ok) throw new Error();
            setRefreshments(refreshments.filter(s => s.id !== id));
            toast.success("Refreshment deleted");
        } catch {
            toast.error("Failed to delete refreshment");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Refreshment</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Refreshment" : "Add New Refreshment"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="coffee">Coffee Bar</SelectItem>
                                        <SelectItem value="cool_beverages">Cool Drinks</SelectItem>
                                        <SelectItem value="food">Snacks & Food</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Price (LKR)</Label>
                                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="flex gap-4 items-start">
                                {formData.image_url && (
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                        <img src={fixImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
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
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Switch checked={formData.is_available === 1} onCheckedChange={c => setFormData({ ...formData, is_available: c ? 1 : 0 })} id="available" />
                            <Label htmlFor="available">Available in menu</Label>
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
                                <TableHead>Category</TableHead>
                                <TableHead>Price (LKR)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow> :
                                refreshments.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No refreshments found</TableCell></TableRow> :
                                    refreshments.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {(() => {
                                                    const hasCustomImg = item.image_url && (item.image_url.includes('/uploads/') || item.image_url.startsWith('http'));
                                                    return hasCustomImg ? (
                                                        <img
                                                            src={fixImageUrl(item.image_url)}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                                            <ImageIcon className="w-5 h-5 opacity-20" />
                                                        </div>
                                                    );
                                                })()}
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="capitalize">{item.category.replace('_', ' ')}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.is_available ? <span className="text-green-600 font-medium">Available</span> : <span className="text-red-500">Hidden</span>}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}><Pencil className="w-4 h-4" /></Button>
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
                                                                This will permanently delete this refreshment item.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
