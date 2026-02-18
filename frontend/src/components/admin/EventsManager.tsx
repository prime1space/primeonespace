
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Calendar, Image as ImageIcon, Edit } from "lucide-react";

import { baseURL } from "@/lib/auth-client";

interface Event {
    id: number;
    title: string;
    description: string;
    eventDate: string;
    imageUrl: string | null;
    published: boolean;
    registrationCount?: number;
    registrants?: { name: string; email: string; phone: string; created_at: string }[];
}

export function EventsManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [viewingRegistrants, setViewingRegistrants] = useState<Event | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        imageUrl: "",
        published: true
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${baseURL}/events`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            const eventsData = Array.isArray(data) ? data : [];

            // Fetch registration info for each event
            const enrichedEvents = await Promise.all(eventsData.map(async (e: Event) => {
                try {
                    const rRes = await fetch(`${baseURL}/event-registrations?eventId=${e.id}`, {
                        headers: { "Authorization": `Bearer ${localStorage.getItem("bearer_token")}` }
                    });
                    const rData = await rRes.json();
                    return { ...e, registrationCount: rData.registrationCount, registrants: rData.registrants };
                } catch {
                    return e;
                }
            }));

            setEvents(enrichedEvents);
        } catch {
            toast.error("Failed to load events");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingEvent ? `${baseURL}/events?id=${editingEvent.id}` : `${baseURL}/events`;
            const method = editingEvent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error();

            toast.success(editingEvent ? "Event updated" : "Event created");
            setIsOpen(false);
            setFormData({ title: "", description: "", eventDate: "", imageUrl: "", published: true });
            setEditingEvent(null);
            fetchEvents();
        } catch {
            toast.error(editingEvent ? "Failed to update event" : "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`${baseURL}/events?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            setEvents(events.filter(e => e.id !== id));
            toast.success("Event deleted");
        } catch {
            toast.error("Failed to delete event");
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            imageUrl: event.imageUrl || "",
            published: event.published
        });
        setIsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Upcoming Events</h2>
                <Button onClick={() => {
                    setEditingEvent(null);
                    setFormData({ title: "", description: "", eventDate: "", imageUrl: "", published: true });
                    setIsOpen(true);
                }}><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
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
                            <Label>Event Date & Time</Label>
                            <Input
                                type="datetime-local"
                                value={formData.eventDate}
                                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Event Image</Label>
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
                        <div className="flex items-center space-x-2">
                            <Switch checked={formData.published} onCheckedChange={c => setFormData({ ...formData, published: c })} id="published" />
                            <Label htmlFor="published">Publish Immediately</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingEvent ? "Update Event" : "Create Event"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewingRegistrants} onOpenChange={() => setViewingRegistrants(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Registrants for {viewingRegistrants?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {(!viewingRegistrants?.registrants || viewingRegistrants.registrants.length === 0) ? (
                            <p className="text-center py-8 text-muted-foreground">No registrations yet.</p>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Phone</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {viewingRegistrants.registrants.map((r, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-medium">{r.name}</td>
                                                <td className="px-4 py-2">{r.email}</td>
                                                <td className="px-4 py-2">{r.phone || "-"}</td>
                                                <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-2 gap-4">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start text-lg">
                                <span>{event.title}</span>
                                {event.published ?
                                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Published</span> :
                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Draft</span>
                                }
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.eventDate).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-6">
                                {event.imageUrl && (
                                    <img src={event.imageUrl} alt={event.title} className="w-20 h-20 object-cover rounded-md" />
                                )}
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                            {event.registrationCount || 0} Registrants
                                        </Badge>
                                        {(event.registrationCount || 0) > 0 && (
                                            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setViewingRegistrants(event)}>
                                                View Details
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-4">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(event.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
