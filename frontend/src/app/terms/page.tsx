import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                        <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 16, 2026 | Effective Date: February 16, 2026
                        </p>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            By accessing or using PrimeOne Coworking Space ("Service"), you agree to be bound by these Terms of Service ("Terms").
                            If you disagree with any part of the terms, you may not access the Service.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>PrimeOne provides coworking space booking and management services, including:</p>
                        <ul>
                            <li>Workspace booking (hot desks, private offices, meeting rooms)</li>
                            <li>Event registration and management</li>
                            <li>Member profile management</li>
                            <li>Payment processing for bookings</li>
                        </ul>

                        <h2>3. User Accounts</h2>
                        <h3>3.1 Registration</h3>
                        <ul>
                            <li>You must provide accurate, complete information when creating an account</li>
                            <li>You must be at least 18 years old to use this Service</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You are responsible for all activities under your account</li>
                        </ul>

                        <h3>3.2 Account Security</h3>
                        <ul>
                            <li>Keep your password confidential</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>We reserve the right to suspend accounts that violate these Terms</li>
                        </ul>

                        <h2>4. Bookings and Payments</h2>
                        <h3>4.1 Booking Policy</h3>
                        <ul>
                            <li>All bookings are subject to availability</li>
                            <li>Bookings must be made in advance</li>
                            <li>We reserve the right to refuse any booking</li>
                        </ul>

                        <h3>4.2 Payment Terms</h3>
                        <ul>
                            <li>Payment is required at the time of booking</li>
                            <li>All prices are in LKR (Sri Lankan Rupees)</li>
                            <li>Prices are subject to change with notice</li>
                        </ul>

                        <h3>4.3 Cancellation Policy</h3>
                        <ul>
                            <li>Cancellations made 24 hours before booking: Full refund</li>
                            <li>Cancellations made less than 24 hours: 50% refund</li>
                            <li>No-shows: No refund</li>
                            <li>We reserve the right to cancel bookings with full refund</li>
                        </ul>
                        <p>
                            For complete details, see our{" "}
                            <Link href="/refund-policy" className="text-primary hover:underline">
                                Refund and Cancellation Policy
                            </Link>
                            .
                        </p>

                        <h2>5. User Conduct</h2>
                        <p>You agree NOT to:</p>
                        <ul>
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Transmit harmful code or malware</li>
                            <li>Harass, abuse, or harm others</li>
                            <li>Use the Service for unauthorized commercial purposes</li>
                            <li>Attempt to gain unauthorized access to systems</li>
                            <li>Submit false or misleading information</li>
                        </ul>

                        <h2>6. Intellectual Property</h2>
                        <h3>6.1 Our Content</h3>
                        <ul>
                            <li>All content, features, and functionality are owned by PrimeOne</li>
                            <li>You may not copy, modify, or distribute our content without permission</li>
                        </ul>

                        <h3>6.2 User Content</h3>
                        <ul>
                            <li>You retain rights to content you submit</li>
                            <li>You grant us a license to use your content for Service operation</li>
                            <li>You represent that you have rights to submit the content</li>
                        </ul>

                        <h2>7. Privacy</h2>
                        <p>
                            Your use of the Service is also governed by our{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            . Please review our Privacy Policy to understand our practices.
                        </p>

                        <h2>8. Disclaimers</h2>
                        <h3>8.1 Service Availability</h3>
                        <ul>
                            <li>The Service is provided "AS IS" and "AS AVAILABLE"</li>
                            <li>We do not guarantee uninterrupted or error-free service</li>
                            <li>We may modify or discontinue the Service at any time</li>
                        </ul>

                        <h3>8.2 Limitation of Liability</h3>
                        <ul>
                            <li>We are not liable for indirect, incidental, or consequential damages</li>
                            <li>Our total liability is limited to the amount you paid in the last 12 months</li>
                            <li>Some jurisdictions do not allow these limitations</li>
                        </ul>

                        <h2>9. Termination</h2>
                        <h3>9.1 By You</h3>
                        <ul>
                            <li>You may terminate your account at any time</li>
                            <li>Contact us to request account deletion</li>
                        </ul>

                        <h3>9.2 By Us</h3>
                        <p>We may terminate or suspend your account if:</p>
                        <ul>
                            <li>You violate these Terms</li>
                            <li>You engage in fraudulent activity</li>
                            <li>Required by law</li>
                            <li>At our sole discretion with or without notice</li>
                        </ul>

                        <h2>10. Contact Information</h2>
                        <div className="bg-accent/50 p-4 rounded-lg not-prose">
                            <p className="font-semibold mb-2">PrimeOne Coworking Space</p>
                            <p className="text-sm">146B, Goodshed Road, Thonikkal</p>
                            <p className="text-sm">Vavuniya, Sri Lanka</p>
                            <p className="text-sm mt-2">
                                <strong>Email:</strong> legal@primeone.space
                            </p>
                            <p className="text-sm">
                                <strong>Phone:</strong> +94 70 623 3612
                            </p>
                            <p className="text-sm">
                                <strong>Website:</strong>{" "}
                                <a href="https://primeone.space" className="text-primary hover:underline">
                                    https://primeone.space
                                </a>
                            </p>
                        </div>

                        <h2>11. Acknowledgment</h2>
                        <p>
                            By using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>

                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded mt-8">
                            <p className="text-sm font-medium">
                                For questions about these Terms, please contact us at{" "}
                                <a href="mailto:legal@primeone.space" className="text-primary hover:underline">
                                    legal@primeone.space
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
