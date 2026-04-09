import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CancellationPage() {
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
            <XCircle className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">Cancellation Policy</h1>
            <p className="text-zinc-500 mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="pt-8 px-6 md:px-10 prose prose-zinc max-w-none text-justify prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-600 prose-p:leading-8 prose-p:mb-6 prose-li:text-zinc-600 prose-li:leading-8 prose-li:mb-3">
            <h2 className="text-zinc-900">1. General Cancellation Policy</h2>
            <p>
              At PrimeOne Space, we understand that plans change. This policy outlines the terms and conditions for canceling bookings and memberships.
            </p>

            <h2 className="text-zinc-900">2. Hourly and Daily Bookings</h2>
            <p>
              <strong className="text-zinc-900">2.1 Cancellation Timeline</strong>
            </p>
            <ul>
              <li><strong>More than 24 hours before:</strong> Full refund (minus processing fees)</li>
              <li><strong>12-24 hours before:</strong> 50% refund</li>
              <li><strong>Less than 12 hours before:</strong> No refund</li>
              <li><strong>No-show:</strong> No refund</li>
            </ul>
            <p>
              <strong className="text-zinc-900">2.2 How to Cancel</strong><br />
              Log into your account and navigate to "My Bookings" to cancel. You will receive email confirmation of your cancellation.
            </p>
            <p>
              <strong className="text-zinc-900">2.3 Weather or Emergency</strong><br />
              In case of severe weather or emergencies that prevent access to our facility, we will offer full refund or rebooking options.
            </p>

            <h2 className="text-zinc-900">3. Monthly Memberships</h2>
            <p>
              <strong className="text-zinc-900">3.1 Notice Period</strong><br />
              Monthly memberships require 30 days written notice for cancellation. Notice must be submitted before the renewal date to avoid charges for the next month.
            </p>
            <p>
              <strong className="text-zinc-900">3.2 Pro-rated Refunds</strong><br />
              Monthly memberships are non-refundable. However, in exceptional circumstances (medical, relocation), we may offer pro-rated refunds at our discretion.
            </p>
            <p>
              <strong className="text-zinc-900">3.3 Cancellation Process</strong>
            </p>
            <ol>
              <li>Submit cancellation request via email to <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a></li>
              <li>Include your membership ID and reason for cancellation</li>
              <li>Receive confirmation within 2 business days</li>
              <li>Return access card/key to reception</li>
              <li>Remove all personal belongings</li>
            </ol>

            <h2 className="text-zinc-900">4. Meeting Room Bookings</h2>
            <p>
              <strong className="text-zinc-900">4.1 Standard Cancellation</strong>
            </p>
            <ul>
              <li><strong>More than 48 hours before:</strong> Full refund</li>
              <li><strong>24-48 hours before:</strong> 50% refund</li>
              <li><strong>Less than 24 hours before:</strong> No refund</li>
            </ul>
            <p>
              <strong className="text-zinc-900">4.2 Recurring Bookings</strong><br />
              For recurring meeting room bookings, each session follows the standard cancellation policy independently.
            </p>

            <h2 className="text-zinc-900">5. Event Bookings</h2>
            <p>
              <strong className="text-zinc-900">5.1 Event Space Cancellation</strong><br />
              Event space bookings have custom cancellation terms based on the event size and duration:
            </p>
            <ul>
              <li><strong>More than 30 days before:</strong> 90% refund</li>
              <li><strong>15-30 days before:</strong> 50% refund</li>
              <li><strong>Less than 15 days before:</strong> No refund</li>
            </ul>
            <p>
              <strong className="text-zinc-900">5.2 Deposit</strong><br />
              Event deposits are non-refundable but may be credited toward a future event booking within 6 months.
            </p>

            <h2 className="text-zinc-900">6. Modifications vs. Cancellations</h2>
            <p>
              <strong className="text-zinc-900">6.1 Rescheduling</strong><br />
              If you need to change your booking date/time rather than cancel, contact us at least 24 hours in advance. Subject to availability, we can reschedule without cancellation fees.
            </p>
            <p>
              <strong className="text-zinc-900">6.2 Upgrades/Downgrades</strong><br />
              Membership tier changes can be made with 7 days notice. Price differences will be calculated pro-rata.
            </p>

            <h2 className="text-zinc-900">7. Force Majeure</h2>
            <p>
              In cases of force majeure (natural disasters, government orders, pandemics, etc.) that prevent us from providing services:
            </p>
            <ul>
              <li>Full refunds or credits will be provided</li>
              <li>Membership fees will be suspended during closure periods</li>
              <li>No penalties for cancellations due to force majeure events</li>
            </ul>

            <h2 className="text-zinc-900">8. Facility-Initiated Cancellations</h2>
            <p>
              If we need to cancel your booking due to maintenance, emergency, or overbooking:
            </p>
            <ul>
              <li>We will notify you as soon as possible</li>
              <li>Full refund will be processed immediately</li>
              <li>We will offer alternative space/time options when available</li>
              <li>For significant inconvenience, we may offer additional credits</li>
            </ul>

            <h2 className="text-zinc-900">9. Refund Processing</h2>
            <p>
              <strong className="text-zinc-900">9.1 Timeline</strong><br />
              Approved refunds are processed within 5-7 business days. The time for funds to appear in your account depends on your payment method and bank.
            </p>
            <p>
              <strong className="text-zinc-900">9.2 Processing Fees</strong><br />
              Payment processing fees (typically 2-3%) are non-refundable on all cancellations.
            </p>
            <p>
              <strong className="text-zinc-900">9.3 Refund Method</strong><br />
              Refunds are issued to the original payment method used for booking.
            </p>

            <h2 className="text-zinc-900">10. Exceptions and Special Circumstances</h2>
            <p>
              We understand that unexpected situations arise. For circumstances not covered by this policy:
            </p>
            <ul>
              <li>Medical emergencies (documentation required)</li>
              <li>Family emergencies</li>
              <li>Business closures or relocations</li>
            </ul>
            <p>
              Please contact our management team at <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a> to discuss your situation. We will review each case individually and make reasonable accommodations where possible.
            </p>

            <h2 className="text-zinc-900">11. Contact for Cancellations</h2>
            <p>
              For cancellation requests and inquiries:<br />
              Email: <a href="mailto:hello@primeone.space" className="text-zinc-900 font-medium no-underline hover:underline">hello@primeone.space</a><br />
              Phone: 077 222 8507<br />
              In-person: Reception desk during business hours
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
            <Link href="/policies/refund">Refund Policy</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-zinc-100">
            <Link href="/policies/it-policy">IT Access Policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
