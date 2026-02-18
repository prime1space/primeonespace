
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Megaphone } from "lucide-react";

import { baseURL } from "@/lib/auth-client";

interface Announcement {
    id: number;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: string;
}

export function AnnouncementsManager() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`${baseURL}/announcements`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });
            const data = await res.json();
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${baseURL}/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                },
                body: JSON.stringify(newAnnouncement),
            });

            if (!res.ok) throw new Error();

            toast.success("Announcement posted successfully");
            setNewAnnouncement({ title: "", content: "" });
            fetchAnnouncements();
        } catch (error) {
            toast.error("Failed to create announcement");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${baseURL}/announcements?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("bearer_token")}`
                }
            });

            if (!res.ok) throw new Error();

            toast.success("Announcement deleted");
            setAnnouncements(announcements.filter(a => a.id !== id));
        } catch (error) {
            toast.error("Failed to delete announcement");
        }
    };

    return (
        <div className="space-y-8">
            {/* Create New */}
            <Card>
                <CardHeader>
                    <CardTitle>Post New Announcement</CardTitle>
                    <CardDescription>Share news and updates with all users</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                placeholder="e.g. Holiday Opening Hours"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                placeholder="Details of the announcement..."
                                required
                            />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Megaphone className="w-4 h-4 mr-2" />}
                            Post Announcement
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List */}
            <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Active Announcements</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : announcements.length === 0 ? (
                    <div className="text-muted-foreground">No active announcements</div>
                ) : (
                    announcements.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Posted on {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
