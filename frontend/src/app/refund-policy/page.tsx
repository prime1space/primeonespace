import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Clock, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <RefreshCw className="w-8 h-8 text-primary" />
                            <CardTitle className="text-3xl font-bold">Refund & Cancellation Policy</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 16, 2026 | Effective Date: February 16, 2026
                        </p>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded mb-6 not-prose">
                            <p className="text-sm font-medium">
                                This policy outlines the terms and conditions for canceling bookings and requesting refunds at PrimeOne Coworking Space.
                            </p>
                        </div>

                        <h2 className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            1. Cancellation Policy
                        </h2>

                        <h3>1.1 Hourly Bookings</h3>

                        <div className="grid gap-4 my-4 not-prose">
                            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-green-900 dark:text-green-100">More than 24 hours before booking</p>
                                        <ul className="text-sm text-green-800 dark:text-green-200 mt-1 space-y-1">
                                            <li>✅ Full refund (100%)</li>
                                            <li>✅ No cancellation fee</li>
                                            <li>✅ Instant processing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">12-24 hours before booking</p>
                                        <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-1 space-y-1">
                                            <li>✅ 50% refund</li>
                                            <li>⚠️ 50% cancellation fee</li>
                                            <li>⏱️ Processed within 5-7 business days</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-red-900 dark:text-red-100">Less than 12 hours before booking</p>
                                        <ul className="text-sm text-red-800 dark:text-red-200 mt-1 space-y-1">
                                            <li>❌ No refund</li>
                                            <li>⚠️ 100% cancellation fee</li>
                                            <li>ℹ️ Booking amount forfeited</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3>1.2 Daily Bookings</h3>
                        <ul>
                            <li><strong>More than 48 hours before</strong>: Full refund (100%)</li>
                            <li><strong>24-48 hours before</strong>: 50% refund</li>
                            <li><strong>Less than 24 hours before</strong>: No refund</li>
                        </ul>

                        <h3>1.3 Monthly Memberships</h3>
                        <ul>
                            <li><strong>Before membership start</strong>: Full refund (100%)</li>
                            <li><strong>Within first 7 days</strong>: Pro-rated refund (minus one week's fee)</li>
                            <li><strong>After 7 days</strong>: No refund for current month, can cancel for next month (30 days notice required)</li>
                        </ul>

                        <h3>1.4 Event Registrations</h3>
                        <ul>
                            <li><strong>More than 7 days before event</strong>: Full refund (100%)</li>
                            <li><strong>3-7 days before event</strong>: 50% refund</li>
                            <li><strong>Less than 3 days before event</strong>: No refund</li>
                        </ul>

                        <h2>2. How to Cancel</h2>

                        <h3>2.1 Online Cancellation</h3>
                        <ol>
                            <li>Log in to your account</li>
                            <li>Go to "My Bookings"</li>
                            <li>Select the booking to cancel</li>
                            <li>Click "Cancel Booking"</li>
                            <li>Confirm cancellation</li>
                            <li>Receive confirmation email</li>
                        </ol>

                        <h3>2.2 Email Cancellation</h3>
                        <ul>
                            <li>Send email to: <a href="mailto:bookings@primeone.space" className="text-primary hover:underline">bookings@primeone.space</a></li>
                            <li>Include: Booking ID, Name, Email, Reason</li>
                            <li>Response within 24 hours</li>
                        </ul>

                        <h3>2.3 Phone Cancellation</h3>
                        <ul>
                            <li>Call: +94 70 623 3612</li>
                            <li>Available: Monday-Friday, 9 AM - 6 PM (Sri Lanka Time)</li>
                            <li>Provide booking details</li>
                        </ul>

                        <h2 className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            3. Refund Processing
                        </h2>

                        <h3>3.1 Refund Timeline</h3>
                        <ul>
                            <li><strong>Credit/Debit Card</strong>: 5-7 business days</li>
                            <li><strong>Bank Transfer</strong>: 7-10 business days</li>
                            <li><strong>Digital Wallets</strong>: 3-5 business days</li>
                        </ul>

                        <h3>3.2 Refund Method</h3>
                        <ul>
                            <li>Refunds issued to original payment method</li>
                            <li>Cannot refund to different account</li>
                            <li>Processing fees may apply (bank-dependent)</li>
                        </ul>

                        <h2>4. Modifications and Rescheduling</h2>

                        <h3>4.1 Modification Policy</h3>
                        <ul>
                            <li><strong>More than 24 hours before</strong>: Free modification (one time), subject to availability</li>
                            <li><strong>Less than 24 hours before</strong>: 25% modification fee, subject to availability</li>
                        </ul>

                        <h2>5. Exceptions and Special Circumstances</h2>

                        <h3>5.1 Force Majeure</h3>
                        <p>Full refund provided for cancellations due to:</p>
                        <ul>
                            <li>Natural disasters</li>
                            <li>Government restrictions</li>
                            <li>Public health emergencies</li>
                            <li>Facility closures</li>
                        </ul>

                        <h3>5.2 Facility Issues</h3>
                        <p>Full refund if we cancel due to:</p>
                        <ul>
                            <li>Maintenance issues</li>
                            <li>Overbooking</li>
                            <li>Facility unavailability</li>
                            <li>Safety concerns</li>
                        </ul>

                        <h3>5.3 Medical Emergencies</h3>
                        <ul>
                            <li>Provide medical certificate</li>
                            <li>Full refund considered on case-by-case basis</li>
                            <li>Contact us within 48 hours</li>
                        </ul>

                        <h2>6. Non-Refundable Items</h2>
                        <p>The following are <strong>NOT refundable</strong>:</p>
                        <ul>
                            <li>❌ Booking fees and service charges</li>
                            <li>❌ Add-on services already consumed</li>
                            <li>❌ Promotional discounts (if booking cancelled)</li>
                            <li>❌ No-show bookings</li>
                            <li>❌ Late cancellations (as per policy)</li>
                        </ul>

                        <h2>7. Contact Information</h2>
                        <div className="bg-accent/50 p-4 rounded-lg not-prose">
                            <p className="font-semibold mb-2">For Cancellations and Refunds:</p>
                            <p className="text-sm">
                                <strong>Email:</strong>{" "}
                                <a href="mailto:bookings@primeone.space" className="text-primary hover:underline">
                                    bookings@primeone.space
                                </a>
                            </p>
                            <p className="text-sm">
                                <strong>Phone:</strong> +94 70 623 3612
                            </p>
                            <p className="text-sm">
                                <strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM (Sri Lanka Time)
                            </p>
                            <p className="text-sm">
                                <strong>Address:</strong> 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka
                            </p>
                        </div>

                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded mt-8 not-prose">
                            <p className="text-sm font-medium">
                                By making a booking, you acknowledge that you have read, understood, and agree to this Refund and Cancellation Policy.
                            </p>
                            <p className="text-sm mt-2">
                                Questions? Contact us at{" "}
                                <a href="mailto:bookings@primeone.space" className="text-primary hover:underline">
                                    bookings@primeone.space
                                </a>{" "}
                                or call +94 70 623 3612
                            </p>
                        </div>

                        <div className="flex gap-4 mt-8 not-prose">
                            <Link href="/terms">
                                <button className="text-sm text-primary hover:underline">Terms of Service</button>
                            </Link>
                            <Link href="/privacy">
                                <button className="text-sm text-primary hover:underline">Privacy Policy</button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
