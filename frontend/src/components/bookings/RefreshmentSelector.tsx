import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Pizza, CupSoda, Minus, Plus, Loader2 } from "lucide-react";
import { baseURL } from "@/lib/auth-client";
import { fixImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Refreshment {
    id: number;
    name: string;
    category: 'coffee' | 'cool_beverages' | 'food';
    price: number;
    image_url?: string;
}

interface RefreshmentSelectorProps {
    onSelectionChange: (selectedItems: { id: number; quantity: number; price: number; name: string }[]) => void;
}

export function RefreshmentSelector({ onSelectionChange }: RefreshmentSelectorProps) {
    const [refreshments, setRefreshments] = useState<Refreshment[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useEffect(() => {
        fetchRefreshments();
    }, []);

    useEffect(() => {
        // Notify parent of changes
        const selected = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const item = refreshments.find(r => r.id === parseInt(id));
                return item ? { id: item.id, quantity: qty, price: item.price, name: item.name } : null;
            })
            .filter(Boolean) as { id: number; quantity: number; price: number; name: string }[];

        onSelectionChange(selected);
    }, [quantities, refreshments]);

    const fetchRefreshments = async () => {
        try {
            const res = await fetch(`${baseURL}/refreshments`);
            if (res.ok) {
                const data = await res.json();
                setRefreshments(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error("Failed to load refreshments", e);
            setRefreshments([]);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

    const categories = {
        coffee: { label: "Coffee Bar", icon: Coffee },
        cool_beverages: { label: "Cool Drinks", icon: CupSoda },
        food: { label: "Snacks & Food", icon: Pizza },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Add Refreshments</h3>
                <Badge variant="outline" className="text-muted-foreground font-normal">Optional</Badge>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent gap-2 mb-2">
                    <TabsTrigger value="all" className="rounded-full border px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">All Items</TabsTrigger>
                    {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
                        <TabsTrigger key={key} value={key} className="rounded-full border px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 transition-all">
                            <Icon className="w-4 h-4" />
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {refreshments.map(item => (
                            <RefreshmentCard key={item.id} item={item} quantity={quantities[item.id] || 0} onUpdate={updateQuantity} />
                        ))}
                    </div>
                </TabsContent>

                {Object.keys(categories).map(cat => (
                    <TabsContent key={cat} value={cat} className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {refreshments.filter(r => r.category === cat).map(item => (
                                <RefreshmentCard key={item.id} item={item} quantity={quantities[item.id] || 0} onUpdate={updateQuantity} />
                            ))}
                            {refreshments.filter(r => r.category === cat).length === 0 && (
                                <div className="col-span-full py-8 text-center text-muted-foreground">No items available in this category.</div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function RefreshmentCard({ item, quantity, onUpdate }: { item: Refreshment, quantity: number, onUpdate: (id: number, d: number) => void }) {
    // Determine beautiful image
    const defaultImage = item.category === 'cool_beverages' ? '/cool_drinks_thumb.png' :
        item.category === 'food' ? '/food_thumb.png' :
            '/coffee_thumb.png';

    const hasCustomImage = item.image_url &&
        (item.image_url.includes('/uploads/') || item.image_url.startsWith('http'));

    const imageUrl = hasCustomImage ? fixImageUrl(item.image_url!) : defaultImage;

    return (
        <Card className={`relative border transition-all duration-200 overflow-hidden group ${quantity > 0 ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}>
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <img src={imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 w-full h-full"></div>
            </div>

            <CardContent className="relative z-10 p-3 sm:p-5 flex items-end justify-between gap-2 sm:gap-4 min-h-[110px] sm:min-h-[140px]">
                <div className="flex-1 pl-0 pr-2 pb-1 text-white">
                    <div className="flex items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                        <div className="flex items-center gap-1.5 drop-shadow-md">
                            <h4 className="font-semibold text-sm sm:text-[17px] leading-tight break-words line-clamp-2">{item.name}</h4>
                        </div>
                        {quantity > 0 && <Badge className="h-5 sm:h-6 px-1.5 sm:px-2 min-w-min text-[10px] sm:text-xs shrink-0 w-max bg-primary hover:bg-primary border-none shadow-sm">{quantity}</Badge>}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium drop-shadow-md">LKR {item.price}</p>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-xl flex-shrink-0 text-white">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-muted shrink-0"
                        onClick={() => onUpdate(item.id, -1)}
                        disabled={quantity === 0}
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-3 sm:w-4 text-center text-xs sm:text-sm font-semibold">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-muted shrink-0"
                        onClick={() => onUpdate(item.id, 1)}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
