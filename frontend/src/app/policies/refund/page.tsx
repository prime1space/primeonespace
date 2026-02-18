import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="py-20 bg-zinc-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 hover:bg-zinc-100">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shadow-sm">
            <DollarSign className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">Refund Policy</h1>
            <p className="text-zinc-500 mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="pt-8 px-6 md:px-10 prose prose-zinc max-w-none text-justify prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-600 prose-p:leading-8 prose-p:mb-6 prose-li:text-zinc-600 prose-li:leading-8 prose-li:mb-3">
            <h2 className="text-zinc-900">1. Refund Eligibility</h2>
            <p>
              This policy outlines when refunds are available and how they are processed. All refunds are subject to our Cancellation Policy terms.
            </p>

            <h2 className="text-zinc-900">2. Eligible Refund Scenarios</h2>
            <p>
              <strong className="text-zinc-900">2.1 Full Refunds</strong><br />
              You are eligible for a full refund in the following cases:
            </p>
            <ul>
              <li>Cancellation more than 24 hours before hourly/daily bookings</li>
              <li>Cancellation more than 48 hours before meeting room bookings</li>
              <li>Facility-initiated cancellations due to maintenance or emergency</li>
              <li>Service unavailability (power outage, internet failure lasting &gt;2 hours)</li>
              <li>Billing errors or duplicate charges</li>
              <li>Unauthorized charges on your account</li>
            </ul>
            <p>
              <strong className="text-zinc-900">2.2 Partial Refunds</strong><br />
              Partial refunds may be issued for:
            </p>
            <ul>
              <li>Cancellations within the notice period (see Cancellation Policy)</li>
              <li>Service disruptions lasting less than 2 hours (pro-rated)</li>
              <li>Membership downgrades (credit difference toward future services)</li>
              <li>Event cancellations with 15-30 days notice (50% refund)</li>
            </ul>
            <p>
              <strong className="text-zinc-900">2.3 Non-Refundable Items</strong><br />
              The following are non-refundable:
            </p>
            <ul>
              <li>Monthly membership fees (except in exceptional circumstances)</li>
              <li>Payment processing fees (typically 2-3%)</li>
              <li>No-show bookings</li>
              <li>Late cancellations (less than 12 hours notice)</li>
              <li>Event deposits (may be credited toward future events)</li>
              <li>Printed materials, refreshments, or consumables</li>
              <li>Guest passes once issued</li>
            </ul>

            <h2 className="text-zinc-900">3. Refund Request Process</h2>
            <p>
              <strong className="text-zinc-900">3.1 How to Request</strong>
            </p>
            <ol>
              <li>Log into your PrimeOne Space account</li>
              <li>Navigate to "My Bookings" or "Billing History"</li>
              <li>Select the booking/payment in question</li>
              <li>Click "Request Refund" and provide reason</li>
              <li>Submit supporting documentation if applicable</li>
            </ol>
            <p>
              Alternatively, contact us at <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a> with your booking reference number.
            </p>
            <p>
              <strong className="text-zinc-900">3.2 Required Information</strong><br />
              To process your refund request, provide:
            </p>
            <ul>
              <li>Booking or transaction ID</li>
              <li>Date of booking/payment</li>
              <li>Reason for refund request</li>
              <li>Supporting documentation (if claiming service issues)</li>
              <li>Preferred refund method (if different from original payment)</li>
            </ul>

            <h2 className="text-zinc-900">4. Refund Processing Timeline</h2>
            <p>
              <strong className="text-zinc-900">4.1 Review Period</strong><br />
              We will review your refund request within 2-3 business days and notify you of approval or denial.
            </p>
            <p>
              <strong className="text-zinc-900">4.2 Processing Time</strong><br />
              Once approved:
            </p>
            <ul>
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
              <li><strong>Online Payment Systems:</strong> 3-7 business days</li>
              <li><strong>Bank Transfers:</strong> 7-14 business days</li>
              <li><strong>Account Credits:</strong> Immediate</li>
            </ul>
            <p>
              Note: Processing times depend on your financial institution and payment method.
            </p>

            <h2 className="text-zinc-900">5. Refund Methods</h2>
            <p>
              <strong className="text-zinc-900">5.1 Original Payment Method</strong><br />
              Refunds are typically issued to the original payment method used for the booking.
            </p>
            <p>
              <strong className="text-zinc-900">5.2 Account Credit</strong><br />
              You may choose to receive refunds as PrimeOne Space account credits, which:
            </p>
            <ul>
              <li>Are issued immediately</li>
              <li>Include 5% bonus (on refunds over $50)</li>
              <li>Never expire</li>
              <li>Can be used for any PrimeOne Space services</li>
            </ul>
            <p>
              <strong className="text-zinc-900">5.3 Alternative Methods</strong><br />
              If the original payment method is unavailable, we can arrange:
            </p>
            <ul>
              <li>Bank transfer (may require additional verification)</li>
              <li>Check payment (processing fee may apply)</li>
            </ul>

            <h2 className="text-zinc-900">6. Disputed Charges</h2>
            <p>
              <strong className="text-zinc-900">6.1 Billing Disputes</strong><br />
              If you notice an incorrect charge:
            </p>
            <ol>
              <li>Contact us immediately at <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a></li>
              <li>Provide transaction details and explanation</li>
              <li>We will investigate within 24-48 hours</li>
              <li>Resolution or explanation provided within 5 business days</li>
            </ol>
            <p>
              <strong className="text-zinc-900">6.2 Chargeback Policy</strong><br />
              Before initiating a chargeback with your bank:
            </p>
            <ul>
              <li>Please contact us first to resolve the issue</li>
              <li>Most disputes can be resolved faster through direct communication</li>
              <li>Chargebacks may result in account suspension pending investigation</li>
              <li>Proven fraudulent chargebacks may result in permanent account termination</li>
            </ul>

            <h2 className="text-zinc-900">7. Service Quality Refunds</h2>
            <p>
              <strong className="text-zinc-900">7.1 Service Disruptions</strong><br />
              If you experience service issues:
            </p>
            <ul>
              <li>Report immediately to reception or <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a></li>
              <li>We will attempt to resolve or provide alternative space</li>
              <li>Significant disruptions (WiFi down, no power) may qualify for partial/full refund</li>
              <li>Minor inconveniences may receive account credits or future discounts</li>
            </ul>
            <p>
              <strong className="text-zinc-900">7.2 Cleanliness or Maintenance</strong><br />
              If space does not meet our standards:
            </p>
            <ul>
              <li>Notify us immediately for immediate correction</li>
              <li>Documented issues may qualify for partial refund</li>
              <li>We may offer alternative space or future booking credits</li>
            </ul>

            <h2 className="text-zinc-900">8. Special Circumstances</h2>
            <p>
              <strong className="text-zinc-900">8.1 Medical or Family Emergencies</strong><br />
              We understand emergencies happen. With proper documentation:
            </p>
            <ul>
              <li>Medical certificates for health-related cancellations</li>
              <li>Death certificates for family bereavement</li>
              <li>Emergency travel documents</li>
            </ul>
            <p>
              We will review requests compassionately and may offer refunds outside standard policy.
            </p>
            <p>
              <strong className="text-zinc-900">8.2 Business Closure or Relocation</strong><br />
              For businesses closing or relocating:
            </p>
            <ul>
              <li>Provide 30 days notice</li>
              <li>Submit business closure documentation</li>
              <li>We may offer pro-rated refund on remaining membership term</li>
            </ul>

            <h2 className="text-zinc-900">9. Membership Refunds</h2>
            <p>
              <strong className="text-zinc-900">9.1 Monthly Memberships</strong><br />
              Generally non-refundable, but we consider:
            </p>
            <ul>
              <li>Unused first month (within 7 days of joining)</li>
              <li>Severe service failures on our part</li>
              <li>Documented emergencies or special circumstances</li>
            </ul>
            <p>
              <strong className="text-zinc-900">9.2 Annual Memberships</strong><br />
              Annual memberships may receive pro-rated refunds:
            </p>
            <ul>
              <li>Within first 30 days: 80% refund</li>
              <li>After 30 days: Pro-rated based on unused months (minus 20% admin fee)</li>
              <li>After 6 months: No refunds, but can transfer membership to someone else</li>
            </ul>

            <h2 className="text-zinc-900">10. Refund Denials and Appeals</h2>
            <p>
              <strong className="text-zinc-900">10.1 Denial Reasons</strong><br />
              Refunds may be denied if:
            </p>
            <ul>
              <li>Request doesn't meet policy criteria</li>
              <li>Insufficient documentation provided</li>
              <li>Services were fully delivered as agreed</li>
              <li>Request made outside acceptable timeframe</li>
              <li>Previous abuse of refund policy</li>
            </ul>
            <p>
              <strong className="text-zinc-900">10.2 Appeal Process</strong><br />
              If your refund is denied:
            </p>
            <ol>
              <li>Review the denial reason provided</li>
              <li>Submit appeal with additional documentation within 14 days</li>
              <li>Management will review within 5 business days</li>
              <li>Final decision will be communicated via email</li>
            </ol>

            <h2 className="text-zinc-900">11. Contact for Refunds</h2>
            <p>
              For refund requests and inquiries:<br />
              Email: <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a><br />
              Phone: 070 623 3612<br />
              Subject Line: "Refund Request - [Booking ID]"
            </p>
            <p>
              Our customer service team is available Monday-Friday, 8:00 AM - 6:00 PM.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 flex-wrap justify-center md:justify-start">
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/terms">Terms of Service</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/privacy">Privacy Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/cancellation">Cancellation Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/it-policy">IT Access Policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
