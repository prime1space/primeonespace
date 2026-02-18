import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BookingReceipt {
    id: number;
    userName: string;
    userEmail: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    spaceName: string;
    totalAmount: number;
    paymentStatus: string;
    refreshments?: { name: string; quantity: number; price: number }[];
}

export const generateReceipt = (booking: BookingReceipt, returnBlob?: boolean) => {
    const doc = new jsPDF();
    const themeColor = [20, 33, 43]; // #14212B (Your brand color)

    // -- Header --
    doc.setFillColor(20, 33, 43);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PrimeOne Space", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt", 160, 25);

    // -- Details Section --
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    let yPos = 55;

    // Left Side (Customer)
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO:", 14, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    doc.text(booking.userName, 14, yPos);
    yPos += 5;
    doc.text(booking.userEmail, 14, yPos);

    // Right Side (Invoice Info)
    yPos = 55;
    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT NO:", 140, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`#${booking.id.toString().padStart(6, '0')}`, 170, yPos);

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("DATE:", 140, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(booking.bookingDate, 170, yPos);

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("STATUS:", 140, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(booking.paymentStatus === 'completed' ? 0 : 200, booking.paymentStatus === 'completed' ? 128 : 0, 0);
    doc.text(booking.paymentStatus.toUpperCase(), 170, yPos);
    doc.setTextColor(0, 0, 0);

    // -- Items Table --

    // Prepare Table Data
    const tableRows: any[] = [];

    // 1. Space Charge
    tableRows.push([
        `Space Booking: ${booking.spaceName}`,
        `${booking.startTime} - ${booking.endTime}`,
        "-", // Quantity n/a for hourly/time usually, or 1
        // We don't have individual breakdown of space cost vs refreshments easily available in the combined totalAmount in the receipt object passed currently? 
        // Actually the Booking interface usually has totalAmount. 
        // We should try to calculate breakdown if possible, or just list items.
        // For now, let's list Refreshments first, then calculate "Space Fee" as Remainder.
    ]);

    let refreshmentsTotal = 0;
    if (booking.refreshments && booking.refreshments.length > 0) {
        booking.refreshments.forEach(ref => {
            const itemTotal = ref.price * ref.quantity;
            refreshmentsTotal += itemTotal;
            tableRows.push([
                `Add-on: ${ref.name}`,
                "Refreshment",
                `x${ref.quantity}`,
                `LKR ${itemTotal.toLocaleString()}`
            ]);
        });
    }

    // Insert Space Fee at top with calculated amount
    const spaceFee = booking.totalAmount - refreshmentsTotal;
    tableRows[0] = [
        `Workspace: ${booking.spaceName}`,
        `${booking.startTime.substring(0, 5)} - ${booking.endTime.substring(0, 5)}`,
        "1",
        `LKR ${spaceFee.toLocaleString()}`
    ];

    autoTable(doc, {
        startY: 85,
        head: [["Description", "Details", "Qty", "Amount"]],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [20, 33, 43], textColor: 255 },
        columnStyles: {
            3: { halign: 'right' }
        },
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // -- Total Section --
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Amount:", 140, finalY);
    doc.setFontSize(14);
    doc.text(`LKR ${booking.totalAmount.toLocaleString()}`, 200, finalY, { align: 'right' });

    // -- Footer --
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing PrimeOne Space.", 105, 280, { align: 'center' });
    doc.text("Questions? Contact us at support@primeone.lk", 105, 285, { align: 'center' });

    // Save
    if (returnBlob) {
        return doc.output('blob');
    } else {
        doc.save(`Receipt_PrimeOne_${booking.id}.pdf`);
    }
};
