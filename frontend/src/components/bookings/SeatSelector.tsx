
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Seat {
    id: string;
    row?: number;
    col?: number;
    label?: string;
    type?: "seat" | "meeting_room" | "private_office"; // Future proofing
}

interface SeatSelectorProps {
    capacity: number;
    selectedSeats: string[];
    onSelect: (seats: string[]) => void;
    bookedSeats: string[];
    loading?: boolean;
    layout?: Seat[]; // Optional custom layout
}

export function SeatSelector({ capacity, selectedSeats, onSelect, bookedSeats, loading, layout }: SeatSelectorProps) {
    // Use custom layout if provided, otherwise generate default grid
    const seats = layout ? layout.map(s => ({
        id: s.id,
        label: s.label || s.id,
        isBooked: bookedSeats.includes(s.id),
        isSelected: selectedSeats.includes(s.id),
        row: s.row,
        col: s.col
    })) : Array.from({ length: capacity }, (_, i) => {
        const seatNum = (i + 1).toString();
        return {
            id: seatNum,
            label: seatNum,
            isBooked: bookedSeats.includes(seatNum),
            isSelected: selectedSeats.includes(seatNum),
            row: undefined,
            col: undefined
        };
    });

    const handleSeatToggle = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            onSelect(selectedSeats.filter(id => id !== seatId));
        } else {
            onSelect([...selectedSeats, seatId]);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Calculate grid dimensions if using row/col
    const maxCol = layout ? Math.max(...layout.map(s => s.col || 0)) + 1 : Math.ceil(Math.sqrt(capacity));

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border shadow-sm">
            <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border bg-background" />
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border bg-primary/20 border-primary" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted text-muted-foreground/50 cursor-not-allowed" />
                    <span>Occupied</span>
                </div>
            </div>

            <div
                className="grid gap-3 justify-center"
                style={{
                    // If layout is present, use flexible grid based on maxCol. 
                    // If not, limit to 6 columns or square root.
                    gridTemplateColumns: `repeat(${layout ? maxCol : Math.min(maxCol, 6)}, minmax(40px, 1fr))`
                }}
            >
                {seats.map((seat) => (
                    <button
                        key={seat.id}
                        type="button"
                        disabled={seat.isBooked}
                        onClick={() => handleSeatToggle(seat.id)}
                        style={seat.row !== undefined && seat.col !== undefined ? {
                            gridColumnStart: (seat.col || 0) + 1,
                            gridRowStart: (seat.row || 0) + 1
                        } : {}}
                        className={cn(
                            "h-10 w-10 flex items-center justify-center rounded-md border text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            seat.isBooked
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50 hover:scale-100"
                                : seat.isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                    : "bg-background hover:border-primary hover:bg-accent"
                        )}
                        title={seat.isBooked ? `Seat ${seat.label} (Occupied)` : `Seat ${seat.label}`}
                    >
                        {seat.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 text-center border-t pt-4">
                <p className="text-sm font-medium">
                    Screen / Front Area
                </p>
                <div className="w-3/4 h-1 mx-auto bg-primary/20 mt-2 rounded-full" />
            </div>
        </div>
    );
}
