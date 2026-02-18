import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Globe, FileText } from "lucide-react";

export default function PrivacyPage() {
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
                            <Shield className="w-8 h-8 text-primary" />
                            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 16, 2026 | Effective Date: February 16, 2026
                        </p>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded mb-6 not-prose">
                            <p className="text-sm font-medium">
                                PrimeOne Coworking Space respects your privacy and is committed to protecting your personal data.
                                This policy explains how we collect, use, and safeguard your information.
                            </p>
                        </div>

                        <h2 className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            1. Information We Collect
                        </h2>

                        <h3>1.1 Information You Provide</h3>
                        <ul>
                            <li><strong>Account Information</strong>: Name, email address, phone number, password</li>
                            <li><strong>Profile Information</strong>: Country, address, date of birth, gender, emergency contact</li>
                            <li><strong>Booking Information</strong>: Workspace preferences, dates, times, seat selections</li>
                            <li><strong>Payment Information</strong>: Payment method details (processed securely)</li>
                            <li><strong>Communications</strong>: Messages, support requests, feedback</li>
                        </ul>

                        <h3>1.2 Automatically Collected Information</h3>
                        <ul>
                            <li><strong>Usage Data</strong>: Pages visited, features used, time spent</li>
                            <li><strong>Device Information</strong>: IP address, browser type, operating system</li>
                            <li><strong>Location Data</strong>: General location based on IP address</li>
                            <li><strong>Cookies</strong>: Session cookies, preference cookies, analytics cookies</li>
                        </ul>

                        <h2 className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            2. How We Use Your Information
                        </h2>

                        <h3>2.1 To Provide Services</h3>
                        <ul>
                            <li>Create and manage your account</li>
                            <li>Process bookings and payments</li>
                            <li>Send booking confirmations and receipts</li>
                            <li>Manage event registrations</li>
                            <li>Provide customer support</li>
                        </ul>

                        <h3>2.2 To Improve Services</h3>
                        <ul>
                            <li>Analyze usage patterns</li>
                            <li>Develop new features</li>
                            <li>Conduct research and analytics</li>
                            <li>Optimize user experience</li>
                        </ul>

                        <h3>2.3 For Security</h3>
                        <ul>
                            <li>Prevent fraud and abuse</li>
                            <li>Enforce our Terms of Service</li>
                            <li>Comply with legal obligations</li>
                            <li>Protect our rights and property</li>
                        </ul>

                        <h2 className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            3. Data Security
                        </h2>

                        <h3>3.1 Security Measures</h3>
                        <ul>
                            <li>Encryption of data in transit (SSL/TLS)</li>
                            <li>Secure password hashing (bcrypt)</li>
                            <li>Regular security audits</li>
                            <li>Access controls and authentication</li>
                            <li>Rate limiting to prevent attacks</li>
                        </ul>

                        <h3>3.2 Your Responsibility</h3>
                        <ul>
                            <li>Keep your password secure</li>
                            <li>Use strong, unique passwords</li>
                            <li>Log out from shared devices</li>
                            <li>Report suspicious activity</li>
                        </ul>

                        <h2 className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            4. Your Rights
                        </h2>

                        <h3>4.1 Access and Portability</h3>
                        <ul>
                            <li>Request a copy of your data</li>
                            <li>Download your data in machine-readable format</li>
                        </ul>

                        <h3>4.2 Correction and Deletion</h3>
                        <ul>
                            <li>Update incorrect information</li>
                            <li>Request deletion of your account and data</li>
                        </ul>

                        <h3>4.3 Restriction and Objection</h3>
                        <ul>
                            <li>Restrict processing of your data</li>
                            <li>Object to processing for marketing purposes</li>
                        </ul>

                        <div className="bg-accent/50 p-4 rounded-lg not-prose my-6">
                            <p className="text-sm font-semibold mb-2">To exercise your rights:</p>
                            <p className="text-sm">
                                Email:{" "}
                                <a href="mailto:privacy@primeone.space" className="text-primary hover:underline">
                                    privacy@primeone.space
                                </a>
                            </p>
                        </div>

                        <h2>5. GDPR Compliance (EU/EEA Residents)</h2>
                        <p>If you are in the European Union or European Economic Area, you have additional rights:</p>
                        <ul>
                            <li><strong>Right to data portability</strong>: Receive your data in a structured format</li>
                            <li><strong>Right to restrict processing</strong>: Limit how we use your data</li>
                            <li><strong>Right to object</strong>: Object to certain types of processing</li>
                            <li><strong>Right to lodge complaints</strong>: Contact your data protection authority</li>
                        </ul>

                        <h2>6. CCPA Compliance (California Residents)</h2>
                        <p>California residents have the right to:</p>
                        <ul>
                            <li>Know what personal data we collect</li>
                            <li>Request deletion of personal data</li>
                            <li>Opt-out of data sales (we don't sell data)</li>
                            <li>Non-discrimination for exercising rights</li>
                        </ul>

                        <h2>7. Cookies and Tracking</h2>

                        <h3>7.1 Types of Cookies</h3>
                        <ul>
                            <li><strong>Essential</strong>: Required for Service functionality</li>
                            <li><strong>Functional</strong>: Remember your preferences</li>
                            <li><strong>Analytics</strong>: Understand usage patterns</li>
                            <li><strong>Marketing</strong>: Deliver relevant ads (with consent)</li>
                        </ul>

                        <h3>7.2 Managing Cookies</h3>
                        <p>
                            You can adjust your browser settings to block cookies. Note that some features may not work without cookies.
                        </p>

                        <h2>8. Data Retention</h2>
                        <ul>
                            <li><strong>Active Accounts</strong>: Data retained while your account is active</li>
                            <li><strong>Inactive Accounts</strong>: Data deleted after 2 years of inactivity</li>
                            <li><strong>Booking Records</strong>: Retained for 7 years for tax/legal purposes</li>
                            <li><strong>Marketing Data</strong>: Until you unsubscribe or withdraw consent</li>
                        </ul>

                        <h2>9. Children's Privacy</h2>
                        <ul>
                            <li>Our Service is not intended for children under 18</li>
                            <li>We do not knowingly collect data from children</li>
                            <li>If we discover such data, we will delete it promptly</li>
                        </ul>

                        <h2>10. International Data Transfers</h2>
                        <p>
                            Your data may be transferred to servers outside your country. We ensure adequate protection through
                            standard contractual clauses and adequacy decisions.
                        </p>

                        <h2>11. Changes to This Policy</h2>
                        <ul>
                            <li>We may update this Privacy Policy</li>
                            <li>Material changes will be notified via email</li>
                            <li>Continued use after changes constitutes acceptance</li>
                        </ul>

                        <h2>12. Contact Us</h2>
                        <div className="bg-accent/50 p-4 rounded-lg not-prose">
                            <p className="font-semibold mb-2">Data Protection Officer</p>
                            <p className="text-sm">PrimeOne Coworking Space</p>
                            <p className="text-sm">146B, Goodshed Road, Thonikkal</p>
                            <p className="text-sm">Vavuniya, Sri Lanka</p>
                            <p className="text-sm mt-2">
                                <strong>Email:</strong>{" "}
                                <a href="mailto:privacy@primeone.space" className="text-primary hover:underline">
                                    privacy@primeone.space
                                </a>
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

                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded mt-8 not-prose">
                            <p className="text-sm font-medium">
                                By using our Service, you consent to this Privacy Policy and our collection and use of information as described.
                            </p>
                            <p className="text-sm mt-2">
                                For privacy questions or to exercise your rights, contact:{" "}
                                <a href="mailto:privacy@primeone.space" className="text-primary hover:underline">
                                    privacy@primeone.space
                                </a>
                            </p>
                        </div>

                        <div className="flex gap-4 mt-8 not-prose">
                            <Link href="/terms">
                                <button className="text-sm text-primary hover:underline">Terms of Service</button>
                            </Link>
                            <Link href="/refund-policy">
                                <button className="text-sm text-primary hover:underline">Refund Policy</button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
